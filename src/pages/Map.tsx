
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import MapView from '@/components/map/MapView';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
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
    <div className={`min-h-screen pb-28 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-budgetbru-purple to-budgetbru-blue'} text-white py-6 px-4 shadow-lg`}
      >
        <div className="container mx-auto max-w-md">
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
            <span>Budget</span>
            <span className="text-budgetbru-orange">Map</span>
            <span className="ml-2 text-xs bg-budgetbru-orange rounded-full px-2 py-0.5">Beta</span>
          </h1>
          <p className="text-center text-sm opacity-90 mt-2 tracking-wider">Find events and people near you!</p>
        </div>
        
        <Toggle 
          className="absolute top-4 right-4 p-2 rounded-full"
          pressed={darkMode}
          onPressedChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Toggle>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MapView />
        </motion.div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Map;
