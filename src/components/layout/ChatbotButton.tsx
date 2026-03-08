import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Sparkles } from 'lucide-react';
import JoziBoetChatbot from '../JoziBoetChatbot';
import { useMobile } from '@/hooks/use-mobile';

const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const isMobile = useMobile();

  const toggleOpen = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const positionClass = isMobile
    ? "fixed bottom-20 right-3 z-50"
    : "fixed bottom-6 right-6 z-50";

  return (
    <div className={positionClass}>
      <AnimatePresence mode="wait">
        {isOpen && !isMinimized ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-background"
            style={{ width: isMobile ? 'calc(100vw - 24px)' : '360px', height: isMobile ? '70vh' : '520px' }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary via-primary/90 to-accent px-4 py-3 flex items-center justify-between">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_60%)]" />
              <div className="relative flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-primary-foreground/30">
                  <Sparkles size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary-foreground tracking-tight">Jozi Boet</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-primary-foreground/70">Online</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                  className="p-1.5 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Chat body */}
            <div className="h-[calc(100%-52px)]">
              <JoziBoetChatbot />
            </div>
          </motion.div>
        ) : isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleOpen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
          >
            <Sparkles size={14} />
            <span className="text-sm font-medium">Jozi Boet</span>
          </motion.button>
        ) : (
          <motion.button
            key="fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleOpen}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
          >
            {/* Glow ring */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-40" style={{ animationDuration: '3s' }} />
            <Sparkles size={22} className="relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotButton;
