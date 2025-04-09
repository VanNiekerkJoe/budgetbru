
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minimize2, Maximize2, MessageSquare, Sparkles } from 'lucide-react';
import JoziBoetChatbot from '../JoziBoetChatbot';
import { useMobile } from '@/hooks/use-mobile';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isMobile = useMobile();
  
  const toggleChatbot = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChatbot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };
  
  // Position chatbot differently based on screen size
  const chatbotPosition = isMobile 
    ? "fixed bottom-20 right-4 z-50" // Above mobile nav
    : "fixed bottom-6 right-6 z-50"; // Bottom right on desktop
    
  return (
    <motion.div className={chatbotPosition}>
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/30 dark:border-gray-700/30 w-[330px] h-[450px] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500/90 to-purple-500/90 backdrop-blur-sm text-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare size={16} />
                <h3 className="font-medium">Finance Assistant</h3>
              </div>
              <div className="flex space-x-2">
                <button onClick={minimizeChatbot} className="hover:bg-white/20 p-1 rounded">
                  <Minimize2 size={14} />
                </button>
                <button onClick={toggleChatbot} className="hover:bg-white/20 p-1 rounded">
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="h-[calc(450px-44px)]">
              <JoziBoetChatbot />
            </div>
          </motion.div>
        ) : isMinimized ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gradient-to-r from-indigo-500/90 to-purple-500/90 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center"
            onClick={toggleChatbot}
          >
            <MessageSquare size={14} className="mr-2" />
            <span className="font-medium text-sm">Finance Assistant</span>
            <Maximize2 size={12} className="ml-2" />
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-white"
            onClick={toggleChatbot}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="relative"
            >
              <MessageSquare size={20} />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Sparkles size={8} className="text-yellow-300" />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotButton;
