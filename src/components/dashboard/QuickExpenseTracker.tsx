
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Check, Zap } from 'lucide-react';
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

const QUICK_PRESETS = [
  { label: '☕ Coffee', amount: 15, category: 'food' },
  { label: '🥪 Lunch', amount: 45, category: 'food' },
  { label: '🚕 Uber', amount: 35, category: 'transport' },
];

export function QuickExpenseTracker({ onAddExpense }: QuickExpenseTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(QUICK_EXPENSE_CATEGORIES[0].id);
  
  const handleAddExpense = () => {
    if (description.trim() && Number(amount) > 0) {
      onAddExpense(description, Number(amount), selectedCategory);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setIsAdding(false);
    setDescription('');
    setAmount('');
    setSelectedCategory(QUICK_EXPENSE_CATEGORIES[0].id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-2xl shadow-md border border-border/50 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap size={14} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-card-foreground">Quick Add</h3>
      </div>
      
      <div className="px-4 pb-4 space-y-3">
        {!isAdding ? (
          <>
            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_EXPENSE_CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap ${category.color} transition-all`}
                  onClick={() => onAddExpense(category.label, 20, category.id)}
                >
                  <span>{category.emoji}</span>
                  <span>{category.label}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Quick presets */}
            <div className="flex gap-2">
              {QUICK_PRESETS.map((preset) => (
                <motion.button
                  key={preset.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-muted hover:bg-muted/70 rounded-xl py-2.5 px-3 text-xs font-medium text-foreground transition-colors"
                  onClick={() => onAddExpense(preset.label.split(' ')[1], preset.amount, preset.category)}
                >
                  {preset.label} R{preset.amount}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1 bg-primary/10 text-primary rounded-xl py-2.5 px-3 text-xs font-medium transition-colors hover:bg-primary/15"
                onClick={() => setIsAdding(true)}
              >
                <Plus size={13} />
                Custom
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <Input 
                placeholder="What did you spend on?" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="text-sm rounded-xl"
                autoFocus
              />
              <Input 
                placeholder="R0" 
                type="number"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="text-sm w-24 rounded-xl"
              />
            </div>
            
            <div className="flex gap-1.5">
              {QUICK_EXPENSE_CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  whileTap={{ scale: 0.93 }}
                  className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5 text-xs transition-all ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-primary/50 ' + category.color
                      : 'bg-muted text-muted-foreground'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.emoji}</span>
                  <span className="text-[10px]">{category.label}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={resetForm} className="text-xs h-8 rounded-lg">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddExpense} className="text-xs h-8 rounded-lg" disabled={!description || !amount}>
                <Check size={14} className="mr-1" />
                Add Expense
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
