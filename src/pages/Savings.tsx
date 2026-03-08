import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import SavingsGoalsList from '@/components/savings/SavingsGoalsList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, Dialog, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus, PiggyBank, TrendingUp, Target, Zap, ShieldCheck,
  Sparkles, Calendar, ArrowUpCircle, Flame, BarChart3, Award,
} from 'lucide-react';
import {
  ResponsiveContainer, RadialBarChart, RadialBar, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar,
} from 'recharts';
import { toast } from 'sonner';

const Savings: React.FC = () => {
  const { savingsGoals, addSavingsGoal, totalIncome, totalExpenses, emergencyFund } = useBudget();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [category, setCategory] = useState<'short' | 'medium' | 'long'>('short');
  const [deadline, setDeadline] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');

  const totalSaved = savingsGoals.reduce((t, g) => t + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((t, g) => t + g.targetAmount, 0);
  const savingsProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const monthlySavingsCapacity = Math.max(0, totalIncome - totalExpenses);

  // Savings health score
  const savingsScore = useMemo(() => {
    let score = 40;
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 0) score += 5;
    if (savingsProgress >= 50) score += 15;
    else if (savingsProgress >= 25) score += 10;
    if (emergencyFund.currentAmount >= emergencyFund.targetAmount * 0.5) score += 10;
    if (savingsGoals.length >= 2) score += 5;
    if (totalSaved > 0) score += 5;
    return Math.min(100, Math.max(0, score));
  }, [savingsRate, savingsProgress, emergencyFund, savingsGoals, totalSaved]);

  const scoreColor = savingsScore >= 80 ? 'hsl(var(--success))' : savingsScore >= 60 ? 'hsl(var(--primary))' : savingsScore >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';

  // Months to complete all goals
  const monthsToComplete = monthlySavingsCapacity > 0
    ? Math.ceil((totalTarget - totalSaved) / monthlySavingsCapacity)
    : null;

  // Goal breakdown by category
  const goalsByCategory = useMemo(() => {
    const cats = { short: { count: 0, saved: 0, target: 0 }, medium: { count: 0, saved: 0, target: 0 }, long: { count: 0, saved: 0, target: 0 } };
    savingsGoals.forEach(g => {
      cats[g.category].count++;
      cats[g.category].saved += g.currentAmount;
      cats[g.category].target += g.targetAmount;
    });
    return cats;
  }, [savingsGoals]);

  // Simulated savings growth projection (6 months)
  const projectionData = useMemo(() => {
    const data = [];
    const today = new Date();
    let cumulative = totalSaved;
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setMonth(today.getMonth() + i);
      data.push({
        month: i === 0 ? 'Now' : d.toLocaleString('default', { month: 'short' }),
        saved: Math.round(cumulative),
        target: totalTarget,
      });
      cumulative += monthlySavingsCapacity * 0.5; // assume 50% of capacity goes to goals
    }
    return data;
  }, [totalSaved, totalTarget, monthlySavingsCapacity]);

  // Goal completion chart data
  const completionData = savingsGoals.map(g => ({
    name: g.name.length > 12 ? g.name.slice(0, 12) + '…' : g.name,
    progress: Math.round((g.currentAmount / g.targetAmount) * 100),
    remaining: Math.round(((g.targetAmount - g.currentAmount) / g.targetAmount) * 100),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) return;
    addSavingsGoal({
      name,
      targetAmount: Number(targetAmount),
      currentAmount: initialAmount ? Number(initialAmount) : 0,
      category,
      deadline: deadline || undefined,
    });
    setName(''); setTargetAmount(''); setInitialAmount('');
    setCategory('short'); setDeadline('');
    setIsOpen(false);
    toast.success('Savings goal created!');
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const radialData = [{ name: 'Score', value: savingsScore, fill: scoreColor }];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border/40 py-5 px-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <PiggyBank size={18} className="text-primary" />
                <h1 className="text-lg font-bold text-foreground">Savings</h1>
              </div>
              <p className="text-xs text-muted-foreground">Track your goals & grow your wealth</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-xl gap-1.5 h-9">
                  <Plus size={14} /> New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>New Savings Goal</DialogTitle>
                  <DialogDescription>What are you saving for?</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Goal Name</label>
                    <Input placeholder="e.g. Rage 2026, New laptop" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Target Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                        <Input type="number" placeholder="0" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} className="pl-7" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Starting Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                        <Input type="number" placeholder="0" value={initialAmount} onChange={e => setInitialAmount(e.target.value)} className="pl-7" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Goal Type</label>
                      <Select value={category} onValueChange={v => setCategory(v as 'short' | 'medium' | 'long')}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short-term</SelectItem>
                          <SelectItem value="medium">Medium-term</SelectItem>
                          <SelectItem value="long">Long-term</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Target Date</label>
                      <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full gap-1.5">
                      <TrendingUp size={14} /> Create Goal
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-muted/60 backdrop-blur-sm">
            <TabsTrigger value="goals" className="text-xs gap-1">
              <Target size={13} /> Goals
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-xs gap-1">
              <Sparkles size={13} /> Overview
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs gap-1">
              <BarChart3 size={13} /> Forecast
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* ═══════ GOALS TAB ═══════ */}
            <TabsContent value="goals" asChild>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {/* Total Progress Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground font-medium">Total Saved</span>
                        <Badge variant="outline" className="text-[10px] bg-muted/50">
                          {savingsGoals.length} goal{savingsGoals.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <span className="text-2xl font-black text-foreground">{formatCurrency(totalSaved)}</span>
                        <span className="text-xs text-muted-foreground">of {formatCurrency(totalTarget)}</span>
                      </div>
                      <Progress value={savingsProgress} className="h-2.5 mb-1.5" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{Math.round(savingsProgress)}% complete</span>
                        <span className="text-[10px] text-primary font-medium">
                          {formatCurrency(totalTarget - totalSaved)} to go
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Goals List */}
                <motion.div variants={itemVariants}>
                  <SavingsGoalsList />
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* ═══════ OVERVIEW TAB ═══════ */}
            <TabsContent value="overview" asChild>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {/* Savings Health Score */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-5">
                        <div className="relative w-24 h-24 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="75%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270} barSize={8}>
                              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'hsl(var(--muted))' }} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black" style={{ color: scoreColor }}>{savingsScore}</span>
                            <span className="text-[8px] text-muted-foreground font-semibold tracking-wider">/ 100</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground mb-1">Savings Health</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {savingsScore >= 80 ? "Outstanding! You're a savings machine." :
                             savingsScore >= 60 ? "Great progress — keep building those goals." :
                             savingsScore >= 40 ? "Decent start. Try increasing monthly contributions." :
                             "Let's kickstart your savings journey!"}
                          </p>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-[9px] bg-muted/50">
                              {savingsRate >= 0 ? '↑' : '↓'} {Math.abs(Math.round(savingsRate))}% rate
                            </Badge>
                            <Badge variant="outline" className="text-[9px] bg-muted/50">
                              {savingsGoals.length} goals
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Zap size={15} className="text-primary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Monthly Capacity</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(monthlySavingsCapacity)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
                          <Calendar size={15} className="text-warning" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Months to Goal</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{monthsToComplete !== null ? `${monthsToComplete}mo` : '—'}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Emergency Fund */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
                          <ShieldCheck size={15} className="text-destructive" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">Emergency Fund</p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatCurrency(emergencyFund.currentAmount)} of {formatCurrency(emergencyFund.targetAmount)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100)}%
                        </span>
                      </div>
                      <Progress value={(emergencyFund.currentAmount / emergencyFund.targetAmount) * 100} className="h-2.5" />
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {formatCurrency(emergencyFund.monthlyContribution)}/month · ~{Math.ceil((emergencyFund.targetAmount - emergencyFund.currentAmount) / emergencyFund.monthlyContribution)} months left
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Goal Breakdown by Category */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <Target size={14} className="text-primary" />
                        Goals by Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      {[
                        { key: 'short' as const, label: 'Short-term', emoji: '🎯', color: '#4ade80' },
                        { key: 'medium' as const, label: 'Medium-term', emoji: '📈', color: '#60a5fa' },
                        { key: 'long' as const, label: 'Long-term', emoji: '🏆', color: '#a78bfa' },
                      ].map(item => {
                        const cat = goalsByCategory[item.key];
                        if (cat.count === 0) return null;
                        const pct = cat.target > 0 ? Math.round((cat.saved / cat.target) * 100) : 0;
                        return (
                          <div key={item.key} className="mb-3 last:mb-0">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="flex items-center gap-1.5 text-foreground font-medium">
                                <span>{item.emoji}</span> {item.label}
                                <Badge variant="outline" className="text-[8px] px-1 py-0 bg-muted/50">{cat.count}</Badge>
                              </span>
                              <span className="text-muted-foreground">{formatCurrency(cat.saved)} / {formatCurrency(cat.target)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8 }}
                                className="h-full rounded-full"
                                style={{ background: item.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Smart Tip */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Flame size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-0.5">Savings Hack</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {monthlySavingsCapacity > 0
                              ? `You have ${formatCurrency(monthlySavingsCapacity)} left each month. Automating even 50% of that to savings could get you to your goals ${monthsToComplete ? `in ~${monthsToComplete} months` : 'faster'}!`
                              : "Try the 'pay yourself first' method — set aside savings before spending on wants."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* ═══════ FORECAST TAB ═══════ */}
            <TabsContent value="forecast" asChild>
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                {/* Savings Growth Projection */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-primary" />
                        Savings Growth Projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={projectionData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `R${v}`} />
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                            <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" fill="none" strokeWidth={1.5} name="Target" />
                            <Area type="monotone" dataKey="saved" stroke="hsl(var(--primary))" fill="url(#savedGrad)" strokeWidth={2} name="Projected" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center mt-1">
                        Based on saving 50% of monthly surplus ({formatCurrency(monthlySavingsCapacity * 0.5)}/mo)
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Goal Completion Bars */}
                {completionData.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                      <CardHeader className="pb-0 pt-4 px-4">
                        <CardTitle className="text-sm flex items-center gap-1.5">
                          <Award size={14} className="text-primary" />
                          Goal Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="h-[180px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={completionData} layout="vertical" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />
                              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                              <Tooltip formatter={(v: number) => `${v}%`} />
                              <Bar dataKey="progress" name="Saved" stackId="a" fill="hsl(var(--primary))" radius={[4, 0, 0, 4]} />
                              <Bar dataKey="remaining" name="Remaining" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Milestones */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary" />
                        Milestones
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <div className="space-y-3">
                        {[
                          { label: 'First R100 saved', reached: totalSaved >= 100, emoji: '🌱' },
                          { label: 'R500 milestone', reached: totalSaved >= 500, emoji: '🔥' },
                          { label: 'R1,000 club', reached: totalSaved >= 1000, emoji: '💪' },
                          { label: 'R5,000 legend', reached: totalSaved >= 5000, emoji: '🏆' },
                          { label: 'All goals complete', reached: savingsProgress >= 100, emoji: '🎉' },
                        ].map((m, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                              m.reached ? 'bg-success/5 border border-success/20' : 'bg-muted/30 border border-transparent'
                            }`}
                          >
                            <span className="text-lg">{m.emoji}</span>
                            <span className={`text-xs font-medium flex-1 ${m.reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {m.label}
                            </span>
                            {m.reached ? (
                              <Badge className="text-[9px] bg-success/10 text-success border-success/20" variant="outline">
                                ✓ Done
                              </Badge>
                            ) : (
                              <Badge className="text-[9px] bg-muted/50" variant="outline">Pending</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
};

export default Savings;
