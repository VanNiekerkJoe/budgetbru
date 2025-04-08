
import React from 'react';
import { useBudget, SavingsGoal } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarDays } from 'lucide-react';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const { updateSavingsGoal } = useBudget();
  
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
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className={`p-4 bg-gradient-to-r ${getCategoryColor()} text-white`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">{goal.name}</h3>
          {goal.iconName && (
            <div className="bg-white/25 w-10 h-10 rounded-full flex items-center justify-center text-xl">
              {/* Could render an icon here based on iconName if you have an icon component */}
              {goal.iconName === 'laptop' && '💻'}
              {goal.iconName === 'palmtree' && '🌴'}
              {goal.iconName === 'car' && '🚗'}
              {goal.iconName === 'house' && '🏠'}
              {goal.iconName === 'graduation' && '🎓'}
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-sm mb-1">
          <div>Progress: {progress}%</div>
          <div>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-white/30" />
      </div>
      
      <div className="p-4 pt-3">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <CalendarDays size={16} className="mr-1" />
          <span>Deadline: {formattedDeadline}</span>
          
          {daysRemaining !== null && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
              {daysRemaining > 0 
                ? `${daysRemaining} days left` 
                : daysRemaining === 0 
                  ? 'Due today!' 
                  : 'Overdue'}
            </span>
          )}
        </div>
        
        <div className="mt-2">
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Amount"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleContribute}
              className="whitespace-nowrap"
            >
              Add Funds
            </Button>
          </div>
        </div>
        
        {remaining > 0 && (
          <p className="text-sm text-gray-500 mt-3">
            Still need {formatCurrency(remaining)} to reach your goal
          </p>
        )}
      </div>
    </div>
  );
};

export default SavingsGoalCard;
