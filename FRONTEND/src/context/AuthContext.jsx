import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mota_auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mota_auth_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Revalidate profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mota_auth_token');
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('mota_auth_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Determine dashboard redirect path based on user role
  const getDashboardPath = (role) => {
    switch (role) {
      case 'applicant':
        return '/applicant/dashboard';
      case 'verifier':
        return '/verifier/dashboard';
      case 'screening_officer':
        return '/screening/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginApi({ email, password });
      const { user: loggedInUser, token: authToken } = res.data;

      localStorage.setItem('mota_auth_token', authToken);
      localStorage.setItem('mota_auth_user', JSON.stringify(loggedInUser));

      setToken(authToken);
      setUser(loggedInUser);

      return loggedInUser;
    } catch (err) {
      const msg = err.message || 'Login failed. Please check credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Registration handler (applicant)
  const register = async (userData) => {
    setError(null);
    try {
      const res = await registerApi(userData);
      const { user: registeredUser, token: authToken } = res.data;

      localStorage.setItem('mota_auth_token', authToken);
      localStorage.setItem('mota_auth_user', JSON.stringify(registeredUser));

      setToken(authToken);
      setUser(registeredUser);

      return registeredUser;
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('mota_auth_token');
    localStorage.removeItem('mota_auth_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    getDashboardPath,
    isAuthenticated: !!token && !!user,
    isApplicant: user?.role === 'applicant',
    isVerifier: user?.role === 'verifier',
    isScreeningOfficer: user?.role === 'screening_officer',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
