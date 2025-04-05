
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';

interface EventPopupProps {
  title: string;
  description: string;
  date?: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

const EventPopup: React.FC<EventPopupProps> = ({
  title,
  description,
  date,
  onClose,
  autoClose = true,
  autoCloseTime = 6000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoClose) {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to finish
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow animation to finish
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-50 max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-theme-pink"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-theme-pink">{title}</h3>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{description}</p>
            
            {date && (
              <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <Calendar size={14} className="mr-1" />
                <span>{date}</span>
              </div>
            )}
            
            <div className="mt-3 flex justify-end">
              <button 
                onClick={handleClose}
                className="text-xs px-3 py-1 bg-theme-pink text-white rounded-md hover:bg-theme-pink/80"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventPopup;
