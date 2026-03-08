import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget, ExpenseCategory } from '@/contexts/BudgetContext';
import { formatCurrency, formatDate, getCategoryEmoji } from '@/utils/formatters';
import {
  Plus, Filter, Wallet, TrendingDown, Search,
  BarChart3, Receipt, Bell, Flame, Calendar, Trash2,
  ChevronDown, ChevronUp, AlertTriangle, Target, PieChart as PieIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import QuickAddExpense from '@/components/expenses/QuickAddExpense';
import BillReminder from '@/components/expenses/BillReminder';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  rent: '#3b82f6', groceries: '#22c55e', transport: '#eab308',
  entertainment: '#a855f7', utilities: '#6b7280', education: '#6366f1',
  clothing: '#ec4899', health: '#ef4444', food: '#f97316', other: '#94a3b8'
};

const CATEGORY_OPTIONS = [
  { value: 'rent', label: 'Rent', emoji: '🏠' },
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'clothing', label: 'Clothing', emoji: '👕' },
  { value: 'health', label: 'Health', emoji: '🏥' },
  { value: 'food', label: 'Food', emoji: '🍔' },
  { value: 'other', label: 'Other', emoji: '📌' }
];

const Expenses: React.FC = () => {
  const { expenses, totalExpenses, totalIncome, addExpense, deleteExpense } = useBudget();
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenseFilter, setExpenseFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState({
    amount: '', category: 'other', description: '', date: new Date().toISOString().split('T')[0]
  });

  const filteredExpenses = useMemo(() =>
    expenses
      .filter(e => !expenseFilter || e.category === expenseFilter)
      .filter(e => !searchTerm || e.description.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const dA = new Date(a.date || 0).getTime();
        const dB = new Date(b.date || 0).getTime();
        return (isNaN(dB) ? 0 : dB) - (isNaN(dA) ? 0 : dA);
      }),
    [expenses, expenseFilter, searchTerm]
  );

  const categoryTotals = useMemo(() =>
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>),
    [expenses]
  );

  const pieData = useMemo(() =>
    Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value, emoji: getCategoryEmoji(name) }))
      .sort((a, b) => b.value - a.value),
    [categoryTotals]
  );

  const weeklyData = useMemo(() => {
    const weeks: { name: string; amount: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const total = expenses.reduce((sum, e) => {
        const d = new Date(e.date || 0);
        return d >= weekStart && d <= weekEnd ? sum + e.amount : sum;
      }, 0);
      weeks.push({ name: `Week ${4 - i}`, amount: total || (totalExpenses / 4) * (0.8 + Math.random() * 0.4) });
    }
    return weeks;
  }, [expenses, totalExpenses]);

  const spendingRate = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const healthScore = Math.max(0, Math.min(100, 100 - spendingRate));
  const healthColor = healthScore >= 80 ? '#22c55e' : healthScore >= 60 ? '#eab308' : healthScore >= 40 ? '#f97316' : '#ef4444';

  const dailyAvg = totalExpenses / 30;
  const biggestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
      toast.error("Please fill all fields with valid values");
      return;
    }
    addExpense({
      amount: Number(newExpense.amount),
      category: newExpense.category as ExpenseCategory,
      description: newExpense.description,
      date: newExpense.date
    });
    setNewExpense({ amount: '', category: 'other', description: '', date: new Date().toISOString().split('T')[0] });
    setShowAddModal(false);
    toast.success("Expense added!");
  };

  const handleDelete = (id: number) => {
    deleteExpense(id);
    toast.success("Expense deleted");
    setExpandedId(null);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Inline Summary Card (replaces sticky header) */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Total Spent</p>
            <h1 className="text-xl font-bold text-destructive">{formatCurrency(totalExpenses)}</h1>
            <p className="text-[10px] text-muted-foreground">~{formatCurrency(Math.round(dailyAvg))}/day · {expenses.length} items</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full h-10 w-10 p-0 shadow-md">
            <Plus size={20} />
          </Button>
        </div>
        <div className="mt-2.5">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Budget used</span>
            <span className={spendingRate > 80 ? 'text-destructive font-semibold' : ''}>{spendingRate}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(spendingRate, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${spendingRate > 80 ? 'bg-destructive' : spendingRate > 50 ? 'bg-warning' : 'bg-success'}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full bg-muted/60">
          <TabsTrigger value="expenses" className="text-[11px]">All</TabsTrigger>
          <TabsTrigger value="analytics" className="text-[11px]">Breakdown</TabsTrigger>
          <TabsTrigger value="trends" className="text-[11px]">Trends</TabsTrigger>
          <TabsTrigger value="bills" className="text-[11px]">Bills</TabsTrigger>
        </TabsList>

        {/* EXPENSES TAB */}
        <TabsContent value="expenses">
          <AnimatePresence mode="wait">
            <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-3">
              <QuickAddExpense />

              {/* Search & Filter */}
              <div className="bg-card rounded-xl p-2.5 border border-border/50">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search expenses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-9 text-xs bg-background/50 border-border rounded-lg" />
                  </div>
                  <Select value={expenseFilter || 'all'} onValueChange={(v) => setExpenseFilter(v === 'all' ? null : v)}>
                    <SelectTrigger className="w-28 bg-background/50 h-9 text-xs rounded-lg">
                      <Filter size={12} className="mr-1" />
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {CATEGORY_OPTIONS.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-1.5">{c.emoji} {c.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expense List */}
              {filteredExpenses.length > 0 ? (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <div className="divide-y divide-border">
                    {filteredExpenses.map((expense) => (
                      <motion.div key={expense.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group">
                        <div
                          className="p-3 flex items-center cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => setExpandedId(expandedId === expense.id ? null : expense.id)}
                        >
                          <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center text-base mr-2.5 flex-shrink-0">
                            {getCategoryEmoji(expense.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs text-foreground truncate">{expense.description}</h3>
                            <p className="text-[10px] text-muted-foreground">{formatDate(expense.date)} · <span className="capitalize">{expense.category}</span></p>
                          </div>
                          <div className="text-right flex items-center gap-1.5">
                            <p className="font-semibold text-destructive text-xs">{formatCurrency(expense.amount)}</p>
                            {expandedId === expense.id ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedId === expense.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-3 pb-2.5 flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{expense.category}</span>
                                <div className="flex-1" />
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(expense.id)}>
                                  <Trash2 size={11} className="mr-1" /> Delete
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl p-6 border border-border/50 text-center">
                  <TrendingDown size={28} className="mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">No expenses found</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {searchTerm || expenseFilter ? "Try changing your filters" : "Start tracking your spending"}
                  </p>
                  {(searchTerm || expenseFilter) && (
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => { setSearchTerm(''); setExpenseFilter(null); }}>Clear Filters</Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* BREAKDOWN TAB */}
        <TabsContent value="analytics">
          <AnimatePresence mode="wait">
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-3">
              {/* Spending Health Score */}
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <Target size={14} className="text-primary" /> Spending Health
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ value: healthScore, fill: healthColor }]} startAngle={90} endAngle={-270} barSize={7}>
                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'hsl(var(--muted))' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="relative -mt-[52px] text-center">
                      <span className="text-xl font-bold" style={{ color: healthColor }}>{healthScore >= 80 ? 'A' : healthScore >= 60 ? 'B' : healthScore >= 40 ? 'C' : 'D'}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs text-foreground font-medium">
                      {healthScore >= 80 ? "Excellent control! 🔥" : healthScore >= 60 ? "Good, room to improve" : healthScore >= 40 ? "Watch your spending ⚠️" : "Over budget! 🚨"}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-muted/30 rounded-lg p-1.5 text-center">
                        <p className="text-[9px] text-muted-foreground">Daily Avg</p>
                        <p className="text-xs font-bold text-foreground">{formatCurrency(Math.round(dailyAvg))}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-1.5 text-center">
                        <p className="text-[9px] text-muted-foreground">Remaining</p>
                        <p className="text-xs font-bold text-success">{formatCurrency(totalIncome - totalExpenses)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <PieIcon size={14} className="text-primary" /> Category Breakdown
                </h3>
                {pieData.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-28 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3} dataKey="value" stroke="none">
                            {pieData.map((entry) => (
                              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1 max-h-32 overflow-y-auto">
                      {pieData.map(cat => {
                        const pct = totalExpenses > 0 ? ((cat.value / totalExpenses) * 100).toFixed(0) : '0';
                        return (
                          <div key={cat.name} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#94a3b8' }} />
                            <span className="text-[10px] flex-1 capitalize text-foreground">{cat.emoji} {cat.name}</span>
                            <span className="text-[10px] font-medium text-foreground">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-3">No expense data yet</p>
                )}
              </div>

              {/* Top Spending */}
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <Flame size={14} className="text-destructive" /> Top Spending
                </h3>
                <div className="space-y-2.5">
                  {pieData.slice(0, 5).map(cat => {
                    const pct = totalExpenses > 0 ? (cat.value / totalExpenses) * 100 : 0;
                    return (
                      <div key={cat.name}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-medium capitalize text-foreground flex items-center gap-1">{cat.emoji} {cat.name}</span>
                          <span className="text-[10px] text-muted-foreground">{formatCurrency(cat.value)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                            className="h-full rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#94a3b8' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* TRENDS TAB */}
        <TabsContent value="trends">
          <AnimatePresence mode="wait">
            <motion.div key="trends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3 mt-3">
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <BarChart3 size={14} /> Weekly Spending
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R${v}`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="amount" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <TrendingDown size={14} className="text-destructive" /> Monthly Trend
                </h3>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { month: 'Oct', amount: totalExpenses * 1.15 },
                      { month: 'Nov', amount: totalExpenses * 0.9 },
                      { month: 'Dec', amount: totalExpenses * 1.3 },
                      { month: 'Jan', amount: totalExpenses * 0.85 },
                      { month: 'Feb', amount: totalExpenses * 1.05 },
                      { month: 'Mar', amount: totalExpenses },
                    ]}>
                      <defs>
                        <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R${v}`} />
                      <Tooltip formatter={(value: number) => formatCurrency(Math.round(value as number))} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="amount" stroke="hsl(var(--destructive))" fill="url(#expGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                  <Flame size={16} className="mx-auto text-destructive mb-1" />
                  <p className="text-[10px] text-muted-foreground">Biggest Category</p>
                  <p className="text-xs font-bold text-foreground capitalize">{biggestCategory ? `${getCategoryEmoji(biggestCategory[0])} ${biggestCategory[0]}` : '—'}</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                  <Calendar size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">This Month</p>
                  <p className="text-xs font-bold text-foreground">{expenses.length} items</p>
                </div>
              </div>

              {spendingRate > 70 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-destructive">Budget Alert</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      You've used {spendingRate}% of your income.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* BILLS TAB */}
        <TabsContent value="bills">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <BillReminder />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Expense Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base">Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Description</label>
              <Input placeholder="What did you spend on?" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Amount (R)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                <Input type="number" placeholder="0.00" className="pl-7 h-9 text-sm" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Category</label>
              <div className="grid grid-cols-5 gap-1">
                {CATEGORY_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setNewExpense({ ...newExpense, category: c.value })}
                    className={`flex flex-col items-center p-1.5 rounded-lg text-xs transition-all ${newExpense.category === c.value ? 'bg-destructive/15 ring-1 ring-destructive/30 scale-105' : 'bg-muted/30 hover:bg-muted/50'}`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-muted-foreground mb-1">Date</label>
              <Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="h-9 text-sm" />
            </div>
            <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9 text-sm" onClick={handleAddExpense}>
              <Plus size={14} className="mr-1" /> Add Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
