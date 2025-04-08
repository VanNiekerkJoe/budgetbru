
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
  
  // Generate gradient style based on color prop
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(to right, ${color}10, ${color}05)`,
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
    <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={getGradientStyle()}
      >
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
              {icon}
            </div>
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
            
            {isExpanded ? 
              <ChevronDown size={18} /> : 
              <ChevronRight size={18} />
            }
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
            <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
              {details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CategoryInsight;
