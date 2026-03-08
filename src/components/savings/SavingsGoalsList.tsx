import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import SavingsGoalCard from './SavingsGoalCard';
import { PiggyBank } from 'lucide-react';

const SavingsGoalsList: React.FC = () => {
  const { savingsGoals } = useBudget();

  if (savingsGoals.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl p-8 text-center">
        <PiggyBank size={32} className="mx-auto text-muted-foreground mb-2" />
        <h3 className="text-sm font-semibold text-foreground mb-1">No Savings Goals Yet</h3>
        <p className="text-xs text-muted-foreground">Create your first goal and start saving!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {savingsGoals.map(goal => (
        <SavingsGoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default SavingsGoalsList;
