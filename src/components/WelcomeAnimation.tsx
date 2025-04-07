
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoBadge from './LogoBadge';

const WelcomeAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500); // Animation will show for 2.5 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-theme-indigo to-theme-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LogoBadge size="xl" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-white mt-6 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            BudgetBru
          </motion.h1>
          
          <motion.p
            className="text-white/80 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Student Finance Made Easy
          </motion.p>
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-theme-pink"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeAnimation;
