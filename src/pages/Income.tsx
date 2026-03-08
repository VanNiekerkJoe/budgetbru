import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import {
  Plus, Calendar, Repeat, TrendingUp, Clock,
  ArrowUpRight, Wallet, PieChart as PieIcon, BarChart3, Target,
  Sparkles, Search, Filter, Trash2,
  ChevronDown, ChevronUp, Zap, X
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';

const SOURCE_OPTIONS = [
  { value: 'Allowance', emoji: '💵', color: '#22c55e' },
  { value: 'Scholarship', emoji: '🎓', color: '#6366f1' },
  { value: 'Part-time Job', emoji: '💼', color: '#3b82f6' },
  { value: 'Bursary', emoji: '📜', color: '#8b5cf6' },
  { value: 'Tutoring', emoji: '📚', color: '#f59e0b' },
  { value: 'Side Hustle', emoji: '🚀', color: '#ec4899' },
  { value: 'Freelance', emoji: '💻', color: '#14b8a6' },
  { value: 'Gift', emoji: '🎁', color: '#f97316' },
  { value: 'Investment', emoji: '📈', color: '#10b981' },
  { value: 'Other', emoji: '💸', color: '#6b7280' },
];

const getSourceEmoji = (source: string) => SOURCE_OPTIONS.find(s => s.value.toLowerCase() === source.toLowerCase())?.emoji || '💸';
const getSourceColor = (source: string) => SOURCE_OPTIONS.find(s => s.value.toLowerCase() === source.toLowerCase())?.color || '#6b7280';

const Income: React.FC = () => {
  const { addIncome, incomes, totalIncome, totalExpenses, deleteIncome } = useBudget();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [quickSource, setQuickSource] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState('');

  const [newIncome, setNewIncome] = useState({
    amount: '', source: '', date: new Date().toISOString().split('T')[0], frequency: 'monthly' as 'weekly' | 'monthly' | 'once'
  });

  const sortedIncomes = useMemo(() =>
    [...incomes]
      .filter(i => !filterSource || i.source.toLowerCase() === filterSource.toLowerCase())
      .filter(i => !searchTerm || i.source.toLowerCase().includes(searchTerm.toLowerCase()) || (i.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()),
    [incomes, filterSource, searchTerm]
  );

  const sourceTotals = useMemo(() => {
    const map: Record<string, number> = {};
    incomes.forEach(i => { map[i.source] = (map[i.source] || 0) + i.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value, emoji: getSourceEmoji(name) })).sort((a, b) => b.value - a.value);
  }, [incomes]);

  const pieData = sourceTotals;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const healthScore = Math.max(0, Math.min(100, savingsRate > 0 ? Math.min(savingsRate * 2.5, 100) : 0));
  const healthColor = healthScore >= 70 ? '#22c55e' : healthScore >= 40 ? '#eab308' : '#ef4444';
  const healthGrade = healthScore >= 80 ? 'A' : healthScore >= 60 ? 'B' : healthScore >= 40 ? 'C' : 'D';

  const monthlyData = useMemo(() => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    return months.map((m) => ({
      month: m, income: totalIncome * (0.7 + Math.random() * 0.6), expenses: totalExpenses * (0.8 + Math.random() * 0.4)
    }));
  }, [totalIncome, totalExpenses]);

  const recurringTotal = useMemo(() => incomes.filter(i => i.recurring).reduce((s, i) => s + i.amount, 0), [incomes]);
  const oneTimeTotal = totalIncome - recurringTotal;
  const avgPerSource = incomes.length > 0 ? Math.round(totalIncome / new Set(incomes.map(i => i.source)).size) : 0;

  const handleAdd = () => {
    if (!newIncome.source || !newIncome.amount || isNaN(Number(newIncome.amount)) || Number(newIncome.amount) <= 0) {
      toast.error('Please fill all fields');
      return;
    }
    addIncome({
      amount: Number(newIncome.amount),
      source: newIncome.source,
      description: newIncome.source,
      date: newIncome.date,
      recurring: isRecurring,
      frequency: isRecurring ? newIncome.frequency : undefined,
    });
    toast.success(`${getSourceEmoji(newIncome.source)} Income of ${formatCurrency(Number(newIncome.amount))} added!`);
    setNewIncome({ amount: '', source: '', date: new Date().toISOString().split('T')[0], frequency: 'monthly' });
    setIsRecurring(false);
    setShowAddForm(false);
  };

  const handleQuickAdd = () => {
    if (!quickSource || !quickAmount || isNaN(Number(quickAmount)) || Number(quickAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    addIncome({
      amount: Number(quickAmount),
      source: quickSource,
      description: quickSource,
      date: new Date().toISOString().split('T')[0],
    });
    toast.success(`${getSourceEmoji(quickSource)} ${formatCurrency(Number(quickAmount))} added!`);
    setQuickSource(null);
    setQuickAmount('');
  };

  const handleDelete = (id: number) => {
    deleteIncome(id);
    toast.success('Income deleted');
    setExpandedId(null);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Inline Summary Card (replaces sticky header) */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Total Income</p>
            <h1 className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</h1>
            <p className="text-[10px] text-muted-foreground">{incomes.length} source{incomes.length !== 1 ? 's' : ''} · {savingsRate}% savings rate</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-success hover:bg-success/90 text-success-foreground rounded-full h-10 w-10 p-0 shadow-md">
            <Plus size={20} />
          </Button>
        </div>
        <div className="mt-2.5">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Income utilization</span>
            <span>{totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}% spent</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
            <motion.div initial={{ width: 0 }} animate={{ width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-destructive/60 rounded-l-full" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${totalIncome > 0 ? Math.max(((totalIncome - totalExpenses) / totalIncome) * 100, 0) : 0}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-success rounded-r-full" />
          </div>
          <div className="flex justify-between text-[9px] mt-0.5">
            <span className="text-destructive">Expenses {formatCurrency(totalExpenses)}</span>
            <span className="text-success">Saved {formatCurrency(Math.max(totalIncome - totalExpenses, 0))}</span>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full bg-muted/60">
          <TabsTrigger value="overview" className="text-[11px]">Overview</TabsTrigger>
          <TabsTrigger value="history" className="text-[11px]">History</TabsTrigger>
          <TabsTrigger value="breakdown" className="text-[11px]">Sources</TabsTrigger>
          <TabsTrigger value="trends" className="text-[11px]">Trends</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview">
          <AnimatePresence mode="wait">
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
              {/* Quick Add Income */}
              <div className="bg-card rounded-xl border border-border/50 p-3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center">
                      <Zap size={12} className="text-success" />
                    </div>
                    <h3 className="text-xs font-semibold text-foreground">Quick Add Income</h3>
                    <div className="flex-1" />
                    <button onClick={() => setShowAddForm(true)} className="text-[10px] text-primary hover:underline">Full form →</button>
                  </div>

                  <AnimatePresence mode="wait">
                    {!quickSource ? (
                      <motion.div key="pick" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                        <p className="text-[10px] text-muted-foreground mb-1.5">Tap a source:</p>
                        <div className="grid grid-cols-5 gap-1">
                          {SOURCE_OPTIONS.map(s => (
                            <motion.button key={s.value} whileTap={{ scale: 0.93 }}
                              onClick={() => setQuickSource(s.value)}
                              className="flex flex-col items-center p-1.5 bg-muted/30 rounded-xl hover:bg-success/10 transition-colors">
                              <span className="text-lg">{s.emoji}</span>
                              <span className="text-[8px] text-muted-foreground mt-0.5 leading-tight">{s.value}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form key="amount" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }}
                        onSubmit={(e) => { e.preventDefault(); handleQuickAdd(); }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setQuickSource(null)} className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors flex-shrink-0">
                            <ChevronDown size={12} className="text-muted-foreground rotate-90" />
                          </button>
                          <span className="text-lg">{getSourceEmoji(quickSource)}</span>
                          <span className="text-xs font-medium text-foreground">{quickSource}</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                            <Input type="number" placeholder="Amount" step="0.01" min="0" value={quickAmount} onChange={e => setQuickAmount(e.target.value)}
                              className="pl-6 h-9 text-sm" autoFocus />
                          </div>
                          <Button type="submit" className="bg-success hover:bg-success/90 text-success-foreground h-9 px-4 text-xs">
                            <Plus size={14} className="mr-1" /> Add
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Income Health */}
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <Target size={14} className="text-primary" /> Income Health
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ value: healthScore, fill: healthColor }]} startAngle={90} endAngle={-270} barSize={7}>
                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'hsl(var(--muted))' }} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="relative -mt-[52px] text-center">
                      <span className="text-xl font-bold" style={{ color: healthColor }}>{healthGrade}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs text-foreground font-medium">
                      {healthScore >= 70 ? "Great savings rate! 🔥" : healthScore >= 40 ? "Room to improve 💪" : "Focus on earning more 📈"}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-muted/30 rounded-lg p-1.5 text-center">
                        <p className="text-[9px] text-muted-foreground">Savings Rate</p>
                        <p className="text-xs font-bold text-success">{savingsRate}%</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-1.5 text-center">
                        <p className="text-[9px] text-muted-foreground">Net Saved</p>
                        <p className="text-xs font-bold text-foreground">{formatCurrency(Math.max(totalIncome - totalExpenses, 0))}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                  <Repeat size={16} className="mx-auto text-primary mb-1" />
                  <p className="text-[9px] text-muted-foreground">Recurring</p>
                  <p className="text-xs font-bold text-foreground">{formatCurrency(recurringTotal)}</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border/50 text-center">
                  <Sparkles size={16} className="mx-auto text-warning mb-1" />
                  <p className="text-[9px] text-muted-foreground">One-time</p>
                  <p className="text-xs font-bold text-foreground">{formatCurrency(oneTimeTotal)}</p>
                </div>
              </div>

              {/* Recent Income */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-2.5 border-b border-border flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-foreground">Recent Income</h3>
                  <button onClick={() => setActiveTab('history')} className="text-[10px] text-primary hover:underline">View all →</button>
                </div>
                {incomes.slice(0, 3).map(income => (
                  <div key={income.id} className="p-2.5 flex items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center text-base mr-2.5 flex-shrink-0">
                      {getSourceEmoji(income.source)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{income.source}</p>
                      <p className="text-[9px] text-muted-foreground">{formatDate(income.date)}
                        {income.recurring && <span className="ml-1 text-primary">• {income.frequency}</span>}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-success flex items-center gap-0.5">
                      <ArrowUpRight size={10} /> {formatCurrency(income.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <AnimatePresence mode="wait">
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
              <div className="bg-card rounded-xl p-2.5 border border-border/50 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search income..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
                </div>
                <Select value={filterSource || 'all'} onValueChange={v => setFilterSource(v === 'all' ? null : v)}>
                  <SelectTrigger className="w-24 h-8 text-[10px]">
                    <Filter size={10} className="mr-1" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {SOURCE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}><span className="flex items-center gap-1">{s.emoji} {s.value}</span></SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {sortedIncomes.length > 0 ? (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <div className="divide-y divide-border">
                    {sortedIncomes.map((income, idx) => {
                      const isExpanded = expandedId === income.id;
                      return (
                        <motion.div key={income.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} layout className="group">
                          <div className="p-3 flex items-center cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpandedId(isExpanded ? null : income.id)}>
                            <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center text-base mr-2.5 flex-shrink-0">
                              {getSourceEmoji(income.source)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-medium text-foreground truncate">{income.source}</h3>
                              <p className="text-[10px] text-muted-foreground">{formatDate(income.date)}
                                {income.recurring && <span className="ml-1 text-primary text-[9px]">🔄 {income.frequency}</span>}
                              </p>
                            </div>
                            <div className="text-right flex items-center gap-1.5">
                              <p className="font-semibold text-success text-xs">{formatCurrency(income.amount)}</p>
                              {isExpanded ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                          </div>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-3 pb-2.5 flex items-center gap-2">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success capitalize">{income.source}</span>
                                  <div className="flex-1" />
                                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(income.id)}>
                                    <Trash2 size={11} className="mr-1" /> Delete
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-xl p-6 border border-border/50 text-center">
                  <Wallet size={24} className="mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-semibold text-sm text-foreground mb-1">No income found</h3>
                  <p className="text-[10px] text-muted-foreground mb-2">{searchTerm || filterSource ? 'Try different filters' : 'Add your first income'}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* SOURCES TAB */}
        <TabsContent value="breakdown">
          <AnimatePresence mode="wait">
            <motion.div key="breakdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <PieIcon size={14} className="text-primary" /> Income by Source
                </h3>
                {pieData.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-28 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3} dataKey="value" stroke="none">
                            {pieData.map(entry => <Cell key={entry.name} fill={getSourceColor(entry.name)} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1 max-h-32 overflow-y-auto">
                      {pieData.map(s => {
                        const pct = totalIncome > 0 ? ((s.value / totalIncome) * 100).toFixed(0) : '0';
                        return (
                          <div key={s.name} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getSourceColor(s.name) }} />
                            <span className="text-[10px] flex-1 text-foreground">{s.emoji} {s.name}</span>
                            <span className="text-[10px] font-medium text-foreground">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : <p className="text-xs text-muted-foreground text-center py-3">No income data yet</p>}
              </div>

              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <TrendingUp size={14} className="text-success" /> Top Sources
                </h3>
                <div className="space-y-2.5">
                  {pieData.slice(0, 5).map(s => {
                    const pct = totalIncome > 0 ? (s.value / totalIncome) * 100 : 0;
                    return (
                      <div key={s.name}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-medium text-foreground flex items-center gap-1">{s.emoji} {s.name}</span>
                          <span className="text-[10px] text-muted-foreground">{formatCurrency(s.value)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                            className="h-full rounded-full" style={{ backgroundColor: getSourceColor(s.name) }} />
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
            <motion.div key="trends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
              <div className="bg-card rounded-xl p-3 border border-border/50">
                <h3 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <BarChart3 size={14} /> Income vs Expenses
                </h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `R${v}`} />
                      <Tooltip formatter={(v: number) => formatCurrency(Math.round(v))} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/15 rounded-xl p-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2 mb-2">
                  <Zap size={12} className="text-success" /> Income Growth Tips
                </h3>
                <div className="space-y-1.5">
                  {[
                    { emoji: '💼', tip: 'Add a side hustle to boost income by R2,000-R5,000/month' },
                    { emoji: '📚', tip: 'Tutoring pays R150-R300/hr — great for students' },
                    { emoji: '🎓', tip: 'Apply for bursaries and scholarships — free money!' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="text-sm">{t.emoji}</span>
                      <span>{t.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Add Income Bottom Sheet */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card border-t border-border rounded-t-2xl p-4 space-y-3" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Add Income</h3>
                <button onClick={() => setShowAddForm(false)}><X size={16} className="text-muted-foreground" /></button>
              </div>

              <div>
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Source</p>
                <div className="grid grid-cols-5 gap-1">
                  {SOURCE_OPTIONS.map(s => (
                    <button key={s.value} type="button" onClick={() => setNewIncome(p => ({ ...p, source: s.value }))}
                      className={`flex flex-col items-center p-1.5 rounded-xl transition-all ${newIncome.source === s.value ? 'bg-success/15 ring-1 ring-success/30 scale-105' : 'bg-muted/30 hover:bg-muted/50'}`}>
                      <span className="text-lg">{s.emoji}</span>
                      <span className="text-[8px] text-muted-foreground mt-0.5">{s.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">Amount</p>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                    <Input type="number" placeholder="0" value={newIncome.amount} onChange={e => setNewIncome(p => ({ ...p, amount: e.target.value }))} className="pl-6 h-9 text-sm" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">Date</p>
                  <Input type="date" value={newIncome.date} onChange={e => setNewIncome(p => ({ ...p, date: e.target.value }))} className="h-9 text-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between bg-muted/30 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Repeat size={14} className="text-primary" />
                  <span className="text-xs font-medium text-foreground">Recurring</span>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>

              {isRecurring && (
                <Select value={newIncome.frequency} onValueChange={v => setNewIncome(p => ({ ...p, frequency: v as any }))}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="once">Once-off</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground h-9 text-sm" onClick={handleAdd}>
                <Plus size={14} className="mr-1" /> Add Income
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Income;
