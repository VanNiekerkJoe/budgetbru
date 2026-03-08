import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wallet, ChevronRight, Plus, TrendingUp, ArrowUpRight, ArrowDownRight,
  PiggyBank, CreditCard, Lightbulb, Map, Users, Zap, Receipt, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useTutorial } from '@/services/TutorialService';
import { QuickExpenseTracker } from '@/components/dashboard/QuickExpenseTracker';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';


const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  
  const { addExpense, totalIncome, totalExpenses, remainingBudget, expenses } = useBudget();
  
  // Use real recent transactions from context
  const recentTransactions = useMemo(() => {
    return expenses.slice(0, 5).map(e => ({
      id: e.id, type: 'expense' as string, amount: e.amount,
      description: e.description, category: e.category, date: new Date(e.date),
    }));
  }, [expenses]);

  const { showTutorial, completeTutorial, skipTutorial } = useTutorial();
  
  }, []);

  const handleQuickExpense = (description: string, amount: number, category: string) => {
    addExpense({ amount, category, description, date: new Date().toISOString() });
    toast.success(`Expense of R${amount} added!`);
  };

  const formatTimeAgo = (date: Date) => {
    const diffHrs = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };
  
  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = { education: '📚', food: '🍔', utilities: '💡', transport: '🚗', entertainment: '🎬', income: '💰' };
    return map[category] || '💼';
  };

  const spendingPct = totalIncome > 0 ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100)) : 0;
  const savingsRate = totalIncome > 0 ? Math.round((remainingBudget / totalIncome) * 100) : 0;

  const quickNav = [
    { icon: Wallet, label: 'Expenses', path: '/expenses', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { icon: TrendingUp, label: 'Income', path: '/income', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { icon: PiggyBank, label: 'Savings', path: '/savings', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { icon: CreditCard, label: 'IOUs', path: '/iou', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
    { icon: Lightbulb, label: 'Tips', path: '/tips', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { icon: Map, label: 'Map', path: '/map', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
    { icon: Users, label: 'Community', path: '/community', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
    { icon: Receipt, label: 'Receipts', path: '/receipts', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Hero Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--accent))] p-5 text-white shadow-lg"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-medium">Hey Bru! Your balance 👋</p>
          <motion.p 
            className="text-3xl font-extrabold tracking-tight mt-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            {formatCurrency(remainingBudget)}
          </motion.p>
          
          {/* Income/Expense row */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowUpRight size={12} className="text-emerald-300" />
                <span className="text-[10px] text-white/70">Income</span>
              </div>
              <p className="text-sm font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDownRight size={12} className="text-rose-300" />
                <span className="text-[10px] text-white/70">Spent</span>
              </div>
              <p className="text-sm font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
          
          {/* Budget bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/60">{spendingPct}% spent</span>
              <span className="text-white/80 font-medium">
                {remainingBudget >= 0 ? `Saving ${savingsRate}%` : 'Over budget!'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${remainingBudget >= 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                initial={{ width: 0 }}
                animate={{ width: `${spendingPct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Navigation Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-4 gap-2">
          {quickNav.map((item, i) => (
            <Link to={item.path} key={item.path}>
              <motion.div
                whileTap={{ scale: 0.93 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-card border border-border/40 active:bg-muted transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <span className="text-[10px] font-medium text-foreground">{item.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Quick Add Expense */}
      <QuickExpenseTracker onAddExpense={handleQuickExpense} />

      {/* Recent Transactions */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-3.5 pb-2">
          <h3 className="font-semibold text-sm text-card-foreground">Recent Activity</h3>
          <Link to="/expenses">
            <Button variant="ghost" size="sm" className="text-[11px] text-primary h-7 rounded-lg px-2">
              See all <ChevronRight size={13} className="ml-0.5" />
            </Button>
          </Link>
        </div>
        
        <div className="px-3.5 pb-3 space-y-1">
          {recentTransactions.slice(0, 4).map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex justify-between items-center p-2.5 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${
                  t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-rose-100 dark:bg-rose-950/40'
                }`}>
                  {getCategoryEmoji(t.category)}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground leading-tight">{t.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatTimeAgo(t.date)} · <span className="capitalize">{t.category}</span></p>
                </div>
              </div>
              <span className={`text-sm font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {t.type === 'income' ? '+' : '-'}R{t.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Insight Card */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border border-primary/10 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Monthly Insight</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {remainingBudget >= 0 
                ? `You've saved ${formatCurrency(remainingBudget)} so far. Keep it up — you're in the top 20% of student savers! 🎉`
                : `You're R${Math.abs(remainingBudget)} over budget. Try cutting back on your top spending category this week.`
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links Row */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.35 }}
        className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-2"
      >
        {[
          { label: '🎯 Savings Goals', path: '/savings' },
          { label: '📊 Insights', path: '/insights' },
          { label: '🛡️ Emergency Fund', path: '/emergency-fund' },
          { label: '🎉 Vibes Hub', path: '/vibes' },
          { label: '📅 Planning', path: '/planning' },
        ].map(item => (
          <Link to={item.path} key={item.path}>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap px-3.5 py-2 rounded-full bg-muted/60 border border-border/40 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              {item.label}
            </motion.div>
          </Link>
        ))}
      </motion.div>
      
    </div>
  );
};

export default IndexPage;
