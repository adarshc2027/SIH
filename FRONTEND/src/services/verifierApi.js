import api from './api';

/**
 * Get Verifier dashboard metrics
 */
export const getVerifierDashboardStatsApi = async () => {
  const response = await api.get('/verifier/dashboard-stats');
  return response.data;
};

/**
 * Get assigned applications for scrutiny
 */
export const getVerifierApplicationsApi = async (params = {}) => {
  const response = await api.get('/verifier/applications', { params });
  return response.data;
};

/**
 * Get complete application dossier for scrutiny
 */
export const getVerifierApplicationDossierApi = async (id) => {
  const response = await api.get(`/verifier/applications/${id}`);
  return response.data;
};

/**
 * Verify individual supporting document
 */
export const verifyDocumentApi = async (docId, remarks = '') => {
  const response = await api.post(`/verifier/documents/${docId}/verify`, { remarks });
  return response.data;
};

/**
 * Reject individual supporting document
 */
export const rejectDocumentApi = async (docId, remarks) => {
  const response = await api.post(`/verifier/documents/${docId}/reject`, { remarks });
  return response.data;
};

/**
 * Complete Level-1 verification
 */
export const verifyApplicationApi = async (id, remarks = '') => {
  const response = await api.post(`/verifier/applications/${id}/verify`, { remarks });
  return response.data;
};

/**
 * Request manual senior committee review
 */
export const requestManualReviewApi = async (id, remarks) => {
  const response = await api.post(`/verifier/applications/${id}/manual-review`, { remarks });
  return response.data;
};

/**
 * Forward application to Level-2 Screening Committee
 */
export const forwardToScreeningApi = async (id, remarks = '') => {
  const response = await api.post(`/verifier/applications/${id}/forward`, { remarks });
  return response.data;
};

/**
 * Get Assistive AI/OCR document intelligence analysis
 */
export const getDocumentAiAnalysisApi = async (docId) => {
  const response = await api.get(`/verifier/documents/${docId}/ai-analysis`);
  return response.data;
};