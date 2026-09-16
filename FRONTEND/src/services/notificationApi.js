import api from './api';

/**
 * Fetch paginated notifications for current authenticated user
 * @param {Object} params - { page, limit, unreadOnly, type }
 */
export const getNotificationsApi = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

/**
 * Mark a single notification as read
 * @param {string} id - Notification ID
 */
export const markNotificationAsReadApi = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications for current user as read
 */
export const markAllNotificationsAsReadApi = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};
