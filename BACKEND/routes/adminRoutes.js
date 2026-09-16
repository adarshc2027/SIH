import express from 'express';
import {
  createScheme,
  updateScheme,
  deleteScheme
} from '../controllers/schemeController.js';
import {
  getAdminDashboardStats,
  getAdminApplications
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes under /api/admin are protected and restricted to 'admin' role
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get metrics and analytics charts data for Admin Dashboard
 * @access  Private (Admin only)
 */
router.get('/dashboard-stats', getAdminDashboardStats);

/**
 * @route   GET /api/admin/applications
 * @desc    Search, filter, sort, and paginate applications across the portal
 * @access  Private (Admin only)
 */
router.get('/applications', getAdminApplications);

/**
 * @route   POST /api/admin/schemes
 * @desc    Create a new scheme
 * @access  Private (Admin only)
 */
router.post('/schemes', createScheme);

/**
 * @route   PUT /api/admin/schemes/:id
 * @desc    Update an existing scheme
 * @access  Private (Admin only)
 */
router.put('/schemes/:id', updateScheme);

/**
 * @route   DELETE /api/admin/schemes/:id
 * @desc    Delete a scheme
 * @access  Private (Admin only)
 */
router.delete('/schemes/:id', deleteScheme);

export default router;
