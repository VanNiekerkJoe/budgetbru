
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const BalanceCard: React.FC = () => {
  const { totalIncome, totalExpenses, remainingBudget } = useBudget();
  const savingsRate = totalIncome > 0 ? Math.round((remainingBudget / totalIncome) * 100) : 0;
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-theme-navy via-theme-indigo to-theme-teal p-6 text-white shadow-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-sm text-white/70 font-medium">Current Balance</p>
            <motion.p 
              className="text-4xl font-bold tracking-tight mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {formatCurrency(remainingBudget)}
            </motion.p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
            <TrendingUp size={12} />
            April 2025
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-5">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <ArrowUpRight size={13} className="text-emerald-300" />
              </div>
              <p className="text-xs text-white/70">Income</p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalIncome)}</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-rose-400/20 flex items-center justify-center">
                <ArrowDownRight size={13} className="text-rose-300" />
              </div>
              <p className="text-xs text-white/70">Expenses</p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalExpenses)}</p>
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-white/60">Budget used</span>
            <span className="text-white/80 font-medium">
              {totalIncome > 0 ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100)) : 0}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                remainingBudget >= 0 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-300' 
                  : 'bg-gradient-to-r from-rose-400 to-rose-300'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0)}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>
        
        <div className="mt-3 text-xs text-center font-medium bg-white/10 backdrop-blur-sm rounded-full py-2 border border-white/5">
          {remainingBudget >= 0 
            ? `✅ You're on track! Saving ${savingsRate}% this month` 
            : "🚨 Eish! You're overspending, bru!"}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
