import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/formatters';

export const NotificationDrawer: React.FC = () => {
  const {
    currentUser,
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveView
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 p-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                aria-label="Close notification panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-[var(--border-color)] px-5 pt-3 gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                filter === 'all'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Activity ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                filter === 'unread'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] mx-auto flex items-center justify-center">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">No notifications here</p>
                <p className="text-xs text-[var(--text-muted)]">You're all caught up with your project milestones.</p>
              </div>
            ) : (
              filteredNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-[var(--bg-surface)] border-[var(--border-color)] opacity-85 hover:opacity-100'
                      : 'bg-blue-500/5 border-blue-500/30 dark:bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.message}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(item.timestamp)}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            markNotificationRead(item.id);
                            setIsNotificationDrawerOpen(false);
                            if (currentUser.role === 'admin') {
                              setActiveView('admin-dashboard');
                            } else if (currentUser.role === 'expert') {
                              setActiveView('expert-dashboard');
                            } else {
                              setActiveView('student-dashboard');
                            }
                          }}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>{currentUser.role === 'admin' ? 'Review in Admin Hub' : 'View Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-center text-xs text-[var(--text-muted)]">
            Lifecycle notifications are sent in real-time.
          </div>

        </div>
      </div>
    </div>
  );
};
