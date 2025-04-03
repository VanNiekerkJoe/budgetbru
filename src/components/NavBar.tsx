
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBudget } from '@/contexts/BudgetContext';
import { formatCurrency } from '@/utils/formatters';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map } from 'lucide-react';

const NavBar: React.FC = () => {
  const { remainingBudget } = useBudget();
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-10">
      <div className="flex justify-around p-2">
        <Link to="/" className={`flex flex-col items-center p-2 ${location.pathname === '/' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/expenses" className={`flex flex-col items-center p-2 ${location.pathname === '/expenses' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <Wallet size={24} />
          <span className="text-xs mt-1">Expenses</span>
        </Link>
        <Link to="/map" className={`flex flex-col items-center p-2 ${location.pathname === '/map' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <Map size={24} />
          <span className="text-xs mt-1">Map</span>
        </Link>
        <Link to="/savings" className={`flex flex-col items-center p-2 ${location.pathname === '/savings' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <CircleDollarSign size={24} />
          <span className="text-xs mt-1">Savings</span>
        </Link>
        <Link to="/insights" className={`flex flex-col items-center p-2 ${location.pathname === '/insights' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <ChartPie size={24} />
          <span className="text-xs mt-1">Insights</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center p-2 ${location.pathname === '/profile' ? 'text-budgetbru-purple' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
      <div className={`w-full py-1 px-4 text-xs text-center font-medium ${remainingBudget >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {remainingBudget >= 0 
          ? `Remaining: ${formatCurrency(remainingBudget)}`
          : `Overspent by: ${formatCurrency(Math.abs(remainingBudget))}`}
      </div>
    </div>
  );
};

export default NavBar;
