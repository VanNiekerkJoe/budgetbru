
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, PiggyBank, BookOpen, Coffee, Lightbulb, BarChart3, Map, Users, Heart, ArrowUpDown, ThumbsUp, Home } from 'lucide-react';

// Define the allowed category types
export type CategoryType = 
  | 'expenses'
  | 'income'
  | 'savings'
  | 'education'
  | 'food'
  | 'tips'
  | 'insights'
  | 'map'
  | 'community'
  | 'planning'
  | 'iou'
  | 'finances'
  | 'jols'
  | 'vibes';

interface CategoryIconProps {
  category: CategoryType;
  size?: number;
  withAnimation?: boolean;
  withBackground?: boolean;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24, 
  withAnimation = false,
  withBackground = false,
  className = ""
}) => {
  const getIcon = () => {
    switch(category) {
      case 'expenses':
        return <ShoppingCart size={size} />;
      case 'income':
        return <ArrowUpDown size={size} />;
      case 'savings':
        return <PiggyBank size={size} />;
      case 'education':
        return <BookOpen size={size} />;
      case 'food':
        return <Coffee size={size} />;
      case 'tips':
        return <Lightbulb size={size} />;
      case 'insights':
        return <BarChart3 size={size} />;
      case 'map':
        return <Map size={size} />;
      case 'community':
        return <Users size={size} />;
      case 'planning':
        return <Users size={size} />;
      case 'iou':
        return <Heart size={size} />;
      case 'finances':
        return <PiggyBank size={size} />;
      case 'jols':
        return <ThumbsUp size={size} />;
      case 'vibes':
        return <Star size={size} />;
      default:
        return <Home size={size} />;
    }
  };
  
  const getBackgroundColor = () => {
    switch(category) {
      case 'expenses':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'income':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'savings':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'education':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'food':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'tips':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'insights':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'map':
        return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'community':
        return 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400';
      case 'planning':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'iou':
        return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      case 'finances':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'jols':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'vibes':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400';
    }
  };
  
  const icon = getIcon();
  
  if (withAnimation) {
    return withBackground ? (
      <motion.div 
        className={`w-10 h-10 rounded-full ${getBackgroundColor()} flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
    ) : (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={className}
      >
        {icon}
      </motion.div>
    );
  }
  
  return withBackground ? (
    <div className={`w-10 h-10 rounded-full ${getBackgroundColor()} flex items-center justify-center ${className}`}>
      {icon}
    </div>
  ) : (
    <div className={className}>{icon}</div>
  );
};

export default CategoryIcon;
