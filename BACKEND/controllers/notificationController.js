import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @route   GET /api/notifications
 * @desc    Get paginated notifications for current authenticated user with unread count
 * @access  Private (Authenticated)
 */
export const getNotifications = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const { unreadOnly, type } = req.query;

    const filter = { user: req.user._id };
    if (unreadOnly === 'true') {
      filter.read = false;
    }
    if (type) {
      filter.type = type;
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: req.user._id, read: false })
    ]);

    return successResponse(res, 'Notifications retrieved successfully', {
      notifications,
      unreadCount,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark an individual notification as read
 * @access  Private (Authenticated)
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      user: req.user._id
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found or unauthorized access.', 404);
    }

    if (!notification.read) {
      notification.read = true;
      await notification.save();
    }

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    return successResponse(res, 'Notification marked as read', {
      notification,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all unread notifications for current user as read
 * @access  Private (Authenticated)
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );

    return successResponse(res, 'All notifications marked as read', {
      markedCount: result.modifiedCount || 0,
      unreadCount: 0
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/notifications
 * @desc    Create a notification (Admin / System / Officer)
 * @access  Private (Admin, Verifier, Screening Officer)
 */
export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type = 'system_notice', application, link } = req.body;

    if (!title || !message) {
      return errorResponse(res, 'Notification title and message are required', 400);
    }

    const targetUserId = userId || req.user._id;

    const notification = await Notification.create({
      user: targetUserId,
      title: title.trim(),
      message: message.trim(),
      type,
      application: application || undefined,
      link: link || '',
      read: false
    });

    return successResponse(res, 'Notification dispatched successfully', { notification }, 201);
  } catch (error) {
    next(error);
  }
};
