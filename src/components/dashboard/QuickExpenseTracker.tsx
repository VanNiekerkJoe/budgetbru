
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickExpenseTrackerProps {
  onAddExpense: (description: string, amount: number, category: string) => void;
}

const QUICK_EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍔', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
  { id: 'transport', label: 'Transport', emoji: '🚗', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  { id: 'education', label: 'Study', emoji: '📚', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300' },
  { id: 'entertainment', label: 'Fun', emoji: '🎬', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' },
  { id: 'utilities', label: 'Utils', emoji: '💡', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' },
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

  const createQuickExpense = (label: string, amount: number, category: string) => {
    onAddExpense(label, amount, category);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md overflow-hidden"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Clock size={16} className="mr-2" />
          Quick Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        {!isAdding ? (
          <>
            <div className="grid grid-cols-5 gap-1">
              {QUICK_EXPENSE_CATEGORIES.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer ${category.color}`}
                  onClick={() => createQuickExpense(category.label, 20, category.id)}
                >
                  <div className="text-lg">{category.emoji}</div>
                  <div className="text-xs mt-1">{category.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => createQuickExpense("Coffee", 15, "food")}
              >
                <span>☕ Coffee R15</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => createQuickExpense("Lunch", 45, "food")}
              >
                <span>🥪 Lunch R45</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => setIsAdding(true)}
              >
                <span className="flex items-center">
                  <Plus size={14} className="mr-1" />
                  Custom
                </span>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input 
                  placeholder="Description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="text-sm"
                />
              </div>
              <div className="w-24">
                <Input 
                  placeholder="Amount" 
                  type="number"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-1">
              {QUICK_EXPENSE_CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-1 rounded-md flex flex-col items-center ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-theme-pink ring-opacity-50 ' + category.color
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-sm">{category.emoji}</div>
                  <div className="text-xs">{category.label}</div>
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetForm}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddExpense}
                className="text-xs h-8"
                disabled={!description || !amount}
              >
                <Check size={14} className="mr-1" />
                Add
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </motion.div>
  );
}
