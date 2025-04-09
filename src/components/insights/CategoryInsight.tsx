
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
  
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card 
        className="overflow-hidden border border-white/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-sm transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            borderLeft: `3px solid ${color}`,
            background: isHovered ? 
              `linear-gradient(to right, ${color}15, transparent)` : 
              `linear-gradient(to right, ${color}05, transparent)`
          }}
        >
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="p-2 rounded-full bg-white/70 dark:bg-gray-700/70 shadow-sm backdrop-blur-sm flex items-center justify-center"
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
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                  borderColor: `${color}30`,
                }}
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
