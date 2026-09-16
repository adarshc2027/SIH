import api from './api';

/**
 * Application Module API Service
 */

// Create or initialize a draft application
export const createOrSaveDraftApi = async (data) => {
  return await api.post('/applications', data);
};

// Get all applications for current logged-in applicant
export const getMyApplicationsApi = async () => {
  return await api.get('/applications/my');
};

// Get single application by ID or reference number
export const getApplicationByIdApi = async (id) => {
  return await api.get(`/applications/${id}`);
};

// Update draft application
export const updateApplicationApi = async (id, data) => {
  return await api.put(`/applications/${id}`, data);
};

// Final lock & submit application
export const submitApplicationApi = async (id) => {
  return await api.post(`/applications/${id}/submit`);
};

// Check application eligibility against scheme rules
export const checkApplicationEligibilityApi = async (id) => {
  return await api.get(`/applications/${id}/eligibility`);
};
