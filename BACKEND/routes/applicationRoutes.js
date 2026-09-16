import express from 'express';
import {
  createOrSaveDraft,
  getMyApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  checkApplicationEligibility
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All application routes require authentication
router.use(protect);

/**
 * @route   POST /api/applications
 * @desc    Create new application or update draft
 * @access  Private (Applicant)
 */
router.post('/', createOrSaveDraft);

/**
 * @route   GET /api/applications/my
 * @desc    Get all applications for the current applicant
 * @access  Private (Applicant)
 */
router.get('/my', getMyApplications);

/**
 * @route   GET /api/applications/:id/eligibility
 * @desc    Evaluate application against configurable scheme rules
 * @access  Private (Applicant/Officer)
 */
router.get('/:id/eligibility', checkApplicationEligibility);

/**
 * @route   GET /api/applications/:id
 * @desc    Get single application by ID
 * @access  Private (Applicant/Officer)
 */
router.get('/:id', getApplicationById);

/**
 * @route   PUT /api/applications/:id
 * @desc    Save/update draft
 * @access  Private (Applicant)
 */
router.put('/:id', updateApplication);

/**
 * @route   POST /api/applications/:id/submit
 * @desc    Final submission lock
 * @access  Private (Applicant)
 */
router.post('/:id/submit', submitApplication);

export default router;
