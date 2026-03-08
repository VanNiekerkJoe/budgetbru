
import React from 'react';
import { motion } from 'framer-motion';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/60 backdrop-blur-2xl border-b border-border/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm shadow-primary/15">
              <span className="text-primary-foreground font-black text-sm leading-none">B</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-black text-sm text-foreground tracking-tight">Budget</span>
              <span className="font-black text-sm text-primary tracking-tight">Bru</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full hover:bg-muted/60" onClick={() => navigate('/notifications')}>
              <Bell size={15} className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
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
        transition={{ duration: 0.15 }}
      >
        <div className="pb-24 min-h-screen">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
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
