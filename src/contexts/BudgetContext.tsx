
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define types for our budget data
export type ExpenseCategory = 
  | 'rent'
  | 'groceries'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'education'
  | 'clothing'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'short' | 'medium' | 'long';
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'once';
}

interface BudgetContextType {
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  incomes: Income[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateSavingsGoal: (id: string, amount: number) => void;
  totalIncome: number;
  totalExpenses: number;
  remainingBudget: number;
  expensesByCategory: Record<ExpenseCategory, number>;
}

// Create the context
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Sample initial data
const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 600,
    category: 'rent',
    description: 'Monthly rent',
    date: '2025-04-01',
  },
  {
    id: '2',
    amount: 150,
    category: 'groceries',
    description: 'Weekly shop',
    date: '2025-04-02',
  },
  {
    id: '3',
    amount: 120,
    category: 'entertainment',
    description: 'Beers with the boys',
    date: '2025-04-01',
  },
  {
    id: '4',
    amount: 50,
    category: 'transport',
    description: 'Uber rides',
    date: '2025-04-01',
  },
];

const initialSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Rage 2026',
    targetAmount: 5000,
    currentAmount: 2000,
    deadline: '2026-12-01',
    category: 'long',
  },
  {
    id: '2',
    name: 'New textbooks',
    targetAmount: 800,
    currentAmount: 250,
    deadline: '2025-06-15',
    category: 'short',
  },
];

const initialIncomes: Income[] = [
  {
    id: '1',
    amount: 1200,
    source: 'Allowance',
    date: '2025-04-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: '2',
    amount: 400,
    source: 'Part-time job',
    date: '2025-04-01',
    recurring: true,
    frequency: 'weekly',
  },
];

// Provider component
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalIncome - totalExpenses;

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  // Add new expense
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([...expenses, newExpense]);
    toast.success("Expense added successfully!");
  };

  // Add new savings goal
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setSavingsGoals([...savingsGoals, newGoal]);
    toast.success("Savings goal added!");
  };

  // Add new income
  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
    };
    setIncomes([...incomes, newIncome]);
    toast.success("Income added successfully!");
  };

  // Update savings goal
  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(
      savingsGoals.map((goal) => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + amount;
          if (newAmount >= goal.targetAmount) {
            toast.success("🎉 You've reached your savings goal!", {
              description: `Congratulations on saving for ${goal.name}!`,
            });
          }
          return {
            ...goal,
            currentAmount: Math.min(newAmount, goal.targetAmount),
          };
        }
        return goal;
      })
    );
  };

  return (
    <BudgetContext.Provider
      value={{
        expenses,
        savingsGoals,
        incomes,
        addExpense,
        addSavingsGoal,
        addIncome,
        updateSavingsGoal,
        totalIncome,
        totalExpenses,
        remainingBudget,
        expensesByCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook to use the budget context
export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
