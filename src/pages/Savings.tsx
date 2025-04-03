
import React, { useState } from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import NavBar from '@/components/NavBar';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

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
      deadline: deadline || undefined,
    });
    
    // Reset form
    setName('');
    setTargetAmount('');
    setInitialAmount('');
    setCategory('short');
    setDeadline('');
    setIsOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <header className="bg-budgetbru-dark text-white py-4 px-4 shadow-md">
        <h1 className="text-xl font-bold">Savings Goals</h1>
        <p className="text-sm opacity-90">
          Saved: {totalSaved.toLocaleString()} / {totalTarget.toLocaleString()} ZAR
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-budgetbru-purple hover:bg-budgetbru-purple/90">
                <Plus size={16} className="mr-1" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                      className="pl-8"
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
                      className="pl-8"
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short-term (< 3 months)</SelectItem>
                      <SelectItem value="medium">Medium-term (3-12 months)</SelectItem>
                      <SelectItem value="long">Long-term (> 12 months)</SelectItem>
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
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="bg-budgetbru-purple hover:bg-budgetbru-purple/90">
                    Create Goal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <SavingsGoalsList />
      </main>
      
      <NavBar />
    </div>
  );
};

export default Savings;
