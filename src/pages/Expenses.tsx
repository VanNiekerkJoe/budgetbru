
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import EnhancedNavBar from '@/components/EnhancedNavBar';
import { formatCurrency, formatDate, getCategoryEmoji } from '@/utils/formatters';
import { BadgeGlow } from '@/components/ui/badge-glow';
import { Plus, Filter, Wallet, ArrowDownCircle, TrendingDown, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ParticleBackground from '@/components/ParticleBackground';
import MascotHelper from '@/components/MascotHelper';
import { toast } from 'sonner';

const Expenses: React.FC = () => {
  const { expenses, totalExpenses, addExpense } = useBudget();
  const [showAddModal, setShowAddModal] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Sort expenses by date (newest first)
  const filteredExpenses = expenses
    .filter(expense => !expenseFilter || expense.category === expenseFilter)
    .filter(expense => !searchTerm || expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  
  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
      toast.error("Please fill all fields with valid values");
      return;
    }
    
    addExpense({
      amount: Number(newExpense.amount),
      category: newExpense.category as any,
      description: newExpense.description,
      date: newExpense.date
    });
    
    setNewExpense({
      amount: '',
      category: 'other',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowAddModal(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get mascot message based on expenses
  const getMascotMessage = () => {
    if (expenses.length === 0) return "Start tracking your expenses to stay on budget!";
    if (biggestCategory && biggestCategory[0]) {
      return `Your highest spending is on ${biggestCategory[0]}. Maybe look for savings there?`;
    }
    return "Keep tracking your expenses to better understand your spending habits!";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-theme-navy pb-28">
      <ParticleBackground count={20} className="opacity-20" />
      
      <header className="bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-6 px-4 relative overflow-hidden">
        <motion.div 
          className="absolute -top-10 left-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container mx-auto max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-3"
          >
            <BadgeGlow glowColor="rgba(239, 68, 68, 0.5)">
              <div className="flex items-center bg-red-500 text-white px-3 py-1.5 rounded-full">
                <Wallet className="mr-2" size={18} />
                <span className="font-semibold">Expenses Tracker</span>
              </div>
            </BadgeGlow>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
            
            <div>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                New Expense
              </Button>
            </div>
          </motion.div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        <MascotHelper type="expenses" message={getMascotMessage()} />
        
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={expenseFilter || 'all'} onValueChange={(value) => setExpenseFilter(value === 'all' ? null : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {filteredExpenses.length > 0 ? (
            <motion.div 
              key="expense-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden"
            >
              <div className="divide-y dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <motion.div 
                    key={expense.id} 
                    variants={itemVariants}
                    className="p-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-lg mr-3"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {getCategoryEmoji(expense.category)}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-medium">{expense.description}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(expense.date)} • {expense.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600 dark:text-red-400 flex items-center">
                        <ArrowDownCircle size={12} className="mr-1" />
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="no-expenses"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 shadow-md text-center"
            >
              <TrendingDown size={40} className="mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No Expenses Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || expenseFilter 
                  ? "Try changing your filters to see more results" 
                  : "Add expenses to track your spending"}
              </p>
              {(searchTerm || expenseFilter) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setExpenseFilter(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                placeholder="What did you spend on?"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Amount (R)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleAddExpense}
              >
                Add Expense
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <EnhancedNavBar />
    </div>
  );
};

export default Expenses;
