import api from './api';

/**
 * Get comprehensive admin dashboard statistics and analytics
 */
export const getAdminDashboardStatsApi = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

/**
 * Search, filter, sort, and paginate applications across the ministry portal
 */
export const getAdminApplicationsApi = async (params = {}) => {
  const response = await api.get('/admin/applications', { params });
  return response.data;
};