import React, { useState } from 'react';
import { useBudget, SavingsGoal } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarDays, TrendingUp, ChevronDown, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const getGoalEmoji = (goal: SavingsGoal): string => {
  const n = goal.name.toLowerCase();
  if (n.includes('laptop') || n.includes('computer')) return '💻';
  if (n.includes('car') || n.includes('vehicle')) return '🚗';
  if (n.includes('holiday') || n.includes('vacation') || n.includes('trip')) return '🌴';
  if (n.includes('house') || n.includes('home')) return '🏠';
  if (n.includes('education') || n.includes('school')) return '🎓';
  if (n.includes('emergency') || n.includes('fund')) return '🏦';
  if (n.includes('gift')) return '🎁';
  if (goal.category === 'short') return '🎯';
  if (goal.category === 'medium') return '📈';
  return '🏆';
};

const getCategoryLabel = (cat: string) => {
  if (cat === 'short') return 'Short-term';
  if (cat === 'medium') return 'Medium-term';
  return 'Long-term';
};

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const [amount, setAmount] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { updateSavingsGoal } = useBudget();

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = goal.targetAmount - goal.currentAmount;
  const emoji = getGoalEmoji(goal);

  const daysRemaining = goal.deadline ? (() => {
    try {
      const d = new Date(goal.deadline);
      if (isNaN(d.getTime())) return null;
      return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    } catch { return null; }
  })() : null;

  const formattedDeadline = goal.deadline ? (() => {
    try {
      const d = new Date(goal.deadline);
      return isNaN(d.getTime()) ? null : d.toLocaleDateString();
    } catch { return null; }
  })() : null;

  const handleContribute = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { toast.error('Enter a valid amount'); return; }
    updateSavingsGoal(goal.id, val);
    toast.success(`Added ${formatCurrency(val)} to ${goal.name}`);
    setAmount('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-card/80 backdrop-blur-xl border-border/40 overflow-hidden">
        <CardContent className="p-0">
          {/* Main content */}
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center text-xl shrink-0">
                {emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-sm font-bold text-foreground truncate">{goal.name}</h3>
                  <Badge variant="outline" className="text-[9px] bg-muted/50 shrink-0 ml-2">
                    {getCategoryLabel(goal.category)}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-foreground">{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-xs text-muted-foreground">/ {formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <Progress value={progress} className="h-2.5" />
              <div className="flex items-center justify-between mt-1">
                <span className={`text-[10px] font-semibold ${
                  progress >= 75 ? 'text-success' : progress >= 50 ? 'text-primary' : progress >= 25 ? 'text-warning' : 'text-destructive'
                }`}>
                  {progress}%
                </span>
                {daysRemaining !== null && daysRemaining > 0 && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <CalendarDays size={9} /> {daysRemaining}d left
                  </span>
                )}
                {daysRemaining !== null && daysRemaining <= 0 && (
                  <span className="text-[10px] text-destructive font-medium">
                    {daysRemaining === 0 ? 'Due today!' : 'Overdue'}
                  </span>
                )}
              </div>
            </div>

            {/* Contribute inline */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="pl-6 h-9 text-xs rounded-xl"
                  onKeyDown={e => e.key === 'Enter' && handleContribute()}
                />
              </div>
              <Button size="sm" onClick={handleContribute} className="h-9 rounded-xl gap-1 px-3">
                <TrendingUp size={13} /> Add
              </Button>
            </div>
          </div>

          {/* Expandable details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-[10px] text-muted-foreground hover:bg-muted/30 transition-colors border-t border-border/30"
          >
            {expanded ? 'Less' : 'Details'}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2.5">
                  {remaining > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Still need</span>
                      <span className="font-semibold text-foreground">{formatCurrency(remaining)}</span>
                    </div>
                  )}
                  {formattedDeadline && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className="text-foreground">{formattedDeadline}</span>
                    </div>
                  )}
                  {remaining > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Weekly target</span>
                      <span className="text-primary font-medium">
                        {formatCurrency(remaining / (daysRemaining && daysRemaining > 7 ? Math.ceil(daysRemaining / 7) : 4))}
                        /week
                      </span>
                    </div>
                  )}
                  {progress >= 100 && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-success/5 border border-success/20">
                      <Award size={14} className="text-success" />
                      <span className="text-xs text-success font-medium">Goal reached! 🎉</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SavingsGoalCard;
