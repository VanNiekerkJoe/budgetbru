
import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import ChatbotButton from './ChatbotButton';
import { useMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  
  return (
    <div className="flex min-h-screen relative">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}
      
      {/* Main content area */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm"
      >
        {/* Page content */}
        <div className="pb-20 md:pb-6 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMobile && <MobileNavbar />}
        
        {/* Chatbot (positioned differently on mobile vs desktop) */}
        <ChatbotButton />
      </motion.main>
    </div>
  );
};

export default MainLayout;
