
import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Camera } from 'lucide-react';

interface ReceiptIconProps {
  size?: number;
  showAnimation?: boolean;
  className?: string;
}

const ReceiptIcon: React.FC<ReceiptIconProps> = ({ 
  size = 24, 
  showAnimation = true,
  className = "" 
}) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      whileHover={showAnimation ? { scale: 1.1 } : {}}
      whileTap={showAnimation ? { scale: 0.95 } : {}}
    >
      <Receipt size={size} className="text-amber-500" />
      <motion.div 
        className="absolute -top-1 -right-1 bg-theme-pink rounded-full p-[2px]"
        animate={showAnimation ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ 
          repeat: showAnimation ? Infinity : 0, 
          repeatType: "reverse", 
          duration: 1.5 
        }}
      >
        <Camera size={size/3} className="text-white" />
      </motion.div>
    </motion.div>
  );
};

export default ReceiptIcon;
