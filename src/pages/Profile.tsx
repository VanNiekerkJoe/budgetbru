
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Bell, CircleDollarSign, FileText, HelpCircle, LogOut, Settings,
  Shield, Moon, Palette, Share2, Star, BookOpen, Gift, ChevronRight,
  Camera, Sparkles, Trophy, Target, Flame, Zap, Crown,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

/* ── Achievement Card ────────────────────────────────── */
const AchievementCard: React.FC<{
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  completed?: boolean;
}> = ({ title, description, progress, icon, completed }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      relative flex items-center gap-3 p-3.5 rounded-2xl border transition-colors
      ${completed
        ? 'bg-warning/5 border-warning/20'
        : 'bg-card border-border/50 hover:border-border'}
    `}
  >
    <div className={`
      w-10 h-10 rounded-xl flex items-center justify-center shrink-0
      ${completed
        ? 'bg-warning/15 text-warning'
        : 'bg-muted text-muted-foreground'}
    `}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        {completed && <Crown size={12} className="text-warning shrink-0" />}
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
      <div className="mt-2">
        <Progress value={progress} className="h-1.5" />
      </div>
    </div>
    <span className={`text-xs font-bold shrink-0 ${completed ? 'text-warning' : 'text-muted-foreground'}`}>
      {completed ? '✓' : `${progress}%`}
    </span>
  </motion.div>
);

/* ── Setting Row ─────────────────────────────────────── */
const SettingRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon, label, description, action, onClick }) => (
  <motion.div
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${onClick ? 'cursor-pointer hover:bg-muted/60 active:bg-muted' : ''}`}
  >
    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
    {action || (onClick && <ChevronRight size={16} className="text-muted-foreground shrink-0" />)}
  </motion.div>
);

/* ── Stat Pill ───────────────────────────────────────── */
const StatPill: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl bg-muted/50">
    <div className="text-primary">{icon}</div>
    <span className="text-base font-bold text-foreground">{value}</span>
    <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
  </div>
);

/* ── Main Profile ────────────────────────────────────── */
type ProfileSection = 'overview' | 'achievements' | 'settings';

const Profile: React.FC = () => {
  const [section, setSection] = useState<ProfileSection>('overview');
  const [showAppearanceDialog, setShowAppearanceDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('darkMode') === 'true' : false
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', String(next));
  };

  const THEMES = [
    { name: 'Default', hue: '324' },
    { name: 'Ocean', hue: '200' },
    { name: 'Sunset', hue: '25' },
    { name: 'Mint', hue: '160' },
    { name: 'Lavender', hue: '270' },
  ];
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].name);

  const sectionPills: { key: ProfileSection; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Sparkles size={13} /> },
    { key: 'achievements', label: 'Achievements', icon: <Trophy size={13} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={13} /> },
  ];

  return (
    <div className="space-y-5">
      {/* ── Profile Header ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-border/40 p-6"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <Avatar className="h-18 w-18 border-3 border-background shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                BP
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Camera size={12} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">Budget Pro</h1>
            <p className="text-sm text-muted-foreground truncate">student@university.ac.za</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-0">
                <Flame size={10} className="mr-0.5" /> Budget Master
              </Badge>
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-warning/10 text-warning border-0">
                <Star size={10} className="mr-0.5" fill="currentColor" /> Level 4
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mt-5 relative z-10">
          <StatPill icon={<Flame size={16} />} value="32" label="Day Streak" />
          <StatPill icon={<Target size={16} />} value="4/10" label="Goals Met" />
          <StatPill icon={<Zap size={16} />} value="2.4k" label="XP Earned" />
        </div>
      </motion.div>

      {/* ── Section Toggle ─────────────────────── */}
      <div className="flex gap-1.5 bg-muted/50 p-1 rounded-2xl">
        {sectionPills.map(s => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
              ${section === s.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ── Section Content ────────────────────── */}
      <AnimatePresence mode="wait">
        {section === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <Card className="border-border/40 shadow-none">
              <CardContent className="p-1">
                <SettingRow icon={<Bell size={16} />} label="Notifications" description="Push & budget alerts" action={<Switch defaultChecked />} />
                <SettingRow icon={<Shield size={16} />} label="Privacy Mode" description="Hide sensitive info" action={<Switch />} />
                <SettingRow icon={<CircleDollarSign size={16} />} label="Budget Alerts" description="When you're near limits" action={<Switch defaultChecked />} />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-none">
              <CardContent className="p-1">
                <SettingRow icon={<Share2 size={16} />} label="Export Data" description="Download as CSV"
                  onClick={() => toast.success('Data export prepared', { description: 'Your data export is ready to download' })} />
                <SettingRow icon={<HelpCircle size={16} />} label="Help & Support" description="FAQs and contact"
                  onClick={() => toast.info('Opening support resources')} />
                <SettingRow icon={<BookOpen size={16} />} label="Documentation" description="Learn how it works"
                  onClick={() => toast.info('Opening documentation')} />
              </CardContent>
            </Card>

            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl h-12"
              onClick={() => toast.info("You've been logged out", { description: 'Come back soon!' })}
            >
              <LogOut size={16} className="mr-2" /> Log Out
            </Button>
          </motion.div>
        )}

        {section === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {/* Progress summary */}
            <div className="flex items-center justify-between bg-warning/5 border border-warning/15 rounded-2xl p-4">
              <div>
                <p className="text-sm font-bold text-foreground">4 of 10 Unlocked</p>
                <p className="text-xs text-muted-foreground mt-0.5">Keep going — you're 40% there!</p>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--warning))" strokeWidth="4"
                    strokeDasharray={`${0.4 * 125.6} ${125.6}`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-warning">40%</span>
              </div>
            </div>

            <AchievementCard title="Budget Master" description="Stick to a budget for 30 days" progress={100} icon={<CircleDollarSign size={16} />} completed />
            <AchievementCard title="Savings Superstar" description="Reach your first savings goal" progress={100} icon={<Star size={16} />} completed />
            <AchievementCard title="Expense Tracker" description="Track expenses for 14 days straight" progress={100} icon={<FileText size={16} />} completed />
            <AchievementCard title="Financial Scholar" description="Complete 5 financial literacy tutorials" progress={100} icon={<BookOpen size={16} />} completed />
            <AchievementCard title="Money Milestone" description="Save R10,000 in total" progress={68} icon={<Gift size={16} />} />
            <AchievementCard title="Frugal Foodie" description="Keep food under budget for 2 months" progress={45} icon={<Flame size={16} />} />
          </motion.div>
        )}

        {section === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <Card className="border-border/40 shadow-none">
              <CardContent className="p-1">
                <SettingRow icon={<Moon size={16} />} label="Dark Mode" action={<Switch checked={darkMode} onCheckedChange={toggleDarkMode} />} />
                <SettingRow icon={<Palette size={16} />} label="Theme & Appearance" description={selectedTheme}
                  onClick={() => setShowAppearanceDialog(true)} />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-none">
              <CardContent className="p-1">
                <SettingRow icon={<Shield size={16} />} label="Hide Balance" description="Privacy on dashboard" action={<Switch />} />
                <SettingRow icon={<Share2 size={16} />} label="Share Usage Data" description="Help improve the app" action={<Switch defaultChecked />} />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-none">
              <CardContent className="p-1">
                <SettingRow icon={<Share2 size={16} />} label="Export Data"
                  onClick={() => toast.success('Data export prepared')} />
                <SettingRow icon={<CircleDollarSign size={16} />} label="Check for Updates"
                  onClick={() => toast.info('Checking for updates...')} />
              </CardContent>
            </Card>

            {/* About */}
            <div className="text-center py-4 space-y-1.5">
              <p className="text-sm font-bold text-primary">BudgetBru</p>
              <p className="text-[11px] text-muted-foreground">Version 1.0.0 (Beta)</p>
              <p className="text-[11px] text-muted-foreground">Made with 💜 in South Africa</p>
              <div className="flex justify-center gap-2 mt-3">
                <Button variant="outline" size="sm" className="text-xs rounded-xl h-8"
                  onClick={() => toast.info('Opening privacy policy')}>Privacy Policy</Button>
                <Button variant="outline" size="sm" className="text-xs rounded-xl h-8"
                  onClick={() => toast.info('Opening terms of service')}>Terms of Service</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Appearance Dialog ──────────────────── */}
      <Dialog open={showAppearanceDialog} onOpenChange={setShowAppearanceDialog}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Theme & Appearance</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Theme</p>
              <div className="grid grid-cols-5 gap-2">
                {THEMES.map(theme => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme.name)}
                    className={`
                      flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all
                      ${selectedTheme === theme.name ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'}
                    `}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-inner"
                      style={{ background: `hsl(${theme.hue}, 60%, 60%)` }}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Easier on the eyes</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Button className="w-full rounded-xl" onClick={() => { setShowAppearanceDialog(false); toast.success('Appearance saved!'); }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
