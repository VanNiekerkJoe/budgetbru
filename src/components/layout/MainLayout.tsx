
import React from 'react';
import { motion } from 'framer-motion';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const location = useLocation();

  return (
    <div className="min-h-screen relative">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-primary-foreground font-bold text-sm">B</span>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground leading-tight tracking-tight">BudgetBru</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Smart Finance</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
              <Bell size={17} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main content */}
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="pb-20 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {children}
          </div>
        </div>
      </motion.main>
      
      <MobileNavbar />
      <ChatbotButton />
    </div>
  );
};

export default MainLayout;
