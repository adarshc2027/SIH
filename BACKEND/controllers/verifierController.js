import Application from '../models/Application.js';
import Document from '../models/Document.js';
import Deficiency from '../models/Deficiency.js';
import AuditLog from '../models/AuditLog.js';
import Scheme from '../models/Scheme.js';
import { evaluateApplicationEligibility } from '../utils/eligibilityEngine.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { runAssistiveDocumentAnalysis } from '../services/ai/index.js';
import { sendNotification } from '../services/notificationService.js';

/**
 * @route   GET /api/verifier/documents/:docId/ai-analysis
 * @desc    Run assistive OCR, classification, data extraction, consistency check & deficiency detection
 * @access  Private (Verifier, Admin)
 */
export const getDocumentAiAnalysis = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const document = await Document.findById(docId);
    if (!document) {
      return errorResponse(res, 'Document record not found', 404);
    }

    const application = await Application.findById(document.application);
    const analysis = await runAssistiveDocumentAnalysis(document, application);

    return successResponse(res, 'Assistive AI document analysis completed', { analysis });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/verifier/dashboard-stats
 * @desc    Get verifier officer metrics and queue overview
 * @access  Private (Verifier, Admin)
 */
export const getVerifierDashboardStats = async (req, res, next) => {
  try {
    const totalAssigned = await Application.countDocuments({
      status: { $in: ['submitted', 'under_verification', 'deficiency_raised', 'verified'] }
    });
    const pendingScrutiny = await Application.countDocuments({
      status: { $in: ['submitted', 'under_verification'] }
    });
    const deficienciesActive = await Deficiency.countDocuments({ status: 'open' });
    const deficienciesResponded = await Deficiency.countDocuments({ status: 'responded' });
    const verifiedApplications = await Application.countDocuments({ status: 'verified' });
    const forwardedToScreening = await Application.countDocuments({ status: 'under_screening' });

    return successResponse(res, 'Verifier dashboard metrics retrieved', {
      stats: {
        totalAssigned,
        pendingScrutiny,
        deficienciesActive,
        deficienciesResponded,
        verifiedApplications,
        forwardedToScreening
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/verifier/applications
 * @desc    Get verifier scrutiny queue with search, scheme filter, and status filter
 * @access  Private (Verifier, Admin)
 */
export const getVerifierApplications = async (req, res, next) => {
  try {
    const {
      search = '',
      scheme = '',
      status = '',
      page = 1,
      limit = 10
    } = req.query;

    const query = {
      // Verifier examines all active post-draft stages
      status: { $in: ['submitted', 'under_verification', 'deficiency_raised', 'verified', 'under_screening'] }
    };

    if (status) {
      query.status = status;
    }

    if (scheme) {
      const foundScheme = await Scheme.findOne({
        $or: [{ code: scheme.toUpperCase() }, { _id: scheme.match(/^[0-9a-fA-F]{24}$/) ? scheme : null }]
      });
      if (foundScheme) {
        query.scheme = foundScheme._id;
      }
    }

    if (search) {
      query.$or = [
        { applicationNumber: new RegExp(search, 'i') },
        { 'personalDetails.fullName': new RegExp(search, 'i') },
        { 'personalDetails.mobile': new RegExp(search, 'i') },
        { 'personalDetails.casteCertificateNumber': new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('scheme', 'name code academicLevel type')
      .populate('user', 'name email phone')
      .populate('assignedOfficer', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return successResponse(res, 'Verifier applications worklist retrieved', {
      applications,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/verifier/applications/:id
 * @desc    Open and review single application dossier with documents, eligibility rules, deficiencies & audit log
 * @access  Private (Verifier, Screening Officer, Admin)
 */
export const getVerifierApplicationDossier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('scheme')
      .populate('user', 'name email phone tribalCommunity')
      .populate('assignedOfficer', 'name email role');

    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    // Auto-assign to this officer if unassigned
    if (!application.assignedOfficer) {
      application.assignedOfficer = req.user._id;
      if (application.status === 'submitted') {
        application.status = 'under_verification';
        application.currentStage = 'UNDER_VERIFICATION';
      }
      await application.save();

      // Log assignment in audit history
      await AuditLog.create({
        application: application._id,
        action: 'ASSIGN_OFFICER',
        actionLabel: 'Officer Assigned to Scrutiny Desk',
        performedBy: req.user._id,
        performedByName: req.user.name,
        performedByRole: req.user.role,
        previousStage: 'SUBMITTED',
        newStage: 'UNDER_VERIFICATION',
        remarks: `Assigned to Scrutiny Officer ${req.user.name}`
      });
    }

    // 1. Fetch live uploaded documents
    const documents = await Document.find({ application: application._id });

    // 2. Fetch live deficiencies logged
    const deficiencies = await Deficiency.find({ application: application._id })
      .populate('document')
      .sort({ createdAt: -1 });

    // 3. Compute Advisory Eligibility Assessment
    const eligibilityAssessment = evaluateApplicationEligibility(application, application.scheme);

    // 4. Fetch Audit Logs
    const auditLogs = await AuditLog.find({ application: application._id })
      .sort({ timestamp: -1 });

    return successResponse(res, 'Application dossier retrieved', {
      application,
      documents,
      deficiencies,
      eligibilityAssessment,
      auditLogs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/verifier/documents/:docId/verify
 * @desc    Officer verifies an individual supporting document
 * @access  Private (Verifier, Admin)
 */
export const verifyDocument = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const { remarks } = req.body;

    const document = await Document.findById(docId);
    if (!document) {
      return errorResponse(res, 'Document record not found', 404);
    }

    const application = await Application.findById(document.application);

    document.status = 'verified';
    document.verificationStatus = 'verified';
    document.verifiedAt = new Date();
    document.verifiedBy = req.user._id;
    document.remarks = remarks || 'Verified satisfactory against official records';
    await document.save();

    // Sync embedded documents inside Application
    if (application) {
      const idx = application.documents.findIndex(
        (d) => d.documentType === document.documentType
      );
      if (idx > -1) {
        application.documents[idx].status = 'verified';
        await application.save();
      }

      // Log audit
      await AuditLog.create({
        application: application._id,
        action: 'VERIFY_DOCUMENT',
        actionLabel: `Verified ${document.documentName || document.documentType}`,
        performedBy: req.user._id,
        performedByName: req.user.name,
        performedByRole: req.user.role,
        previousStage: application.currentStage,
        newStage: application.currentStage,
        remarks: remarks || `Document verified satisfactory (${document.fileName})`,
        metadata: { documentId: document._id, documentType: document.documentType }
      });

      // Dispatch document verified notification to applicant
      await sendNotification({
        user: application.user,
        title: 'Supporting Document Verified',
        message: `Your document '${document.documentName || document.documentType}' has been verified and approved by the scrutiny officer.`,
        type: 'document_verified',
        application: application._id,
        link: '/applicant/dashboard'
      });
    }

    return successResponse(res, 'Document verified successfully', { document });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/verifier/documents/:docId/reject
 * @desc    Officer rejects an individual supporting document
 * @access  Private (Verifier, Admin)
 */
export const rejectDocument = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return errorResponse(res, 'Official rejection remarks are required', 400);
    }

    const document = await Document.findById(docId);
    if (!document) {
      return errorResponse(res, 'Document record not found', 404);
    }

    const application = await Application.findById(document.application);

    document.status = 'rejected';
    document.verificationStatus = 'rejected';
    document.verifiedAt = new Date();
    document.verifiedBy = req.user._id;
    document.remarks = remarks;
    await document.save();

    if (application) {
      const idx = application.documents.findIndex(
        (d) => d.documentType === document.documentType
      );
      if (idx > -1) {
        application.documents[idx].status = 'rejected';
        await application.save();
      }

      // Log audit
      await AuditLog.create({
        application: application._id,
        action: 'REJECT_DOCUMENT',
        actionLabel: `Rejected ${document.documentName || document.documentType}`,
        performedBy: req.user._id,
        performedByName: req.user.name,
        performedByRole: req.user.role,
        previousStage: application.currentStage,
        newStage: application.currentStage,
        remarks: remarks,
        metadata: { documentId: document._id, documentType: document.documentType }
      });
    }

    return successResponse(res, 'Document rejected', { document });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/verifier/applications/:id/verify
 * @desc    Officer marks entire Level-1 scrutiny as Verified
 * @access  Private (Verifier, Admin)
 */
export const verifyApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    // Check if there are unresolved open deficiencies
    const openDefs = await Deficiency.countDocuments({
      application: application._id,
      status: { $in: ['open', 'responded'] }
    });

    if (openDefs > 0) {
      return errorResponse(
        res,
        `Cannot verify: There are ${openDefs} active or unresolved deficiencies on this application. Resolve them before clearance.`,
        400
      );
    }

    const prevStage = application.status;
    application.status = 'verified';
    application.currentStage = 'VERIFIED_LEVEL_1';
    application.remarks.push({
      officer: req.user._id,
      officerName: req.user.name,
      remark: remarks || 'Level-1 Document and Eligibility verification completed successfully.',
      stage: 'VERIFIED_LEVEL_1',
      createdAt: new Date()
    });
    await application.save();

    // Audit log
    await AuditLog.create({
      application: application._id,
      action: 'VERIFY_APPLICATION',
      actionLabel: 'Level-1 Scrutiny Clearance Granted',
      performedBy: req.user._id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      previousStage: prevStage,
      newStage: 'verified',
      remarks: remarks || 'Level-1 verification completed.'
    });

    // Dispatch official verification notification to applicant
    await sendNotification({
      user: application.user,
      title: 'Level-1 Scrutiny Clearance Granted',
      message: `Your application (Ref: ${application.applicationNumber}) has passed Level-1 document and eligibility verification by the scrutiny desk.`,
      type: 'application_verified',
      application: application._id,
      link: '/applicant/dashboard'
    });

    return successResponse(res, 'Application marked as Verified by Scrutiny Desk', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/verifier/applications/:id/manual-review
 * @desc    Officer flags application for manual senior committee review
 * @access  Private (Verifier, Admin)
 */
export const requestManualReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (!remarks) {
      return errorResponse(res, 'Justification remarks for manual review are required', 400);
    }

    const application = await Application.findById(id);
    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    const prevStage = application.status;
    application.currentStage = 'MANUAL_REVIEW_REQUESTED';
    application.remarks.push({
      officer: req.user._id,
      officerName: req.user.name,
      remark: `Manual Review Requested: ${remarks}`,
      stage: 'MANUAL_REVIEW_REQUESTED',
      createdAt: new Date()
    });
    await application.save();

    await AuditLog.create({
      application: application._id,
      action: 'REQUEST_MANUAL_REVIEW',
      actionLabel: 'Manual Review Requested by Officer',
      performedBy: req.user._id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      previousStage: prevStage,
      newStage: 'MANUAL_REVIEW_REQUESTED',
      remarks: remarks
    });

    return successResponse(res, 'Manual review request logged', { application });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/verifier/applications/:id/forward
 * @desc    Officer forwards verified application to Level-2 Screening Committee
 * @access  Private (Verifier, Admin)
 */
export const forwardToScreening = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return errorResponse(res, 'Application record not found', 404);
    }

    // Check open deficiencies
    const openDefs = await Deficiency.countDocuments({
      application: application._id,
      status: { $in: ['open', 'responded'] }
    });

    if (openDefs > 0) {
      return errorResponse(
        res,
        `Cannot forward to screening: ${openDefs} unresolved deficiencies pending.`,
        400
      );
    }

    const prevStage = application.status;
    application.status = 'under_screening';
    application.currentStage = 'UNDER_SCREENING';
    application.remarks.push({
      officer: req.user._id,
      officerName: req.user.name,
      remark: remarks || 'Forwarded to Ministry Screening Committee for merit evaluation and quota allocation.',
      stage: 'UNDER_SCREENING',
      createdAt: new Date()
    });
    await application.save();

    await AuditLog.create({
      application: application._id,
      action: 'FORWARD_TO_SCREENING',
      actionLabel: 'Forwarded to Level-2 Screening Committee',
      performedBy: req.user._id,
      performedByName: req.user.name,
      performedByRole: req.user.role,
      previousStage: prevStage,
      newStage: 'under_screening',
      remarks: remarks || 'Forwarded to Screening Committee'
    });

    // Dispatch screening update notification to applicant
    await sendNotification({
      user: application.user,
      title: 'Forwarded to Stage-2 Screening Committee',
      message: `Your application (Ref: ${application.applicationNumber}) has been forwarded to the Central Screening Committee for quota allocation and merit evaluation.`,
      type: 'screening_update',
      application: application._id,
      link: '/applicant/dashboard'
    });

    return successResponse(res, 'Application successfully forwarded to Screening Committee', { application });
  } catch (error) {
    next(error);
  }
};