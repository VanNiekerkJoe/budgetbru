
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuickExpenseTrackerProps {
  onAddExpense: (description: string, amount: number, category: string) => void;
}

const QUICK_EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍔', color: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300' },
  { id: 'transport', label: 'Transport', emoji: '🚗', color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' },
  { id: 'education', label: 'Study', emoji: '📚', color: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300' },
  { id: 'entertainment', label: 'Fun', emoji: '🎬', color: 'bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300' },
  { id: 'utilities', label: 'Utils', emoji: '💡', color: 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300' },
];

export function QuickExpenseTracker({ onAddExpense }: QuickExpenseTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  
  const handleConfirm = () => {
    if (selectedCategory && Number(amount) > 0) {
      const cat = QUICK_EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);
      onAddExpense(cat?.label || selectedCategory, Number(amount), selectedCategory);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setSelectedCategory(null);
    setAmount('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-1.5">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap size={12} className="text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-card-foreground">Quick Add Expense</h3>
      </div>
      
      <div className="px-3 pb-3">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div 
              key="pick"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-[10px] text-muted-foreground mb-2">Tap a category:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_EXPENSE_CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.93 }}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap ${category.color} transition-all min-w-0`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="amount"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
                >
                  <ChevronLeft size={14} className="text-muted-foreground" />
                </button>
                <span className="text-lg">{QUICK_EXPENSE_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}</span>
                <span className="text-xs font-medium text-foreground">{QUICK_EXPENSE_CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                  <Input 
                    type="number" 
                    placeholder="Amount" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="pl-6 text-sm rounded-xl h-9"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="text-xs h-9 rounded-xl px-4" 
                  disabled={!amount || Number(amount) <= 0}
                >
                  <Check size={14} className="mr-1" />
                  Add
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
