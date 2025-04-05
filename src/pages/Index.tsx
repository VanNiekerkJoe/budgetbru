
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, Sun, Plus } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

import NavBar from '@/components/NavBar';
import LogoBadge from '@/components/LogoBadge';
import CategoryIcon from '@/components/CategoryIcon';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EventPopup from '@/components/EventPopup';
import JoziBoetChatbot from '@/components/JoziBoetChatbot';

const Index: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{
    title: string;
    description: string;
    date?: string;
  } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);
  
  useEffect(() => {
    // Show event popup after a delay
    const timer = setTimeout(() => {
      setCurrentEvent({
        title: "Varsity Night Market",
        description: "Don't miss the Night Market this Friday! Food, music, and more at the Student Center.",
        date: "Friday, 8 April 2025"
      });
      setShowEventPopup(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleCloseEventPopup = () => {
    setShowEventPopup(false);
  };

  return (
    <div className={`min-h-screen pb-28 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-gray-900' : 'bg-white'} py-6 px-4 shadow-md`}
      >
        <div className="container mx-auto max-w-md flex justify-center">
          <LogoBadge size="lg" />
        </div>
        
        <Toggle 
          className="absolute top-4 right-4 p-2 rounded-full"
          pressed={darkMode}
          onPressedChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} className="animate-pulse-soft" /> : <Moon size={18} />}
        </Toggle>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BalanceCard />
        </motion.div>
        
        {/* Main Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Finances Category */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
          >
            <CategoryIcon category="finances" withBackground withAnimation size={28} />
            <h3 className="font-semibold text-lg">Finances</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Link to="/expenses" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="expenses" size={18} />
                <span className="text-xs mt-1">Expenses</span>
              </Link>
              <Link to="/savings" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="savings" size={18} />
                <span className="text-xs mt-1">Savings</span>
              </Link>
              <Link to="/insights" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="tips" size={18} />
                <span className="text-xs mt-1">Tips</span>
              </Link>
              <Link to="/iou" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="iou" size={18} />
                <span className="text-xs mt-1">IOU</span>
              </Link>
            </div>
          </motion.div>
          
          {/* Jols Category */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
          >
            <CategoryIcon category="jols" withBackground withAnimation size={28} />
            <h3 className="font-semibold text-lg">Jols</h3>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Link to="/map" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="map" size={18} />
                <span className="text-xs mt-1">Map</span>
              </Link>
              <Link to="/community" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="community" size={18} />
                <span className="text-xs mt-1">Community</span>
              </Link>
              <Link to="/planning" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="planning" size={18} />
                <span className="text-xs mt-1">Planning</span>
              </Link>
              <Link to="/vibes" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <CategoryIcon category="vibes" size={18} />
                <span className="text-xs mt-1">Vibes Hub</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Quick Add Button */}
        <motion.div
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        >
          <button className="bg-theme-pink hover:bg-theme-pink/90 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg">
            <Plus size={24} />
          </button>
        </motion.div>
      </main>
      
      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup 
          title={currentEvent.title}
          description={currentEvent.description}
          date={currentEvent.date}
          onClose={handleCloseEventPopup}
        />
      )}
      
      {/* Jozi Boet Chatbot */}
      <JoziBoetChatbot />
      
      <NavBar />
    </div>
  );
};

export default Index;
