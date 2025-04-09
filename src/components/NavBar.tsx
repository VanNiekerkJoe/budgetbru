
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';

const NavBar: React.FC = () => {
  const { remainingBudget } = useBudget();
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  // Animations for menu items
  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotate: [0, 5, -5, 0], transition: { duration: 0.3 } },
    active: { scale: 1.1 }
  };
  
  const labelVariants = {
    initial: { y: 0, opacity: 0.7 },
    hover: { y: -2, opacity: 1, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <motion.div 
        className={`w-full py-1 px-4 text-xs flex items-center justify-center font-medium ${
          remainingBudget >= 0 ? 'bg-green-500/10 text-green-800 dark:text-green-300' : 
          'bg-red-500/10 text-red-800 dark:text-red-300'
        } backdrop-blur-md`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {remainingBudget >= 0 
          ? (
            <motion.span 
              className="flex items-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <ArrowUp size={14} className="mr-1 text-green-600 dark:text-green-400" />
              </motion.div>
              Remaining: {formatCurrency(remainingBudget)}
            </motion.span>
          )
          : (
            <motion.span 
              className="flex items-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              >
                <ArrowDown size={14} className="mr-1 text-red-600 dark:text-red-400" />
              </motion.div>
              Overspent by: {formatCurrency(Math.abs(remainingBudget))}
            </motion.span>
          )
        }
      </motion.div>
      
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border-t border-white/20 dark:border-gray-800/30 shadow-lg relative overflow-hidden">
        {/* Particle background for active tab */}
        <div className="absolute inset-0 z-0 opacity-30">
          <ParticleBackground count={20} theme="finances" className="opacity-40" />
        </div>
        
        <motion.div 
          className="flex justify-around p-2 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, staggerChildren: 0.05 }}
        >
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-link relative flex flex-col items-center p-2 ${
                isActive(item.path) ? 'text-theme-pink' : 'text-gray-500 dark:text-gray-400'
              }`}
              onMouseEnter={() => setHovered(item.path)}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate={isActive(item.path) ? "active" : hovered === item.path ? "hover" : "initial"}
                className="relative"
              >
                <item.icon size={24} />
                {isActive(item.path) && (
                  <motion.div 
                    className="absolute -inset-1 bg-theme-pink/10 rounded-full -z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    layoutId="activeTab"
                  />
                )}
                
                {isActive(item.path) && (
                  <motion.div 
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles size={10} className="text-theme-pink" />
                  </motion.div>
                )}
              </motion.div>
              
              <motion.span 
                className="text-xs mt-1"
                variants={labelVariants}
                initial="initial"
                animate={hovered === item.path || isActive(item.path) ? "hover" : "initial"}
              >
                {item.label}
              </motion.span>
              
              {isActive(item.path) && (
                <motion.div 
                  className="absolute bottom-0 h-0.5 bg-theme-pink rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NavBar;
