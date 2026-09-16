import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// All notification routes are private to authenticated sessions
router.use(protect);

// GET /api/notifications
router.get('/', getNotifications);

// POST /api/notifications (Admin / Official create notification)
router.post('/', authorize('admin', 'verifier', 'screening_officer'), createNotification);

// PUT /api/notifications/read-all
router.put('/read-all', markAllAsRead);

// PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

export default router;
