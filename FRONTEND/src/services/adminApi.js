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

/**
 * Get paginated administrative audit logs with multi-field search and filters
 */
export const getAdminAuditLogsApi = async (params = {}) => {
  const response = await api.get('/admin/audit-logs', { params });
  return response.data;
};

/**
 * Admin manually sets application status (e.g. selected / rejected)
 */
export const updateApplicationStatusApi = async (id, data) => {
  const response = await api.put(`/admin/applications/${id}/status`, data);
  return response.data;
};

/**
 * Generate ministry administrative reports with multi-criteria filters
 */
export const getAdminReportsApi = async (params = {}) => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};