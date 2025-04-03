
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const BalanceCard: React.FC = () => {
  const { totalIncome, totalExpenses, remainingBudget } = useBudget();
  
  return (
    <div className="bg-gradient-to-r from-budgetbru-purple to-budgetbru-blue rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold opacity-90">Current Balance</h2>
        <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
          April 2025
        </div>
      </div>
      
      <div className="text-3xl font-bold mb-6">
        {formatCurrency(remainingBudget)}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpCircle size={16} className="text-green-300" />
            <p className="text-sm">Income</p>
          </div>
          <p className="text-xl font-semibold">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownCircle size={16} className="text-red-300" />
            <p className="text-sm">Expenses</p>
          </div>
          <p className="text-xl font-semibold">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center font-medium bg-white/10 rounded-full py-1.5">
        {remainingBudget >= 0 
          ? "✅ You're on track this month, bru!" 
          : "🚨 Eish! You're overspending, bru!"}
      </div>
    </div>
  );
};

export default BalanceCard;
