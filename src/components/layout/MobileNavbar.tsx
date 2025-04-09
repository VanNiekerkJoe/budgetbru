
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map } from 'lucide-react';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50"
    >
      <div className="flex justify-around py-2 px-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center px-2 py-1 text-center"
          >
            <motion.div
              className={`p-1.5 rounded-full ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="h-5 w-5" />
            </motion.div>
            <span className="text-xs mt-0.5">{item.label}</span>
            {isActive(item.path) && (
              <motion.div
                className="absolute bottom-0 w-1 h-1 bg-primary rounded-full"
                layoutId="activeIndicatorMobile"
              />
            )}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
