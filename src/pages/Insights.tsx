
import React, { useState } from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import EnhancedNavBar from '@/components/EnhancedNavBar';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronRight, ChevronDown, BarChart3, PieChart as PieChartIcon, ArrowUpCircle, ArrowDownCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeGlow } from '@/components/ui/badge-glow';
import MascotHelper from '@/components/MascotHelper';
import ParticleBackground from '@/components/ParticleBackground';
import { toast } from 'sonner';

const Insights: React.FC = () => {
  const { expenses, incomes, totalIncome, totalExpenses, remainingBudget } = useBudget();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const formattedSavingsRate = Math.round(savingsRate * 10) / 10;
  
  // Process expense data by category
  const categoryData = React.useMemo(() => {
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);
  
  // Weekly data
  const weeklyData = [
    { name: 'W1', expenses: 350 },
    { name: 'W2', expenses: 420 },
    { name: 'W3', expenses: 280 },
    { name: 'W4', expenses: totalExpenses - (350 + 420 + 280) > 0 ? totalExpenses - (350 + 420 + 280) : 100 },
  ];
  
  // Financial health status
  const getFinancialStatus = () => {
    if (savingsRate >= 20) return { status: 'Excellent', color: 'text-green-500', icon: <TrendingUp className="h-5 w-5" /> };
    if (savingsRate >= 10) return { status: 'Good', color: 'text-blue-500', icon: <TrendingUp className="h-5 w-5" /> };
    if (savingsRate >= 0) return { status: 'Fair', color: 'text-yellow-500', icon: <TrendingDown className="h-5 w-5" /> };
    return { status: 'Needs Attention', color: 'text-red-500', icon: <AlertTriangle className="h-5 w-5" /> };
  };
  
  const financialStatus = getFinancialStatus();
  
  // Financial tips based on status
  const getFinancialTip = () => {
    if (savingsRate >= 20) return "Keep it up, bru! You're killing the savings game!";
    if (savingsRate >= 10) return "Solid work! Try to cut back on small expenses to save even more.";
    if (savingsRate >= 0) return "You're making ends meet, but try to track your spending more closely.";
    return "Eish, you're spending more than you earn. Let's look at cutting non-essential costs.";
  };

  const COLORS = ['#6E59A5', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9966FF'];
  
  const toggleInsight = (insight: string) => {
    if (expandedInsight === insight) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(insight);
    }
  };

  const generateInvestmentTip = () => {
    const tips = [
      "Consider a tax-free savings account for long-term goals.",
      "Investing just 5% of your income can build significant wealth over time.",
      "Unit trusts are a good starting point for new investors.",
      "Emergency fund first, then investments!",
      "Compound interest is your best friend - start early!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  const handleShareInsights = () => {
    toast.success("Insights ready to share!", {
      description: "Your financial snapshot has been copied to clipboard.",
      action: {
        label: "Undo",
        onClick: () => toast.info("Share cancelled")
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-theme-navy pb-28">
      <ParticleBackground count={20} className="opacity-20" />
      
      <header className="bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-6 px-4 relative overflow-hidden">
        <motion.div 
          className="absolute -top-10 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container mx-auto max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-3"
          >
            <BadgeGlow glowColor="rgba(109, 40, 217, 0.5)">
              <div className="flex items-center bg-purple-600 text-white px-3 py-1.5 rounded-full">
                <BarChart3 className="mr-2" size={18} />
                <span className="font-semibold">Financial Insights</span>
              </div>
            </BadgeGlow>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 dark:text-gray-400">Overall Status</span>
              <span className={`text-2xl font-bold ${financialStatus.color}`}>
                {financialStatus.status}
              </span>
            </div>
            
            <div>
              <Button 
                onClick={handleShareInsights}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                Share Insights
              </Button>
            </div>
          </motion.div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        <MascotHelper 
          type="insights" 
          message="Looking at your financial insights helps you make smarter money decisions!" 
        />
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="overview" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Financial Health
                      <span className={`${financialStatus.color}`}>
                        {financialStatus.icon}
                      </span>
                    </CardTitle>
                    <CardDescription>Overall status: {financialStatus.status}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Savings Rate</p>
                          <p className={`text-xl font-semibold ${savingsRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formattedSavingsRate}%
                            {savingsRate > 0 ? <ArrowUpCircle size={14} className="inline ml-1" /> : <ArrowDownCircle size={14} className="inline ml-1" />}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Balance</p>
                          <p className={`text-xl font-semibold ${remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(remainingBudget)}
                            {remainingBudget > 0 ? <ArrowUpCircle size={14} className="inline ml-1" /> : <ArrowDownCircle size={14} className="inline ml-1" />}
                          </p>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-amber-900/30 dark:to-yellow-900/20 p-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800/30"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="flex items-start">
                          <Lightbulb className="text-amber-500 mr-3 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm font-medium mb-1 text-amber-800 dark:text-amber-300">Tip of the Day</p>
                            <p className="text-sm text-amber-700 dark:text-amber-200">{getFinancialTip()}</p>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800/30"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      >
                        <div className="flex items-start">
                          <Lightbulb className="text-blue-500 mr-3 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">Investment Tip</p>
                            <p className="text-sm text-blue-700 dark:text-blue-200">{generateInvestmentTip()}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
                
                <div 
                  className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => toggleInsight('income')}
                >
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <h3 className="font-medium flex items-center">
                      <ArrowUpCircle className="mr-2 text-green-600 dark:text-green-400" size={18} />
                      Income vs. Expenses
                    </h3>
                    <Badge variant="outline" className="bg-white dark:bg-gray-700 border border-green-200 dark:border-green-800/40">
                      {expandedInsight === 'income' ? 
                        <ChevronDown size={14} /> : 
                        <ChevronRight size={14} />
                      }
                    </Badge>
                  </div>
                  
                  <AnimatePresence>
                    {expandedInsight === 'income' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                                <p className="text-xl font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
                              </div>
                              <div className="text-2xl">💰</div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                                <p className="text-xl font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</p>
                              </div>
                              <div className="text-2xl">💸</div>
                            </div>
                          </div>
                          
                          {incomes.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Income Sources</p>
                              <div className="space-y-2">
                                {incomes.map((income) => (
                                  <div key={income.id} className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                                    <span>{income.source}</span>
                                    <span className="font-medium">{formatCurrency(income.amount)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="spending" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChartIcon size={18} />
                        Spending Breakdown
                      </CardTitle>
                      <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                        {categoryData.length} Categories
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {categoryData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {categoryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Categories</h4>
                          {categoryData.slice(0, 4).map((category, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm capitalize">{category.name}</span>
                              </div>
                              <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <PieChartIcon className="mx-auto mb-2" size={32} />
                        <p>No expense data available</p>
                        <p className="text-sm">Add expenses to see your spending breakdown</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="trends" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20 pb-2">
                    <CardTitle className="text-lg">Monthly Spending</CardTitle>
                    <CardDescription>Weekly breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${formatCurrency(Number(value))}`, 'Expenses']} />
                          <Bar dataKey="expenses" fill="#6E59A5" radius={[8, 8, 0, 0]}>
                            {weeklyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium mb-2">Spending Insights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded mr-2 mt-0.5">
                            <TrendingDown size={14} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <span>Your Week 3 spending was lower than average - great job!</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded mr-2 mt-0.5">
                            <TrendingUp size={14} className="text-amber-600 dark:text-amber-400" />
                          </div>
                          <span>Week 2 had the highest expenses this month</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
      
      <EnhancedNavBar />
    </div>
  );
};

export default Insights;
