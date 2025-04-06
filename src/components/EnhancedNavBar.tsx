
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map, ArrowUp, ArrowDown, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { BadgeGlow } from './ui/badge-glow';

const EnhancedNavBar: React.FC = () => {
  const { remainingBudget } = useBudget();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  // Define menu items for better organization
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/planning', icon: Users, label: 'Planning' },
    { path: '/vibes', icon: Star, label: 'Vibes' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };
  
  // Individual item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-800 z-30">
        <motion.div 
          className="flex justify-around p-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'text-theme-pink active' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  {isActive(item.path) ? (
                    <BadgeGlow>
                      <item.icon size={24} />
                    </BadgeGlow>
                  ) : (
                    <item.icon size={24} />
                  )}
                </motion.div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className={`w-full py-2 px-4 text-sm flex items-center justify-center font-medium backdrop-blur-md ${
            remainingBudget >= 0 
              ? 'bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 text-green-700 dark:text-green-300' 
              : 'bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 text-red-700 dark:text-red-300'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {remainingBudget >= 0 
            ? (
              <span className="flex items-center">
                <div className="mr-2 p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <ArrowUp size={14} className="text-green-600 dark:text-green-400" />
                </div>
                Remaining: <span className="font-bold ml-1">{formatCurrency(remainingBudget)}</span>
              </span>
            )
            : (
              <span className="flex items-center">
                <div className="mr-2 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
                  <ArrowDown size={14} className="text-red-600 dark:text-red-400" />
                </div>
                Overspent by: <span className="font-bold ml-1">{formatCurrency(Math.abs(remainingBudget))}</span>
              </span>
            )
          }
        </motion.div>
      </div>
    </>
  );
};

export default EnhancedNavBar;
