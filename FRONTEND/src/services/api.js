import axios from 'axios';

// Normalize the API base URL to ensure proper endpoint routing
const resolveApiBaseUrl = (rawUrl) => {
  if (!rawUrl || rawUrl.trim() === '') {
    return '/api';
  }
  let cleaned = rawUrl.trim().replace(/\/+$/, '');
  // If the user specified an origin without /api, append /api
  if (!cleaned.endsWith('/api')) {
    cleaned = `${cleaned}/api`;
  }
  return cleaned;
};

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);

// Helper to construct fully qualified URLs for uploaded statutory documents
export const getFileUrl = (filePath) => {
  if (!filePath) return '';

  // Strip hardcoded localhost development prefixes if stored in legacy records
  const cleaned = filePath.replace(/^http:\/\/localhost:\d+/i, '');

  // If already an absolute web URL (e.g. AWS S3, Cloudinary, Vercel Blob), return as-is
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return cleaned;
  }

  const normalized = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;

  // If API_BASE_URL is an absolute URL (e.g. https://backend.vercel.app/api)
  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${backendOrigin}${normalized}`;
  }

  // Unified deployment or relative proxy mode
  return normalized;
};

// Create Axios client instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
