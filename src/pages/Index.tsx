
import React from 'react';
import NavBar from '@/components/NavBar';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickAddExpense from '@/components/dashboard/QuickAddExpense';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-28">
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-budgetbru-purple to-budgetbru-blue text-white py-6 px-4 shadow-lg"
      >
        <div className="container mx-auto max-w-md">
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <span>Budget</span>
            <span className="text-budgetbru-orange">Bru</span>
            <span className="ml-2 text-xs bg-budgetbru-orange rounded-full px-2 py-0.5">Beta</span>
          </h1>
          <p className="text-center text-sm opacity-90 mt-2 tracking-wider">You must budget, bru!</p>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BalanceCard />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <QuickAddExpense />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mt-6 mb-3 text-budgetbru-dark pl-2">Your Finances</h2>
          <CategoryBreakdown />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold mt-6 mb-3 text-budgetbru-dark pl-2">Savings Goals</h2>
          <SavingsGoalsList />
        </motion.div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Index;
