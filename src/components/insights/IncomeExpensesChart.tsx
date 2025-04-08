
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { useBudget } from '@/contexts/BudgetContext';

interface IncomeExpensesChartProps {
  className?: string;
}

const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({ className }) => {
  const { expenses, incomes, totalIncome, totalExpenses } = useBudget();
  
  // Group expenses by month
  const groupDataByMonth = () => {
    const monthlyData: Record<string, { month: string, income: number, expenses: number, savings: number }> = {};
    
    // Current month and previous months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      monthlyData[monthKey] = {
        month: monthName,
        income: 0,
        expenses: 0,
        savings: 0
      };
    }
    
    // Calculate expense totals by month
    expenses.forEach(expense => {
      if (expense.date) {
        const date = new Date(expense.date);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].expenses += expense.amount;
          }
        }
      }
    });
    
    // Calculate income totals by month
    incomes.forEach(income => {
      if (income.date) {
        const date = new Date(income.date);
        if (!isNaN(date.getTime())) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].income += income.amount;
          }
        }
      }
    });
    
    // Calculate savings
    Object.keys(monthlyData).forEach(key => {
      monthlyData[key].savings = monthlyData[key].income - monthlyData[key].expenses;
    });
    
    // If no data, simulate some data for visualization
    if (Object.values(monthlyData).every(data => data.income === 0 && data.expenses === 0)) {
      const currentMonthKey = Object.keys(monthlyData)[Object.keys(monthlyData).length - 1];
      monthlyData[currentMonthKey].income = totalIncome;
      monthlyData[currentMonthKey].expenses = totalExpenses;
      monthlyData[currentMonthKey].savings = totalIncome - totalExpenses;
    }
    
    return Object.values(monthlyData);
  };
  
  const chartData = groupDataByMonth();

  return (
    <Card className={`overflow-hidden bg-white/80 dark:bg-gray-800/75 backdrop-blur-xl border border-white/20 ${className}`}>
      <CardHeader className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 pb-2">
        <CardTitle className="text-lg">Income vs Expenses</CardTitle>
        <CardDescription>Monthly comparison</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `R${value}`}
                width={40}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="#f87171" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="savings" 
                name="Savings" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpensesChart;
