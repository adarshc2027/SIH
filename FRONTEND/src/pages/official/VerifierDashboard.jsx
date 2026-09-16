import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert
} from '../../components/ui';
import { ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, LogOut, Users } from 'lucide-react';

export const VerifierDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <PageContainer
      title="Verification Officer Scrutiny Desk"
      hindiTitle="सत्यापन अधिकारी डेस्क"
      description="Official portal for Level-1 document scrutiny, Aadhaar validation, certificate consistency checking, and deficiency reporting."
      breadcrumbs={[{ label: 'Verifier Desk', href: '/verifier/dashboard' }]}
      action={
        <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-6">
        <Alert variant="info" title="Authorized Official Desk Active">
          Authenticated as <strong>{user?.name}</strong> [Level-1 Scrutiny Officer]. All verification actions are logged in the statutory audit trail under Section 43 of the IT Act.
        </Alert>

        {/* Officer Profile & Verification Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Officer Identity
            </span>
            <h3 className="font-bold text-slate-900 text-sm">{user?.name}</h3>
            <p className="text-xs text-slate-600 font-mono">{user?.email}</p>
            <div className="pt-2">
              <StatusBadge status="verified" label="Active Scrutiny Officer" size="sm" />
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Queue Summary
            </span>
            <span className="text-2xl font-bold font-mono text-[#0c2340]">24 Pending</span>
            <p className="text-xs text-slate-500">NFST & NOS applications awaiting document review</p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Assisted Verifications
            </span>
            <span className="text-2xl font-bold font-mono text-[#15803d]">18 Completed</span>
            <p className="text-xs text-slate-500">Scrutinized with OCR consistency checks</p>
          </div>
        </div>

        {/* Verification Queue Placeholder */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
          <SectionHeading
            title="Document Verification Worklist"
            hindiTitle="दस्तावेज़ सत्यापन कार्यसूची"
            subtitle="Side-by-side inspection desk will be configured in upcoming phases"
            accentColor="blue"
          />

          <div className="bg-slate-50 border border-slate-200 rounded p-6 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-[#113f67] mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              Authentication Module Operational
            </h4>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Your Level-1 Verifier credentials have been validated. Document inspection queue and OCR discrepancy highlighting interface will connect in Phase 4.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default VerifierDashboard;
