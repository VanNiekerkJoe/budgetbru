
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeGlow } from './ui/badge-glow';
import { toast } from 'sonner';

const EnhancedNavBar: React.FC = () => {
  const { remainingBudget } = useBudget();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [lastVisited, setLastVisited] = useState<Record<string, Date>>({});
  
  useEffect(() => {
    // Update last visited timestamp for the current page
    setLastVisited(prev => ({
      ...prev,
      [location.pathname]: new Date()
    }));
    
    // Show tooltip for items with new content
    const timer = setTimeout(() => {
      setShowTooltip(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleRewardsClick = () => {
    toast.success("You earned 10 points for checking your budget status!", {
      icon: "🏆",
      description: "Keep tracking your finances for more rewards!",
      action: {
        label: "View All",
        onClick: () => toast.info("Rewards system coming soon!")
      }
    });
  };

  // Define menu items for better organization - removed Planning and Vibes
  const menuItems = [
    { path: '/', icon: Home, label: 'Home', tooltip: "Dashboard" },
    { path: '/expenses', icon: Wallet, label: 'Expenses', tooltip: "Track spending" },
    { path: '/map', icon: Map, label: 'Map', tooltip: "Campus Map" },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings', tooltip: "Save money" },
    { path: '/insights', icon: ChartPie, label: 'Insights', tooltip: "Financial insights" },
    { path: '/profile', icon: User, label: 'Profile', tooltip: "Your profile" },
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/40 dark:bg-gray-900/50 backdrop-blur-md shadow-lg border-t border-gray-200/30 dark:border-gray-800/30 z-30">
        <motion.div 
          className="flex justify-around p-2 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item) => (
            <motion.div key={item.path} variants={itemVariants}>
              <Link 
                to={item.path} 
                className={`nav-link relative flex flex-col items-center px-3 py-2 ${
                  isActive(item.path) 
                    ? 'text-theme-pink active' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onMouseEnter={() => setShowTooltip(item.path)}
                onMouseLeave={() => setShowTooltip(null)}
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
                
                <AnimatePresence>
                  {showTooltip === item.path && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: -5 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-10 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50"
                    >
                      {item.tooltip}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className={`w-full py-3 px-4 text-sm flex items-center justify-between font-medium backdrop-blur-md ${
            remainingBudget >= 0 
              ? 'bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 text-green-700 dark:text-green-300' 
              : 'bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10 text-red-700 dark:text-red-300'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleRewardsClick}
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
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full text-xs cursor-pointer"
          >
            <span className="mr-1">🏆</span> View Rewards
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default EnhancedNavBar;
