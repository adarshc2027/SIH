import express from 'express';
import mongoose from 'mongoose';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    System health check & diagnostics
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const dbState = mongoose.connection.readyState;

  return successResponse(res, 'MoTA Scholarship Portal API is operational', {
    status: 'UP',
    system: 'Ministry of Tribal Affairs - Scholarship & Fellowship Management System',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'Unknown',
      connected: dbState === 1
    },
    version: '1.0.0'
  });
});

export default router;
