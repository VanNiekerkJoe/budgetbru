
import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, MapPin, CircleDollarSign, BookOpen, Users, PartyPopper, MessageCircle, Bot } from 'lucide-react';

export type CategoryType = 
  | 'finances' 
  | 'jols' 
  | 'expenses' 
  | 'savings' 
  | 'tips' 
  | 'iou' 
  | 'map' 
  | 'community' 
  | 'planning' 
  | 'vibes' 
  | 'chatbot';

interface CategoryIconProps {
  category: CategoryType;
  size?: number;
  className?: string;
  withBackground?: boolean;
  withAnimation?: boolean;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24, 
  className = "",
  withBackground = false,
  withAnimation = false
}) => {
  
  const getIcon = () => {
    switch(category) {
      case 'finances':
        return <Wallet size={size} />;
      case 'jols':
        return <PartyPopper size={size} />;
      case 'expenses':
        return <Wallet size={size} />;
      case 'savings':
        return <CircleDollarSign size={size} />;
      case 'tips':
        return <BookOpen size={size} />;
      case 'iou':
        return <Users size={size} />;
      case 'map':
        return <MapPin size={size} />;
      case 'community':
        return <MessageCircle size={size} />;
      case 'planning':
        return <Users size={size} />;
      case 'vibes':
        return <PartyPopper size={size} />;
      case 'chatbot':
        return <Bot size={size} />;
      default:
        return <Wallet size={size} />;
    }
  };
  
  const getCategoryClass = () => {
    if (!withBackground) return '';
    
    switch(category) {
      case 'finances':
        return 'finances-icon';
      case 'jols':
        return 'jols-icon';
      case 'expenses':
        return 'bg-orange-500 text-white';
      case 'savings':
        return 'bg-green-500 text-white';
      case 'tips':
        return 'bg-blue-500 text-white';
      case 'iou':
        return 'bg-purple-500 text-white';
      case 'map':
        return 'bg-emerald-500 text-white';
      case 'community':
        return 'bg-pink-500 text-white';
      case 'planning':
        return 'bg-indigo-500 text-white';
      case 'vibes':
        return 'bg-amber-500 text-white';
      case 'chatbot':
        return 'bg-teal-500 text-white chatbot-icon';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const iconContent = getIcon();
  
  if (withAnimation) {
    return (
      <motion.div
        className={`category-icon ${getCategoryClass()} ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {iconContent}
      </motion.div>
    );
  }
  
  return (
    <div className={`${withBackground ? 'category-icon' : ''} ${getCategoryClass()} ${className}`}>
      {iconContent}
    </div>
  );
};

export default CategoryIcon;
