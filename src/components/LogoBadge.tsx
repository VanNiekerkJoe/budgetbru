
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

const LogoBadge: React.FC<LogoBadgeProps> = ({ size = 'md' }) => {
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

  return (
    <motion.div 
      className="logo-container inline-block"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`flex items-center ${classes.container}`}>
        <div className="relative">
          <motion.div 
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={classes.sparkles} className="text-theme-pink" />
          </motion.div>
          <div className="flex items-baseline">
            <motion.h1 
              className={`logo-text ${classes.title} flex items-center`}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <span className="text-theme-pink">B</span>
              <span className="text-theme-indigo">udget</span>
              <span className="text-theme-teal">B</span>
              <span className="text-theme-pink">ru</span>
            </motion.h1>
            <motion.span 
              className={`ml-1.5 bg-theme-pink rounded-full ${classes.badge} font-bold text-white`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Beta
            </motion.span>
          </div>
          <motion.p 
            className={`${classes.subtitle} text-center opacity-80`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
          >
            You must budget, bru!
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default LogoBadge;
