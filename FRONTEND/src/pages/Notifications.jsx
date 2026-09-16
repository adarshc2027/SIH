import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Info,
  FileText,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  getNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi
} from '../services/notificationApi';
import { SectionHeading, Button, StatusBadge, Alert } from '../components/ui';

const NOTIFICATION_TYPE_CONFIG = {
  application_submitted: {
    label: 'Application Submitted',
    badgeVariant: 'submitted',
    color: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: FileText
  },
  document_verified: {
    label: 'Document Verified',
    badgeVariant: 'verified',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: FileCheck
  },
  deficiency_raised: {
    label: 'Deficiency Notice',
    badgeVariant: 'deficient',
    color: 'bg-amber-50 text-amber-950 border-amber-300',
    icon: AlertTriangle
  },
  document_resubmission: {
    label: 'Document Resubmission',
    badgeVariant: 'under_scrutiny',
    color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    icon: FileText
  },
  application_verified: {
    label: 'Scrutiny Clearance',
    badgeVariant: 'verified',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: CheckCircle2
  },
  screening_update: {
    label: 'Screening Update',
    badgeVariant: 'under_scrutiny',
    color: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: Info
  },
  selection_result: {
    label: 'Selection Result',
    badgeVariant: 'sanctioned',
    color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    icon: CheckCircle2
  },
  system_notice: {
    label: 'Portal Advisory',
    badgeVariant: 'draft',
    color: 'bg-slate-100 text-slate-900 border-slate-300',
    icon: Info
  }
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters: 'all' | 'unread' | 'deficiency' | 'verification' | 'system'
  const [activeFilter, setActiveFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchNotifications = async (page = 1, filter = activeFilter) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (filter === 'unread') {
        params.unreadOnly = 'true';
      } else if (filter === 'deficiency') {
        params.type = 'deficiency_raised';
      } else if (filter === 'verification') {
        params.type = 'document_verified';
      } else if (filter === 'system') {
        params.type = 'system_notice';
      }

      const res = await getNotificationsApi(params);
      if (res?.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
        setCurrentPage(res.data.pagination?.currentPage || 1);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.totalCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, activeFilter);
  }, [activeFilter]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, read: true } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
      setSuccessMessage('All notifications marked as read.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.warn('Failed to mark all read:', err);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#113f67] tracking-wider uppercase">
                Official Intimations & Communications
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0c2340]">
                Notification Desk
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Statutory communications, deficiency alerts, and scrutiny stage updates dispatched by Ministry Officials
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={RefreshCw}
                onClick={() => fetchNotifications(currentPage, activeFilter)}
                disabled={loading}
              >
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={CheckCheck}
                  onClick={handleMarkAllAsRead}
                >
                  Mark All as Read ({unreadCount})
                </Button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-200 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Total Communications</span>
              <strong className="text-base text-slate-900">{totalCount}</strong>
            </div>
            <div className="bg-amber-50/70 p-3 rounded border border-amber-200">
              <span className="text-amber-800 block text-[11px] font-medium">Unread Intimations</span>
              <strong className="text-base text-amber-950">{unreadCount}</strong>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Current Page</span>
              <strong className="text-base text-slate-900">
                {currentPage} of {totalPages}
              </strong>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Portal Sync Status</span>
              <strong className="text-base text-emerald-700">Real-Time Active</strong>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert variant="success" title="Action Completed">
            {successMessage}
          </Alert>
        )}

        {/* Filter Navigation Bar */}
        <div className="bg-white border border-slate-300 rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Messages' },
              { id: 'unread', label: `Unread Only (${unreadCount})` },
              { id: 'deficiency', label: 'Deficiency Notices' },
              { id: 'verification', label: 'Verifications' },
              { id: 'system', label: 'Portal Advisories' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer text-xs ${
                  activeFilter === f.id
                    ? 'bg-[#0c2340] text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500">
            Showing {notifications.length} of {totalCount} records
          </span>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400 mb-2" />
              <p>Fetching official notifications from Ministry repository...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white border border-slate-300 rounded p-12 text-center text-slate-500 text-xs space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Communications Found</h4>
              <p className="max-w-md mx-auto text-slate-600">
                {activeFilter === 'unread'
                  ? 'All notifications have been read. No pending alerts.'
                  : 'There are no official notifications recorded matching your current filter criteria.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = NOTIFICATION_TYPE_CONFIG[notif.type] || NOTIFICATION_TYPE_CONFIG.system_notice;
              const IconComponent = config.icon;

              return (
                <div
                  key={notif._id}
                  className={`bg-white border rounded p-4 text-xs transition-colors space-y-3 ${
                    !notif.read
                      ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                      : 'border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Unread indicator */}
                      <div className="pt-1 shrink-0">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            !notif.read ? 'bg-[#c2410c]' : 'bg-slate-300'
                          }`}
                          title={!notif.read ? 'Unread notification' : 'Read notification'}
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${config.color}`}
                          >
                            {config.label}
                          </span>
                          {!notif.read && (
                            <span className="bg-[#c2410c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                              NEW
                            </span>
                          )}
                        </div>

                        <h3 className={`text-sm ${!notif.read ? 'font-bold text-[#0c2340]' : 'font-semibold text-slate-800'}`}>
                          {notif.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 shrink-0 sm:self-start">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="pl-5.5 text-slate-700 leading-relaxed text-xs">
                    {notif.message}
                  </div>

                  {/* Action Bar */}
                  <div className="pl-5.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="text-xs font-semibold text-[#113f67] hover:text-[#0c2340] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Associated Dossier</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    {!notif.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="text-[11px] font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-2.5 py-1 bg-white hover:bg-slate-50 cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white border border-slate-300 rounded p-3 flex items-center justify-between text-xs">
            <Button
              variant="outline"
              size="sm"
              leftIcon={ChevronLeft}
              disabled={currentPage <= 1 || loading}
              onClick={() => fetchNotifications(currentPage - 1, activeFilter)}
            >
              Previous
            </Button>

            <span className="text-slate-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              rightIcon={ChevronRight}
              disabled={currentPage >= totalPages || loading}
              onClick={() => fetchNotifications(currentPage + 1, activeFilter)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
