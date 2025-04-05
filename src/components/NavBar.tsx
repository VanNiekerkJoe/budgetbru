
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const NavBar: React.FC = () => {
  const { remainingBudget } = useBudget();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-theme-navy shadow-lg border-t z-10">
      <div className="flex justify-around p-2">
        <Link to="/" className={`nav-link ${isActive('/') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Home size={24} />
          </motion.div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/expenses" className={`nav-link ${isActive('/expenses') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Wallet size={24} />
          </motion.div>
          <span className="text-xs mt-1">Expenses</span>
        </Link>
        <Link to="/map" className={`nav-link ${isActive('/map') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className={isActive('/map') ? 'animate-pulse-soft' : ''}
          >
            <Map size={24} />
          </motion.div>
          <span className="text-xs mt-1">Map</span>
        </Link>
        <Link to="/savings" className={`nav-link ${isActive('/savings') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <CircleDollarSign size={24} />
          </motion.div>
          <span className="text-xs mt-1">Savings</span>
        </Link>
        <Link to="/insights" className={`nav-link ${isActive('/insights') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ChartPie size={24} />
          </motion.div>
          <span className="text-xs mt-1">Insights</span>
        </Link>
        <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'text-theme-pink active' : 'text-gray-500'}`}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <User size={24} />
          </motion.div>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
      <motion.div 
        className={`w-full py-1 px-4 text-xs flex items-center justify-center font-medium ${
          remainingBudget >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {remainingBudget >= 0 
          ? (
            <span className="flex items-center">
              <ArrowUp size={14} className="mr-1 text-green-600 dark:text-green-400" />
              Remaining: {formatCurrency(remainingBudget)}
            </span>
          )
          : (
            <span className="flex items-center">
              <ArrowDown size={14} className="mr-1 text-red-600 dark:text-red-400" />
              Overspent by: {formatCurrency(Math.abs(remainingBudget))}
            </span>
          )
        }
      </motion.div>
    </div>
  );
};

export default NavBar;
