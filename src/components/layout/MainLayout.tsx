
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Map, CircleDollarSign, ChartPie, User, Menu, X, Receipt, Lightbulb, HandCoins, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/map', icon: Map, label: 'Campus Map' },
    { path: '/savings', icon: CircleDollarSign, label: 'Savings' },
    { path: '/insights', icon: ChartPie, label: 'Insights' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const extraItems = [
    { path: '/tips', icon: Lightbulb, label: 'Tips' },
    { path: '/iou', icon: HandCoins, label: 'IOUs' },
    { path: '/receipts', icon: Receipt, label: 'Receipts' },
    { path: '/community', icon: Users, label: 'Community' },
  ];
  
  return (
    <div className="min-h-screen relative">
      {/* Slide-out drawer menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent" />
                  <span className="font-semibold text-lg text-foreground">BudgetBru</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={20} className="text-foreground" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">Main</p>
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}

                <p className="text-xs font-medium text-muted-foreground px-3 pt-4 pb-2 uppercase tracking-wider">More</p>
                {extraItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-border flex items-center justify-between">
                <ThemeToggle />
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border/50">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent" />
          <span className="font-semibold text-foreground">BudgetBru</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Main content */}
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={isMobile ? "pb-20 min-h-screen" : "pb-6 min-h-screen"}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>
        </div>
      </motion.main>
      
      {isMobile && <MobileNavbar />}
      <ChatbotButton />
    </div>
  );
};

export default MainLayout;
