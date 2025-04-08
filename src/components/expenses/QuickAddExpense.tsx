
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check } from 'lucide-react';
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
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
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
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<'category' | 'details'>('category');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please fill all fields with valid values");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    addExpense({
      description,
      amount: parseFloat(amount),
      category: category,
      date: today
    });
    
    toast.success("Expense added successfully!");
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('other');
    setShowForm(false);
    setStep('category');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  // Handle category selection
  const selectCategory = (selectedCategory: ExpenseCategory) => {
    setCategory(selectedCategory);
    setStep('details');
  };
  
  const handleBack = () => {
    setStep('category');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md p-4 border border-white/20 relative overflow-hidden"
    >
      {/* Background lighting effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-lg mr-2">
            <Plus size={16} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Quick Add Expense</h3>
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'category' ? (
            <motion.div
              key="categoryGrid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-2"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectCategory(option.value as ExpenseCategory)}
                  className="flex flex-col items-center justify-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{option.label}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.form 
              key="detailsForm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 flex-shrink-0 bg-white/70 dark:bg-gray-800/70 rounded-full flex items-center justify-center text-lg">
                  {getCategoryEmoji(category)}
                </div>
                <span className="font-medium capitalize">{category}</span>
              </div>
              
              <div>
                <Input 
                  placeholder="What did you spend on?" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">R</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7 bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Check size={16} className="mr-1" /> Add
                </Button>
              </div>
              
              <Button 
                type="button"
                variant="ghost" 
                className="mt-2 w-full text-sm"
                onClick={handleBack}
              >
                Back
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuickAddExpense;
