
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';

interface CategoryInsightProps {
  categoryName: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  percentage: number;
  details?: React.ReactNode;
}

const CategoryInsight: React.FC<CategoryInsightProps> = ({
  categoryName,
  amount,
  icon,
  color,
  percentage,
  details
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate gradient style based on color prop
  const getGradientStyle = () => {
    return {
      background: isHovered 
        ? `linear-gradient(to right, ${color}20, transparent)` 
        : `linear-gradient(to right, ${color}10, transparent)`,
      borderLeft: `3px solid ${color}${isHovered ? '' : '80'}`,
      transition: 'all 0.3s ease',
    };
  };
  
  // Generate badge style based on color prop
  const getBadgeStyle = () => {
    return {
      backgroundColor: `${color}15`,
      color: color,
      borderColor: `${color}30`,
    };
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl shadow-sm transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          style={getGradientStyle()}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-full bg-gradient-to-br from-white/70 to-white/30 dark:from-gray-800/70 dark:to-gray-900/30 shadow-sm backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isHovered ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                style={{ borderColor: `${color}40`, borderWidth: '1px' }}
              >
                {icon}
              </motion.div>
              <div>
                <h3 className="font-medium capitalize">{categoryName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(amount)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant="outline" 
                className="flex items-center"
                style={getBadgeStyle()}
              >
                {percentage}%
              </Badge>
              
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </div>
          </CardContent>
        </div>
        
        <AnimatePresence>
          {isExpanded && details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pb-4 pt-1 border-t border-gray-100/50 dark:border-gray-800/50 backdrop-blur-sm bg-white/10 dark:bg-gray-900/10">
                {details}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default CategoryInsight;
