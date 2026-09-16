import Application from '../models/Application.js';
import Scheme from '../models/Scheme.js';
import { generateApplicationNumber } from '../utils/applicationNumberGen.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { evaluateApplicationEligibility } from '../utils/eligibilityEngine.js';

/**
 * @route   POST /api/applications
 * @desc    Initialize a draft or retrieve existing draft for a scheme
 * @access  Private (Applicant only)
 */
export const createOrSaveDraft = async (req, res, next) => {
  try {
    const { schemeId, personalDetails, academicDetails, financialDetails, bankDetails, documents } = req.body;

    if (!schemeId) {
      return errorResponse(res, 'Please provide target scheme ID', 400);
    }

    // Verify scheme exists and is open
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return errorResponse(res, 'Specified welfare scheme does not exist in Ministry registry', 404);
    }

    // Check if user already has an active, submitted application for this scheme
    const existingSubmitted = await Application.findOne({
      user: req.user._id,
      scheme: scheme._id,
      status: { $in: ['submitted', 'under_verification', 'under_screening', 'verified', 'selected'] }
    });

    if (existingSubmitted) {
      return errorResponse(
        res,
        `You have already submitted an application (${existingSubmitted.applicationNumber}) for ${scheme.code}. Multiple active submissions for the same scheme are prohibited under GIGW guidelines.`,
        400
      );
    }

    // Check for existing draft to update
    let application = await Application.findOne({
      user: req.user._id,
      scheme: scheme._id,
      status: 'draft'
    });

    if (application) {
      // Update existing draft
      if (personalDetails) application.personalDetails = { ...application.personalDetails, ...personalDetails };
      if (academicDetails) application.academicDetails = { ...application.academicDetails, ...academicDetails };
      if (financialDetails) application.financialDetails = { ...application.financialDetails, ...financialDetails };
      if (bankDetails) application.bankDetails = { ...application.bankDetails, ...bankDetails };
      if (documents) application.documents = documents;

      await application.save();
      return successResponse(res, 'Draft application updated successfully', { application });
    }

    // Create a new draft with generated application number
    const appNumber = await generateApplicationNumber(scheme.code);

    application = await Application.create({
      user: req.user._id,
      scheme: scheme._id,
      applicationNumber: appNumber,
      personalDetails: {
        fullName: req.user.name,
        email: req.user.email,
        mobile: req.user.phone,
        tribalCommunity: req.user.tribalCommunity || '',
        ...(personalDetails || {})
      },
      academicDetails: academicDetails || {},
      financialDetails: financialDetails || {},
      bankDetails: bankDetails || {},
      documents: documents || [],
      status: 'draft',
      currentStage: 'DRAFT_INITIALIZED'
    });

    return successResponse(res, 'Draft application initialized', { application }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/my
 * @desc    Get all applications submitted or drafted by current applicant
 * @access  Private (Applicant)
 */
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('scheme', 'name code academicLevel annualSlots type')
      .sort({ createdAt: -1 });

    return successResponse(res, 'My applications retrieved', {
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application by MongoDB ID or Application Number
 * @access  Private (Applicant or Officer)
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = { _id: id };
    // If not a valid ObjectId, search by applicationNumber
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { applicationNumber: id };
    }

    const application = await Application.findOne(query)
      .populate('scheme')
      .populate('user', 'name email phone role tribalCommunity');

    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    // Authorization check: Applicant can only see their own application
    if (
      req.user.role === 'applicant' &&
      application.user._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'Access denied. You are not authorized to view this application.', 403);
    }

    return successResponse(res, 'Application details retrieved', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/applications/:id
 * @desc    Update draft or resubmit deficient application
 * @access  Private (Applicant)
 */
export const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }

    // Ownership check
    if (application.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized to update this application', 403);
    }

    // Only drafts or applications with deficiencies raised can be updated
    if (!['draft', 'deficiency_raised'].includes(application.status)) {
      return errorResponse(
        res,
        `Applications in '${application.status}' status are locked and cannot be modified.`,
        400
      );
    }

    const { personalDetails, academicDetails, financialDetails, bankDetails, documents } = req.body;

    if (personalDetails) application.personalDetails = { ...application.personalDetails, ...personalDetails };
    if (academicDetails) application.academicDetails = { ...application.academicDetails, ...academicDetails };
    if (financialDetails) application.financialDetails = { ...application.financialDetails, ...financialDetails };
    if (bankDetails) application.bankDetails = { ...application.bankDetails, ...bankDetails };
    if (documents) application.documents = documents;

    await application.save();

    return successResponse(res, 'Application draft saved successfully', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/applications/:id/submit
 * @desc    Final review and locked submission of application
 * @access  Private (Applicant)
 */
export const submitApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate('scheme');

    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    // Ownership check
    if (application.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized action on application', 403);
    }

    // Prevent accidental duplicate submission
    if (['submitted', 'under_verification', 'under_screening', 'verified', 'selected'].includes(application.status)) {
      return errorResponse(
        res,
        `Application ${application.applicationNumber} has already been submitted on ${new Date(application.submittedAt).toLocaleDateString('en-IN')}. Duplicate submission prevented.`,
        400
      );
    }

    // 1. Mandatory Field Validations
    const pd = application.personalDetails || {};
    if (!pd.fullName || !pd.dateOfBirth || !pd.gender || !pd.mobile || !pd.casteCertificateNumber) {
      return errorResponse(
        res,
        'Personal Information is incomplete. Please ensure Full Name, Date of Birth, Gender, Mobile, and Caste Certificate Number are entered.',
        400
      );
    }

    const ad = application.academicDetails || {};
    if (!ad.qualifyingDegree || !ad.enrolledCourse || !ad.enrolledInstitution) {
      return errorResponse(
        res,
        'Academic Information is incomplete. Please ensure Qualifying Degree, Enrolled Course, and University/Institution are specified.',
        400
      );
    }

    const fd = application.financialDetails || {};
    if (fd.annualFamilyIncome === undefined || fd.annualFamilyIncome === null) {
      return errorResponse(res, 'Annual family income must be specified.', 400);
    }

    const bd = application.bankDetails || {};
    if (!bd.accountHolderName || !bd.bankName || !bd.accountNumber || !bd.ifscCode) {
      return errorResponse(
        res,
        'Bank Details are incomplete. Direct Benefit Transfer (DBT) requires Bank Name, Account Number, and IFSC Code.',
        400
      );
    }

    // 2. Mandatory Documents Validation against Scheme requirements
    if (application.scheme && application.scheme.requiredDocuments) {
      const missingMandatoryDocs = [];
      const uploadedDocTypes = (application.documents || []).map((d) => d.documentType.toUpperCase());

      for (const reqDoc of application.scheme.requiredDocuments) {
        if (reqDoc.isMandatory && !uploadedDocTypes.includes(reqDoc.code.toUpperCase())) {
          missingMandatoryDocs.push(reqDoc.name);
        }
      }

      if (missingMandatoryDocs.length > 0) {
        return errorResponse(
          res,
          `Mandatory document(s) missing: ${missingMandatoryDocs.join(', ')}. All required certificates must be attached before final submission.`,
          400
        );
      }
    }

    // Run assistive eligibility evaluation
    const evalResult = evaluateApplicationEligibility(application, application.scheme);
    application.eligibilityResult = {
      isEligible: evalResult.eligible,
      overallStatus: evalResult.overallStatus,
      matchedCriteria: evalResult.rules.filter((r) => r.status === 'passed').map((r) => r.rule),
      flags: evalResult.rules.filter((r) => r.status === 'manual_review').map((r) => r.rule),
      checkedAt: new Date(),
      ruleBreakdown: evalResult.rules
    };

    // Lock application
    application.status = 'submitted';
    application.currentStage = 'UNDER_VERIFICATION';
    application.submittedAt = new Date();

    await application.save();

    return successResponse(
      res,
      `Application successfully submitted. Your permanent reference number is ${application.applicationNumber}.`,
      { application, eligibilityAssessment: evalResult }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/applications/:id/eligibility
 * @desc    Run configurable eligibility engine for an application
 * @access  Private (Applicant or Officer)
 */
export const checkApplicationEligibility = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('scheme');

    if (!application) {
      return errorResponse(res, 'Target application record was not found.', 404);
    }

    // Access control
    if (req.user.role === 'applicant' && application.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized access to this application evaluation.', 403);
    }

    const scheme = application.scheme;
    if (!scheme) {
      return errorResponse(res, 'Associated scheme master data not found.', 404);
    }

    // Evaluate application against scheme configuration
    const assessment = evaluateApplicationEligibility(application, scheme);

    // Persist latest check in application model
    application.eligibilityResult = {
      isEligible: assessment.eligible,
      overallStatus: assessment.overallStatus,
      matchedCriteria: assessment.rules.filter((r) => r.status === 'passed').map((r) => r.rule),
      flags: assessment.rules.filter((r) => r.status === 'manual_review').map((r) => r.rule),
      checkedAt: new Date(),
      ruleBreakdown: assessment.rules
    };
    await application.save();

    return successResponse(res, 'Application eligibility evaluation complete', assessment);
  } catch (error) {
    next(error);
  }
};
