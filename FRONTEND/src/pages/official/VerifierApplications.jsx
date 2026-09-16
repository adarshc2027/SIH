import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  PageContainer,
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Table
} from '../../components/ui';
import {
  ShieldCheck,
  FileCheck,
  Search,
  Filter,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { getVerifierApplicationsApi } from '../../services/verifierApi';

export const VerifierApplications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);

  const fetchWorklist = async () => {
    try {
      setLoading(true);
      const res = await getVerifierApplicationsApi({
        page,
        limit,
        search: searchTerm,
        scheme: selectedScheme,
        status: selectedStatus
      });

      if (res?.success && res.data) {
        setApplications(res.data.applications || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.warn('Could not load verifier applications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorklist();
  }, [page, limit, selectedScheme, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchWorklist();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedScheme('');
    setSelectedStatus('');
    setPage(1);
  };

  return (
    <PageContainer
      title="Level-1 Scrutiny Worklist"
      hindiTitle="सत्यापन कार्यसूची"
      description="List of applications assigned for Level-1 statutory scrutiny, document verification, deficiency tracking, and screening committee clearance."
      breadcrumbs={[
        { label: 'Verifier Desk', href: '/verifier/dashboard' },
        { label: 'Applications Worklist', href: '/verifier/applications' }
      ]}
      action={
        <Button variant="outline" size="sm" onClick={logout} leftIcon={LogOut}>
          Sign Out
        </Button>
      }
    >
      <div className="space-y-5">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-2xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                placeholder="Search by Application ID, Name, Mobile, Caste Cert No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#113f67] outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedScheme}
                onChange={(e) => {
                  setSelectedScheme(e.target.value);
                  setPage(1);
                }}
                className="w-full border border-slate-300 rounded px-2.5 py-2 text-xs bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              >
                <option value="">All Schemes</option>
                <option value="NFST">NFST (Fellowship)</option>
                <option value="NOS">NOS (Overseas)</option>
                <option value="POST_MATRIC">Post-Matric (PMS)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full border border-slate-300 rounded px-2.5 py-2 text-xs bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_verification">Under Verification</option>
                <option value="deficiency_raised">Deficiency Raised</option>
                <option value="verified">Verified</option>
                <option value="under_screening">Under Screening</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <Button type="submit" variant="primary" size="sm" className="w-full justify-center">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500 font-mono">
            <span>Showing {applications.length} Records</span>
            <span>Total Assigned: {pagination.totalCount} Applications</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0c2340] text-white border-b border-[#113f67] font-semibold">
                <tr>
                  <th className="p-3 whitespace-nowrap">Application ID</th>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3 whitespace-nowrap">Scheme</th>
                  <th className="p-3">Enrolled Institution</th>
                  <th className="p-3 whitespace-nowrap">Submitted On</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Scrutiny Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      Loading verification queue...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">
                      No applications currently in queue matching the filters.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0c2340] whitespace-nowrap">
                        {app.applicationNumber}
                      </td>

                      <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                        {app.personalDetails?.fullName || 'Applicant'}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {app.personalDetails?.tribalCommunity || 'ST Community'}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[10px] border border-slate-200">
                          {app.scheme?.code || 'NFST'}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700 max-w-[200px] truncate">
                        {app.academicDetails?.enrolledInstitution || 'Recognized University'}
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {app.submittedAt
                          ? new Date(app.submittedAt).toLocaleDateString('en-GB')
                          : app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString('en-GB')
                          : 'Draft'}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <StatusBadge status={app.status} size="sm" />
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <Link to={`/verifier/applications/${app._id}`}>
                          <Button variant="primary" size="sm" leftIcon={FileCheck}>
                            Open Scrutiny Dossier
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50 p-3.5 border-t border-slate-300 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-mono">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default VerifierApplications;