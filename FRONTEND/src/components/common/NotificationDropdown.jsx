import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, AlertTriangle, FileCheck, Info, FileText, CheckCircle2 } from 'lucide-react';
import {
  getNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi
} from '../../services/notificationApi';

// Official type styling & icons
const NOTIFICATION_TYPE_CONFIG = {
  application_submitted: {
    label: 'Submission',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: FileText
  },
  document_verified: {
    label: 'Doc Verified',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: FileCheck
  },
  deficiency_raised: {
    label: 'Deficiency',
    color: 'bg-amber-50 text-amber-900 border-amber-300',
    icon: AlertTriangle
  },
  document_resubmission: {
    label: 'Resubmitted',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: FileText
  },
  application_verified: {
    label: 'Cleared',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle2
  },
  screening_update: {
    label: 'Screening',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: Info
  },
  selection_result: {
    label: 'Selection',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: CheckCircle2
  },
  system_notice: {
    label: 'Portal Notice',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: Info
  }
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchRecentNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotificationsApi({ limit: 6 });
      if (res?.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentNotifications();
    // Refresh periodically every 60 seconds
    const interval = setInterval(fetchRecentNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchRecentNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await markNotificationAsReadApi(notif._id);
        setNotifications((prev) =>
          prev.map((item) => (item._id === notif._id ? { ...item, read: true } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.warn('Failed to mark notification read:', err);
      }
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    } else {
      navigate('/notifications');
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllNotificationsAsReadApi();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Action Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-1.5 rounded text-slate-200 hover:text-white hover:bg-[#113f67] border border-slate-600 transition-colors cursor-pointer flex items-center justify-center"
        aria-label="View notifications"
        title="Official Notifications & Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#c2410c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-white leading-tight">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-300 rounded shadow-md z-50 overflow-hidden text-xs">
          {/* Header */}
          <div className="bg-[#0c2340] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-amber-500 text-[#0c2340] font-bold text-[10px] px-1.5 py-0.2 rounded">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-200">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 space-y-1">
                <Bell className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                <p className="font-semibold text-slate-700">No Notifications</p>
                <p className="text-[11px]">You have no new updates or statutory alerts at this time.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = NOTIFICATION_TYPE_CONFIG[notif.type] || NOTIFICATION_TYPE_CONFIG.system_notice;
                const IconComponent = config.icon;

                return (
                  <div
                    key={notif._id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-2.5 ${
                      !notif.read ? 'bg-amber-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    <div className="pt-1 shrink-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          !notif.read ? 'bg-[#c2410c]' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border uppercase ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatDate(notif.createdAt)}
                        </span>
                      </div>

                      <h5 className={`text-xs leading-snug ${!notif.read ? 'font-bold text-[#0c2340]' : 'font-medium text-slate-800'}`}>
                        {notif.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All Link */}
          <div className="bg-slate-50 p-2.5 border-t border-slate-200 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-[#113f67] hover:text-[#0c2340] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All Official Communications</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
