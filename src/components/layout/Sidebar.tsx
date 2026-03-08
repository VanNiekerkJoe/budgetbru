
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map, MessageSquare, Calendar, Zap, Heart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { remainingBudget, totalIncome, totalExpenses } = useBudget();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/income', icon: CircleDollarSign, label: 'Income' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/community', icon: MessageSquare, label: 'Community' },
    { path: '/vibes', icon: Zap, label: 'Vibes Hub' },
    { path: '/planning', icon: Calendar, label: 'Planning' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="w-64 h-screen bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 overflow-y-auto fixed">
      <div className="flex flex-col h-full">
        {/* Logo & Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <motion.div 
            className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            JoziBoet Finance
          </motion.div>
        </div>
        
        {/* Budget Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Budget Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Income:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Expenses:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-gray-200/50 dark:border-gray-700/50">
              <span className="text-xs">Remaining:</span>
              <span className={`font-medium ${remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(remainingBudget)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <motion.div
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    whileHover={{ x: 5 }}
                    animate={isActive(item.path) ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        className="w-1.5 h-1.5 bg-primary rounded-full ml-auto"
                        layoutId="activeIndicator"
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Additional Links */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Resources</div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/tips" className="text-xs px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-all">
              Tips & Guides
            </Link>
            <Link to="/emergency-fund" className="text-xs px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-all">
              Emergency Fund
            </Link>
            <Link to="/iou" className="text-xs px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-all">
              IOUs
            </Link>
            <Link to="/receipts" className="text-xs px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-all">
              Receipts
            </Link>
          </div>
        </div>
        
        {/* Footer with info badge */}
        <div className="p-4 flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/50">
          <Badge variant="outline" className="text-xs">JoziBoet v1.0</Badge>
          <Link to="/community" className="flex items-center text-xs text-blue-600 dark:text-blue-400">
            <MessageSquare className="h-3 w-3 mr-1" />
            Community
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
