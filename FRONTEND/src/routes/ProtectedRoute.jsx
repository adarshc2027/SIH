import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/ui';

/**
 * Protected Route Guard
 * Enforces authentication and optional Role-Based Access Control (RBAC)
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading, getDashboardPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingState
          message="प्रमाणीकरण जांच हो रही है / Verifying session credentials..."
          subtext="Connecting with Ministry Security Gateway"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page preserving the target location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization if restricted
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If user's role is not authorized for this route, redirect to their own role dashboard
    const userHome = getDashboardPath(user?.role);
    return <Navigate to={userHome} replace />;
  }

  return children;
};

export default ProtectedRoute;
