
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickExpenseTrackerProps {
  onAddExpense: (description: string, amount: number, category: string) => void;
}

const QUICK_EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'education', label: 'Study', emoji: '📚' },
  { id: 'entertainment', label: 'Fun', emoji: '🎬' },
  { id: 'utilities', label: 'Bills', emoji: '💡' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒' },
];

const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

export function QuickExpenseTracker({ onAddExpense }: QuickExpenseTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);

  const handleConfirm = (finalAmount?: number) => {
    const val = finalAmount || Number(amount);
    if (selectedCategory && val > 0) {
      const cat = QUICK_EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);
      onAddExpense(cat?.label || selectedCategory, val, selectedCategory);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setAmount('');
    setCustomAmount(false);
  };

  const goBack = () => {
    if (customAmount) {
      setCustomAmount(false);
      setAmount('');
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const selectedCat = QUICK_EXPENSE_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={goBack}
              className="w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center active:bg-muted transition-colors"
            >
              <ChevronLeft size={14} className="text-muted-foreground" />
            </motion.button>
          )}
          <h3 className="text-xs font-semibold text-card-foreground">
            {!selectedCategory
              ? 'Quick Add'
              : customAmount
                ? `${selectedCat?.emoji} Custom Amount`
                : `${selectedCat?.emoji} ${selectedCat?.label} — How much?`}
          </h3>
        </div>
        {selectedCategory && !customAmount && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={() => setCustomAmount(true)}
            className="text-[10px] font-medium text-primary active:text-primary/70 transition-colors"
          >
            Custom
          </motion.button>
        )}
      </div>

      <div className="px-3 pb-3 pt-1">
        <AnimatePresence mode="wait">
          {/* Step 1: Pick category */}
          {!selectedCategory && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-2"
            >
              {QUICK_EXPENSE_CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl bg-muted/40 border border-border/30 active:bg-muted transition-all"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="text-xl">{category.emoji}</span>
                  <span className="text-[11px] font-medium text-foreground">{category.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 2: Pick amount (preset grid) */}
          {selectedCategory && !customAmount && (
            <motion.div
              key="amounts"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-2"
            >
              {QUICK_AMOUNTS.map((preset) => (
                <motion.button
                  key={preset}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center py-3 rounded-xl bg-primary/5 border border-primary/10 active:bg-primary/15 transition-all"
                  onClick={() => handleConfirm(preset)}
                >
                  <span className="text-sm font-bold text-foreground">R{preset}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Step 2b: Custom amount input */}
          {selectedCategory && customAmount && (
            <motion.form
              key="custom"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">R</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  className="w-full h-11 pl-7 pr-3 text-lg font-bold rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-11 rounded-xl px-5 text-sm font-semibold"
                disabled={!amount || Number(amount) <= 0}
              >
                <Check size={16} className="mr-1" />
                Add
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
