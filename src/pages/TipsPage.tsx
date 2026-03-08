import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Star, Coffee, DollarSign, Briefcase, GraduationCap,
  Lightbulb, TrendingUp, Heart, Bookmark, BookmarkCheck, ChevronRight,
  Flame, Target, Sparkles, ArrowRight, CheckCircle2, Clock, Zap,
  PiggyBank, ShieldCheck, Users, Smartphone, Search, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';

type TipCategory = 'student' | 'budgeting' | 'saving' | 'earning' | 'investing' | 'lifestyle';
type TipDifficulty = 'beginner' | 'intermediate' | 'advanced';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: TipCategory;
  difficulty: TipDifficulty;
  emoji: string;
  isFeatured?: boolean;
  potentialSaving?: number;
  actionSteps?: string[];
  tags?: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: TipDifficulty;
  emoji: string;
  progress: number;
  target: number;
  reward: string;
}

const TIPS: Tip[] = [
  {
    id: '1', title: 'The 50/30/20 Rule', emoji: '📊',
    content: 'Split your income: 50% for needs (rent, food, transport), 30% for wants (entertainment, dining out), and 20% for savings. This simple framework keeps your budget balanced without being restrictive.',
    category: 'budgeting', difficulty: 'beginner', isFeatured: true, potentialSaving: 500,
    actionSteps: ['Calculate your monthly income', 'List all fixed expenses (needs)', 'Set a fun-money limit (wants)', 'Automate your savings transfer'],
    tags: ['essential', 'beginner-friendly']
  },
  {
    id: '2', title: 'Meal Prep Like a Pro', emoji: '🍱',
    content: 'Cook meals in bulk on Sundays — rice, chicken, veggies. Freeze portions for the week. Students who meal prep save R800-R1,200/month compared to buying takeaways daily.',
    category: 'student', difficulty: 'beginner', potentialSaving: 1000,
    actionSteps: ['Plan 5 meals for the week', 'Buy ingredients in bulk at Checkers/PnP', 'Cook and portion on Sunday', 'Label containers with dates'],
    tags: ['food', 'weekly-habit']
  },
  {
    id: '3', title: 'Emergency Fund Strategy', emoji: '🛡️',
    content: 'Build a safety net covering 3-6 months of expenses. Start with R500/month — even small amounts compound. Keep it in a separate account so you\'re not tempted to dip in.',
    category: 'saving', difficulty: 'intermediate', isFeatured: true, potentialSaving: 6000,
    actionSteps: ['Calculate monthly essential expenses', 'Open a separate savings account', 'Set up automatic monthly transfer', 'Only touch it for real emergencies'],
    tags: ['critical', 'long-term']
  },
  {
    id: '4', title: 'Textbook Hacks', emoji: '📚',
    content: 'Never buy new textbooks at full price. Check Takealot, campus notice boards, WhatsApp groups, or use LibGen for digital copies. International editions are identical but 60% cheaper.',
    category: 'student', difficulty: 'beginner', potentialSaving: 2000,
    actionSteps: ['Check library reserves first', 'Search Takealot & Facebook Marketplace', 'Ask senior students for secondhand copies', 'Split costs with a study group'],
    tags: ['academic', 'quick-win']
  },
  {
    id: '5', title: 'Side Hustle Starter Pack', emoji: '💼',
    content: 'Tutoring pays R150-R300/hr, freelance design R200+/hr, content creation can be monetised. Pick something that builds skills in your field — earn while you learn.',
    category: 'earning', difficulty: 'intermediate', potentialSaving: 3000,
    actionSteps: ['Identify your top 3 skills', 'Create a simple portfolio/profile', 'Start on Fiverr, Upwork, or campus boards', 'Dedicate 5-10 hrs/week consistently'],
    tags: ['income', 'skill-building']
  },
  {
    id: '6', title: 'Student Discount Everything', emoji: '🎓',
    content: 'Your student card is a money-saving weapon. Spotify Student is R30/mo, Apple Music R35/mo, Ster-Kinekor R50 tickets. Always ask — many places offer 10-20% off.',
    category: 'student', difficulty: 'beginner', potentialSaving: 400,
    actionSteps: ['Get your student card validated', 'Download student discount apps', 'Always ask before paying full price', 'Check for online student portals'],
    tags: ['discounts', 'easy']
  },
  {
    id: '7', title: 'Start Investing with R100', emoji: '📈',
    content: 'You don\'t need thousands to start. EasyEquities lets you invest from R100. Buy ETFs like the Satrix Top 40 — it tracks SA\'s biggest companies. Time in the market beats timing the market.',
    category: 'investing', difficulty: 'intermediate', potentialSaving: 1200,
    actionSteps: ['Open an EasyEquities account', 'Start with a Satrix Top 40 ETF', 'Set up monthly R100-R500 auto-invest', 'Don\'t panic sell during dips'],
    tags: ['wealth-building', 'long-term']
  },
  {
    id: '8', title: 'The No-Spend Challenge', emoji: '🚫',
    content: 'Pick one day per week where you spend R0. Bring lunch, skip coffee shops, walk instead of Uber. Over a month, this can save R500-R1,000 without major lifestyle changes.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 800,
    actionSteps: ['Choose your no-spend day', 'Prep meals the night before', 'Find free entertainment options', 'Track how much you saved'],
    tags: ['challenge', 'mindset']
  },
  {
    id: '9', title: 'Subscription Audit', emoji: '🔍',
    content: 'Check your bank statement — you\'re probably paying for subscriptions you forgot about. Cancel anything you haven\'t used in 30 days. Streaming, gym, apps — it adds up fast.',
    category: 'budgeting', difficulty: 'beginner', potentialSaving: 600,
    actionSteps: ['Pull your last 3 bank statements', 'List every recurring charge', 'Cancel unused subscriptions today', 'Set calendar reminders for free trials'],
    tags: ['quick-win', 'audit']
  },
  {
    id: '10', title: 'The 24-Hour Rule', emoji: '⏰',
    content: 'Before any non-essential purchase over R200, wait 24 hours. If you still want it after sleeping on it, buy it. This eliminates 70% of impulse purchases.',
    category: 'lifestyle', difficulty: 'beginner', potentialSaving: 1500,
    actionSteps: ['Add items to cart but don\'t checkout', 'Write down what you want to buy', 'Wait 24 hours before deciding', 'Ask: "Do I need this or want this?"'],
    tags: ['mindset', 'impulse-control']
  },
  {
    id: '11', title: 'Transport Savings', emoji: '🚌',
    content: 'Uber pools, lift clubs, monthly bus passes, or cycling can cut transport costs by 40-60%. If you live near campus, walking saves R500+/month and keeps you fit.',
    category: 'student', difficulty: 'beginner', potentialSaving: 700,
    actionSteps: ['Compare Uber vs bus vs walking', 'Find lift club WhatsApp groups', 'Buy a monthly transport pass', 'Consider cycling for short distances'],
    tags: ['transport', 'daily']
  },
  {
    id: '12', title: 'Tax-Free Savings Account', emoji: '🏦',
    content: 'SA allows R36,000/year into a tax-free savings account (lifetime limit R500K). Your investment grows completely tax-free — no capital gains or dividend tax. Start young, retire rich.',
    category: 'investing', difficulty: 'advanced', potentialSaving: 3000,
    actionSteps: ['Open a TFSA at your bank or EasyEquities', 'Choose a low-cost ETF or balanced fund', 'Max out R36K/year if possible', 'Never withdraw — let it compound'],
    tags: ['tax', 'wealth-building']
  },
];

const CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'No-Spend Week', description: 'Go 7 days with only essential spending', duration: '7 days', difficulty: 'intermediate', emoji: '🚫', progress: 3, target: 7, reward: 'Save ~R500' },
  { id: 'c2', title: 'Pack Lunch Challenge', description: 'Bring lunch from home every day for 2 weeks', duration: '14 days', difficulty: 'beginner', emoji: '🍱', progress: 8, target: 14, reward: 'Save ~R700' },
  { id: 'c3', title: 'R5 Coin Jar', description: 'Save every R5 coin you receive for a month', duration: '30 days', difficulty: 'beginner', emoji: '🪙', progress: 15, target: 30, reward: 'Save ~R300' },
  { id: 'c4', title: '52-Week Savings', description: 'Week 1: save R10, Week 2: R20, etc.', duration: '52 weeks', difficulty: 'advanced', emoji: '📈', progress: 12, target: 52, reward: 'Save R13,780' },
];

const CATEGORY_META: Record<TipCategory, { icon: React.ReactNode; label: string; color: string }> = {
  student: { icon: <GraduationCap size={14} />, label: 'Student', color: 'bg-primary/15 text-primary' },
  budgeting: { icon: <DollarSign size={14} />, label: 'Budgeting', color: 'bg-accent/15 text-accent-foreground' },
  saving: { icon: <PiggyBank size={14} />, label: 'Saving', color: 'bg-success/15 text-success' },
  earning: { icon: <Briefcase size={14} />, label: 'Earning', color: 'bg-warning/15 text-warning' },
  investing: { icon: <TrendingUp size={14} />, label: 'Investing', color: 'bg-destructive/15 text-destructive' },
  lifestyle: { icon: <Coffee size={14} />, label: 'Lifestyle', color: 'bg-muted text-muted-foreground' },
};

const DIFFICULTY_META: Record<TipDifficulty, { label: string; color: string }> = {
  beginner: { label: 'Easy', color: 'bg-success/10 text-success' },
  intermediate: { label: 'Medium', color: 'bg-warning/10 text-warning' },
  advanced: { label: 'Advanced', color: 'bg-destructive/10 text-destructive' },
};

const TipsPage: React.FC = () => {
  const { totalExpenses, totalIncome } = useBudget();
  const [activeTab, setActiveTab] = useState('tips');
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedTips, setSavedTips] = useState<Set<string>>(new Set(['1', '3']));
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});

  const filteredTips = useMemo(() =>
    TIPS
      .filter(t => !selectedCategory || t.category === selectedCategory)
      .filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()) || t.tags?.some(tag => tag.includes(searchTerm.toLowerCase()))),
    [selectedCategory, searchTerm]
  );

  const featuredTips = TIPS.filter(t => t.isFeatured);
  const totalPotentialSaving = TIPS.reduce((s, t) => s + (t.potentialSaving || 0), 0);
  const savedTipsList = TIPS.filter(t => savedTips.has(t.id));

  const toggleSaved = (id: string) => {
    setSavedTips(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from saved'); }
      else { next.add(id); toast.success('Tip saved! 🔖'); }
      return next;
    });
  };

  const toggleStep = (tipId: string, stepIdx: number) => {
    setCompletedSteps(prev => {
      const steps = new Set(prev[tipId] || []);
      if (steps.has(stepIdx)) steps.delete(stepIdx); else steps.add(stepIdx);
      return { ...prev, [tipId]: steps };
    });
  };

  const getPersonalizedTips = () => {
    const spendRate = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    if (spendRate > 0.8) return TIPS.filter(t => t.category === 'budgeting' || t.category === 'saving').slice(0, 3);
    if (spendRate > 0.5) return TIPS.filter(t => t.category === 'saving' || t.category === 'investing').slice(0, 3);
    return TIPS.filter(t => t.category === 'investing' || t.category === 'earning').slice(0, 3);
  };

  const personalizedTips = getPersonalizedTips();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 pb-28">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '16s' }} />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border py-5 px-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Lightbulb size={16} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Financial Tips</h1>
                    <p className="text-[11px] text-muted-foreground">Smart money moves for students</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="bg-success/10 rounded-lg px-2.5 py-1 text-center">
                  <p className="text-[10px] text-muted-foreground">Can save</p>
                  <p className="text-xs font-bold text-success">{formatCurrency(totalPotentialSaving)}/yr</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 max-w-lg">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-card/60 backdrop-blur-md border border-border">
            <TabsTrigger value="tips" className="text-xs gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Lightbulb size={13} /> Tips
            </TabsTrigger>
            <TabsTrigger value="foryou" className="text-xs gap-1 data-[state=active]:bg-accent/10 data-[state=active]:text-accent-foreground">
              <Sparkles size={13} /> For You
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs gap-1 data-[state=active]:bg-warning/10 data-[state=active]:text-warning">
              <Flame size={13} /> Challenges
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs gap-1 data-[state=active]:bg-success/10 data-[state=active]:text-success">
              <Bookmark size={13} /> Saved
            </TabsTrigger>
          </TabsList>

          {/* TIPS TAB */}
          <TabsContent value="tips">
            <AnimatePresence mode="wait">
              <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {/* Featured Carousel */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15 p-4">
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {featuredTips.map((tip, i) => (
                      <motion.div key={tip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={i > 0 ? 'hidden' : ''}>
                        <span className="text-3xl">{tip.emoji}</span>
                        <h3 className="text-base font-bold text-foreground mt-2">{tip.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tip.content}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_META[tip.category].color} flex items-center gap-1`}>
                            {CATEGORY_META[tip.category].icon} {CATEGORY_META[tip.category].label}
                          </span>
                          {tip.potentialSaving && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                              Save ~{formatCurrency(tip.potentialSaving)}/yr
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Search & Category Filters */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tips..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-background/50 border-border h-9 text-sm"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5">
                        <X size={14} className="text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                    >
                      All ({TIPS.length})
                    </button>
                    {(Object.entries(CATEGORY_META) as [TipCategory, typeof CATEGORY_META[TipCategory]][]).map(([key, meta]) => {
                      const count = TIPS.filter(t => t.category === key).length;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                          className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1 ${selectedCategory === key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                        >
                          {meta.icon} {meta.label} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tips List */}
                <div className="space-y-2">
                  {filteredTips.map((tip, idx) => {
                    const isExpanded = expandedTip === tip.id;
                    const tipSteps = completedSteps[tip.id] || new Set();
                    const stepsTotal = tip.actionSteps?.length || 0;
                    const stepsDone = tipSteps.size;

                    return (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        layout
                        className="bg-card/60 backdrop-blur-xl rounded-xl border border-border overflow-hidden"
                      >
                        <div
                          className="p-3.5 cursor-pointer hover:bg-muted/20 transition-colors"
                          onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-xl flex-shrink-0">
                              {tip.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleSaved(tip.id); }}
                                  className="flex-shrink-0 ml-2"
                                >
                                  {savedTips.has(tip.id) ? (
                                    <BookmarkCheck size={16} className="text-primary" />
                                  ) : (
                                    <Bookmark size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </button>
                              </div>
                              <p className={`text-xs text-muted-foreground mt-0.5 ${isExpanded ? '' : 'line-clamp-2'}`}>{tip.content}</p>
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${CATEGORY_META[tip.category].color} flex items-center gap-0.5`}>
                                  {CATEGORY_META[tip.category].icon} {CATEGORY_META[tip.category].label}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_META[tip.difficulty].color}`}>
                                  {DIFFICULTY_META[tip.difficulty].label}
                                </span>
                                {tip.potentialSaving && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success">
                                    ~{formatCurrency(tip.potentialSaving)}/yr
                                  </span>
                                )}
                                {stepsTotal > 0 && stepsDone > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                    {stepsDone}/{stepsTotal} done
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && tip.actionSteps && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 pb-3.5 border-t border-border pt-3">
                                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                  <Target size={12} className="text-primary" /> Action Steps
                                </p>
                                {stepsTotal > 0 && (
                                  <div className="mb-2.5">
                                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                      <span>Progress</span>
                                      <span>{stepsDone}/{stepsTotal}</span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stepsDone / stepsTotal) * 100}%` }}
                                        className="h-full rounded-full bg-primary"
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-1.5">
                                  {tip.actionSteps.map((step, i) => (
                                    <button
                                      key={i}
                                      onClick={() => toggleStep(tip.id, i)}
                                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs ${tipSteps.has(i) ? 'bg-success/10 line-through text-muted-foreground' : 'bg-muted/20 hover:bg-muted/30 text-foreground'}`}
                                    >
                                      <CheckCircle2 size={14} className={tipSteps.has(i) ? 'text-success' : 'text-muted-foreground'} />
                                      {step}
                                    </button>
                                  ))}
                                </div>
                                {tip.tags && (
                                  <div className="flex gap-1 mt-2.5 flex-wrap">
                                    {tip.tags.map(tag => (
                                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground">#{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  {filteredTips.length === 0 && (
                    <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                      <Search size={28} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No tips found</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}>Clear filters</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* FOR YOU TAB */}
          <TabsContent value="foryou">
            <AnimatePresence mode="wait">
              <motion.div key="foryou" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-3">
                {/* Personalized Header */}
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Personalized for You</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your spending pattern ({totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}% of income), here are tips that can help most.
                  </p>
                </div>

                {/* Personalized Tips */}
                {personalizedTips.map((tip, idx) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {tip.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-foreground">{tip.title}</h3>
                          {tip.potentialSaving && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                              ~{formatCurrency(tip.potentialSaving)}/yr
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{tip.content}</p>
                        {tip.actionSteps && (
                          <div className="mt-2.5 space-y-1">
                            {tip.actionSteps.slice(0, 2).map((step, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <ArrowRight size={10} className="text-primary flex-shrink-0" />
                                {step}
                              </div>
                            ))}
                            {(tip.actionSteps.length > 2) && (
                              <p className="text-[10px] text-primary cursor-pointer" onClick={() => { setActiveTab('tips'); setExpandedTip(tip.id); }}>
                                +{tip.actionSteps.length - 2} more steps →
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Stats */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-warning" /> Quick Wins
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TIPS.filter(t => t.difficulty === 'beginner' && t.potentialSaving).slice(0, 4).map(tip => (
                      <button
                        key={tip.id}
                        onClick={() => { setActiveTab('tips'); setExpandedTip(tip.id); }}
                        className="bg-muted/20 hover:bg-muted/30 rounded-lg p-2.5 text-left transition-colors"
                      >
                        <span className="text-lg">{tip.emoji}</span>
                        <p className="text-[11px] font-medium text-foreground mt-1 line-clamp-1">{tip.title}</p>
                        <p className="text-[10px] text-success">~{formatCurrency(tip.potentialSaving!)}/yr</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* CHALLENGES TAB */}
          <TabsContent value="challenges">
            <AnimatePresence mode="wait">
              <motion.div key="challenges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                <div className="bg-gradient-to-br from-warning/10 to-destructive/10 border border-warning/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame size={16} className="text-warning" />
                    <h3 className="text-sm font-bold text-foreground">Money Challenges</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Build better habits with fun savings challenges</p>
                </div>

                {CHALLENGES.map((challenge, idx) => {
                  const pct = Math.round((challenge.progress / challenge.target) * 100);
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center text-xl flex-shrink-0">
                          {challenge.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_META[challenge.difficulty].color}`}>
                              {DIFFICULTY_META[challenge.difficulty].label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
                          <div className="mt-2.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span className="flex items-center gap-1"><Clock size={10} /> {challenge.duration}</span>
                              <span>{challenge.progress}/{challenge.target} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-full rounded-full bg-warning"
                              />
                            </div>
                            <p className="text-[10px] text-success mt-1.5 flex items-center gap-1">
                              <Star size={10} /> Reward: {challenge.reward}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* SAVED TAB */}
          <TabsContent value="saved">
            <AnimatePresence mode="wait">
              <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {savedTipsList.length > 0 ? (
                  <>
                    <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{savedTipsList.length} saved tips</span>
                      <span className="text-xs text-success font-medium">
                        ~{formatCurrency(savedTipsList.reduce((s, t) => s + (t.potentialSaving || 0), 0))}/yr potential
                      </span>
                    </div>
                    {savedTipsList.map((tip, idx) => (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card/60 backdrop-blur-xl rounded-xl p-3.5 border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center text-xl flex-shrink-0">{tip.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
                              <button onClick={() => toggleSaved(tip.id)}>
                                <BookmarkCheck size={16} className="text-primary" />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tip.content}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${CATEGORY_META[tip.category].color}`}>
                                {CATEGORY_META[tip.category].label}
                              </span>
                              {tip.potentialSaving && (
                                <span className="text-[10px] text-success">~{formatCurrency(tip.potentialSaving)}/yr</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <Bookmark size={32} className="mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">No saved tips</h3>
                    <p className="text-xs text-muted-foreground mb-3">Bookmark tips to save them here for later</p>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setActiveTab('tips')}>
                      Browse Tips
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TipsPage;
