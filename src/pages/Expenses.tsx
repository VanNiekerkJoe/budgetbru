
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import NavBar from '@/components/NavBar';
import { formatCurrency, formatDate, getCategoryEmoji } from '@/utils/formatters';

const Expenses: React.FC = () => {
  const { expenses, totalExpenses } = useBudget();
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <header className="bg-budgetbru-dark text-white py-4 px-4 shadow-md">
        <h1 className="text-xl font-bold">Expenses</h1>
        <p className="text-sm opacity-90">Total spent: {formatCurrency(totalExpenses)}</p>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        {sortedExpenses.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y">
              {sortedExpenses.map((expense) => (
                <div key={expense.id} className="p-4 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
                    {getCategoryEmoji(expense.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{expense.description}</h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(expense.date)} • {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">-{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <h3 className="text-lg font-semibold text-budgetbru-dark mb-2">No Expenses Yet</h3>
            <p className="text-gray-500">Add expenses to track your spending</p>
          </div>
        )}
      </main>
      
      <NavBar />
    </div>
  );
};

export default Expenses;
