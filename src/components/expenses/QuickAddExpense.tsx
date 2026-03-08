import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, ArrowLeft, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import { toast } from 'sonner';
import { getCategoryEmoji } from '@/utils/formatters';
import { ExpenseCategory } from '@/contexts/BudgetContext';

interface QuickAddExpenseProps {
  onComplete?: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'rent', label: 'Rent', emoji: '🏠' },
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'entertainment', label: 'Fun', emoji: '🎬' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'other', label: 'Other', emoji: '📌' }
];

const QuickAddExpense: React.FC<QuickAddExpenseProps> = ({ onComplete }) => {
  const { addExpense } = useBudget();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [step, setStep] = useState<'category' | 'details'>('category');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please fill all fields with valid values");
      return;
    }
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    });
    toast.success(`${getCategoryEmoji(category)} Expense added!`);
    setDescription('');
    setAmount('');
    setCategory('other');
    setStep('category');
    onComplete?.();
  };

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-border p-4 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-destructive" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Quick Add</h3>
        </div>

        <AnimatePresence mode="wait">
          {step === 'category' ? (
            <motion.div
              key="cats"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-1.5"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setCategory(opt.value as ExpenseCategory); setStep('details'); }}
                  className="flex flex-col items-center p-2.5 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{opt.label}</span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-2.5"
            >
              <div className="flex items-center gap-2 mb-1">
                <button type="button" onClick={() => setStep('category')} className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors">
                  <ArrowLeft size={14} className="text-muted-foreground" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{getCategoryEmoji(category)}</span>
                  <span className="text-sm font-medium text-foreground capitalize">{category}</span>
                </div>
              </div>

              <Input
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50 border-border h-9 text-sm"
                autoFocus
              />

              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 bg-background/50 border-border h-9 text-sm"
                  />
                </div>
                <Button type="submit" size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 px-4">
                  <Check size={14} className="mr-1" /> Add
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickAddExpense;
