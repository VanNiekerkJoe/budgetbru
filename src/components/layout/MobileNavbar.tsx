
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Wallet, ChartPie, CircleDollarSign, User, Map, 
  MessageSquare, Calendar, Zap, Lightbulb, Receipt, 
  Shield, CreditCard, MoreHorizontal, X
} from 'lucide-react';

const PRIMARY_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/expenses', icon: Wallet, label: 'Expenses' },
  { path: '/income', icon: CircleDollarSign, label: 'Income' },
  { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
];

const MORE_ITEMS = [
  { path: '/insights', icon: ChartPie, label: 'Insights' },
  { path: '/iou', icon: CreditCard, label: 'IOUs' },
  { path: '/community', icon: MessageSquare, label: 'Community' },
  { path: '/vibes', icon: Zap, label: 'Vibes Hub' },
  { path: '/planning', icon: Calendar, label: 'Planning' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/tips', icon: Lightbulb, label: 'Tips' },
  { path: '/receipts', icon: Receipt, label: 'Receipts' },
  { path: '/emergency-fund', icon: Shield, label: 'Emergency' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = MORE_ITEMS.some(item => isActive(item.path));

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border pb-safe max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="font-semibold text-base">More</h3>
                <button 
                  onClick={() => setShowMore(false)} 
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 px-3 pb-6">
                {MORE_ITEMS.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl transition-colors active:scale-95 ${
                      isActive(item.path) 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-muted active:bg-muted'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-[10px] mt-1.5 font-medium leading-tight text-center">{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-stretch">
          {PRIMARY_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors active:scale-95 ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 1.8} />
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive(item.path) ? 'text-primary' : ''}`}>
                {item.label}
              </span>
            </Link>
          ))}
          
          {/* More button */}
          <button
            onClick={() => setShowMore(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors active:scale-95 ${
              isMoreActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MoreHorizontal size={20} strokeWidth={isMoreActive ? 2.5 : 1.8} />
            <span className={`text-[10px] mt-0.5 font-medium ${isMoreActive ? 'text-primary' : ''}`}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
