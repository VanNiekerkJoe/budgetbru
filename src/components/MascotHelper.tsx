
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeGlow } from '@/components/ui/badge-glow';
import { AlertCircle, X, Gift, MessageCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';

type MascotType = 'budgetbru' | 'savings' | 'expenses' | 'planning';

interface MascotHelperProps {
  type?: MascotType;
  message?: string;
  showClose?: boolean;
  unlockableReward?: boolean;
}

const MascotHelper: React.FC<MascotHelperProps> = ({ 
  type = 'budgetbru',
  message = "Hey there! I'm BudgetBru, here to help you with your finances!",
  showClose = true,
  unlockableReward = false
}) => {
  const [visible, setVisible] = useState(true);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  
  useEffect(() => {
    // Reset states when type or message changes
    setVisible(true);
    setRewardUnlocked(false);
  }, [type, message]);
  
  const handleClick = () => {
    setIsJumping(true);
    setInteractionCount(prev => prev + 1);
    
    // After jump animation completes
    setTimeout(() => {
      setIsJumping(false);
    }, 500);
    
    // Unlock reward after 3 interactions
    if (unlockableReward && interactionCount >= 2 && !rewardUnlocked) {
      setRewardUnlocked(true);
      toast.success("You've unlocked a reward! +50 budget points!", {
        icon: "🏆",
        duration: 3000,
      });
    }
  };
  
  const getMascotEmoji = () => {
    switch (type) {
      case 'savings':
        return "🐷"; // Piggy bank for savings
      case 'expenses':
        return "🦊"; // Fox for expenses tracker
      case 'planning':
        return "🦉"; // Owl for planning
      default:
        return "🦁"; // Lion for general BudgetBru mascot
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'savings':
        return "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50";
      case 'expenses':
        return "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50";
      case 'planning':
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50";
      default:
        return "bg-theme-pink/10 dark:bg-theme-pink/20 border-theme-pink/20 dark:border-theme-pink/30";
    }
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`rounded-xl border ${getBackgroundColor()} p-3 relative`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <motion.div 
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shadow-sm"
              animate={isJumping ? { y: [-10, 0] } : {}}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClick}
            >
              {getMascotEmoji()}
            </motion.div>
            
            <div className="flex-1">
              <div className="font-medium text-left mb-1">
                {type.charAt(0).toUpperCase() + type.slice(1)} Buddy
              </div>
              <div className="text-sm text-left text-gray-700 dark:text-gray-300">
                {message}
              </div>
              
              {rewardUnlocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-sm text-left flex items-center"
                >
                  <Gift size={14} className="mr-1 text-yellow-600 dark:text-yellow-400" />
                  <span>Reward unlocked! +50 budget points</span>
                </motion.div>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50"
                  onClick={() => toast.info("Thanks for the feedback!")}
                >
                  <Heart size={12} />
                  Helpful
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50"
                  onClick={() => toast.info("What else would you like to know?")}
                >
                  <MessageCircle size={12} />
                  More tips
                </motion.button>
              </div>
            </div>
            
            {showClose && (
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setVisible(false)}
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Interactive elements based on mascot type */}
          {type === 'savings' && interactionCount > 0 && (
            <motion.div 
              className="absolute -top-2 -left-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BadgeGlow>
                <div className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Savings Pro!
                </div>
              </BadgeGlow>
            </motion.div>
          )}
          
          {type === 'expenses' && interactionCount > 0 && (
            <motion.div 
              className="absolute -top-2 -right-2"
              initial={{ opacity: 0, rotate: -20 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                🔍 Budget Detective
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MascotHelper;
