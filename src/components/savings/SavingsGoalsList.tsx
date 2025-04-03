
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import SavingsGoalCard from './SavingsGoalCard';

const SavingsGoalsList: React.FC = () => {
  const { savingsGoals } = useBudget();
  
  if (savingsGoals.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md text-center">
        <h3 className="text-lg font-semibold text-budgetbru-dark mb-2">No Savings Goals Yet</h3>
        <p className="text-gray-500 mb-4">Start planning for your future by adding a savings goal!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {savingsGoals.map((goal) => (
        <SavingsGoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};

export default SavingsGoalsList;
