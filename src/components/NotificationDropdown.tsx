import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, TrendingUp, TrendingDown, AlertTriangle, Gift,
  Target, Users, Clock, Trash2, X, Zap, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotif,
  clearAllNotifications,
  type AppNotification,
  type NotificationIconType,
} from '@/services/notificationService';

const ICON_MAP: Record<NotificationIconType, { icon: React.ReactNode; bg: string }> = {
  expense: { icon: <TrendingDown size={14} />, bg: 'bg-destructive/10 text-destructive' },
  income: { icon: <TrendingUp size={14} />, bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  alert: { icon: <AlertTriangle size={14} />, bg: 'bg-destructive/10 text-destructive' },
  goal: { icon: <Target size={14} />, bg: 'bg-primary/10 text-primary' },
  achievement: { icon: <Gift size={14} />, bg: 'bg-primary/10 text-primary' },
  bill: { icon: <Clock size={14} />, bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  social: { icon: <Users size={14} />, bg: 'bg-accent/10 text-accent' },
  info: { icon: <Info size={14} />, bg: 'bg-primary/10 text-primary' },
};

type FilterType = 'all' | 'finance' | 'goals' | 'alerts';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Finance', value: 'finance' },
  { label: 'Goals', value: 'goals' },
  { label: 'Alerts', value: 'alerts' },
];

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);

  // Load on open
  useEffect(() => {
    if (open) loadNotifications();
  }, [open, loadNotifications]);

  // Poll for unread count every 30s
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = async (id: string) => {
    await deleteNotif(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
    setOpen(false);
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 rounded-full hover:bg-muted/60"
        onClick={() => setOpen(!open)}
      >
        <Bell size={15} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
        )}
      </Button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-24px)] bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="default" className="rounded-full text-[9px] h-4 px-1.5 font-bold">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-primary font-semibold px-2 py-1 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 px-4 pb-2 overflow-x-auto no-scrollbar">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                    filter === f.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border/60 mx-3" />

            {/* Notification list */}
            <div className="max-h-[360px] overflow-y-auto overscroll-contain">
              {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center py-10 text-muted-foreground"
                    >
                      <Bell size={24} className="mb-2 opacity-20" />
                      <p className="text-xs font-medium">No notifications yet</p>
                      <p className="text-[10px] opacity-50 mt-0.5">They'll appear as you use the app</p>
                    </motion.div>
                  ) : (
                    filtered.map((n, i) => {
                      const iconInfo = ICON_MAP[n.icon_type as NotificationIconType] || ICON_MAP.info;
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => handleMarkRead(n.id)}
                          className={`group relative flex items-start gap-2.5 px-4 py-3 cursor-pointer transition-colors border-b border-border/30 last:border-0 ${
                            n.read
                              ? 'hover:bg-muted/40'
                              : 'bg-primary/[0.03] hover:bg-primary/[0.06]'
                          }`}
                        >
                          {!n.read && (
                            <div className="absolute top-3.5 left-1.5 w-1 h-1 rounded-full bg-primary" />
                          )}

                          <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${iconInfo.bg}`}>
                            {iconInfo.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] leading-tight ${n.read ? 'font-medium text-foreground/75' : 'font-semibold text-foreground'}`}>
                              {n.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                              {n.description}
                            </p>
                            <p className="text-[9px] text-muted-foreground/50 mt-1 font-medium">
                              {formatTime(n.created_at)}
                            </p>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive mt-0.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border/60 px-4 py-2.5">
                <button
                  onClick={handleClearAll}
                  className="w-full text-center text-[10px] font-semibold text-muted-foreground hover:text-destructive transition-colors py-1"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
