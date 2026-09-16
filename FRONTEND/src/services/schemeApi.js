import api from './api';

/**
 * Welfare Schemes API Service
 */

// Public: Get all schemes with optional filters (type, status, search)
export const getSchemesApi = async (params = {}) => {
  return await api.get('/schemes', { params });
};

// Public: Get scheme by ID or unique code (e.g. NFST, NOS)
export const getSchemeByIdApi = async (id) => {
  return await api.get(`/schemes/${id}`);
};

// Admin: Create new scheme
export const createSchemeApi = async (schemeData) => {
  return await api.post('/admin/schemes', schemeData);
};

// Admin: Update existing scheme
export const updateSchemeApi = async (id, schemeData) => {
  return await api.put(`/admin/schemes/${id}`, schemeData);
};

// Admin: Delete scheme
export const deleteSchemeApi = async (id) => {
  return await api.delete(`/admin/schemes/${id}`);
};
