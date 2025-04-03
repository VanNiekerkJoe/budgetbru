
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import NavBar from '@/components/NavBar';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const Insights: React.FC = () => {
  const { expenses, incomes, totalIncome, totalExpenses, remainingBudget } = useBudget();
  
  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const formattedSavingsRate = Math.round(savingsRate * 10) / 10;
  
  // Mock data for demo purposes
  const weeklyData = [
    { name: 'W1', expenses: 350 },
    { name: 'W2', expenses: 420 },
    { name: 'W3', expenses: 280 },
    { name: 'W4', expenses: totalExpenses - (350 + 420 + 280) },
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
  
  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <header className="bg-budgetbru-dark text-white py-4 px-4 shadow-md">
        <h1 className="text-xl font-bold">Financial Insights</h1>
        <p className="text-sm opacity-90">Your money, visualized</p>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              Financial Health
              <span className={`${financialStatus.color}`}>
                {financialStatus.icon}
              </span>
            </CardTitle>
            <CardDescription>Overall status: {financialStatus.status}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Savings Rate</p>
                  <p className={`text-xl font-semibold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formattedSavingsRate}%
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Balance</p>
                  <p className={`text-xl font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(remainingBudget)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Tip of the Day</p>
                <p className="text-sm">{getFinancialTip()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Spending</CardTitle>
            <CardDescription>Weekly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${formatCurrency(Number(value))}`, 'Expenses']} />
                  <Bar dataKey="expenses" fill="#6E59A5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Income vs. Expenses</CardTitle>
            <CardDescription>Monthly overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-xl font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
              
              <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-xl font-semibold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="text-3xl">💸</div>
              </div>
              
              {incomes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Income Sources</p>
                  <div className="space-y-2">
                    {incomes.map((income) => (
                      <div key={income.id} className="flex justify-between text-sm">
                        <span>{income.source}</span>
                        <span className="font-medium">{formatCurrency(income.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Insights;
