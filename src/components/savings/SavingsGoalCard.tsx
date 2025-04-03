
import React, { useState } from 'react';
import { useBudget, SavingsGoal } from '@/contexts/BudgetContext';
import { formatCurrency, formatDate, getEncouragingMessage } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState<string>('');
  
  const { updateSavingsGoal } = useBudget();
  
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  
  const handleAddSavings = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    updateSavingsGoal(goal.id, Number(amount));
    setAmount('');
    setIsAdding(false);
    toast.success(getEncouragingMessage());
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-budgetbru-dark">{goal.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          goal.category === 'short' ? 'bg-green-100 text-green-800' :
          goal.category === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {goal.category === 'short' ? 'Short-term' :
           goal.category === 'medium' ? 'Medium-term' : 'Long-term'}
        </span>
      </div>
      
      {goal.deadline && (
        <p className="text-xs text-gray-500 mb-3">Target date: {formatDate(goal.deadline)}</p>
      )}
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-right mt-1 text-gray-500">{progress}% complete</p>
      </div>
      
      {isAdding ? (
        <div className="mt-3">
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
              className="bg-budgetbru-purple hover:bg-budgetbru-purple/90"
            >
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
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full mt-2 border-budgetbru-purple text-budgetbru-purple hover:bg-budgetbru-purple/10"
          onClick={() => setIsAdding(true)}
        >
          Add to Savings
        </Button>
      )}
    </div>
  );
};

export default SavingsGoalCard;
