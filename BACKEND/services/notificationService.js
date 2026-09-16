import Notification from '../models/Notification.js';

/**
 * Helper to dispatch a system/workflow notification safely without failing caller operations.
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.user - Target recipient User ID
 * @param {string} params.title - Clear notification heading
 * @param {string} params.message - Descriptive body text
 * @param {string} params.type - One of the valid notification types
 * @param {string|mongoose.Types.ObjectId} [params.application] - Optional application reference
 * @param {string} [params.link] - Optional relative navigation link
 * @returns {Promise<Notification|null>}
 */
export const sendNotification = async ({
  user,
  title,
  message,
  type = 'system_notice',
  application = null,
  link = ''
}) => {
  try {
    if (!user || !title || !message) {
      console.warn('[NotificationService] Missing required notification fields');
      return null;
    }

    const notification = await Notification.create({
      user,
      title: title.trim(),
      message: message.trim(),
      type,
      application: application || undefined,
      link: link ? link.trim() : '',
      read: false
    });

    return notification;
  } catch (error) {
    console.error('[NotificationService] Failed to create notification:', error.message);
    return null;
  }
};
