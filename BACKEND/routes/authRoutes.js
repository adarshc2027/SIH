import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Applicant registration
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login for all roles (applicant, verifier, screening_officer, admin)
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Retrieve logged in user data
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   GET /api/auth/officer-access
 * @desc    Test route restricted to official staff (verifier, screening_officer, admin)
 * @access  Private (Official roles only)
 */
router.get(
  '/officer-access',
  protect,
  authorize('verifier', 'screening_officer', 'admin'),
  (req, res) => {
    return successResponse(res, `Authorized access granted for official desk (${req.user.role})`);
  }
);

export default router;
