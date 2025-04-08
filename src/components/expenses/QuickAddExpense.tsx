
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import { toast } from 'sonner';
import { getCategoryEmoji } from '@/utils/formatters';

interface QuickAddExpenseProps {
  onComplete?: () => void;
}

const QuickAddExpense: React.FC<QuickAddExpenseProps> = ({ onComplete }) => {
  const { addExpense } = useBudget();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  
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
      category: category as any,
      date: today
    });
    
    toast.success("Expense added successfully!");
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategory('other');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const categoryOptions = [
    { value: 'rent', label: 'Rent' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'education', label: 'Education' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-lg mr-2">
          <Plus size={16} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Quick Add Expense</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-20 shrink-0 bg-gray-50 dark:bg-gray-700/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">{getCategoryEmoji(option.value)}</span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input 
            placeholder="What did you spend on?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-grow"
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
              className="pl-7"
            />
          </div>
          
          <Button 
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Check size={16} className="mr-1" /> Add
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddExpense;
