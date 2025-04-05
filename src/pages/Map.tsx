
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import MapView from '@/components/map/MapView';
import { motion } from 'framer-motion';
import { Moon, Sun, MapPin } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

const Map: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen pb-28 ${darkMode ? 'bg-theme-navy text-white' : 'bg-gradient-to-br from-theme-indigo to-theme-teal'}`}>
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy' : 'bg-gradient-to-r from-theme-indigo to-theme-teal'} text-white py-6 px-4 shadow-lg`}
      >
        <div className="container mx-auto max-w-md">
          <motion.h1 
            className="text-3xl font-bold flex items-center justify-center space-x-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >Budget</motion.span>
            <motion.span 
              className="text-theme-pink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >Map</motion.span>
            <motion.span 
              className="ml-2 text-xs bg-theme-pink rounded-full px-2 py-0.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >Beta</motion.span>
          </motion.h1>
          <motion.p 
            className="text-center text-sm opacity-90 mt-2 tracking-wider flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <MapPin size={16} className="mr-1 animate-pulse-soft" /> Find events and people near you!
          </motion.p>
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
          className="rounded-xl overflow-hidden shadow-xl"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <MapView />
        </motion.div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Map;
