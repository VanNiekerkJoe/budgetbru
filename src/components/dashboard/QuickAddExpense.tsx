
import React, { useState } from 'react';
import { useBudget, ExpenseCategory } from '@/contexts/BudgetContext';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QuickAddExpense: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const { addExpense } = useBudget();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    addExpense({
      amount: Number(amount),
      description: description || 'Quick add expense',
      category,
      date: new Date().toISOString().split('T')[0],
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('other');
    setShowForm(false);
  };
  
  const quickPresets = [
    { amount: 60, desc: "2 Beers", category: "entertainment" },
    { amount: 35, desc: "Uber ride", category: "transport" },
    { amount: 50, desc: "Lunch", category: "groceries" },
    { amount: 20, desc: "Coffee", category: "groceries" },
  ];
  
  const handleQuickAdd = (preset: { amount: number, desc: string, category: ExpenseCategory }) => {
    addExpense({
      amount: preset.amount,
      description: preset.desc,
      category: preset.category as ExpenseCategory,
      date: new Date().toISOString().split('T')[0],
    });
    
    toast.success(`Added R${preset.amount} for ${preset.desc}`);
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-budgetbru-dark">Quick Add</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-budgetbru-purple border-budgetbru-purple"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} className="mr-1" />
          {showForm ? "Cancel" : "Add"}
        </Button>
      </div>
      
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="amount" className="text-sm font-medium mb-1 block">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label htmlFor="category" className="text-sm font-medium mb-1 block">Category</label>
              <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium mb-1 block">Description</label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full bg-budgetbru-purple hover:bg-budgetbru-purple/90">
            Add Expense
          </Button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {quickPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleQuickAdd({ ...preset, category: preset.category as ExpenseCategory })}
              className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-left transition-colors"
            >
              <p className="font-medium text-budgetbru-dark">R{preset.amount}</p>
              <p className="text-xs text-gray-600">{preset.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickAddExpense;
