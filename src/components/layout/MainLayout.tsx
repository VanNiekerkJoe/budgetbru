
import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarNavItem, SidebarSearch } from '@/components/ui/sidebar';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { Home, Wallet, Map, CircleDollarSign, ChartPie, User, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface MainLayoutProps {
  children: React.ReactNode;
}

const pageTransitionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 }
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen relative">
      {/* Desktop sidebar */}
      {!isMobile && (
        <Sidebar defaultOpen={true} className="hidden md:flex border-r border-border/30">
          <SidebarHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-theme-pink to-theme-teal"></div>
              <span className="font-semibold text-lg">BudgetBru</span>
            </div>
          </SidebarHeader>
          
          <SidebarSearch />
          
          <SidebarContent className="py-6">
            <nav className="space-y-1.5">
              <SidebarNavItem href="/" icon={Home} active={location.pathname === '/'}>
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem href="/expenses" icon={Wallet} active={location.pathname === '/expenses'}>
                Expenses
              </SidebarNavItem>
              <SidebarNavItem href="/map" icon={Map} active={location.pathname === '/map'}>
                Campus Map
              </SidebarNavItem>
              <SidebarNavItem href="/savings" icon={CircleDollarSign} active={location.pathname === '/savings'}>
                Savings
              </SidebarNavItem>
              <SidebarNavItem href="/insights" icon={ChartPie} active={location.pathname === '/insights'}>
                Insights
              </SidebarNavItem>
              <SidebarNavItem href="/profile" icon={User} active={location.pathname === '/profile'}>
                Profile
              </SidebarNavItem>
            </nav>
          </SidebarContent>
          
          <SidebarFooter className="flex items-center justify-between">
            <ThemeToggle />
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>
      )}
      
      {/* Main content area */}
      <motion.main 
        key={location.pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransitionVariants}
        transition={{ duration: 0.3 }}
        className="flex-1 relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"
      >
        {/* Page content */}
        <div className="pb-20 md:pb-6 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </div>
        </div>
        
        {/* Mobile navigation - only show if mobile */}
        {isMobile && <MobileNavbar />}
        
        {/* Chatbot (positioned differently on mobile vs desktop) */}
        <ChatbotButton />
      </motion.main>
    </div>
  );
};

export default MainLayout;
