
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Map, CircleDollarSign, ChartPie, User, Menu, X, Receipt, Lightbulb, HandCoins, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarNavItem, SidebarSearch } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen relative">
      {/* Mobile slide-out menu */}
      {isMobile && (
        <>
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                {/* Drawer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed top-0 left-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent" />
                      <span className="font-semibold text-lg text-foreground">BudgetBru</span>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X size={20} className="text-foreground" />
                    </button>
                  </div>

                  {/* Nav items */}
                  <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground px-3 py-2 uppercase tracking-wider">Main</p>
                    {navItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
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
                        onClick={() => setMobileMenuOpen(false)}
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

                  {/* Footer */}
                  <div className="p-4 border-t border-border flex items-center justify-between">
                    <ThemeToggle />
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      
      {/* Main content area */}
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex-1 relative"
      >
        {/* Mobile top bar with hamburger */}
        {isMobile && (
          <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border/50">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent" />
              <span className="font-semibold text-foreground">BudgetBru</span>
            </div>
          </div>
        )}

        <div className="pb-20 md:pb-6 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>
        </div>
        
        {isMobile && <MobileNavbar />}
        <ChatbotButton />
      </motion.main>
    </div>
  );
};

export default MainLayout;
