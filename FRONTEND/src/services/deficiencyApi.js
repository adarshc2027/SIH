import api from './api';

/**
 * Get all deficiencies for the logged-in applicant
 */
export const getMyDeficienciesApi = async () => {
  const response = await api.get('/deficiencies/my');
  return response.data;
};

/**
 * Get all deficiencies logged against a specific application
 */
export const getDeficienciesByApplicationApi = async (applicationId) => {
  const response = await api.get(`/deficiencies/application/${applicationId}`);
  return response.data;
};

/**
 * Get single deficiency details with complete timeline
 */
export const getDeficiencyByIdApi = async (id) => {
  const response = await api.get(`/deficiencies/${id}`);
  return response.data;
};

/**
 * Officer raises a deficiency against an application / document
 */
export const raiseDeficiencyApi = async (data) => {
  const response = await api.post('/deficiencies', data);
  return response.data;
};

/**
 * Applicant responds to a deficiency with explanation and optional resubmitted document
 */
export const respondToDeficiencyApi = async (id, data) => {
  const response = await api.post(`/deficiencies/${id}/respond`, data);
  return response.data;
};

/**
 * Officer reviews applicant response (action: 'resolve' | 'request_correction' | 'close')
 */
export const reviewDeficiencyApi = async (id, data) => {
  const response = await api.post(`/deficiencies/${id}/review`, data);
  return response.data;
};