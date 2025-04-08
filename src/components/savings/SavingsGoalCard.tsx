
import React from 'react';
import { useBudget, SavingsGoal } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays, PiggyBank, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const { updateSavingsGoal } = useBudget();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = goal.targetAmount - goal.currentAmount;
  
  // Format deadline (if exists) with better error handling
  const formattedDeadline = goal.deadline 
    ? (() => {
        try {
          const date = new Date(goal.deadline);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            return 'No deadline set';
          }
          return date.toLocaleDateString();
        } catch (e) {
          console.error("Invalid date format:", e);
          return 'No deadline set';
        }
      })() 
    : 'No deadline set';
  
  // Calculate days remaining if deadline exists with better error handling
  const daysRemaining = goal.deadline 
    ? (() => {
        try {
          const deadlineDate = new Date(goal.deadline);
          // Check if date is valid
          if (isNaN(deadlineDate.getTime())) {
            return null;
          }
          return Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        } catch (e) {
          console.error("Error calculating days remaining:", e);
          return null;
        }
      })() 
    : null;
  
  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    updateSavingsGoal(goal.id, amount);
    toast.success(`Added ${formatCurrency(amount)} to ${goal.name}`);
    setContributionAmount('');
  };
  
  // Get appropriate color based on goal category or progress
  const getCategoryColor = () => {
    if (goal.category === 'short') return 'from-emerald-300 to-emerald-500';
    if (goal.category === 'medium') return 'from-blue-300 to-blue-500';
    return 'from-indigo-300 to-indigo-500';
  };
  
  const getGradientStyle = () => {
    if (goal.category === 'short') return 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5';
    if (goal.category === 'medium') return 'bg-gradient-to-r from-blue-500/10 to-blue-500/5';
    return 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/5';
  };
  
  const getBorderStyle = () => {
    if (goal.category === 'short') return 'border-emerald-200 dark:border-emerald-800/40';
    if (goal.category === 'medium') return 'border-blue-200 dark:border-blue-800/40';
    return 'border-indigo-200 dark:border-indigo-800/40';
  };
  
  const getGoalTip = () => {
    if (goal.category === 'short') {
      return "Short-term goals are great for building momentum and creating saving habits.";
    }
    if (goal.category === 'medium') {
      return "Medium-term goals help you plan for upcoming expenses and reduce financial stress.";
    }
    return "Long-term goals are essential for major life plans and future financial security.";
  };
  
  // Get icon based on goal name or category
  const getGoalIcon = () => {
    const name = goal.name.toLowerCase();
    if (name.includes('laptop') || name.includes('computer')) return '💻';
    if (name.includes('car') || name.includes('vehicle')) return '🚗';
    if (name.includes('holiday') || name.includes('vacation') || name.includes('trip')) return '🌴';
    if (name.includes('house') || name.includes('home') || name.includes('apartment')) return '🏠';
    if (name.includes('education') || name.includes('school') || name.includes('university')) return '🎓';
    if (name.includes('emergency') || name.includes('fund')) return '🏦';
    if (name.includes('wedding') || name.includes('marriage')) return '💍';
    if (name.includes('gift')) return '🎁';
    
    // Default icons based on category
    if (goal.category === 'short') return '🎯';
    if (goal.category === 'medium') return '📈';
    return '🏆';
  };
  
  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border ${getBorderStyle()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className={`p-4 ${getGradientStyle()}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">{goal.name}</h3>
          <div className="bg-white/25 dark:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner">
            {getGoalIcon()}
          </div>
        </div>
        
        <div className="flex justify-between items-end mb-1">
          <div>
            <span className="text-xs text-gray-600 dark:text-gray-400 block">Current</span>
            <span className="text-xl font-bold">{formatCurrency(goal.currentAmount)}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-600 dark:text-gray-400 block">Target</span>
            <span className="text-xl font-bold">{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${progress >= 50 ? "bg-green-200 text-green-800" : "bg-amber-200 text-amber-800"}`}>
                {progress}%
              </span>
            </div>
            {daysRemaining !== null && daysRemaining > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {daysRemaining} days left
              </div>
            )}
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div 
              className={`h-2 rounded-full ${progress >= 75 ? "bg-green-500" : progress >= 50 ? "bg-blue-500" : progress >= 25 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {daysRemaining !== null && daysRemaining <= 0 && (
          <div className="mt-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs p-1.5 rounded-md text-center">
            {daysRemaining === 0 ? "Due today!" : "Goal deadline passed"}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <CalendarDays size={16} className="mr-1" />
          <span>Deadline: {formattedDeadline}</span>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">R</span>
            <Input
              type="number"
              placeholder="Amount"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="pl-7"
            />
          </div>
          <Button 
            onClick={handleContribute}
            className="whitespace-nowrap bg-theme-pink hover:bg-theme-pink/90 text-white"
          >
            <TrendingUp size={16} className="mr-1" /> Add
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-between text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? "Show less" : "Show details"}</span>
          <ArrowRight size={16} className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`} />
        </Button>
        
        {/* Expanded section */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 space-y-3"
          >
            {remaining > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Still need:</span>
                <span className="font-semibold">{formatCurrency(remaining)}</span>
              </div>
            )}
            
            <div className={`${goal.category === 'short' ? "bg-emerald-50 dark:bg-emerald-900/20" : goal.category === 'medium' ? "bg-blue-50 dark:bg-blue-900/20" : "bg-indigo-50 dark:bg-indigo-900/20"} p-3 rounded-lg`}>
              <div className="flex items-start">
                <PiggyBank size={16} className={`mt-0.5 mr-2 ${goal.category === 'short' ? "text-emerald-600" : goal.category === 'medium' ? "text-blue-600" : "text-indigo-600"}`} />
                <span className={`text-xs ${goal.category === 'short' ? "text-emerald-700 dark:text-emerald-300" : goal.category === 'medium' ? "text-blue-700 dark:text-blue-300" : "text-indigo-700 dark:text-indigo-300"}`}>
                  {getGoalTip()}
                </span>
              </div>
            </div>
            
            {progress >= 100 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/40">
                <div className="flex items-center">
                  <Award size={16} className="text-green-600 mr-2" />
                  <span className="text-xs text-green-700 dark:text-green-300">
                    Congratulations! You've reached your savings goal!
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SavingsGoalCard;
