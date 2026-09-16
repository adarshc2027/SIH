import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminAuditLogsApi } from '../../services/adminApi';
import {
  SectionHeading,
  Button,
  StatusBadge,
  Alert,
  Modal,
  Table,
  Input,
  Select,
  LoadingState
} from '../../components/ui';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  User,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  LayoutDashboard,
  FileCheck,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const ACTION_BADGE_CONFIG = {
  'Application submitted': {
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: FileText
  },
  'Document verified': {
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: CheckCircle2
  },
  'Document rejected': {
    color: 'bg-red-50 text-red-900 border-red-200',
    icon: AlertTriangle
  },
  'Deficiency raised': {
    color: 'bg-amber-50 text-amber-950 border-amber-300',
    icon: AlertTriangle
  },
  'Deficiency resolved': {
    color: 'bg-teal-50 text-teal-900 border-teal-200',
    icon: CheckCircle2
  },
  'Application forwarded': {
    color: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: Layers
  },
  'Application selected': {
    color: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold',
    icon: ShieldCheck
  },
  'Application rejected': {
    color: 'bg-rose-100 text-rose-950 border-rose-300',
    icon: AlertTriangle
  },
  'Scheme modified': {
    color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    icon: Settings
  }
};

export const AdminAuditLogs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 25
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected Log Modal Detail
  const [activeLog, setActiveLog] = useState(null);

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit
      };

      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedAction) params.action = selectedAction;
      if (selectedEntity) params.entityType = selectedEntity;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getAdminAuditLogsApi(params);
      if (res?.success && res.data) {
        setAuditLogs(res.data.auditLogs || []);
        setPagination(res.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalCount: 0,
          limit: 25
        });
      }
    } catch (err) {
      console.warn('Failed to load audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(1);
  }, [selectedAction, selectedEntity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAuditLogs(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAction('');
    setSelectedEntity('');
    setStartDate('');
    setEndDate('');
    fetchAuditLogs(1);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const formatStatus = (status) => {
    if (!status) return '—';
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Applications', path: '/admin/applications', icon: FileText },
    { label: 'Welfare Schemes', path: '/admin/schemes', icon: Settings },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert, active: true }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-xs select-none">
      {/* 1. ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0c2340] text-slate-200 border-r border-[#1e3a8a] shrink-0">
        <div className="p-4 border-b border-[#1e3a8a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-white text-sm block leading-tight">Admin Console</span>
              <span className="text-[10px] text-slate-300">Central Directorate</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 rounded text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className={`p-3 space-y-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded font-semibold transition-colors ${
                  link.active
                    ? 'bg-[#113f67] text-amber-400 border border-[#1e4b7a]'
                    : 'text-slate-300 hover:bg-[#113f67] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#113f67] tracking-wider uppercase">
                Transparency & Governance Registry
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340]">
                Statutory Audit Logs
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Immutable chronological ledger of administrative operations, document reviews, scrutiny clearances, and status transitions
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={() => fetchAuditLogs(pagination.currentPage)}
              disabled={loading}
            >
              Refresh Ledger
            </Button>
          </div>

          {/* Statutory Notice */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded text-slate-700 flex items-center gap-2.5 text-xs">
            <ShieldAlert className="w-4 h-4 text-[#0c2340] shrink-0" />
            <span>
              <strong>Read-Only Audit Trail:</strong> All log entries are cryptographically stamped and immutable. Deletion or modification is prohibited under the Information Technology Act.
            </span>
          </div>

          {/* Summary Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Total Audit Records</span>
              <strong className="text-base text-slate-900">{pagination.totalCount}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Active Filters</span>
              <strong className="text-base text-[#113f67]">
                {[selectedAction, selectedEntity, searchTerm, startDate].filter(Boolean).length}
              </strong>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Audit Mode</span>
              <strong className="text-base text-emerald-700">Strict Append-Only</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Current Page</span>
              <strong className="text-base text-slate-900">
                {pagination.currentPage} of {pagination.totalPages}
              </strong>
            </div>
          </div>
        </div>

        {/* 3. MULTI-FIELD FILTER CONTROLS */}
        <div className="bg-white border border-slate-300 rounded p-4 shadow-xs space-y-3">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Keyword Search */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Search (User, Action, Remarks, App ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Ramesh, MOTA/NFST/2026, Document..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Action Type
              </label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              >
                <option value="">All Actions</option>
                <option value="Application submitted">Application submitted</option>
                <option value="Document verified">Document verified</option>
                <option value="Document rejected">Document rejected</option>
                <option value="Deficiency raised">Deficiency raised</option>
                <option value="Deficiency resolved">Deficiency resolved</option>
                <option value="Application forwarded">Application forwarded</option>
                <option value="Application selected">Application selected</option>
                <option value="Application rejected">Application rejected</option>
                <option value="Scheme modified">Scheme modified</option>
                <option value="ASSIGN_OFFICER">Officer Assigned</option>
              </select>
            </div>

            {/* Entity Type Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Target Entity
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-[#113f67] outline-hidden"
              >
                <option value="">All Entities</option>
                <option value="Application">Application</option>
                <option value="Document">Document</option>
                <option value="Deficiency">Deficiency</option>
                <option value="Scheme">Scheme</option>
              </select>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="flex items-end gap-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1"
                leftIcon={Search}
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Date Range Sub-row */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-slate-600 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date Filter:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs p-1 border border-slate-300 rounded bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs p-1 border border-slate-300 rounded bg-white"
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAuditLogs(1)}
              >
                Apply Dates
              </Button>
            )}
          </div>
        </div>

        {/* 4. AUDIT LOGS TABLE */}
        <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0c2340] text-white border-b border-slate-300">
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">User</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Action</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Entity</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Application</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Previous Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">New Status</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-400 mb-2" />
                      Loading statutory audit logs...
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      <ShieldAlert className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">No Audit Records Found</p>
                      <p className="text-[11px] text-slate-500">No logged activity matches the selected filter parameters.</p>
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => {
                    const actionConfig = ACTION_BADGE_CONFIG[log.action] || ACTION_BADGE_CONFIG[log.actionLabel] || {
                      color: 'bg-slate-100 text-slate-800 border-slate-300',
                      icon: FileText
                    };
                    const ActionIcon = actionConfig.icon;
                    const userName = log.user?.name || log.performedByName || 'Authorized User';
                    const userRole = log.user?.role || log.performedByRole || 'user';
                    const appNumber = log.applicationId?.applicationNumber || (typeof log.application === 'object' ? log.application?.applicationNumber : null);

                    return (
                      <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                        {/* 1. User */}
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{userName}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border bg-slate-100 text-slate-700 uppercase">
                              {userRole.replace('_', ' ')}
                            </span>
                            {log.user?.email && (
                              <span className="text-[10px] text-slate-500 truncate max-w-[130px]" title={log.user.email}>
                                {log.user.email}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 2. Action */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border uppercase tracking-wider ${actionConfig.color}`}
                          >
                            <ActionIcon className="w-3 h-3 shrink-0" />
                            <span>{log.action || log.actionLabel}</span>
                          </span>
                        </td>

                        {/* 3. Entity */}
                        <td className="py-2.5 px-3 font-semibold text-slate-700">
                          {log.entityType || 'Application'}
                        </td>

                        {/* 4. Application */}
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          {appNumber ? (
                            <span className="font-bold text-[#113f67] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              {appNumber}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* 5. Previous Status */}
                        <td className="py-2.5 px-3">
                          <span className="text-slate-600 font-mono text-[11px]">
                            {formatStatus(log.previousStatus || log.previousStage)}
                          </span>
                        </td>

                        {/* 6. New Status */}
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 font-mono text-[11px]">
                            {formatStatus(log.newStatus || log.newStage)}
                          </span>
                        </td>

                        {/* 7. Timestamp */}
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                          {formatDate(log.timestamp || log.createdAt)}
                        </td>

                        {/* 8. Actions (Read-Only Detail Modal) */}
                        <td className="py-2.5 px-3 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={Eye}
                            onClick={() => setActiveLog(log)}
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-300 flex items-center justify-between text-xs">
              <Button
                variant="outline"
                size="sm"
                leftIcon={ChevronLeft}
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => fetchAuditLogs(pagination.currentPage - 1)}
              >
                Previous
              </Button>

              <span className="text-slate-600 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total entries)
              </span>

              <Button
                variant="outline"
                size="sm"
                rightIcon={ChevronRight}
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => fetchAuditLogs(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* 5. READ-ONLY AUDIT DETAIL MODAL */}
      <Modal
        isOpen={Boolean(activeLog)}
        onClose={() => setActiveLog(null)}
        title="Official Audit Trail Record"
        subtitle={`Log Reference: ${activeLog?._id || ''}`}
        maxWidth="max-w-2xl"
      >
        {activeLog && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block text-[11px]">Action Recorded</span>
                <strong className="text-slate-900 text-sm">{activeLog.action || activeLog.actionLabel}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Target Entity Type</span>
                <strong className="text-slate-900 text-sm">{activeLog.entityType || 'Application'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Actor / Officer</span>
                <strong className="text-slate-900">
                  {activeLog.user?.name || activeLog.performedByName || 'Authorized User'} ({activeLog.user?.role || activeLog.performedByRole})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Recorded Timestamp</span>
                <span className="font-mono text-slate-800">{formatDate(activeLog.timestamp || activeLog.createdAt)}</span>
              </div>
            </div>

            {/* Status Transition Card */}
            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Previous Status</span>
                <strong className="text-slate-700 font-mono text-sm">
                  {formatStatus(activeLog.previousStatus || activeLog.previousStage)}
                </strong>
              </div>
              <div className="text-blue-500 font-bold text-base">➔</div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">New Status</span>
                <strong className="text-[#0c2340] font-mono text-sm">
                  {formatStatus(activeLog.newStatus || activeLog.newStage)}
                </strong>
              </div>
            </div>

            {/* Associated Application */}
            {activeLog.applicationId && (
              <div className="p-3 bg-white border border-slate-200 rounded space-y-1">
                <span className="text-slate-500 block text-[11px] font-semibold">Associated Application Dossier</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#0c2340]">
                    {activeLog.applicationId.applicationNumber || 'Application Reference'}
                  </span>
                  {activeLog.applicationId.scheme?.name && (
                    <span className="text-slate-600 text-xs">
                      {activeLog.applicationId.scheme.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Remarks / Justification */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Official Rationale / Remarks Recorded
              </label>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded text-slate-800 leading-relaxed font-mono">
                {activeLog.remarks || 'No specific remarks recorded for this audit entry.'}
              </div>
            </div>

            {/* Metadata (if available) */}
            {activeLog.metadata && Object.keys(activeLog.metadata).length > 0 && (
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Contextual Metadata
                </label>
                <pre className="p-2.5 bg-slate-900 text-emerald-400 rounded text-[11px] overflow-x-auto">
                  {JSON.stringify(activeLog.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveLog(null)}
              >
                Close Inspection
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAuditLogs;
