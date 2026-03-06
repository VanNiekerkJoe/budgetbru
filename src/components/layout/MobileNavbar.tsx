
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChartPie, CircleDollarSign, Wallet, User, Map } from 'lucide-react';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/50 z-50 safe-area-bottom"
    >
      <div className="flex justify-around py-2 px-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            {isActive(item.path) && (
              <div className="w-1 h-1 bg-primary rounded-full mt-0.5" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
