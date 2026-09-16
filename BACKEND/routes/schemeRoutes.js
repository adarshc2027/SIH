import express from 'express';
import { getSchemes, getSchemeById } from '../controllers/schemeController.js';

const router = express.Router();

/**
 * @route   GET /api/schemes
 * @desc    Get all active welfare schemes
 * @access  Public
 */
router.get('/', getSchemes);

/**
 * @route   GET /api/schemes/:id
 * @desc    Get scheme by ID or code
 * @access  Public
 */
router.get('/:id', getSchemeById);

export default router;
