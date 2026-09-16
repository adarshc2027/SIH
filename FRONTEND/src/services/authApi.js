import api from './api';

/**
 * Authentication API Service
 */

// Register new applicant
export const registerApi = async (userData) => {
  return await api.post('/auth/register', userData);
};

// Login (applicant or official)
export const loginApi = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

// Get current user profile
export const getMeApi = async () => {
  return await api.get('/auth/me');
};
