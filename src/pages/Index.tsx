import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Moon, Sun, ArrowUpRight, CreditCard, Landmark, Wallet, ChevronRight, 
  Search, Bell, Settings, Clock, ArrowRight, Calendar, Bookmark, 
  PanelRight, PanelLeft, Plus
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BadgeGlow } from '@/components/ui/badge-glow';

import EnhancedNavBar from '@/components/EnhancedNavBar';
import LogoBadge from '@/components/LogoBadge';
import CategoryIcon, { CategoryType } from '@/components/CategoryIcon';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EventPopup from '@/components/EventPopup';
import JoziBoetChatbot from '@/components/JoziBoetChatbot';
import MapView from '@/components/map/MapView';
import ParticleBackground from '@/components/ParticleBackground';
import TutorialGuide from '@/components/TutorialGuide';
import { useTutorial } from '@/services/TutorialService';
import { QuickExpenseTracker } from '@/components/dashboard/QuickExpenseTracker';
import { useBudget } from '@/contexts/BudgetContext';

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

const IndexPage: React.FC = () => {
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
  const [activeTab, setActiveTab] = useState("overview");
  const [showSidebar, setShowSidebar] = useState(false);
  const { addExpense } = useBudget();
  
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 50, description: 'Textbooks', category: 'education', date: new Date(Date.now() - 3600000) },
    { id: 2, type: 'income', amount: 300, description: 'Money from Mom', category: 'other', date: new Date(Date.now() - 86400000) },
    { id: 3, type: 'expense', amount: 35, description: 'Lunch with friends', category: 'food', date: new Date(Date.now() - 172800000) },
    { id: 4, type: 'expense', amount: 80, description: 'Phone data', category: 'utilities', date: new Date(Date.now() - 259200000) }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [quickActions, setQuickActions] = useState([
    { id: 1, name: 'Add Expense', icon: 'expenses' as CategoryType, path: '/expenses' },
    { id: 2, name: 'Add Income', icon: 'income' as CategoryType, path: '/income' },
    { id: 3, name: 'Set Goal', icon: 'savings' as CategoryType, path: '/savings' },
    { id: 4, name: 'Insights', icon: 'insights' as CategoryType, path: '/insights' },
  ]);
  
  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  
  const { showTutorial, completeTutorial, skipTutorial, resetTutorial } = useTutorial();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);
  
  useEffect(() => {
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

  useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = [
        `Add expense for ${searchTerm}`,
        `Find ${searchTerm} in transactions`,
        `Budget for ${searchTerm}`,
      ];
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

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
      description: 'Money from Mom',
      category: 'other',
      date: new Date()
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

  const handleQuickExpense = (description: string, amount: number, category: string) => {
    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      amount,
      description,
      category,
      date: new Date()
    };
    setTransactions([newTransaction, ...transactions]);
    addExpense({ amount, category, description });
    toast.success(`Expense of R${amount} added!`);
  };
  
  const filteredTransactions = transactions.filter(
    transaction => transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTutorialComplete = () => {
    completeTutorial();
    toast.success('Tutorial completed! Enjoy using BudgetBru!');
  };
  
  const handleTutorialSkip = () => {
    skipTutorial();
    toast.info('Tutorial skipped. You can access it anytime from settings.');
  };

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
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };
  
  const getCategoryEmoji = (category: string) => {
    switch(category) {
      case 'education': return '📚';
      case 'food': return '🍔';
      case 'utilities': return '💡';
      case 'transport': return '🚗';
      case 'entertainment': return '🎬';
      case 'income': return '💰';
      default: return '💼';
    }
  };
  
  const exploreItems = [
    { title: 'Tips for Food Budget', category: 'Food', icon: '🍔' },
    { title: 'Save on Textbooks', category: 'Education', icon: '📚' },
    { title: 'Weekend Activities', category: 'Entertainment', icon: '🎬' },
    { title: 'Transport Tips', category: 'Transport', icon: '🚗' },
  ];

  const recentSearches = ["textbooks", "lunch", "data", "transport"];

  return (
    <div className={`min-h-screen pb-28 ${wallpaper} transition-all duration-500`}>
      <ParticleBackground count={20} className="opacity-30" />
      
      {/* Welcome Tutorial */}
      {showTutorial && (
        <TutorialGuide onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
      )}

      {/* Quick Access Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-50 shadow-xl"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <LogoBadge size="sm" />
              <h2 className="text-lg font-semibold ml-2">Quick Access</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                <PanelLeft size={18} />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setSearchTerm(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Quick Navigation</h3>
                <div className="space-y-1">
                  <Link to="/expenses" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Wallet size={18} className="mr-2 text-theme-pink" />
                    <span>Expenses</span>
                  </Link>
                  <Link to="/savings" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <CreditCard size={18} className="mr-2 text-theme-pink" />
                    <span>Savings</span>
                  </Link>
                  <Link to="/insights" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ArrowUpRight size={18} className="mr-2 text-theme-pink" />
                    <span>Insights</span>
                  </Link>
                  <Link to="/map" className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Landmark size={18} className="mr-2 text-theme-pink" />
                    <span>Campus Map</span>
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Upcoming</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-theme-pink/20 rounded-full p-2 mr-3">
                      <Calendar size={16} className="text-theme-pink" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Night Market</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">This Friday</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Saved Items</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <Bookmark size={16} className="mr-2 text-theme-pink" />
                    <span className="text-sm">Budget Planning Guide</span>
                  </div>
                  <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <Bookmark size={16} className="mr-2 text-theme-pink" />
                    <span className="text-sm">Financial Aid Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy bg-opacity-60 backdrop-blur-lg' : 'bg-white bg-opacity-80 backdrop-blur-lg'} py-6 px-4 shadow-md`}
      >
        <div className="container mx-auto max-w-md flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1" 
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <PanelRight size={18} /> : <PanelLeft size={18} />}
            </Button>
            <div className="flex items-center">
              <LogoBadge size="md" />
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-heading">BudgetBru</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student Finance Made Easy</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300"
              onClick={() => resetTutorial()}
              aria-label="Show tutorial"
            >
              <Bell size={18} />
            </motion.button>
            
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
            
            <Link to="/profile">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                    BP
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-5 max-w-md">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            type="text"
            placeholder="Search transactions, tips, or categories..." 
            className="pl-9 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Enhanced Search Suggestions */}
          <AnimatePresence>
            {searchSuggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 overflow-hidden"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSearchSuggestions([]);
                    }}
                  >
                    <Search size={14} className="mr-2 text-gray-500" />
                    <span className="text-sm">{suggestion}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="animated-card"
        >
          <BalanceCard />
        </motion.div>

        {/* Quick Expense Tracker */}
        <QuickExpenseTracker onAddExpense={handleQuickExpense} />
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="overview" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-4 gap-3"
                >
                  {quickActions.map(action => (
                    <Link to={action.path} key={action.id}>
                      <motion.div 
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white dark:bg-gray-800/80 rounded-lg shadow-sm p-3 flex flex-col items-center justify-center"
                      >
                        <CategoryIcon category={action.icon} size={20} withAnimation />
                        <span className="text-xs mt-2 text-center">{action.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
                
                {/* Recent Transactions */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <BadgeGlow>
                        <h3 className="font-semibold text-base">Recent Activity</h3>
                      </BadgeGlow>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your latest transactions</p>
                    </div>
                    <motion.button 
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      className="text-xs text-theme-pink flex items-center gap-1 px-2 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20"
                      onClick={handleAddIncome}
                    >
                      <Plus size={12} className="inline-block" />
                      Add Income
                    </motion.button>
                  </div>
                  
                  <div className="space-y-2">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.slice(0, 4).map((transaction) => (
                        <motion.div 
                          key={transaction.id}
                          variants={itemVariants}
                          className={`flex justify-between items-center p-2.5 rounded-lg ${
                            transaction.type === 'income' 
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-300' 
                                : 'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-300'
                            }`}>
                              {getCategoryEmoji(transaction.category)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs opacity-80">{formatTimeAgo(transaction.date)}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium">
                              {transaction.type === 'income' ? '+' : '-'}R{transaction.amount}
                            </span>
                            <span className="text-xs opacity-80 capitalize">{transaction.category}</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Wallet className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Try clearing your search</p>
                      </div>
                    )}
                  </div>
                  
                  {filteredTransactions.length > 4 && (
                    <div className="mt-3 text-center">
                      <Button variant="link" size="sm" className="text-theme-pink">
                        View All Transactions
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  )}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/20 to-transparent hover:from-black/30 transition-all z-10">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-black/70 text-black dark:text-white shadow-lg">
                      Campus Map
                    </Badge>
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
                    className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
                  >
                    <CategoryIcon category="finances" withBackground withAnimation size={28} />
                    <h3 className="font-semibold text-base">Finances</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link to="/expenses" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="expenses" size={16} />
                        <span className="text-xs mt-1">Expenses</span>
                      </Link>
                      <Link to="/savings" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="savings" size={16} />
                        <span className="text-xs mt-1">Savings</span>
                      </Link>
                      <Link to="/tips" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="tips" size={16} />
                        <span className="text-xs mt-1">Tips</span>
                      </Link>
                      <Link to="/iou" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="iou" size={16} />
                        <span className="text-xs mt-1">IOU</span>
                      </Link>
                    </div>
                  </motion.div>
                  
                  {/* Jols Category */}
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
                  >
                    <CategoryIcon category="jols" withBackground withAnimation size={28} />
                    <h3 className="font-semibold text-base">Jols</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link to="/map" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="map" size={16} />
                        <span className="text-xs mt-1">Map</span>
                      </Link>
                      <Link to="/community" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="community" size={16} />
                        <span className="text-xs mt-1">Community</span>
                      </Link>
                      <Link to="/planning" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="planning" size={16} />
                        <span className="text-xs mt-1">Planning</span>
                      </Link>
                      <Link to="/vibes" className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <CategoryIcon category="vibes" size={16} />
                        <span className="text-xs mt-1">Vibes Hub</span>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="activity" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold">All Transactions</h3>
                  <div className="flex space-x-1">
                    <Select 
                      options={["All Types", "Income", "Expense"]} 
                      defaultValue="All Types"
                      small
                    />
                    <Select 
                      options={["All Time", "This Week", "This Month"]} 
                      defaultValue="All Time"
                      small
                    />
                  </div>
                </div>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <motion.div 
                        key={transaction.id}
                        variants={itemVariants}
                        className="bg-white dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-lg shadow-sm flex items-center justify-between"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {getCategoryEmoji(transaction.category)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <span className="capitalize">{transaction.category}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(transaction.date)}</span>
                            </p>
                          </div>
                        </div>
                        <div className={`font-medium ${
                          transaction.type === 'income' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}R{transaction.amount}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      variants={itemVariants}
                      className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-lg p-6 shadow-sm text-center"
                    >
                      <Wallet className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="explore" asChild>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <BadgeGlow>
                          <h3 className="font-medium text-lg">Explore</h3>
                        </BadgeGlow>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Discover budget tips and ideas</p>
                      </div>
                      <div className="text-2xl">💡</div>
                    </div>
                  </CardContent>
                </Card>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {exploreItems.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-lg shadow-sm cursor-pointer"
                        onClick={() => toast.info("Coming soon!", { description: "This feature is under development" })}
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎓</div>
                      <div>
                        <h3 className="font-medium">Student Discounts</h3>
                        <p className="text-sm text-amber-800 dark:text-amber-200 mt-0.5">Tap to explore special offers</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">📊</div>
                      <div>
                        <h3 className="font-medium">Budget Challenges</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-0.5">Join a challenge and save more</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setNewCategoryModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddCategory}
                >
                  Create
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <EnhancedNavBar />
    </div>
  );
};

const Select: React.FC<{options: string[], defaultValue: string, small?: boolean}> = ({ options, defaultValue, small }) => {
  return (
    <select 
      defaultValue={defaultValue} 
      className={`rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${
        small ? 'text-xs py-1' : 'text-sm py-2'
      } px-2`}
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};

export default IndexPage;
