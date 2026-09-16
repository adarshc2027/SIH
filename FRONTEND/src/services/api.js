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

// Request interceptor: Attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mota_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract response data and normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If token expired or unauthorized, clear local session
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('mota_auth_token');
        localStorage.removeItem('mota_auth_user');
      }
    }

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
