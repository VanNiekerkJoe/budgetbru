
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const EnhancedLogoBadge: React.FC<LogoBadgeProps> = ({ size = 'md', animated = true }) => {
  const sizeClasses = {
    sm: {
      container: 'h-8',
      title: 'text-lg',
      subtitle: 'text-[8px]',
      badge: 'text-[7px] px-1',
      sparkles: 12
    },
    md: {
      container: 'h-12',
      title: 'text-2xl',
      subtitle: 'text-xs',
      badge: 'text-[9px] px-1.5 py-0.5',
      sparkles: 16
    },
    lg: {
      container: 'h-16',
      title: 'text-3xl',
      subtitle: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
      sparkles: 20
    },
  };

  const classes = sizeClasses[size];

  // More pronounced 3D-like effect and animations
  return (
    <motion.div 
      className="relative inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-theme-pink via-purple-500 to-theme-teal"
        animate={{ 
          filter: ["blur(8px)", "blur(12px)", "blur(8px)"],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ zIndex: -2 }}
      />
      
      <div className={`flex items-center ${classes.container} relative`}>
        <div className="relative">
          <motion.div 
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={classes.sparkles} className="text-theme-pink drop-shadow-lg" />
          </motion.div>
          
          {/* Logo text with enhanced 3D effect */}
          <div className="flex items-baseline mt-2">
            <div className="flex items-baseline">
              <motion.h1 
                className={`font-extrabold tracking-tight ${classes.title} flex items-center`}
                style={{ 
                  textShadow: "2px 2px 0 rgba(0,0,0,0.2), 0 0 10px rgba(202, 82, 154, 0.5)" 
                }}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <motion.span 
                  className="text-theme-pink"
                  animate={animated ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, delay: 0, repeat: Infinity }}
                >
                  B
                </motion.span>
                <span className="text-theme-indigo">udget</span>
                <motion.span 
                  className="text-theme-teal"
                  animate={animated ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                >
                  B
                </motion.span>
                <span className="text-theme-pink">ru</span>
              </motion.h1>
              
              <motion.span 
                className={`ml-1.5 bg-gradient-to-r from-theme-pink to-theme-teal rounded-full ${classes.badge} font-bold text-white`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                Beta
              </motion.span>
            </div>
          </div>
          
          <motion.div 
            className="absolute inset-0 bg-white/10 dark:bg-black/10 rounded-lg"
            style={{ backdropFilter: "blur(1px)", zIndex: -1 }}
          />
          
          <motion.p 
            className={`${classes.subtitle} text-center font-medium text-gray-700 dark:text-gray-200`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.2 }}
          >
            You must budget, bru!
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedLogoBadge;
