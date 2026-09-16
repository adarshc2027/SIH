import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Schemes } from '../pages/Schemes';
import { SchemeDetails } from '../pages/SchemeDetails';
import { Guidelines } from '../pages/Guidelines';
import { Notices } from '../pages/Notices';
import { HelpSupport } from '../pages/HelpSupport';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Dashboards & Administration
import { ApplicantDashboard } from '../pages/applicant/ApplicantDashboard';
import { ApplyScheme } from '../pages/applicant/ApplyScheme';
import { VerifierDashboard } from '../pages/official/VerifierDashboard';
import { VerifierApplications } from '../pages/official/VerifierApplications';
import { VerifierApplicationDetail } from '../pages/official/VerifierApplicationDetail';
import { ScreeningDashboard } from '../pages/official/ScreeningDashboard';
import { AdminDashboard } from '../pages/official/AdminDashboard';
import { AdminSchemes } from '../pages/official/AdminSchemes';
import { AdminApplications } from '../pages/official/AdminApplications';
import { AdminAuditLogs } from '../pages/official/AdminAuditLogs';
import { AdminReports } from '../pages/official/AdminReports';
import { Notifications } from '../pages/Notifications';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Citizen Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/schemes" element={<Schemes />} />
      <Route path="/schemes/:id" element={<SchemeDetails />} />
      <Route path="/guidelines" element={<Guidelines />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/help-support" element={<HelpSupport />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Applicant Routes */}
      <Route
        path="/applicant/dashboard"
        element={
          <ProtectedRoute allowedRoles={['applicant']}>
            <ApplicantDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Applicant: Multi-Step Application Wizard */}
      <Route
        path="/applicant/apply/:schemeId"
        element={
          <ProtectedRoute allowedRoles={['applicant']}>
            <ApplyScheme />
          </ProtectedRoute>
        }
      />

      {/* Protected Official: Level-1 Scrutiny Officer */}
      <Route
        path="/verifier/dashboard"
        element={
          <ProtectedRoute allowedRoles={['verifier', 'admin']}>
            <VerifierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verifier/applications"
        element={
          <ProtectedRoute allowedRoles={['verifier', 'admin']}>
            <VerifierApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verifier/applications/:id"
        element={
          <ProtectedRoute allowedRoles={['verifier', 'admin']}>
            <VerifierApplicationDetail />
          </ProtectedRoute>
        }
      />

      {/* Protected Official: Level-2 Screening Committee */}
      <Route
        path="/screening/dashboard"
        element={
          <ProtectedRoute allowedRoles={['screening_officer', 'admin']}>
            <ScreeningDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Official: Super Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin: Master Applications Desk */}
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin: Welfare Scheme Master Management */}
      <Route
        path="/admin/schemes"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSchemes />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin: Statutory Audit Logs Registry */}
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin: Statistical & Performance Reports */}
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      {/* Protected: Official Communications & Notifications Desk */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['applicant', 'verifier', 'screening_officer', 'admin']}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
