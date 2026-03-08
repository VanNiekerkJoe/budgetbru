import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import {
  Plus, Calendar, Landmark, Repeat, Coins, TrendingUp, Clock,
  ArrowUpRight, Wallet, PieChart as PieIcon, BarChart3, Target,
  Briefcase, GraduationCap, Gift, Sparkles, Search, Filter, Trash2,
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
    return months.map((m, i) => ({
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

  const handleDelete = (id: number) => {
    deleteIncome(id);
    toast.success('Income deleted');
    setExpandedId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 pb-28">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-20 w-80 h-80 bg-success/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border py-5 px-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Income</p>
                <h1 className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {incomes.length} source{incomes.length !== 1 ? 's' : ''} · {savingsRate}% savings rate
                </p>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="bg-success hover:bg-success/90 text-success-foreground rounded-full h-12 w-12 p-0 shadow-lg">
                <Plus size={22} />
              </Button>
            </div>

            {/* Income vs Expenses bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Income utilization</span>
                <span>{totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}% spent</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <motion.div initial={{ width: 0 }} animate={{ width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%` }} transition={{ duration: 0.8 }} className="h-full bg-destructive/60 rounded-l-full" />
                <motion.div initial={{ width: 0 }} animate={{ width: `${totalIncome > 0 ? Math.max(((totalIncome - totalExpenses) / totalIncome) * 100, 0) : 0}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full bg-success rounded-r-full" />
              </div>
              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-destructive">Expenses {formatCurrency(totalExpenses)}</span>
                <span className="text-success">Saved {formatCurrency(Math.max(totalIncome - totalExpenses, 0))}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 max-w-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-card/60 backdrop-blur-md border border-border">
            <TabsTrigger value="overview" className="text-xs gap-1 data-[state=active]:bg-success/10 data-[state=active]:text-success">
              <TrendingUp size={13} /> Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Clock size={13} /> History
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="text-xs gap-1 data-[state=active]:bg-accent/10 data-[state=active]:text-accent-foreground">
              <PieIcon size={13} /> Sources
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs gap-1 data-[state=active]:bg-warning/10 data-[state=active]:text-warning">
              <BarChart3 size={13} /> Trends
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <AnimatePresence mode="wait">
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {/* Inline Quick Add — 2 steps, no modal */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-border p-4 relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-success/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 bg-success/10 rounded-lg flex items-center justify-center">
                        <Zap size={14} className="text-success" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">Quick Add Income</h3>
                      <div className="flex-1" />
                      <button onClick={() => setShowAddForm(true)} className="text-[11px] text-primary hover:underline">Full form →</button>
                    </div>

                    <AnimatePresence mode="wait">
                      {!quickSource ? (
                        <motion.div key="pick" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>
                          <p className="text-[11px] text-muted-foreground mb-2">Tap a source:</p>
                          <div className="grid grid-cols-5 gap-1.5">
                            {SOURCE_OPTIONS.map(s => (
                              <motion.button key={s.value} whileTap={{ scale: 0.93 }}
                                onClick={() => setQuickSource(s.value)}
                                className="flex flex-col items-center p-2 bg-muted/30 rounded-xl hover:bg-success/10 transition-colors">
                                <span className="text-xl">{s.emoji}</span>
                                <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{s.value}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.form key="amount" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.15 }}
                          onSubmit={(e) => { e.preventDefault(); handleQuickAdd(); }}
                          className="space-y-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setQuickSource(null)} className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center hover:bg-muted/50 transition-colors flex-shrink-0">
                              <ChevronDown size={14} className="text-muted-foreground rotate-90" />
                            </button>
                            <span className="text-lg">{getSourceEmoji(quickSource)}</span>
                            <span className="text-sm font-medium text-foreground">{quickSource}</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                              <Input type="number" placeholder="Amount" step="0.01" min="0" value={quickAmount} onChange={e => setQuickAmount(e.target.value)}
                                className="pl-7 bg-background/50 border-border h-10 text-base" autoFocus />
                            </div>
                            <Button type="submit" className="bg-success hover:bg-success/90 text-success-foreground h-10 px-5">
                              <Plus size={16} className="mr-1" /> Add
                            </Button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Income Health */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target size={16} className="text-primary" /> Income Health
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ value: healthScore, fill: healthColor }]} startAngle={90} endAngle={-270} barSize={8}>
                          <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'hsl(var(--muted))' }} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="relative -mt-[62px] text-center">
                        <span className="text-2xl font-bold" style={{ color: healthColor }}>{healthGrade}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-foreground font-medium">
                        {healthScore >= 70 ? "Great savings rate! 🔥" : healthScore >= 40 ? "Room to improve 💪" : "Focus on earning more 📈"}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Savings Rate</p>
                          <p className="text-sm font-bold text-success">{savingsRate}%</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                          <p className="text-[10px] text-muted-foreground">Net Saved</p>
                          <p className="text-sm font-bold text-foreground">{formatCurrency(Math.max(totalIncome - totalExpenses, 0))}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3.5 border border-border text-center">
                    <Repeat size={18} className="mx-auto text-primary mb-1" />
                    <p className="text-[10px] text-muted-foreground">Recurring</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(recurringTotal)}</p>
                    <p className="text-[10px] text-muted-foreground">{incomes.filter(i => i.recurring).length} sources</p>
                  </div>
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3.5 border border-border text-center">
                    <Sparkles size={18} className="mx-auto text-warning mb-1" />
                    <p className="text-[10px] text-muted-foreground">One-time</p>
                    <p className="text-sm font-bold text-foreground">{formatCurrency(oneTimeTotal)}</p>
                    <p className="text-[10px] text-muted-foreground">{incomes.filter(i => !i.recurring).length} entries</p>
                  </div>
                </div>

                {/* Recent Income */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Recent Income</h3>
                    <button onClick={() => setActiveTab('history')} className="text-[11px] text-primary hover:underline">View all →</button>
                  </div>
                  {incomes.slice(0, 3).map(income => (
                    <div key={income.id} className="p-3 flex items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                        {getSourceEmoji(income.source)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{income.source}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(income.date)}
                          {income.recurring && <span className="ml-1.5 text-primary">• {income.frequency}</span>}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-success flex items-center gap-1">
                        <ArrowUpRight size={12} /> {formatCurrency(income.amount)}
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
                {/* Search & Filter */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search income..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-background/50 h-9 text-sm" />
                  </div>
                  <Select value={filterSource || 'all'} onValueChange={v => setFilterSource(v === 'all' ? null : v)}>
                    <SelectTrigger className="w-28 bg-background/50 h-9 text-xs">
                      <Filter size={12} className="mr-1" /><SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {SOURCE_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}><span className="flex items-center gap-1">{s.emoji} {s.value}</span></SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Income List */}
                {sortedIncomes.length > 0 ? (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {sortedIncomes.map((income, idx) => {
                        const isExpanded = expandedId === income.id;
                        return (
                          <motion.div key={income.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} layout className="group">
                            <div className="p-3.5 flex items-center cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpandedId(isExpanded ? null : income.id)}>
                              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                                {getSourceEmoji(income.source)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-foreground truncate">{income.source}</h3>
                                <p className="text-xs text-muted-foreground">{formatDate(income.date)}
                                  {income.recurring && <span className="ml-1.5 text-primary text-[10px]">🔄 {income.frequency}</span>}
                                </p>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <p className="font-semibold text-success text-sm">{formatCurrency(income.amount)}</p>
                                {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                              </div>
                            </div>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="px-3.5 pb-3 flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success capitalize">{income.source}</span>
                                    {income.recurring && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Recurring · {income.frequency}</span>}
                                    {totalIncome > 0 && <span className="text-xs text-muted-foreground">{((income.amount / totalIncome) * 100).toFixed(1)}% of total</span>}
                                    <div className="flex-1" />
                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(income.id)}>
                                      <Trash2 size={13} className="mr-1" /> Delete
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
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <Wallet size={32} className="mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">No income found</h3>
                    <p className="text-xs text-muted-foreground mb-3">{searchTerm || filterSource ? 'Try different filters' : 'Add your first income'}</p>
                    {(searchTerm || filterSource) && <Button variant="outline" size="sm" className="text-xs" onClick={() => { setSearchTerm(''); setFilterSource(null); }}>Clear</Button>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* SOURCES TAB */}
          <TabsContent value="breakdown">
            <AnimatePresence mode="wait">
              <motion.div key="breakdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-3">
                {/* Pie Chart */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <PieIcon size={16} className="text-primary" /> Income by Source
                  </h3>
                  {pieData.length > 0 ? (
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" stroke="none">
                              {pieData.map(entry => <Cell key={entry.name} fill={getSourceColor(entry.name)} />)}
                            </Pie>
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-1.5 max-h-40 overflow-y-auto">
                        {pieData.map(s => {
                          const pct = totalIncome > 0 ? ((s.value / totalIncome) * 100).toFixed(0) : '0';
                          return (
                            <div key={s.name} className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getSourceColor(s.name) }} />
                              <span className="text-xs flex-1 text-foreground">{s.emoji} {s.name}</span>
                              <span className="text-xs font-medium text-foreground">{pct}%</span>
                              <span className="text-xs text-muted-foreground">{formatCurrency(s.value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : <p className="text-sm text-muted-foreground text-center py-4">No income data yet</p>}
                </div>

                {/* Source Bars */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" /> Top Sources
                  </h3>
                  <div className="space-y-3">
                    {pieData.slice(0, 5).map(s => {
                      const pct = totalIncome > 0 ? (s.value / totalIncome) * 100 : 0;
                      return (
                        <div key={s.name}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-foreground flex items-center gap-1">{s.emoji} {s.name}</span>
                            <span className="text-xs text-muted-foreground">{formatCurrency(s.value)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.1 }}
                              className="h-full rounded-full" style={{ backgroundColor: getSourceColor(s.name) }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Diversification Score */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-warning" /> Income Diversification
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground">Sources</p>
                      <p className="text-lg font-bold text-foreground">{new Set(incomes.map(i => i.source)).size}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground">Avg/Source</p>
                      <p className="text-sm font-bold text-foreground">{formatCurrency(avgPerSource)}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                      <p className="text-[10px] text-muted-foreground">Recurring %</p>
                      <p className="text-sm font-bold text-primary">{totalIncome > 0 ? Math.round((recurringTotal / totalIncome) * 100) : 0}%</p>
                    </div>
                  </div>
                  {new Set(incomes.map(i => i.source)).size < 3 && (
                    <p className="text-xs text-warning mt-2 flex items-center gap-1">
                      ⚠️ Tip: Diversify your income — aim for 3+ sources to reduce risk
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TRENDS TAB */}
          <TabsContent value="trends">
            <AnimatePresence mode="wait">
              <motion.div key="trends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-3">
                {/* Income vs Expenses Chart */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 size={16} className="text-accent-foreground" /> Income vs Expenses
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `R${v}`} />
                        <Tooltip formatter={(v: number) => formatCurrency(Math.round(v))} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                        <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Income" />
                        <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Savings Growth */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-success" /> Savings Growth
                  </h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData.map((d, i) => ({ ...d, savings: Math.max(d.income - d.expenses, 0) * (1 + i * 0.1) }))}>
                        <defs>
                          <linearGradient id="savGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `R${v}`} />
                        <Tooltip formatter={(v: number) => formatCurrency(Math.round(v))} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="savings" stroke="hsl(var(--success))" fill="url(#savGradient)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Income Growth Tips */}
                <div className="bg-gradient-to-br from-success/10 to-primary/10 border border-success/15 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-success" /> Income Growth Tips
                  </h3>
                  <div className="space-y-2">
                    {[
                      { emoji: '💼', tip: 'Add a side hustle to boost income by R2,000-R5,000/month' },
                      { emoji: '📚', tip: 'Tutoring pays R150-R300/hr — great for students' },
                      { emoji: '🎓', tip: 'Apply for bursaries and scholarships — free money!' },
                      { emoji: '📈', tip: 'Invest spare income to generate passive returns' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-base">{t.emoji}</span>
                        <span>{t.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Income Bottom Sheet */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card border-t border-border rounded-t-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Add Income</h3>
                <button onClick={() => setShowAddForm(false)}><X size={18} className="text-muted-foreground" /></button>
              </div>

              {/* Source Selection */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Source</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {SOURCE_OPTIONS.map(s => (
                    <button key={s.value} onClick={() => setNewIncome({ ...newIncome, source: s.value })}
                      className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${newIncome.source === s.value ? 'bg-success/15 ring-1 ring-success/30 scale-105' : 'bg-muted/30 hover:bg-muted/50'}`}>
                      <span className="text-lg">{s.emoji}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">{s.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                <Input type="number" placeholder="0.00" value={newIncome.amount} onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })} className="pl-8 bg-background/50 h-11 text-lg" />
              </div>

              <Input type="date" value={newIncome.date} onChange={e => setNewIncome({ ...newIncome, date: e.target.value })} className="bg-background/50 h-10" />

              <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Repeat size={14} className={isRecurring ? 'text-primary' : 'text-muted-foreground'} />
                  <span className="text-sm text-foreground">Recurring income</span>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>

              {isRecurring && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                  <div className="grid grid-cols-3 gap-2">
                    {(['weekly', 'monthly', 'once'] as const).map(f => (
                      <button key={f} onClick={() => setNewIncome({ ...newIncome, frequency: f })}
                        className={`p-2 rounded-xl text-xs text-center transition-all capitalize ${newIncome.frequency === f ? 'bg-primary/15 ring-1 ring-primary/30 text-primary font-medium' : 'bg-muted/20 text-muted-foreground'}`}>
                        {f === 'once' ? 'One-time' : f}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground h-11" onClick={handleAdd}>
                <Plus size={16} className="mr-2" /> Add Income
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Income;
