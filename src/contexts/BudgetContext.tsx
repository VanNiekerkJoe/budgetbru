import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { createNotification } from '@/services/notificationService';

export type ExpenseCategory = 'food' | 'entertainment' | 'education' | 'transport' | 'utilities' | 'rent' | 'clothing' | 'health' | 'groceries' | 'other';

export type SavingsGoal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: 'short' | 'medium' | 'long';
  iconName?: string;
};

export type EmergencyFund = {
  targetAmount: number;
  currentAmount: number;
  lastUpdate?: string;
  monthlyContribution: number;
};

export type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO string
};

export type Income = {
  id: number;
  amount: number;
  source: string;
  description?: string;
  date: string; // ISO string
  recurring?: boolean;
  frequency?: string;
};

export type Saving = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  iconName?: string;
};

type BudgetContextType = {
  totalBudget: number;
  remainingBudget: number;
  expenses: Expense[];
  income: Income[];
  savings: Saving[];
  savingsGoals: SavingsGoal[];
  totalIncome: number;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  emergencyFund: EmergencyFund;
  incomes: Income[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  addSaving: (saving: Omit<Saving, 'id'>) => void;
  deleteExpense: (id: number) => void;
  deleteIncome: (id: number) => void;
  deleteSaving: (id: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: number, amount: number) => void;
  setEmergencyFund: (fund: EmergencyFund) => void;
  updateEmergencyFund: (amount: number) => void;
  // New helpers for insights
  getExpensesForMonth: (year: number, month: number) => Expense[];
  getIncomeForMonth: (year: number, month: number) => Income[];
  getExpensesForDateRange: (start: Date, end: Date) => Expense[];
  currentMonthExpenses: Expense[];
  currentMonthIncome: Income[];
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

// ─── localStorage helpers ───
const STORAGE_KEYS = {
  expenses: 'bb_expenses',
  income: 'bb_income',
  savings: 'bb_savings',
  savingsGoals: 'bb_savingsGoals',
  emergencyFund: 'bb_emergencyFund',
};

const RESET_VERSION_KEY = 'bb_reset_v4';
const LEGACY_BUDGET_KEYS = [
  'expenses',
  'income',
  'savings',
  'savingsGoals',
  'emergencyFund',
  'budget_expenses',
  'budget_income',
  'budget_savings',
  'budget_savingsGoals',
  'budget_emergencyFund',
];

const DEFAULT_EMERGENCY_FUND: EmergencyFund = {
  targetAmount: 10000,
  currentAmount: 0,
  lastUpdate: new Date().toISOString(),
  monthlyContribution: 0,
};

const isBrowser = typeof window !== 'undefined';

const clearAllBudgetStorage = () => {
  if (!isBrowser) return;

  const exactKeys = new Set([...Object.values(STORAGE_KEYS), ...LEGACY_BUDGET_KEYS]);
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('bb_') || exactKeys.has(key)) {
      localStorage.removeItem(key);
    }
  });
};

const shouldForceResetBudget = (() => {
  if (!isBrowser) return false;
  if (localStorage.getItem(RESET_VERSION_KEY)) return false;

  clearAllBudgetStorage();
  localStorage.setItem(RESET_VERSION_KEY, '1');
  return true;
})();

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full — silently fail
  }
}

type BudgetProviderProps = { children: ReactNode };

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    shouldForceResetBudget ? [] : loadFromStorage(STORAGE_KEYS.expenses, [])
  );

  const [income, setIncome] = useState<Income[]>(() =>
    shouldForceResetBudget ? [] : loadFromStorage(STORAGE_KEYS.income, [])
  );

  const [savings, setSavings] = useState<Saving[]>(() =>
    shouldForceResetBudget ? [] : loadFromStorage(STORAGE_KEYS.savings, [])
  );

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() =>
    shouldForceResetBudget ? [] : loadFromStorage(STORAGE_KEYS.savingsGoals, [])
  );

  const [emergencyFund, setEmergencyFundState] = useState<EmergencyFund>(() =>
    shouldForceResetBudget
      ? DEFAULT_EMERGENCY_FUND
      : loadFromStorage(STORAGE_KEYS.emergencyFund, DEFAULT_EMERGENCY_FUND)
  );

  useEffect(() => {
    if (!shouldForceResetBudget) return;

    setExpenses([]);
    setIncome([]);
    setSavings([]);
    setSavingsGoals([]);
    setEmergencyFundState(DEFAULT_EMERGENCY_FUND);
  }, []);

  // Persist on changes
  useEffect(() => { saveToStorage(STORAGE_KEYS.expenses, expenses); }, [expenses]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.income, income); }, [income]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.savings, savings); }, [savings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.savingsGoals, savingsGoals); }, [savingsGoals]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.emergencyFund, emergencyFund); }, [emergencyFund]);

  // ─── Current month helpers ───
  const now = new Date();
  const currentMonthExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
    [expenses]
  );

  const currentMonthIncome = useMemo(() =>
    income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
    [income]
  );

  const totalIncome = useMemo(() => currentMonthIncome.reduce((s, i) => s + i.amount, 0), [currentMonthIncome]);
  const totalExpenses = useMemo(() => currentMonthExpenses.reduce((s, e) => s + e.amount, 0), [currentMonthExpenses]);
  const remainingBudget = totalIncome - totalExpenses;
  const totalBudget = totalIncome;

  const expensesByCategory = useMemo(() =>
    currentMonthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>),
    [currentMonthExpenses]
  );

  const getExpensesForMonth = useCallback((year: number, month: number) =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }),
    [expenses]
  );

  const getIncomeForMonth = useCallback((year: number, month: number) =>
    income.filter(i => {
      const d = new Date(i.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }),
    [income]
  );

  const getExpensesForDateRange = useCallback((start: Date, end: Date) =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    }),
    [expenses]
  );

  // ─── Mutations ───
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => {
      const id = prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 1;
      const newExp = { ...expense, id, date: expense.date || new Date().toISOString() };
      return [newExp, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    // Create notification for the expense
    const amount = expense.amount;
    if (amount >= 500) {
      createNotification({
        type: 'finance',
        title: 'Large expense detected',
        description: `R${amount} spent on ${expense.category} — "${expense.description}"`,
        icon_type: 'expense',
      });
    } else {
      createNotification({
        type: 'finance',
        title: 'Expense added',
        description: `R${amount} for ${expense.description}`,
        icon_type: 'expense',
      });
    }

    // Check if approaching budget limit
    const newTotal = totalExpenses + amount;
    if (totalIncome > 0 && newTotal / totalIncome >= 0.9) {
      createNotification({
        type: 'alerts',
        title: 'Budget limit approaching!',
        description: `You've spent ${Math.round((newTotal / totalIncome) * 100)}% of your income this month.`,
        icon_type: 'alert',
      });
    }
  };

  const addIncome = (incomeItem: Omit<Income, 'id'>) => {
    setIncome(prev => {
      const id = prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1;
      const newInc = { ...incomeItem, id, date: incomeItem.date || new Date().toISOString(), description: incomeItem.description || incomeItem.source };
      return [newInc, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    createNotification({
      type: 'finance',
      title: 'Income received',
      description: `R${incomeItem.amount} from ${incomeItem.source}`,
      icon_type: 'income',
    });
  };

  const addSaving = (saving: Omit<Saving, 'id'>) => {
    const id = savings.length > 0 ? Math.max(...savings.map(s => s.id)) + 1 : 1;
    setSavings(prev => [...prev, { ...saving, id }]);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const id = savingsGoals.length > 0 ? Math.max(...savingsGoals.map(g => g.id)) + 1 : 1;
    setSavingsGoals(prev => [...prev, { ...goal, id }]);
  };

  const updateSavingsGoal = (id: number, amount: number) => {
    setSavingsGoals(prev => {
      const updated = prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g);
      const goal = updated.find(g => g.id === id);
      if (goal && goal.currentAmount >= goal.targetAmount) {
        createNotification({
          type: 'goals',
          title: 'Savings goal reached! 🎉',
          description: `You've reached your "${goal.name}" goal of R${goal.targetAmount}!`,
          icon_type: 'achievement',
        });
      } else if (goal) {
        const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
        if (pct >= 50 && pct - Math.round(((goal.currentAmount - amount) / goal.targetAmount) * 100) < 50) {
          createNotification({
            type: 'goals',
            title: 'Savings goal halfway there!',
            description: `You're ${pct}% towards "${goal.name}". Keep going!`,
            icon_type: 'goal',
          });
        }
      }
      return updated;
    });
  };

  const setEmergencyFund = (fund: EmergencyFund) => setEmergencyFundState(fund);

  const updateEmergencyFund = (amount: number) => {
    setEmergencyFundState(prev => ({ ...prev, currentAmount: prev.currentAmount + amount, lastUpdate: new Date().toISOString() }));
  };

  const deleteExpense = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id));
  const deleteIncome = (id: number) => setIncome(prev => prev.filter(i => i.id !== id));
  const deleteSaving = (id: number) => setSavings(prev => prev.filter(s => s.id !== id));

  return (
    <BudgetContext.Provider
      value={{
        totalBudget, remainingBudget, expenses, income, savings, savingsGoals,
        totalIncome, totalExpenses, expensesByCategory, emergencyFund,
        incomes: income,
        addExpense, addIncome, addSaving, deleteExpense, deleteIncome, deleteSaving,
        addSavingsGoal, updateSavingsGoal, setEmergencyFund, updateEmergencyFund,
        getExpensesForMonth, getIncomeForMonth, getExpensesForDateRange,
        currentMonthExpenses, currentMonthIncome,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
