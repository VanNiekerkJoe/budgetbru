import React, { useState, useMemo } from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp, TrendingDown, AlertTriangle, BarChart3,
  PieChart as PieChartIcon, ArrowUpCircle, ArrowDownCircle,
  Lightbulb, Wallet, Target, Flame, Zap, ShieldCheck,
  Calendar, Receipt, ArrowRight, Sparkles, Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// ─── Helpers ───
function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    rent: '#f87171', groceries: '#60a5fa', transport: '#fbbf24',
    entertainment: '#34d399', utilities: '#fb923c', education: '#a78bfa',
    clothing: '#818cf8', health: '#4ade80', food: '#f97316', other: '#94a3b8',
  };
  return map[category] || '#94a3b8';
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    rent: '🏠', groceries: '🛒', transport: '🚌', entertainment: '🎮',
    utilities: '💡', education: '📚', clothing: '👕', health: '💊',
    food: '🍔', other: '📦',
  };
  return map[category] || '📦';
}

const CHART_COLORS = ['#f87171', '#60a5fa', '#fbbf24', '#34d399', '#fb923c', '#a78bfa', '#818cf8'];

const Insights: React.FC = () => {
  const { expenses, incomes, totalIncome, totalExpenses, remainingBudget, savingsGoals, emergencyFund } = useBudget();
  const [activeTab, setActiveTab] = useState('overview');

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const dailyAvg = totalExpenses / 30;

  // ─── Financial health score (0-100) ───
  const healthScore = useMemo(() => {
    let score = 50;
    if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 0) score += 10;
    else score -= 20;
    if (emergencyFund.currentAmount >= emergencyFund.targetAmount * 0.5) score += 10;
    if (expenses.length > 0) score += 5;
    if (totalExpenses < totalIncome * 0.8) score += 5;
    return Math.min(100, Math.max(0, score));
  }, [savingsRate, emergencyFund, expenses, totalExpenses, totalIncome]);

  const healthGrade = healthScore >= 80 ? 'A' : healthScore >= 60 ? 'B' : healthScore >= 40 ? 'C' : 'D';
  const healthColor = healthScore >= 80 ? 'hsl(var(--success))' : healthScore >= 60 ? 'hsl(var(--primary))' : healthScore >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';

  // ─── Category breakdown ───
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0,
        color: getCategoryColor(name),
        emoji: getCategoryEmoji(name),
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, totalExpenses]);

  // ─── Weekly trend data ───
  const weeklyData = [
    { week: 'W1', spent: 350, budget: 625 },
    { week: 'W2', spent: 420, budget: 625 },
    { week: 'W3', spent: 280, budget: 625 },
    { week: 'W4', spent: Math.max(totalExpenses - 1050, 100), budget: 625 },
  ];

  // ─── Monthly trend (6 months) ───
  const monthlyTrend = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(today.getMonth() - (5 - i));
      const month = d.toLocaleString('default', { month: 'short' });
      // Simulate trend with some variance around current data
      const factor = 0.7 + Math.random() * 0.6;
      const inc = i === 5 ? totalIncome : Math.round(totalIncome * factor);
      const exp = i === 5 ? totalExpenses : Math.round(totalExpenses * factor);
      return { month, income: inc, expenses: exp, savings: inc - exp };
    });
  }, [totalIncome, totalExpenses]);

  // ─── Spending insights ───
  const topCategory = categoryData[0];
  const biggestExpense = expenses.length > 0
    ? expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0])
    : null;

  // ─── Projected end-of-month ───
  const daysInMonth = 30;
  const dayOfMonth = new Date().getDate();
  const projectedTotal = dayOfMonth > 0 ? (totalExpenses / dayOfMonth) * daysInMonth : totalExpenses;
  const projectedSavings = totalIncome - projectedTotal;

  const getFinancialTip = () => {
    const tips = [
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
      "Pack lunch twice a week — save R200+ per month, bru!",
      "Set up an automatic transfer to savings on payday.",
      "Cancel subscriptions you haven't used in 30 days.",
      "Use student discounts everywhere — you're leaving money on the table!",
      "Track every R10 — small leaks sink big ships.",
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  const radialData = [{ name: 'Score', value: healthScore, fill: healthColor }];

  return (
    <div className="space-y-4 pb-4">
      {/* Inline Summary */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Activity size={16} className="text-primary" />
              <h1 className="text-base font-bold text-foreground">Insights</h1>
            </div>
            <p className="text-[10px] text-muted-foreground">Your financial command center</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: healthColor }}>{healthGrade}</div>
            <p className="text-[8px] text-muted-foreground font-medium">SCORE</p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-3 bg-muted/60">
          <TabsTrigger value="overview" className="text-[11px]">Overview</TabsTrigger>
          <TabsTrigger value="spending" className="text-[11px]">Spending</TabsTrigger>
          <TabsTrigger value="trends" className="text-[11px]">Trends</TabsTrigger>
          <TabsTrigger value="goals" className="text-[11px]">Goals</TabsTrigger>
        </TabsList>

          <AnimatePresence mode="wait">
            {/* ═══════ OVERVIEW TAB ═══════ */}
            <TabsContent value="overview" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {/* Health Score Ring */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-5">
                        <div className="relative w-24 h-24 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              innerRadius="75%"
                              outerRadius="100%"
                              data={radialData}
                              startAngle={90}
                              endAngle={-270}
                              barSize={8}
                            >
                              <RadialBar
                                dataKey="value"
                                cornerRadius={10}
                                background={{ fill: 'hsl(var(--muted))' }}
                              />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black" style={{ color: healthColor }}>
                              {healthScore}
                            </span>
                            <span className="text-[8px] text-muted-foreground font-semibold tracking-wider">
                              / 100
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground mb-1">Financial Health</p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {healthScore >= 80
                              ? "You're killing it! Great financial habits."
                              : healthScore >= 60
                                ? "Solid foundation — a few tweaks and you'll be top tier."
                                : healthScore >= 40
                                  ? "Room for improvement. Let's tighten up spending."
                                  : "Needs attention. Focus on reducing expenses."}
                          </p>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-[9px] bg-muted/50">
                              {savingsRate >= 0 ? '↑' : '↓'} {Math.abs(Math.round(savingsRate))}% saved
                            </Badge>
                            <Badge variant="outline" className="text-[9px] bg-muted/50">
                              R{Math.round(dailyAvg)}/day avg
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center">
                          <ArrowUpCircle size={16} className="text-success" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Income</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(totalIncome)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
                          <ArrowDownCircle size={16} className="text-destructive" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Expenses</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Wallet size={16} className="text-primary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Balance</span>
                      </div>
                      <p className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(remainingBudget)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
                          <Flame size={16} className="text-warning" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">Daily Avg</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(dailyAvg)}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Projected End of Month */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={15} className="text-primary" />
                        <p className="text-sm font-semibold text-foreground">Month-End Projection</p>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Projected spending</span>
                            <span className="font-semibold text-foreground">{formatCurrency(projectedTotal)}</span>
                          </div>
                          <Progress
                            value={Math.min((projectedTotal / totalIncome) * 100, 100)}
                            className="h-2"
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Projected savings</span>
                          <span className={`font-semibold ${projectedSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(projectedSavings)}
                          </span>
                        </div>
                        {projectedTotal > totalIncome && (
                          <div className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 rounded-lg p-2">
                            <AlertTriangle size={12} />
                            <span>On track to overspend by {formatCurrency(projectedTotal - totalIncome)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Smart Tip */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-0.5">Smart Tip</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{getFinancialTip()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Mini Income vs Expense Chart */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-primary" />
                        Income vs Expenses (6 months)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monthlyTrend} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `R${v}`} />
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                            <Area type="monotone" dataKey="income" stroke="#4ade80" fill="url(#incGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="expenses" stroke="#f87171" fill="url(#expGrad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* ═══════ SPENDING TAB ═══════ */}
            <TabsContent value="spending" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {/* Donut Chart */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-1.5">
                          <PieChartIcon size={14} className="text-primary" />
                          Spending Breakdown
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] bg-muted/50">
                          {categoryData.length} categories
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      {categoryData.length > 0 ? (
                        <>
                          <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={55}
                                  outerRadius={85}
                                  paddingAngle={3}
                                  dataKey="value"
                                  nameKey="name"
                                  strokeWidth={0}
                                >
                                  {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                              </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-xs text-muted-foreground">Total</span>
                              <span className="text-lg font-bold text-foreground">{formatCurrency(totalExpenses)}</span>
                            </div>
                          </div>

                          {/* Category list */}
                          <div className="space-y-2 mt-2">
                            {categoryData.map(cat => (
                              <div key={cat.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                                  style={{ background: `${cat.color}15` }}
                                >
                                  {cat.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-foreground capitalize">{cat.name}</span>
                                    <span className="text-xs font-bold text-foreground">{formatCurrency(cat.value)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.percentage}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ background: cat.color }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-medium w-8 text-right">
                                      {cat.percentage}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-10">
                          <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium text-foreground">No expense data yet</p>
                          <p className="text-xs text-muted-foreground">Add expenses to see your breakdown</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Spending Alerts */}
                {categoryData.filter(c => c.percentage > 30).length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="bg-warning/5 border-warning/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={14} className="text-warning" />
                          <span className="text-xs font-semibold text-foreground">Spending Alerts</span>
                        </div>
                        <div className="space-y-1.5">
                          {categoryData.filter(c => c.percentage > 30).map(c => (
                            <p key={c.name} className="text-xs text-muted-foreground">
                              <span className="font-medium capitalize">{c.name}</span> is {c.percentage}% of spending — consider setting a budget cap.
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Top Expense */}
                {biggestExpense && (
                  <motion.div variants={itemVariants}>
                    <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">BIGGEST EXPENSE</p>
                            <p className="text-sm font-semibold text-foreground">{biggestExpense.description}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{biggestExpense.category}</p>
                          </div>
                          <span className="text-lg font-bold text-destructive">{formatCurrency(biggestExpense.amount)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>

            {/* ═══════ TRENDS TAB ═══════ */}
            <TabsContent value="trends" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {/* Weekly Spending vs Budget */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <BarChart3 size={14} className="text-primary" />
                        Weekly Spending
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `R${v}`} />
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                            <Bar dataKey="spent" name="Spent" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="budget" name="Budget" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} opacity={0.4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Week insights */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs p-2 rounded-lg bg-success/5">
                          <TrendingDown size={13} className="text-success shrink-0" />
                          <span className="text-muted-foreground">Week 3 was your best — <span className="font-medium text-foreground">R280</span> spent</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs p-2 rounded-lg bg-warning/5">
                          <TrendingUp size={13} className="text-warning shrink-0" />
                          <span className="text-muted-foreground">Week 2 was the highest at <span className="font-medium text-foreground">R420</span></span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Monthly Comparison */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <Activity size={14} className="text-primary" />
                        6-Month Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyTrend} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `R${v}`} />
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                            <Bar dataKey="income" name="Income" fill="#4ade80" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                            <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Savings Rate Trend */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-primary" />
                        Savings Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="h-[160px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={monthlyTrend.map(m => ({
                              month: m.month,
                              rate: m.income > 0 ? Math.round(((m.income - m.expenses) / m.income) * 100) : 0,
                            }))}
                            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                            <Tooltip formatter={(v: number) => `${v}%`} />
                            <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fill="url(#savGrad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs text-muted-foreground">
                          Current: <span className={`font-bold ${savingsRate >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {Math.round(savingsRate)}%
                          </span>
                          {' · '}Target: <span className="font-bold text-foreground">20%</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* ═══════ GOALS TAB ═══════ */}
            <TabsContent value="goals" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
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
                      <Progress
                        value={(emergencyFund.currentAmount / emergencyFund.targetAmount) * 100}
                        className="h-2.5"
                      />
                      <p className="text-[10px] text-muted-foreground mt-2">
                        Contributing {formatCurrency(emergencyFund.monthlyContribution)}/month ·{' '}
                        ~{Math.ceil((emergencyFund.targetAmount - emergencyFund.currentAmount) / emergencyFund.monthlyContribution)} months to goal
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Savings Goals */}
                {savingsGoals.map(goal => {
                  const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                  return (
                    <motion.div key={goal.id} variants={itemVariants}>
                      <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{goal.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-[10px] capitalize bg-muted/50">
                              {goal.category}-term
                            </Badge>
                          </div>
                          <Progress value={pct} className="h-2" />
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{pct}% complete</span>
                            <span className="text-[10px] text-primary font-medium">
                              {formatCurrency(goal.targetAmount - goal.currentAmount)} to go
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* 50/30/20 Budget Rule */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-card/80 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-0 pt-4 px-4">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <Target size={14} className="text-primary" />
                        50/30/20 Rule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <p className="text-[10px] text-muted-foreground mb-3">
                        Recommended budget split based on your income of {formatCurrency(totalIncome)}
                      </p>
                      {[
                        { label: 'Needs (50%)', amount: totalIncome * 0.5, color: '#60a5fa', pct: 50 },
                        { label: 'Wants (30%)', amount: totalIncome * 0.3, color: '#fbbf24', pct: 30 },
                        { label: 'Savings (20%)', amount: totalIncome * 0.2, color: '#4ade80', pct: 20 },
                      ].map(item => (
                        <div key={item.label} className="mb-2.5 last:mb-0">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-foreground font-medium">{item.label}</span>
                            <span className="text-muted-foreground">{formatCurrency(item.amount)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.pct}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ background: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold text-foreground mb-2">Quick Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-9 rounded-xl gap-1.5"
                          onClick={() => toast.success('Insights snapshot copied!')}
                        >
                          <Sparkles size={13} /> Share Insights
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-9 rounded-xl gap-1.5"
                          onClick={() => toast.info('Coming soon: Export to PDF')}
                        >
                          <Receipt size={13} /> Export Report
                        </Button>
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

export default Insights;
