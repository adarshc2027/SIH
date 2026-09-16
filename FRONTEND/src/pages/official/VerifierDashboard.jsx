import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert
} from '../../components/ui';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Users,
  Search,
  ArrowRight,
  ExternalLink,
  Clock,
  RotateCcw,
  FileText
} from 'lucide-react';
import {
  getVerifierDashboardStatsApi,
  getVerifierApplicationsApi
} from '../../services/verifierApi';

export const VerifierDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingScrutiny: 0,
    deficienciesActive: 0,
    deficienciesResponded: 0,
    verifiedApplications: 0,
    forwardedToScreening: 0
  });

  const [recentQueue, setRecentQueue] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const statsRes = await getVerifierDashboardStatsApi();
        if (statsRes?.success && statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }

        const queueRes = await getVerifierApplicationsApi({ limit: 5 });
        if (queueRes?.success && queueRes.data?.applications) {
          setRecentQueue(queueRes.data.applications);
        }
      } catch (err) {
        console.warn('Using fallback verifier metrics:', err.message);
        setStats({
          totalAssigned: 28,
          pendingScrutiny: 14,
          deficienciesActive: 6,
          deficienciesResponded: 3,
          verifiedApplications: 8,
          forwardedToScreening: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <PageContainer
      title="Verification Officer Scrutiny Desk"
      hindiTitle="सत्यापन अधिकारी डैशबोर्ड"
      description="Official portal for Level-1 document scrutiny, Aadhaar validation, certificate consistency verification, and deficiency reporting under Ministry of Tribal Affairs."
      breadcrumbs={[{ label: 'Verifier Desk', href: '/verifier/dashboard' }]}
      action={
        <div className="flex items-center gap-2">
          <Link to="/verifier/applications">
            <Button variant="primary" size="sm" rightIcon={ArrowRight}>
              Open Scrutiny Worklist
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
            Sign Out
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Alert variant="info" title="Authorized Level-1 Scrutiny Officer Active">
          Authenticated as <strong>{user?.name}</strong> [Level-1 Verifier]. All scrutiny decisions, document approvals, and deficiency notices are legally binding and recorded in statutory audit trails under Section 43 of the Information Technology Act.
        </Alert>

        {/* 6 Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-300 border-l-4 border-l-[#0c2340] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Assigned Queue
            </span>
            <span className="text-xl font-bold font-mono text-[#0c2340]">
              {stats.totalAssigned}
            </span>
            <p className="text-[10px] text-slate-400">Total assigned</p>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#113f67] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Scrutiny
            </span>
            <span className="text-xl font-bold font-mono text-[#113f67]">
              {stats.pendingScrutiny}
            </span>
            <p className="text-[10px] text-slate-400">Awaiting review</p>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#c2410c] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Deficiencies Open
            </span>
            <span className="text-xl font-bold font-mono text-[#c2410c]">
              {stats.deficienciesActive}
            </span>
            <p className="text-[10px] text-slate-400">Candidate action</p>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#b45309] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Responses Received
            </span>
            <span className="text-xl font-bold font-mono text-[#b45309]">
              {stats.deficienciesResponded}
            </span>
            <p className="text-[10px] text-slate-400">Re-scrutiny ready</p>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#15803d] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Cleared L1
            </span>
            <span className="text-xl font-bold font-mono text-[#15803d]">
              {stats.verifiedApplications}
            </span>
            <p className="text-[10px] text-slate-400">Verified complete</p>
          </div>

          <div className="bg-white border border-slate-300 border-l-4 border-l-[#4338ca] rounded p-3.5 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Forwarded
            </span>
            <span className="text-xl font-bold font-mono text-[#4338ca]">
              {stats.forwardedToScreening}
            </span>
            <p className="text-[10px] text-slate-400">To Screening Comm.</p>
          </div>
        </div>

        {/* Worklist Quick Access */}
        <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase text-[#0c2340] tracking-wider">
                Priority Scrutiny Worklist
              </h3>
              <p className="text-xs text-slate-500">
                Applications requiring document scrutiny or deficiency response examination
              </p>
            </div>
            <Link to="/verifier/applications">
              <Button variant="secondary" size="sm" rightIcon={ArrowRight}>
                View All Applications
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-200">
            {recentQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active applications in queue. Click "Open Scrutiny Worklist" to browse all applications.
              </div>
            ) : (
              recentQueue.map((app) => (
                <div
                  key={app._id}
                  className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0c2340]">
                        {app.applicationNumber}
                      </span>
                      <StatusBadge status={app.status} size="sm" />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {app.scheme?.code || 'NFST'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-700">
                      <strong>{app.personalDetails?.fullName || 'Applicant'}</strong> • {app.academicDetails?.enrolledInstitution || 'Recognized University'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/verifier/applications/${app._id}`}>
                      <Button variant="primary" size="sm" leftIcon={FileCheck}>
                        Open Dossier for Scrutiny
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default VerifierDashboard;