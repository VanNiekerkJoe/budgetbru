
import React from 'react';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency, getCategoryEmoji } from '@/utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryBreakdown: React.FC = () => {
  const { expensesByCategory, totalExpenses } = useBudget();
  
  const categories = Object.keys(expensesByCategory).map((category) => ({
    name: category,
    value: expensesByCategory[category as keyof typeof expensesByCategory] || 0,
    emoji: getCategoryEmoji(category),
  }));
  
  // Only include categories with values > 0
  const filteredCategories = categories.filter((item) => item.value > 0);
  
  const COLORS = [
    '#6E59A5', // purple
    '#F97316', // orange
    '#0EA5E9', // blue
    '#10B981', // green
    '#F43F5E', // red
    '#8B5CF6', // indigo
    '#EC4899', // pink
    '#6B7280', // gray
    '#D946EF', // fuchsia
  ];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={14}
      >
        {filteredCategories[index].emoji}
      </text>
    );
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold text-budgetbru-dark mb-4">Expense Breakdown</h2>
      
      {totalExpenses > 0 ? (
        <>
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2 mt-2">
            {filteredCategories.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="capitalize">{category.name}</span>
                </div>
                <div className="font-medium">
                  {formatCurrency(category.value)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
          <p className="text-center">No expenses added yet</p>
          <p className="text-sm text-center mt-2">Add expenses to see your breakdown</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
