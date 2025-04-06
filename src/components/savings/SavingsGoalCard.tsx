
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget, SavingsGoal } from '@/contexts/BudgetContext';
import { formatCurrency, formatDate, getEncouragingMessage } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Sparkles, TrendingUp, Calendar, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [celebrations, setCelebrations] = useState(false);
  
  const { updateSavingsGoal } = useBudget();
  
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  
  const handleAddSavings = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Check if this will complete the goal
    const newTotal = goal.currentAmount + Number(amount);
    const willComplete = newTotal >= goal.targetAmount;
    
    if (willComplete) {
      setCelebrations(true);
      
      // Hide celebrations after a few seconds
      setTimeout(() => {
        setCelebrations(false);
      }, 5000);
    }
    
    updateSavingsGoal(goal.id, Number(amount));
    setAmount('');
    setIsAdding(false);
    toast.success(getEncouragingMessage());
  };
  
  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  const dailyTarget = daysRemaining && daysRemaining > 0 
    ? (goal.targetAmount - goal.currentAmount) / daysRemaining 
    : 0;
  
  const getCategoryColor = () => {
    switch (goal.category) {
      case 'short':
        return 'from-green-500 to-emerald-600';
      case 'medium':
        return 'from-yellow-500 to-amber-600';
      case 'long':
        return 'from-blue-500 to-indigo-600';
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center text-white mr-2`}>
              {goal.category === 'short' ? "S" : goal.category === 'medium' ? "M" : "L"}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{goal.name}</h3>
          </div>
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              goal.category === 'short' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
              goal.category === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {goal.category === 'short' ? 'Short-term' :
              goal.category === 'medium' ? 'Medium-term' : 'Long-term'}
            </span>
          </div>
        </div>
        
        {goal.deadline && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Calendar size={12} className="mr-1" />
            Target: {formatDate(goal.deadline)}
            
            {daysRemaining !== null && (
              <span className={`ml-2 px-1.5 rounded-sm ${
                daysRemaining > 30 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                daysRemaining > 7 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {daysRemaining} days left
              </span>
            )}
          </div>
        )}
        
        <div className="mb-3 relative">
          {celebrations && (
            <>
              <motion.div 
                className="absolute -top-4 left-1/4"
                animate={{
                  y: [-20, -40], 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2 }}
              >
                <Sparkles className="text-yellow-400" />
              </motion.div>
              <motion.div 
                className="absolute -top-4 right-1/4"
                animate={{
                  y: [-20, -40], 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                <Sparkles className="text-yellow-400" />
              </motion.div>
              <motion.div 
                className="absolute -top-4 left-1/2"
                animate={{
                  y: [-20, -40], 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, delay: 0.3 }}
              >
                <Sparkles className="text-yellow-400" />
              </motion.div>
            </>
          )}
        
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
          <motion.div 
            className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${getCategoryColor()}`}
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 1,
                delay: 0.5,
              }}
            />
          </motion.div>
          <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
            {progress}% complete
            {progress >= 100 && (
              <motion.span 
                className="inline-flex items-center ml-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1 rounded"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Check size={10} className="mr-0.5" />
                Goal achieved!
              </motion.span>
            )}
          </p>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t dark:border-gray-700 pt-3 overflow-hidden"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount remaining:</span>
                  <span className="font-medium">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                </div>
                
                {dailyTarget > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Recommended daily saving:</span>
                    <span className="font-medium">{formatCurrency(dailyTarget)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Progress:</span>
                  <span className="font-medium">{progress}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button 
                  onClick={handleAddSavings}
                  className="bg-theme-pink hover:bg-theme-pink/90 text-white"
                >
                  <TrendingUp size={14} className="mr-1" />
                  Add
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-gray-500"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </motion.div>
          ) : (
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                className="flex-1 border-theme-pink text-theme-pink hover:bg-theme-pink/10"
                onClick={() => setIsAdding(true)}
              >
                Add to Savings
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="dark:text-gray-400"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SavingsGoalCard;
