import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert
} from '../../components/ui';
import { Award, CheckSquare, Search, LogOut } from 'lucide-react';

export const ScreeningDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <PageContainer
      title="Ministry Screening & Selection Desk"
      hindiTitle="छंटनी एवं चयन समिति डेस्क"
      description="Level-2 committee portal for merit ranking, annual quota allocation, and sanction recommendation under Central Sector Schemes."
      breadcrumbs={[{ label: 'Screening Desk', href: '/screening/dashboard' }]}
      action={
        <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-6">
        <Alert variant="info" title="Screening Committee Active">
          Authenticated as <strong>{user?.name}</strong> [Screening & Recommendation Officer].
        </Alert>

        <div className="bg-white border border-slate-300 rounded p-6 shadow-2xs space-y-4">
          <SectionHeading
            title="Merit Assessment & Quota Allocation"
            hindiTitle="मेरिट मूल्यांकन"
            subtitle="750 NFST Slots & 20 NOS Slots Allocation Window"
            accentColor="saffron"
          />

          <div className="bg-slate-50 border border-slate-200 rounded p-6 text-center space-y-2">
            <Award className="w-10 h-10 text-[#c2410c] mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              Screening Desk Ready
            </h4>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Screening Committee credentials verified. Merit list generation and sanction order authorization workflows will link in Phase 5.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ScreeningDashboard;
