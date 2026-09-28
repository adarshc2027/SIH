import path from 'path';
import fs from 'fs';
import Document from '../models/Document.js';
import Application from '../models/Application.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { assistiveDocumentService } from '../utils/assistiveDocumentService.js';
import { getUploadDirectory } from '../middleware/uploadMiddleware.js';

/**
 * @route   POST /api/documents/upload
 * @desc    Upload or replace a supporting statutory document
 * @access  Private (Applicant)
 */
export const uploadDocument = async (req, res, next) => {
  try {
    const { applicationId, documentType, documentName } = req.body;

    if (!req.file) {
      return errorResponse(res, 'No document file uploaded. Please provide a valid file.', 400);
    }

    if (!applicationId || !documentType) {
      // Remove temporary uploaded file if required metadata missing
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return errorResponse(res, 'Missing required fields: applicationId and documentType are required.', 400);
    }

    // Verify application exists and applicant is authorized
    const application = await Application.findById(applicationId);
    if (!application) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return errorResponse(res, 'Target application record not found.', 404);
    }

    if (application.user.toString() !== req.user._id.toString() && req.user.role === 'applicant') {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return errorResponse(res, 'Unauthorized access to this application document repository.', 403);
    }

    const fileSizeMB = parseFloat((req.file.size / (1024 * 1024)).toFixed(2));
    const relativeFileUrl = `/uploads/documents/${req.file.filename}`;

    // Check if a document of this type already exists for this application
    let document = await Document.findOne({
      application: application._id,
      documentType: documentType.toUpperCase()
    });

    const isReplacing = Boolean(document);
    const isResubmission = isReplacing && (document.status === 'deficient' || document.verificationStatus === 'deficient');

    if (document) {
      // Remove old disk file if it exists
      const oldFilePath = path.join(getUploadDirectory(), document.storedFileName);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (e) {
          console.warn('Could not delete old file:', oldFilePath);
        }
      }

      document.fileName = req.file.originalname;
      document.storedFileName = req.file.filename;
      document.fileUrl = relativeFileUrl;
      document.mimeType = req.file.mimetype;
      document.fileSizeBytes = req.file.size;
      document.fileSizeMB = fileSizeMB;
      document.status = isResubmission ? 'resubmitted' : 'uploaded';
      document.verificationStatus = 'pending';
      document.uploadedAt = new Date();
      document.remarks = isResubmission ? 'Resubmitted clear copy by applicant' : '';

      await document.save();
    } else {
      document = await Document.create({
        application: application._id,
        user: req.user._id,
        documentType: documentType.toUpperCase(),
        documentName: documentName || documentType,
        fileName: req.file.originalname,
        storedFileName: req.file.filename,
        fileUrl: relativeFileUrl,
        mimeType: req.file.mimetype,
        fileSizeBytes: req.file.size,
        fileSizeMB,
        status: 'uploaded',
        verificationStatus: 'pending'
      });
    }

    // Synchronize document in the Application embedded documents list
    const existingIndex = application.documents.findIndex(
      (d) => d.documentType === document.documentType
    );

    const docSummary = {
      documentType: document.documentType,
      documentName: document.documentName,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      fileSizeMB: document.fileSizeMB,
      uploadedAt: document.uploadedAt,
      status: 'pending'
    };

    if (existingIndex > -1) {
      application.documents[existingIndex] = docSummary;
    } else {
      application.documents.push(docSummary);
    }
    await application.save();

    // Trigger assistive document pipeline asynchronously (non-blocking)
    assistiveDocumentService.processDocumentOCR(document, req.file.path).catch((err) => {
      console.warn('Assistive OCR Service notice:', err.message);
    });

    return successResponse(
      res,
      isResubmission
        ? 'Document resubmitted successfully for scrutiny.'
        : isReplacing
        ? 'Document replaced successfully.'
        : 'Document uploaded successfully.',
      { document },
      201
    );
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @route   GET /api/documents/:id
 * @desc    Get single document metadata and security verification
 * @access  Private (Applicant or Officer)
 */
export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('application', 'applicationNumber scheme status')
      .populate('verifiedBy', 'name email role');

    if (!document) {
      return errorResponse(res, 'Requested document was not found.', 404);
    }

    // Access control: only document owner or verification officers/admins
    if (
      req.user.role === 'applicant' &&
      document.user.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'Unauthorized access to this document record.', 403);
    }

    return successResponse(res, 'Document details retrieved', { document });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/documents/application/:applicationId
 * @desc    Get all documents for an application
 * @access  Private (Applicant or Officer)
 */
export const getDocumentsByApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return errorResponse(res, 'Target application not found.', 404);
    }

    if (
      req.user.role === 'applicant' &&
      application.user.toString() !== req.user._id.toString()
    ) {
      return errorResponse(res, 'Access denied.', 403);
    }

    const documents = await Document.find({ application: applicationId }).sort({ createdAt: 1 });

    return successResponse(res, 'Application documents retrieved', {
      count: documents.length,
      documents
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document (only permitted if application is still draft)
 * @access  Private (Applicant only)
 */
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return errorResponse(res, 'Document not found.', 404);
    }

    if (document.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized to delete this document.', 403);
    }

    // Check application status
    const application = await Application.findById(document.application);
    if (application && application.status !== 'draft' && req.user.role !== 'admin') {
      return errorResponse(
        res,
        'Cannot remove documents once application has been formally submitted for government scrutiny.',
        400
      );
    }

    // Remove physical file from disk
    if (document.storedFileName) {
      const filePath = path.join(getUploadDirectory(), document.storedFileName);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Physical file could not be deleted:', filePath);
        }
      }
    }

    // Remove from Application embedded documents
    if (application) {
      application.documents = application.documents.filter(
        (d) => d.documentType !== document.documentType
      );
      await application.save();
    }

    await Document.findByIdAndDelete(req.params.id);

    return successResponse(res, 'Document deleted successfully.');
  } catch (error) {
    next(error);
  }
};
