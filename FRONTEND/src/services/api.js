import axios from 'axios';

// Create Axios client instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Response interceptor for centralized error inspection
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected server error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.error || null
    };
    return Promise.reject(customError);
  }
);

// Health check service
export const checkSystemHealth = async () => {
  return await api.get('/health');
};

export default api;
