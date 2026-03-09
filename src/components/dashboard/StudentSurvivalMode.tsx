import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Settings, TrendingDown, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StudentSurvivalMode: React.FC = () => {
  const { remainingBudget, totalExpenses, expenses } = useBudget();
  const [showSettings, setShowSettings] = useState(false);
  const [nextIncomeDate, setNextIncomeDate] = useState(() => {
    const saved = localStorage.getItem('budgetbru_next_income');
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    localStorage.setItem('budgetbru_next_income', nextIncomeDate);
  }, [nextIncomeDate]);

  const now = new Date();
  const incomeDate = new Date(nextIncomeDate + 'T00:00:00');
  const daysLeft = Math.max(0, Math.ceil((incomeDate.getTime() - now.getTime()) / 86400000));
  const dailyBudget = daysLeft > 0 ? remainingBudget / daysLeft : 0;

  // Average daily spending from last 7 days
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const recentExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);
  const avgDaily = recentExpenses.length > 0
    ? recentExpenses.reduce((s, e) => s + e.amount, 0) / 7
    : totalExpenses / 30;

  const survivalDays = avgDaily > 0 ? Math.floor(remainingBudget / avgDaily) : 999;
  const isAtRisk = survivalDays < daysLeft;

  const getStatus = () => {
    if (remainingBudget <= 0) return { label: 'Broke 💀', color: 'text-rose-500', bg: 'bg-rose-500/10', ring: 'ring-rose-500/20' };
    if (survivalDays < daysLeft * 0.5) return { label: 'Critical 🚨', color: 'text-rose-500', bg: 'bg-rose-500/10', ring: 'ring-rose-500/20' };
    if (isAtRisk) return { label: 'Tight 😬', color: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' };
    return { label: 'Safe ✅', color: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' };
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Timer size={16} className="text-amber-500" />
            </div>
            <h3 className="font-semibold text-sm text-card-foreground">Student Survival Mode</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ${status.bg} ${status.color} ${status.ring}`}>
              {status.label}
            </span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={13} className="text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <label className="text-[11px] font-medium text-muted-foreground">Next income/allowance date</label>
                <Input
                  type="date"
                  value={nextIncomeDate}
                  onChange={(e) => setNextIncomeDate(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Money Left</p>
            <p className={`text-sm font-bold ${remainingBudget <= 0 ? 'text-rose-500' : 'text-foreground'}`}>
              {formatCurrency(Math.max(0, remainingBudget))}
            </p>
          </div>
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Days Left</p>
            <p className="text-sm font-bold text-foreground">{daysLeft}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Daily Budget</p>
            <p className={`text-sm font-bold ${dailyBudget < avgDaily ? 'text-amber-500' : 'text-emerald-500'}`}>
              {formatCurrency(Math.max(0, Math.round(dailyBudget)))}
            </p>
          </div>
        </div>

        {/* Survival estimate */}
        {avgDaily > 0 && (
          <div className={`mt-2.5 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] ${status.bg}`}>
            {isAtRisk ? (
              <AlertTriangle size={13} className={status.color} />
            ) : (
              <CheckCircle size={13} className={status.color} />
            )}
            <span className={`font-medium ${status.color}`}>
              {remainingBudget <= 0
                ? "You're broke, bru! Time to hustle 💪"
                : isAtRisk
                  ? `At current spending (${formatCurrency(Math.round(avgDaily))}/day), money runs out in ${survivalDays} days`
                  : `You'll make it! Surviving ${survivalDays} days at ${formatCurrency(Math.round(avgDaily))}/day`
              }
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentSurvivalMode;
