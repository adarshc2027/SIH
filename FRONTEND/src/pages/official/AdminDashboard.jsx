import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert
} from '../../components/ui';
import { Settings, Shield, Users, Database, LogOut, FileText, ArrowRight } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <PageContainer
      title="Ministry IT Administration Portal"
      hindiTitle="प्रशासनिक नियंत्रण केंद्र"
      description="System administration, role provisioning, audit trail surveillance, and scheme quota configurations for Ministry of Tribal Affairs."
      breadcrumbs={[{ label: 'Admin Dashboard', href: '/admin/dashboard' }]}
      action={
        <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-6">
        <Alert variant="info" title="System Administrator Access Granted">
          Logged in as <strong>{user?.name}</strong> (`admin`). System-wide security oversight and user management access enabled.
        </Alert>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Admin Identity
            </span>
            <h3 className="font-bold text-slate-900 text-sm">{user?.name}</h3>
            <p className="text-xs text-slate-600 font-mono">{user?.email}</p>
            <div className="pt-2">
              <StatusBadge status="sanctioned" label="Super Administrator" size="sm" />
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Welfare Scheme Registry
            </span>
            <span className="text-2xl font-bold font-mono text-[#0c2340]">Configurable</span>
            <p className="text-xs text-slate-500">NFST, NOS & Central Sector Scholarships</p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Security Status
            </span>
            <span className="text-2xl font-bold font-mono text-[#15803d]">GIGW 3.0</span>
            <p className="text-xs text-slate-500">STQC compliant session & audit controls</p>
          </div>
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-300 border-l-4 border-l-[#0c2340] rounded p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 rounded text-[#0c2340]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0c2340] text-sm">Welfare Schemes Management</h4>
                <p className="text-xs text-slate-500">Configure NFST, NOS, quotas, eligibility & documents</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create and update Central Sector scholarship schemes, configure required documents with size constraints, edit financial entitlements, and set application deadlines.
            </p>
            <div className="pt-2">
              <Link to="/admin/schemes">
                <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                  Manage Welfare Schemes
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#15803d] rounded p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-100 rounded text-[#15803d]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#0c2340] text-sm">Public Portal Verification</h4>
                <p className="text-xs text-slate-500">Inspect live public citizen scheme catalog</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              View how configured schemes, eligibility rules, and mandatory documents appear to citizens and students on the national portal.
            </p>
            <div className="pt-2">
              <Link to="/schemes" target="_blank">
                <Button variant="secondary" size="sm" rightIcon={ArrowRight}>
                  View Public Schemes Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminDashboard;
