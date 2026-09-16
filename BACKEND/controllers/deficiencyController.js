import Deficiency from '../models/Deficiency.js';
import Application from '../models/Application.js';
import Document from '../models/Document.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendNotification } from '../services/notificationService.js';

/**
 * @route   POST /api/deficiencies
 * @desc    Officer raises a deficiency against an application or document
 * @access  Private (Verifier, Screening Officer, Admin)
 */
export const raiseDeficiency = async (req, res, next) => {
  try {
    const {
      applicationId,
      documentId,
      reason,
      description,
      requiredAction,
      deadlineDays = 7
    } = req.body;

    if (!applicationId || !reason || !description || !requiredAction) {
      return errorResponse(
        res,
        'Please provide applicationId, reason, description, and requiredAction.',
        400
      );
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return errorResponse(res, 'Application record not found.', 404);
    }

    let targetDoc = null;
    if (documentId) {
      targetDoc = await Document.findById(documentId);
    }

    // Compute deadline date (default 7 calendar days)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(deadlineDays));

    const deficiency = await Deficiency.create({
      application: application._id,
      document: targetDoc ? targetDoc._id : null,
      documentType: targetDoc ? targetDoc.documentType : '',
      documentName: targetDoc ? targetDoc.documentName : '',
      reason,
      description,
      requiredAction,
      deadline,
      status: 'open',
      raisedBy: req.user._id,
      raisedByName: req.user.name,
      raisedAt: new Date(),
      timeline: [
        {
          stage: 'raised',
          actor: 'officer',
          actorName: req.user.name,
          remarks: `Deficiency raised: ${reason}. Action required: ${requiredAction}`,
          timestamp: new Date()
        }
      ]
    });

    // Update Document status if attached
    if (targetDoc) {
      targetDoc.status = 'deficient';
      targetDoc.verificationStatus = 'deficient';
      targetDoc.remarks = `Deficiency raised: ${reason}`;
      await targetDoc.save();

      // Also update embedded document inside Application
      const docIndex = application.documents.findIndex(
        (d) => d.documentType === targetDoc.documentType
      );
      if (docIndex > -1) {
        application.documents[docIndex].status = 'deficient';
      }
    }

    // Update Application status to deficiency_raised
    application.status = 'deficiency_raised';
    application.currentStage = 'DEFICIENCY_RAISED';
    application.remarks.push({
      officer: req.user._id,
      officerName: req.user.name,
      remark: `Deficiency raised: ${reason}. Deadline: ${deadline.toLocaleDateString('en-IN')}`,
      stage: 'DEFICIENCY_RAISED',
      createdAt: new Date()
    });
    await application.save();

    // Dispatch notification to applicant
    await sendNotification({
      user: application.user,
      title: 'Action Required: Deficiency Notice',
      message: `A deficiency has been raised on application ${application.applicationNumber} regarding ${targetDoc?.documentName || reason}. Action required: ${requiredAction}. Deadline: ${deadline.toLocaleDateString('en-IN')}`,
      type: 'deficiency_raised',
      application: application._id,
      link: '/applicant/dashboard'
    });

    return successResponse(
      res,
      'Deficiency registered successfully. Application status updated to deficiency_raised.',
      { deficiency },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/deficiencies/application/:applicationId
 * @desc    Get all deficiencies logged for an application
 * @access  Private (Applicant, Officer, Admin)
 */
export const getDeficienciesByApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return errorResponse(res, 'Application record not found.', 404);
    }

    // Permission check: applicant can only view their own
    if (
      req.user.role === 'applicant' &&
      application.user.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'Unauthorized access to deficiencies.', 403);
    }

    const deficiencies = await Deficiency.find({ application: applicationId })
      .populate('document', 'fileName fileUrl mimeType fileSizeMB status')
      .populate('resubmittedDocument', 'fileName fileUrl mimeType fileSizeMB status')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Deficiencies retrieved successfully.', {
      count: deficiencies.length,
      deficiencies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/deficiencies/my
 * @desc    Applicant gets all deficiencies across their applications
 * @access  Private (Applicant)
 */
export const getMyDeficiencies = async (req, res, next) => {
  try {
    // Find all applications of current user
    const myApps = await Application.find({ user: req.user._id }).select('_id');
    const appIds = myApps.map((a) => a._id);

    const deficiencies = await Deficiency.find({ application: { $in: appIds } })
      .populate('application', 'applicationNumber scheme status createdAt')
      .populate('document', 'fileName fileUrl documentType documentName')
      .populate('resubmittedDocument', 'fileName fileUrl')
      .sort({ createdAt: -1 });

    return successResponse(res, 'Applicant deficiencies retrieved.', {
      count: deficiencies.length,
      deficiencies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/deficiencies/:id
 * @desc    Get specific deficiency details and timeline
 * @access  Private
 */
export const getDeficiencyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deficiency = await Deficiency.findById(id)
      .populate('application', 'applicationNumber scheme status personalDetails')
      .populate('document')
      .populate('resubmittedDocument')
      .populate('raisedBy', 'name email role')
      .populate('resolvedBy', 'name email role');

    if (!deficiency) {
      return errorResponse(res, 'Deficiency record not found.', 404);
    }

    return successResponse(res, 'Deficiency details retrieved.', { deficiency });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/deficiencies/:id/respond
 * @desc    Applicant submits response/explanation and optional resubmitted document
 * @access  Private (Applicant)
 */
export const respondToDeficiency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { applicantRemarks, resubmittedDocumentId } = req.body;

    if (!applicantRemarks || !applicantRemarks.trim()) {
      return errorResponse(res, 'Applicant explanation/remarks are mandatory.', 400);
    }

    const deficiency = await Deficiency.findById(id).populate('application');
    if (!deficiency) {
      return errorResponse(res, 'Deficiency record not found.', 404);
    }

    // Ownership check
    if (deficiency.application.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Unauthorized action on deficiency.', 403);
    }

    if (deficiency.status === 'resolved' || deficiency.status === 'closed') {
      return errorResponse(
        res,
        `Cannot respond: This deficiency is already marked as ${deficiency.status}.`,
        400
      );
    }

    deficiency.applicantRemarks = applicantRemarks.trim();
    deficiency.respondedAt = new Date();
    deficiency.status = 'responded';

    if (resubmittedDocumentId) {
      deficiency.resubmittedDocument = resubmittedDocumentId;
    }

    // Append timeline step: Applicant Responded & Resubmitted
    deficiency.timeline.push({
      stage: resubmittedDocumentId ? 'resubmitted' : 'responded',
      actor: 'applicant',
      actorName: req.user.name,
      remarks: applicantRemarks.trim(),
      timestamp: new Date()
    });

    await deficiency.save();

    // Check if there are other open deficiencies on this application
    const remainingOpen = await Deficiency.countDocuments({
      application: deficiency.application._id,
      status: 'open'
    });

    // If all deficiencies have been responded to, transition application status back to under_verification
    if (remainingOpen === 0) {
      const app = await Application.findById(deficiency.application._id);
      if (app && app.status === 'deficiency_raised') {
        app.status = 'under_verification';
        app.currentStage = 'DEFICIENCY_RESPONDED';
        app.remarks.push({
          officer: null,
          officerName: 'System / Applicant Response',
          remark: `Applicant responded to deficiency. Resubmission sent to Scrutiny Desk for re-verification.`,
          stage: 'DEFICIENCY_RESPONDED',
          createdAt: new Date()
        });
        await app.save();
      }
    }

    // Dispatch notification to applicant acknowledging submission
    await sendNotification({
      user: deficiency.application.user,
      title: 'Correction Resubmitted Successfully',
      message: `Your explanation and document resubmission for '${deficiency.reason}' has been logged and returned to the scrutiny officer for review.`,
      type: 'document_resubmission',
      application: deficiency.application._id,
      link: '/applicant/dashboard'
    });

    return successResponse(
      res,
      'Response and resubmission recorded successfully. Transferred to Scrutiny Officer worklist.',
      { deficiency }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/deficiencies/:id/review
 * @desc    Officer reviews applicant response: can accept (resolve), request further correction, or close
 * @access  Private (Verifier, Screening Officer, Admin)
 */
export const reviewDeficiency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, officerRemarks } = req.body;
    // action: 'resolve' | 'request_correction' | 'close'

    if (!['resolve', 'request_correction', 'close'].includes(action)) {
      return errorResponse(
        res,
        "Invalid action. Expected 'resolve', 'request_correction', or 'close'.",
        400
      );
    }

    const deficiency = await Deficiency.findById(id).populate('application');
    if (!deficiency) {
      return errorResponse(res, 'Deficiency record not found.', 404);
    }

    const now = new Date();

    if (action === 'resolve') {
      deficiency.status = 'resolved';
      deficiency.resolvedBy = req.user._id;
      deficiency.resolvedByName = req.user.name;
      deficiency.resolvedAt = now;
      deficiency.officerResolutionRemarks = officerRemarks || 'Deficiency cleared and verified by officer.';

      deficiency.timeline.push({
        stage: 'resolved',
        actor: 'officer',
        actorName: req.user.name,
        remarks: officerRemarks || 'Officer accepted applicant correction. Deficiency resolved.',
        timestamp: now
      });

      // Update associated Document verificationStatus to verified if resolved
      if (deficiency.document) {
        const doc = await Document.findById(deficiency.document);
        if (doc) {
          doc.verificationStatus = 'verified';
          doc.status = 'verified';
          doc.verifiedAt = now;
          doc.verifiedBy = req.user._id;
          doc.remarks = 'Deficiency rectified and document verified.';
          await doc.save();
        }
      }

      // Check if all deficiencies on this application are now resolved
      const remainingUnresolved = await Deficiency.countDocuments({
        application: deficiency.application._id,
        status: { $in: ['open', 'responded'] }
      });

      if (remainingUnresolved === 0) {
        const app = await Application.findById(deficiency.application._id);
        if (app && (app.status === 'deficiency_raised' || app.status === 'under_verification')) {
          app.status = 'under_verification';
          app.remarks.push({
            officer: req.user._id,
            officerName: req.user.name,
            remark: 'All raised deficiencies have been satisfactorily resolved. Application cleared for verification completion.',
            stage: 'DEFICIENCY_RESOLVED',
            createdAt: now
          });
          await app.save();
        }
      }
    } else if (action === 'request_correction') {
      // Re-open deficiency for further correction
      deficiency.status = 'open';
      deficiency.officerResolutionRemarks = officerRemarks || 'Further clarification/document correction requested.';

      deficiency.timeline.push({
        stage: 'reviewed',
        actor: 'officer',
        actorName: req.user.name,
        remarks: officerRemarks || 'Officer requested further correction from applicant.',
        timestamp: now
      });

      const app = await Application.findById(deficiency.application._id);
      if (app) {
        app.status = 'deficiency_raised';
        app.currentStage = 'DEFICIENCY_RAISED';
        app.remarks.push({
          officer: req.user._id,
          officerName: req.user.name,
          remark: `Deficiency re-opened: ${officerRemarks || 'Further correction requested.'}`,
          stage: 'DEFICIENCY_RAISED',
          createdAt: now
        });
        await app.save();
      }
    } else if (action === 'close') {
      deficiency.status = 'closed';
      deficiency.officerResolutionRemarks = officerRemarks || 'Deficiency closed administratively.';

      deficiency.timeline.push({
        stage: 'closed',
        actor: 'officer',
        actorName: req.user.name,
        remarks: officerRemarks || 'Deficiency closed.',
        timestamp: now
      });
    }

    await deficiency.save();

    return successResponse(
      res,
      `Deficiency action '${action}' completed successfully.`,
      { deficiency }
    );
  } catch (error) {
    next(error);
  }
};