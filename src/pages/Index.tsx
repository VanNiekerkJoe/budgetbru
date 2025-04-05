
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Moon, Sun, Plus, ArrowUpRight, CreditCard, Landmark } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';

import NavBar from '@/components/NavBar';
import LogoBadge from '@/components/LogoBadge';
import CategoryIcon from '@/components/CategoryIcon';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EventPopup from '@/components/EventPopup';
import JoziBoetChatbot from '@/components/JoziBoetChatbot';
import MapView from '@/components/map/MapView';
import ParticleBackground from '@/components/ParticleBackground';
import { Card, CardContent } from '@/components/ui/card';

const WALLPAPERS = [
  {
    name: "Blue Gradient",
    value: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-theme-navy dark:to-theme-indigo/80"
  },
  {
    name: "Pink Glow",
    value: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-theme-pink/30 dark:to-theme-indigo/50"
  },
  {
    name: "Teal Breeze",
    value: "bg-gradient-to-br from-teal-100 to-blue-100 dark:from-theme-teal/30 dark:to-theme-navy"
  },
  {
    name: "Default",
    value: "bg-gray-50 dark:bg-gray-900"
  }
];

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
  
  const [showMap, setShowMap] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].value);
  
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 50, description: 'Textbooks' },
    { id: 2, type: 'income', amount: 300, description: 'Money from Mom' }
  ]);
  
  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");

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
  
  const toggleMap = () => {
    setShowMap(!showMap);
  };
  
  const handleWallpaperChange = () => {
    const currentIndex = WALLPAPERS.findIndex(wp => wp.value === wallpaper);
    const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
    setWallpaper(WALLPAPERS[nextIndex].value);
    toast.success(`Wallpaper changed to ${WALLPAPERS[nextIndex].name}`);
  };
  
  const handleAddIncome = () => {
    const newTransaction = {
      id: Date.now(),
      type: 'income',
      amount: 300,
      description: 'Money from Mom'
    };
    setTransactions([newTransaction, ...transactions]);
    toast.success('Income of R300 added!');
  };
  
  const handleAddCategory = () => {
    if (categoryName.trim()) {
      toast.success(`New category "${categoryName}" added!`);
      setNewCategoryModal(false);
      setCategoryName("");
    } else {
      toast.error("Please enter a category name");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen pb-28 ${wallpaper} transition-all duration-500`}>
      <ParticleBackground count={30} className="opacity-30" />
      
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy bg-opacity-60 backdrop-blur-lg' : 'bg-white bg-opacity-80 backdrop-blur-lg'} py-6 px-4 shadow-md`}
      >
        <div className="container mx-auto max-w-md flex justify-center">
          <LogoBadge size="lg" />
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300"
            onClick={handleWallpaperChange}
          >
            <Landmark size={18} />
          </motion.button>
          
          <Toggle 
            className="p-2 rounded-full"
            pressed={darkMode}
            onPressedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} className="animate-pulse-soft" /> : <Moon size={18} />}
          </Toggle>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BalanceCard />
        </motion.div>
        
        {/* Recent Transactions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-theme-pink flex items-center gap-1"
              onClick={handleAddIncome}
            >
              <CreditCard size={14} />
              Add Income
            </motion.button>
          </div>
          
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <motion.div 
                key={transaction.id}
                variants={itemVariants}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {transaction.type === 'income' ? 
                    <ArrowUpRight size={18} /> : 
                    <CreditCard size={18} />
                  }
                  <span>{transaction.description}</span>
                </div>
                <span className="font-medium">
                  {transaction.type === 'income' ? '+' : '-'}R{transaction.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Mini Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl overflow-hidden shadow-xl h-32 relative cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleMap}
        >
          <MapView compact />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-all z-10">
            <span className="text-white font-semibold text-lg shadow-sm">Campus Map</span>
          </div>
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
              <Link to="/tips" className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
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
        
        {/* Custom Category Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Custom Categories</h3>
            <button 
              onClick={() => setNewCategoryModal(true)}
              className="text-sm text-theme-pink flex items-center"
            >
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div 
              className="bg-white dark:bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-600"
              onClick={() => setNewCategoryModal(true)}
            >
              <Plus size={20} className="text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">New</span>
            </div>
          </div>
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
      
      {/* Full Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMap}
          >
            <motion.div 
              className="w-full max-w-md mx-4 h-[500px] rounded-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <MapView />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Category Modal */}
      <AnimatePresence>
        {newCategoryModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNewCategoryModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-5 rounded-xl w-full max-w-xs"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-3 text-theme-pink">New Category</h3>
              <div className="mb-4">
                <label className="block text-sm mb-1">Category Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" 
                  placeholder="e.g. Entertainment"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600"
                  onClick={() => setNewCategoryModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 text-sm bg-theme-pink text-white rounded-md"
                  onClick={handleAddCategory}
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <NavBar />
    </div>
  );
};

export default Index;
