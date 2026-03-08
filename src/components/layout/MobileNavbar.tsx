
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Home, Wallet, CircleDollarSign, Plus, Check,
  ChartPie, User, Map, MessageSquare, Calendar, 
  Zap, Lightbulb, Receipt, Shield, CreditCard, 
  MoreHorizontal, X, PiggyBank, ChevronLeft, TrendingUp
} from 'lucide-react';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';

const PRIMARY_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/expenses', icon: Wallet, label: 'Expenses' },
];

const RIGHT_ITEMS = [
  { path: '/savings', icon: PiggyBank, label: 'Savings' },
];

const FINANCE_ITEMS = [
  { path: '/income', icon: CircleDollarSign, label: 'Income' },
  { path: '/insights', icon: ChartPie, label: 'Insights' },
  { path: '/iou', icon: CreditCard, label: 'IOUs' },
  { path: '/receipts', icon: Receipt, label: 'Receipts' },
  { path: '/emergency-fund', icon: Shield, label: 'Emergency' },
];

const SOCIAL_ITEMS = [
  { path: '/community', icon: MessageSquare, label: 'Community' },
  { path: '/vibes', icon: Zap, label: 'Vibes Hub' },
  { path: '/planning', icon: Calendar, label: 'Planning' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/tips', icon: Lightbulb, label: 'Tips' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [showFAB, setShowFAB] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = [...FINANCE_ITEMS, ...SOCIAL_ITEMS].some(item => isActive(item.path));

  return (
    <>
      {/* FAB Bottom Sheet */}
      <AnimatePresence>
        {showFAB && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowFAB(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border pb-safe"
            >
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mt-3 mb-4" />
              <div className="px-5 pb-8 space-y-3">
                <h3 className="font-semibold text-base text-foreground">Quick Add</h3>
                <button
                  onClick={() => { setShowFAB(false); navigate('/expenses'); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-destructive/10 hover:bg-destructive/15 transition-colors active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <Wallet size={20} className="text-destructive" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Add Expense</p>
                    <p className="text-xs text-muted-foreground">Track what you spent</p>
                  </div>
                </button>
                <button
                  onClick={() => { setShowFAB(false); navigate('/income'); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CircleDollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">Add Income</p>
                    <p className="text-xs text-muted-foreground">Record your earnings</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              
              {/* Finance Section */}
              <div className="px-4 pb-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Finance</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {FINANCE_ITEMS.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-xl transition-colors active:scale-95 ${
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
              </div>

              {/* Social Section */}
              <div className="px-4 pb-6">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Social & Tools</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SOCIAL_ITEMS.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-xl transition-colors active:scale-95 ${
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
          
          {/* Center FAB */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setShowFAB(true)}
              className="w-12 h-12 -mt-5 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          </div>

          {RIGHT_ITEMS.map(item => (
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
                    layoutId="nav-dot-right"
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
