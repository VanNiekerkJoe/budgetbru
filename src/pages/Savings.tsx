
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';

import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog, DialogTrigger } from '@/components/ui/dialog';
import { BadgeGlow } from '@/components/ui/badge-glow';
import { Plus, PiggyBank, Sparkles, Award, TrendingUp } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import MascotHelper from '@/components/MascotHelper';

const Savings: React.FC = () => {
  const { savingsGoals, addSavingsGoal } = useBudget();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [category, setCategory] = useState<'short' | 'medium' | 'long'>('short');
  const [deadline, setDeadline] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const totalSaved = savingsGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((total, goal) => total + goal.targetAmount, 0);
  const savingsProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      return;
    }
    
    addSavingsGoal({
      name,
      targetAmount: Number(targetAmount),
      currentAmount: initialAmount ? Number(initialAmount) : 0,
      category,
      deadline: deadline || undefined, // This now matches our updated type
    });
    
    // Reset form
    setName('');
    setTargetAmount('');
    setInitialAmount('');
    setCategory('short');
    setDeadline('');
    setIsOpen(false);
  };

  // Get mascot message based on savings progress
  const getMascotMessage = () => {
    if (savingsProgress >= 75) return "You're crushing your savings goals! Keep it up!";
    if (savingsProgress >= 50) return "You're halfway to all your goals! Amazing progress!";
    if (savingsProgress >= 25) return "Good start on saving! Keep the momentum going!";
    if (savingsProgress > 0) return "Every rand saved is a step towards your goals!";
    return "Start your savings journey today!";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-theme-navy dark:to-theme-indigo/80 pb-28">
      <ParticleBackground count={30} className="opacity-30" />
      
      <header className="bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-6 px-4 relative overflow-hidden">
        <motion.div 
          className="absolute -top-10 right-0 w-32 h-32 bg-gradient-to-br from-theme-pink/20 to-theme-indigo/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
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
            className="flex items-center justify-center mb-2"
          >
            <BadgeGlow glowColor="rgba(202, 82, 154, 0.5)">
              <div className="flex items-center bg-theme-pink text-white px-3 py-1.5 rounded-full">
                <PiggyBank className="mr-2" size={18} />
                <span className="font-semibold">Savings Goals</span>
              </div>
            </BadgeGlow>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-white dark:bg-gray-800/60 backdrop-blur-md p-3 rounded-lg shadow-md w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-300">Total Progress</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    R{totalSaved.toLocaleString()} / R{totalTarget.toLocaleString()}
                  </span>
                  {savingsProgress >= 50 && (
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Sparkles size={16} className="text-yellow-400" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-theme-pink to-theme-indigo"
                  style={{ width: `${savingsProgress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${savingsProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              
              <div className="mt-2 text-xs text-right">
                <span className={`font-medium ${savingsProgress > 70 ? 'text-green-500' : savingsProgress > 30 ? 'text-yellow-500' : 'text-theme-pink'}`}>
                  {savingsProgress.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Award size={18} className="text-theme-pink mr-1" />
            <h2 className="text-lg font-medium">Your Goals</h2>
          </motion.div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-theme-pink hover:bg-theme-pink/90 text-white"
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Savings Goal</DialogTitle>
                <DialogDescription>
                  Set a new goal to help you save for something special.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">
                    Goal Name
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Rage 2026, New laptop"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="focus-ring"
                  />
                </div>
                
                <div>
                  <label htmlFor="targetAmount" className="text-sm font-medium mb-1 block">
                    Target Amount (ZAR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="0"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="pl-8 focus-ring"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="initialAmount" className="text-sm font-medium mb-1 block">
                    Initial Amount (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                    <Input
                      id="initialAmount"
                      type="number"
                      placeholder="0"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="pl-8 focus-ring"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="text-sm font-medium mb-1 block">
                    Goal Type
                  </label>
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as 'short' | 'medium' | 'long')}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (&lt; 3 months)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-12 months)</SelectItem>
                      <SelectItem value="long">Long-term (&gt; 12 months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="deadline" className="text-sm font-medium mb-1 block">
                    Target Date (optional)
                  </label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="focus-ring"
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-theme-pink hover:bg-theme-pink/90 text-white">
                    <TrendingUp size={16} className="mr-1" />
                    Create Goal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <MascotHelper type="savings" message={getMascotMessage()} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key="savings-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SavingsGoalsList />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <EnhancedNavBar />
    </div>
  );
};

export default Savings;
