import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, TrendingUp, TrendingDown, AlertTriangle, Gift, 
  Target, Users, Clock, Trash2, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type NotificationType = 'all' | 'finance' | 'goals' | 'social' | 'alerts';

interface Notification {
  id: string;
  type: NotificationType;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'alerts',
    icon: <AlertTriangle size={16} />,
    iconBg: 'bg-destructive/10 text-destructive',
    title: 'Budget limit reached',
    description: "You've spent 95% of your Food & Groceries budget this month.",
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'finance',
    icon: <TrendingDown size={16} />,
    iconBg: 'bg-destructive/10 text-destructive',
    title: 'Large expense detected',
    description: "R1,250 spent at Woolworths — that's higher than your usual grocery run.",
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    type: 'goals',
    icon: <Target size={16} />,
    iconBg: 'bg-primary/10 text-primary',
    title: 'Savings goal on track',
    description: "You're 68% towards your New Laptop goal. Keep it up!",
    time: '3 hrs ago',
    read: false,
  },
  {
    id: '4',
    type: 'finance',
    icon: <TrendingUp size={16} />,
    iconBg: 'bg-green-500/10 text-green-600 dark:text-green-400',
    title: 'Income received',
    description: 'Salary of R15,000 deposited into your account.',
    time: '5 hrs ago',
    read: true,
  },
  {
    id: '5',
    type: 'social',
    icon: <Users size={16} />,
    iconBg: 'bg-accent/10 text-accent',
    title: 'IOU reminder',
    description: 'Thabo owes you R120 for the braai last weekend.',
    time: '1 day ago',
    read: true,
  },
  {
    id: '6',
    type: 'goals',
    icon: <Gift size={16} />,
    iconBg: 'bg-primary/10 text-primary',
    title: 'Achievement unlocked!',
    description: 'You completed the 7-Day No Spend Challenge. Nice one!',
    time: '2 days ago',
    read: true,
  },
  {
    id: '7',
    type: 'alerts',
    icon: <Clock size={16} />,
    iconBg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    title: 'Bill due tomorrow',
    description: 'Your electricity bill of R890 is due tomorrow.',
    time: '2 days ago',
    read: true,
  },
  {
    id: '8',
    type: 'finance',
    icon: <TrendingUp size={16} />,
    iconBg: 'bg-green-500/10 text-green-600 dark:text-green-400',
    title: 'Weekly savings summary',
    description: 'You saved R620 this week — 12% more than last week.',
    time: '3 days ago',
    read: true,
  },
];

const FILTERS: { label: string; value: NotificationType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Finance', value: 'finance' },
  { label: 'Goals', value: 'goals' },
  { label: 'Social', value: 'social' },
  { label: 'Alerts', value: 'alerts' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationType>('all');

  const filtered = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="rounded-full text-[10px] h-5 px-2 font-semibold">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs text-muted-foreground h-8">
            <Check size={14} className="mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            >
              <Bell size={32} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs opacity-60">You are all caught up!</p>
            </motion.div>
          ) : (
            filtered.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60, height: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => markRead(n.id)}
                className={`group relative flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors ${
                  n.read 
                    ? 'bg-card/50 hover:bg-card' 
                    : 'bg-card border border-primary/10 shadow-sm'
                }`}
              >
                {!n.read && (
                  <div className="absolute top-4 left-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}

                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${n.iconBg}`}>
                  {n.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-tight ${n.read ? 'font-medium text-foreground/80' : 'font-semibold text-foreground'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {n.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-medium">{n.time}</p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
