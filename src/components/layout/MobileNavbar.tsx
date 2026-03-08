
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Home, Wallet, CircleDollarSign, Plus, Check,
  ChartPie, User, Map, MessageSquare, Calendar, 
  Zap, Lightbulb, Receipt, Shield, CreditCard, Heart, 
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
  { path: '/income', icon: CircleDollarSign, label: 'Income', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { path: '/insights', icon: ChartPie, label: 'Insights', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { path: '/iou', icon: CreditCard, label: 'IOUs', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { path: '/receipts', icon: Receipt, label: 'Receipts', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { path: '/emergency-fund', icon: Shield, label: 'Emergency', color: 'text-red-500', bg: 'bg-red-500/10' },
];

const SOCIAL_ITEMS = [
  { path: '/community', icon: MessageSquare, label: 'Community', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { path: '/vibes', icon: Zap, label: 'Vibes Hub', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { path: '/planning', icon: Calendar, label: 'Planning', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { path: '/couples', icon: Heart, label: 'Couples', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { path: '/map', icon: Map, label: 'Map', color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { path: '/tips', icon: Lightbulb, label: 'Tips', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { path: '/profile', icon: User, label: 'Profile', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'education', label: 'Study', emoji: '📚' },
  { id: 'entertainment', label: 'Fun', emoji: '🎬' },
  { id: 'utilities', label: 'Bills', emoji: '💡' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒' },
];

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addExpense, addIncome } = useBudget();
  const [showMore, setShowMore] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  
  // FAB flow state
  const [fabStep, setFabStep] = useState<'type' | 'category' | 'amount' | 'custom'>('type');
  const [fabType, setFabType] = useState<'expense' | 'income'>('expense');
  const [fabCategory, setFabCategory] = useState<string | null>(null);
  const [fabAmount, setFabAmount] = useState('');

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = [...FINANCE_ITEMS, ...SOCIAL_ITEMS].some(item => isActive(item.path));

  const resetFAB = () => {
    setShowFAB(false);
    setFabStep('type');
    setFabType('expense');
    setFabCategory(null);
    setFabAmount('');
  };

  const handleFabConfirm = (amount: number) => {
    if (fabType === 'expense' && fabCategory) {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === fabCategory);
      addExpense({
        amount,
        category: fabCategory as any,
        description: cat?.label || fabCategory,
        date: new Date().toISOString().split('T')[0],
      });
      toast.success(`${cat?.emoji} R${amount} expense added`);
    } else if (fabType === 'income') {
      addIncome({ amount, source: 'Quick add', date: new Date().toISOString().split('T')[0] });
      toast.success(`💰 R${amount} income added`);
    }
    resetFAB();
  };

  const fabBack = () => {
    if (fabStep === 'custom') setFabStep('amount');
    else if (fabStep === 'amount') {
      if (fabType === 'expense') setFabStep('category');
      else setFabStep('type');
    }
    else if (fabStep === 'category') setFabStep('type');
    else resetFAB();
  };

  const selectedCat = EXPENSE_CATEGORIES.find(c => c.id === fabCategory);

  return (
    <>
      {/* FAB Bottom Sheet */}
      <AnimatePresence>
        {showFAB && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={resetFAB}
          >
            <motion.div
              initial={{ translateY: '100%' }}
              animate={{ translateY: '0%' }}
              exit={{ translateY: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-3" />
              
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  {fabStep !== 'type' && (
                    <motion.button
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={fabBack}
                      className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center active:bg-muted"
                    >
                      <ChevronLeft size={16} className="text-muted-foreground" />
                    </motion.button>
                  )}
                  <h3 className="font-bold text-base text-foreground">
                    {fabStep === 'type' && 'Quick Add'}
                    {fabStep === 'category' && 'Pick Category'}
                    {fabStep === 'amount' && `${fabType === 'expense' ? selectedCat?.emoji : '💰'} How much?`}
                    {fabStep === 'custom' && `${fabType === 'expense' ? selectedCat?.emoji : '💰'} Enter Amount`}
                  </h3>
                </div>
                <button onClick={resetFAB} className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center active:bg-muted">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="px-5 pb-8 pt-1">
                <AnimatePresence mode="wait">
                  {/* Step 1: Choose type */}
                  {fabStep === 'type' && (
                    <motion.div
                      key="type"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setFabType('expense'); setFabStep('category'); }}
                        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-destructive/8 border-2 border-destructive/15 active:border-destructive/30 transition-all"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center">
                          <Wallet size={24} className="text-destructive" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-foreground">Expense</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Track spending</p>
                        </div>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setFabType('income'); setFabStep('amount'); }}
                        className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-emerald-500/8 border-2 border-emerald-500/15 active:border-emerald-500/30 transition-all"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                          <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-sm text-foreground">Income</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Add earnings</p>
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 2: Pick category (expense only) */}
                  {fabStep === 'category' && (
                    <motion.div
                      key="category"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-3 gap-2"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { setFabCategory(cat.id); setFabStep('amount'); }}
                          className="flex flex-col items-center gap-1.5 py-4 rounded-xl bg-muted/40 border border-border/40 active:bg-muted transition-all"
                        >
                          <span className="text-2xl">{cat.emoji}</span>
                          <span className="text-[11px] font-semibold text-foreground">{cat.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 3: Pick preset amount */}
                  {fabStep === 'amount' && (
                    <motion.div
                      key="amount"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {QUICK_AMOUNTS.map((preset) => (
                          <motion.button
                            key={preset}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFabConfirm(preset)}
                            className="flex items-center justify-center py-4 rounded-xl bg-primary/5 border border-primary/10 active:bg-primary/15 transition-all"
                          >
                            <span className="text-base font-bold text-foreground">R{preset}</span>
                          </motion.button>
                        ))}
                      </div>
                      <button
                        onClick={() => setFabStep('custom')}
                        className="w-full py-3 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground active:bg-muted/50 transition-colors"
                      >
                        Enter custom amount
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3b: Custom amount */}
                  {fabStep === 'custom' && (
                    <motion.form
                      key="custom"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={(e) => { e.preventDefault(); if (Number(fabAmount) > 0) handleFabConfirm(Number(fabAmount)); }}
                      className="flex gap-2"
                    >
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-semibold">R</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          value={fabAmount}
                          onChange={(e) => setFabAmount(e.target.value)}
                          autoFocus
                          className="w-full h-12 pl-8 pr-3 text-xl font-bold rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-12 rounded-xl px-6 text-sm font-bold"
                        disabled={!fabAmount || Number(fabAmount) <= 0}
                      >
                        <Check size={18} className="mr-1.5" />
                        Add
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
            onClick={() => setShowMore(false)}
          >
            <motion.div
              initial={{ translateY: '100%' }}
              animate={{ translateY: '0%' }}
              exit={{ translateY: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[75vh] overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-3" />

              <div className="flex items-center justify-between px-5 pt-3 pb-1">
                <h3 className="font-bold text-base text-foreground">More</h3>
                <button 
                  onClick={() => setShowMore(false)} 
                  className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center active:bg-muted"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              
              {/* Finance Section */}
              <div className="px-4 pb-3 pt-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">💰 Finance</p>
                <div className="space-y-1">
                  {FINANCE_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setShowMore(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all active:scale-[0.98] ${
                          isActive(item.path)
                            ? 'bg-primary/10 ring-1 ring-primary/20'
                            : 'hover:bg-muted/60 active:bg-muted'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${isActive(item.path) ? 'bg-primary/15' : item.bg} flex items-center justify-center flex-shrink-0`}>
                          <item.icon size={20} className={isActive(item.path) ? 'text-primary' : item.color} />
                        </div>
                        <span className={`text-sm font-semibold ${isActive(item.path) ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                        {isActive(item.path) && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 h-px bg-border/60" />

              {/* Social Section */}
              <div className="px-4 pb-8 pt-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">🌍 Social & Tools</p>
                <div className="grid grid-cols-3 gap-2">
                  {SOCIAL_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.03 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setShowMore(false)}
                        className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all active:scale-95 ${
                          isActive(item.path) 
                            ? 'bg-primary/10 ring-1 ring-primary/20' 
                            : 'bg-muted/30 hover:bg-muted/60 active:bg-muted'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${isActive(item.path) ? 'bg-primary/15' : item.bg} flex items-center justify-center mb-1.5`}>
                          <item.icon size={18} className={isActive(item.path) ? 'text-primary' : item.color} />
                        </div>
                        <span className={`text-[11px] font-semibold leading-tight text-center ${isActive(item.path) ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav data-tutorial="tutorial-bottom-nav" className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
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
