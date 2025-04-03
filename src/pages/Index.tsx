
import React from 'react';
import { BudgetProvider } from '@/contexts/BudgetContext';
import NavBar from '@/components/NavBar';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickAddExpense from '@/components/dashboard/QuickAddExpense';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';

const Index: React.FC = () => {
  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-100 pb-28">
        <header className="bg-budgetbru-dark text-white py-6 px-4 shadow-md">
          <h1 className="text-2xl font-bold flex items-center justify-center">
            Budget<span className="text-budgetbru-orange">Bru</span>
            <span className="ml-2 text-xs bg-budgetbru-orange rounded-full px-2 py-0.5">Beta</span>
          </h1>
          <p className="text-center text-sm opacity-90 mt-1">You must budget, bru!</p>
        </header>
        
        <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
          <BalanceCard />
          
          <QuickAddExpense />
          
          <h2 className="text-xl font-bold mt-6 mb-3 text-budgetbru-dark">Your Finances</h2>
          
          <CategoryBreakdown />
          
          <h2 className="text-xl font-bold mt-6 mb-3 text-budgetbru-dark">Savings Goals</h2>
          
          <SavingsGoalsList />
        </main>
        
        <NavBar />
      </div>
    </BudgetProvider>
  );
};

export default Index;
