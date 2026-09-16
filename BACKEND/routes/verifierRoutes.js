import express from 'express';
import {
  getVerifierDashboardStats,
  getVerifierApplications,
  getVerifierApplicationDossier,
  getDocumentAiAnalysis,
  verifyDocument,
  rejectDocument,
  verifyApplication,
  requestManualReview,
  forwardToScreening
} from '../controllers/verifierController.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All verifier routes require authentication and verifier / screening / admin roles
router.use(protect, authorize('verifier', 'screening_officer', 'admin'));

/**
 * @route   GET /api/verifier/dashboard-stats
 * @desc    Metrics for verifier dashboard
 */
router.get('/dashboard-stats', getVerifierDashboardStats);

/**
 * @route   GET /api/verifier/applications
 * @desc    Get verifier worklist queue with search & filters
 */
router.get('/applications', getVerifierApplications);

/**
 * @route   GET /api/verifier/applications/:id
 * @desc    Get complete application dossier for scrutiny
 */
router.get('/applications/:id', getVerifierApplicationDossier);

/**
 * @route   GET /api/verifier/documents/:docId/ai-analysis
 * @desc    Run assistive AI/OCR document intelligence pipeline
 */
router.get('/documents/:docId/ai-analysis', getDocumentAiAnalysis);

/**
 * @route   POST /api/verifier/documents/:docId/verify
 * @desc    Verify individual document
 */
router.post('/documents/:docId/verify', verifyDocument);

/**
 * @route   POST /api/verifier/documents/:docId/reject
 * @desc    Reject individual document
 */
router.post('/documents/:docId/reject', rejectDocument);

/**
 * @route   POST /api/verifier/applications/:id/verify
 * @desc    Mark Level-1 scrutiny complete (Verified)
 */
router.post('/applications/:id/verify', verifyApplication);

/**
 * @route   POST /api/verifier/applications/:id/manual-review
 * @desc    Request manual committee review
 */
router.post('/applications/:id/manual-review', requestManualReview);

/**
 * @route   POST /api/verifier/applications/:id/forward
 * @desc    Forward application to Level-2 Screening Committee
 */
router.post('/applications/:id/forward', forwardToScreening);

export default router;