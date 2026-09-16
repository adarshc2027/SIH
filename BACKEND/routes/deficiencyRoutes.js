import express from 'express';
import {
  raiseDeficiency,
  getDeficienciesByApplication,
  getMyDeficiencies,
  getDeficiencyById,
  respondToDeficiency,
  reviewDeficiency
} from '../controllers/deficiencyController.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All deficiency operations require authentication
router.use(protect);

/**
 * @route   GET /api/deficiencies/my
 * @desc    Get all deficiencies for the logged in applicant
 * @access  Private (Applicant)
 */
router.get('/my', getMyDeficiencies);

/**
 * @route   GET /api/deficiencies/application/:applicationId
 * @desc    Get all deficiencies logged for an application
 * @access  Private (Applicant / Verifier / Officer / Admin)
 */
router.get('/application/:applicationId', getDeficienciesByApplication);

/**
 * @route   GET /api/deficiencies/:id
 * @desc    Get single deficiency detail and timeline
 * @access  Private
 */
router.get('/:id', getDeficiencyById);

/**
 * @route   POST /api/deficiencies
 * @desc    Officer raises a new deficiency against application/document
 * @access  Private (Verifier, Screening Officer, Admin)
 */
router.post(
  '/',
  authorize('verifier', 'screening_officer', 'admin'),
  raiseDeficiency
);

/**
 * @route   POST /api/deficiencies/:id/respond
 * @desc    Applicant responds to open deficiency and optionally resubmits document
 * @access  Private (Applicant)
 */
router.post(
  '/:id/respond',
  authorize('applicant', 'admin'),
  respondToDeficiency
);

/**
 * @route   POST /api/deficiencies/:id/review
 * @desc    Officer reviews response: accepts/resolves, requests further correction, or closes
 * @access  Private (Verifier, Screening Officer, Admin)
 */
router.post(
  '/:id/review',
  authorize('verifier', 'screening_officer', 'admin'),
  reviewDeficiency
);

export default router;