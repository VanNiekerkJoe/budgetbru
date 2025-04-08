
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type BudgetContextType = {
  totalBudget: number;
  remainingBudget: number;
  expenses: Expense[];
  income: Income[];
  savings: Saving[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  addSaving: (saving: Omit<Saving, 'id'>) => void;
  deleteExpense: (id: number) => void;
  deleteIncome: (id: number) => void;
  deleteSaving: (id: number) => void;
};

export type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  date?: Date;
};

export type Income = {
  id: number;
  amount: number;
  source: string;
  description: string;
  date?: Date;
};

export type Saving = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  iconName?: string;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

type BudgetProviderProps = {
  children: ReactNode;
};

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  // Sample data
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, amount: 350, category: 'food', description: 'Groceries' },
    { id: 2, amount: 150, category: 'entertainment', description: 'Movies' },
    { id: 3, amount: 200, category: 'education', description: 'Books' },
    { id: 4, amount: 80, category: 'transport', description: 'Bus fare' },
    { id: 5, amount: 120, category: 'utilities', description: 'Electricity' },
  ]);

  const [income, setIncome] = useState<Income[]>([
    { id: 1, amount: 2000, source: 'part-time', description: 'Part-time job' },
    { id: 2, amount: 500, source: 'allowance', description: 'Monthly allowance from parents' },
  ]);

  const [savings, setSavings] = useState<Saving[]>([
    { 
      id: 1, 
      name: 'New Laptop', 
      targetAmount: 1200, 
      currentAmount: 400, 
      deadline: new Date('2023-12-01'),
      iconName: 'laptop',
    },
    { 
      id: 2, 
      name: 'Spring Break Trip', 
      targetAmount: 500, 
      currentAmount: 250,
      deadline: new Date('2023-10-15'),
      iconName: 'palmtree',
    },
  ]);

  // Calculate totals
  const totalBudget = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;

  // Add functions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const id = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    setExpenses([...expenses, { ...expense, id }]);
  };

  const addIncome = (incomeItem: Omit<Income, 'id'>) => {
    const id = income.length > 0 ? Math.max(...income.map(i => i.id)) + 1 : 1;
    setIncome([...income, { ...incomeItem, id }]);
  };

  const addSaving = (saving: Omit<Saving, 'id'>) => {
    const id = savings.length > 0 ? Math.max(...savings.map(s => s.id)) + 1 : 1;
    setSavings([...savings, { ...saving, id }]);
  };

  // Delete functions
  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const deleteIncome = (id: number) => {
    setIncome(income.filter(inc => inc.id !== id));
  };

  const deleteSaving = (id: number) => {
    setSavings(savings.filter(saving => saving.id !== id));
  };

  return (
    <BudgetContext.Provider
      value={{
        totalBudget,
        remainingBudget,
        expenses,
        income,
        savings,
        addExpense,
        addIncome,
        addSaving,
        deleteExpense,
        deleteIncome,
        deleteSaving,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
