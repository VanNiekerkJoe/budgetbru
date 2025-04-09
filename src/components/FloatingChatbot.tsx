
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import JoziBoetChatbot from './JoziBoetChatbot';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

  return (
    <>
      <motion.div
        className="fixed bottom-20 right-4 z-50"
        animate={{ 
          bottom: isOpen ? '5rem' : '5rem',
          right: isOpen ? '1rem' : '1rem',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        drag={!isOpen}
        dragConstraints={{ left: 0, right: window.innerWidth - 60, top: 0, bottom: window.innerHeight - 60 }}
        onDragEnd={(_, info) => {
          setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y,
          });
        }}
      >
        <AnimatePresence>
          {isOpen && !isMinimized ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg border border-gray-200/30 dark:border-gray-700/30 w-[350px] h-[500px] overflow-hidden"
            >
              <div className="bg-theme-pink/80 backdrop-blur-sm text-white p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare size={18} className="mr-2" />
                  <h3 className="font-medium">JoziBoet Assistant</h3>
                </div>
                <div className="flex space-x-2">
                  <button onClick={minimizeChatbot} className="hover:bg-white/20 p-1 rounded">
                    <Minimize2 size={16} />
                  </button>
                  <button onClick={toggleChatbot} className="hover:bg-white/20 p-1 rounded">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="h-[calc(500px-40px)]">
                <JoziBoetChatbot />
              </div>
            </motion.div>
          ) : isMinimized ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-theme-pink/90 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer flex items-center"
              onClick={toggleChatbot}
            >
              <MessageSquare size={16} className="mr-2" />
              <span className="font-medium text-sm">JoziBoet Assistant</span>
              <Maximize2 size={14} className="ml-2" />
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-theme-pink shadow-lg rounded-full w-14 h-14 flex items-center justify-center text-white"
              onClick={toggleChatbot}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <MessageSquare size={24} />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default FloatingChatbot;
