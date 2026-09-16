import express from 'express';
import {
  uploadDocument,
  getDocumentById,
  getDocumentsByApplication,
  deleteDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All document management routes require authentication
router.use(protect);

/**
 * @route   POST /api/documents/upload
 * @desc    Upload or replace a statutory document
 * @access  Private (Applicant)
 */
router.post('/upload', upload.single('file'), uploadDocument);

/**
 * @route   GET /api/documents/:id
 * @desc    Get single document metadata
 * @access  Private
 */
router.get('/:id', getDocumentById);

/**
 * @route   GET /api/documents/application/:applicationId
 * @desc    Get all documents associated with an application
 * @access  Private
 */
router.get('/application/:applicationId', getDocumentsByApplication);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document (if application is in draft status)
 * @access  Private (Applicant/Admin)
 */
router.delete('/:id', deleteDocument);

export default router;
