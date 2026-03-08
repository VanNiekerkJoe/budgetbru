import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, ChevronRight, 
  Search, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BadgeGlow } from '@/components/ui/badge-glow';

import CategoryIcon, { CategoryType } from '@/components/CategoryIcon';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EventPopup from '@/components/EventPopup';
import MapView from '@/components/map/MapView';
import TutorialGuide from '@/components/TutorialGuide';
import { useTutorial } from '@/services/TutorialService';
import { QuickExpenseTracker } from '@/components/dashboard/QuickExpenseTracker';
import { useBudget } from '@/contexts/BudgetContext';


const IndexPage: React.FC = () => {
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<{
    title: string;
    description: string;
    date?: string;
  } | null>(null);
  
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { addExpense } = useBudget();
  
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 50, description: 'Textbooks', category: 'education', date: new Date(Date.now() - 3600000) },
    { id: 2, type: 'income', amount: 300, description: 'Money from Mom', category: 'other', date: new Date(Date.now() - 86400000) },
    { id: 3, type: 'expense', amount: 35, description: 'Lunch with friends', category: 'food', date: new Date(Date.now() - 172800000) },
    { id: 4, type: 'expense', amount: 80, description: 'Phone data', category: 'utilities', date: new Date(Date.now() - 259200000) }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const quickActions = [
    { id: 1, name: 'Add Expense', icon: 'expenses' as CategoryType, path: '/expenses' },
    { id: 2, name: 'Add Income', icon: 'income' as CategoryType, path: '/income' },
    { id: 3, name: 'Set Goal', icon: 'savings' as CategoryType, path: '/savings' },
    { id: 4, name: 'Insights', icon: 'insights' as CategoryType, path: '/insights' },
  ];
  
  const [newCategoryModal, setNewCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  
  const { showTutorial, completeTutorial, skipTutorial } = useTutorial();
  
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

  const handleCloseEventPopup = () => {
    setShowEventPopup(false);
  };
  
  const toggleMap = () => {
    setShowMap(!showMap);
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
      transition: { staggerChildren: 0.06 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 }
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

  return (
    <div className="space-y-5">
      {showTutorial && (
        <TutorialGuide onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
      )}
      
      <div className="space-y-5">
        {/* Search */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            type="text"
            placeholder="Search transactions, tips, or categories..." 
            className="pl-9 bg-card/80 border-border rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <AnimatePresence>
            {searchSuggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full mt-1 bg-popover text-popover-foreground rounded-lg shadow-lg z-20 overflow-hidden border border-border"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-2.5 hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSearchSuggestions([]);
                    }}
                  >
                    <Search size={14} className="mr-2 text-muted-foreground" />
                    <span className="text-sm">{suggestion}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="animated-card"
        >
          <BalanceCard />
        </motion.div>

        {/* Quick Expense Tracker */}
        <QuickExpenseTracker onAddExpense={handleQuickExpense} />
        
        {/* Tabs */}
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
                {/* Quick Actions */}
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
                        className="bg-card rounded-lg shadow-sm p-3 flex flex-col items-center justify-center"
                      >
                        <CategoryIcon category={action.icon} size={20} withAnimation />
                        <span className="text-xs mt-2 text-center text-card-foreground">{action.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
                
                {/* Recent Transactions */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="bg-card backdrop-blur-md rounded-xl shadow-md p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <BadgeGlow>
                        <h3 className="font-semibold text-base text-card-foreground">Recent Activity</h3>
                      </BadgeGlow>
                      <p className="text-xs text-muted-foreground mt-0.5">Your latest transactions</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-primary flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10"
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
                              ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300' 
                              : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 flex items-center justify-center rounded-full ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 dark:bg-green-900/40' 
                                : 'bg-red-100 dark:bg-red-900/40'
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
                        <Wallet className="mx-auto text-muted-foreground mb-2" size={24} />
                        <p className="text-muted-foreground">No transactions found</p>
                        <p className="text-xs text-muted-foreground/70">Try clearing your search</p>
                      </div>
                    )}
                  </div>
                  
                  {filteredTransactions.length > 4 && (
                    <div className="mt-3 text-center">
                      <Button variant="link" size="sm" className="text-primary">
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
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-xl overflow-hidden shadow-xl h-32 relative cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleMap}
                >
                  <MapView compact />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/20 to-transparent hover:from-black/30 transition-all z-10">
                    <Badge variant="secondary" className="bg-background/90 text-foreground shadow-lg">
                      Campus Map
                    </Badge>
                  </div>
                </motion.div>
                
                {/* Category Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Finances */}
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-card backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
                  >
                    <CategoryIcon category="finances" withBackground withAnimation size={28} />
                    <h3 className="font-semibold text-base text-card-foreground">Finances</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link to="/expenses" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="expenses" size={16} />
                        <span className="text-xs mt-1">Expenses</span>
                      </Link>
                      <Link to="/savings" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="savings" size={16} />
                        <span className="text-xs mt-1">Savings</span>
                      </Link>
                      <Link to="/tips" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="tips" size={16} />
                        <span className="text-xs mt-1">Tips</span>
                      </Link>
                      <Link to="/iou" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="iou" size={16} />
                        <span className="text-xs mt-1">IOU</span>
                      </Link>
                    </div>
                  </motion.div>
                  
                  {/* Jols */}
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-card backdrop-blur-md rounded-xl shadow-md p-4 flex flex-col items-center space-y-3"
                  >
                    <CategoryIcon category="jols" withBackground withAnimation size={28} />
                    <h3 className="font-semibold text-base text-card-foreground">Jols</h3>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link to="/map" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="map" size={16} />
                        <span className="text-xs mt-1">Map</span>
                      </Link>
                      <Link to="/community" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="community" size={16} />
                        <span className="text-xs mt-1">Community</span>
                      </Link>
                      <Link to="/planning" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
                        <CategoryIcon category="planning" size={16} />
                        <span className="text-xs mt-1">Planning</span>
                      </Link>
                      <Link to="/vibes" className="flex flex-col items-center p-2 bg-muted rounded-lg hover:bg-muted/80 transition-all">
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
                    <SimpleSelect 
                      options={["All Types", "Income", "Expense"]} 
                      defaultValue="All Types"
                      small
                    />
                    <SimpleSelect 
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
                        className="bg-card backdrop-blur-md p-3 rounded-lg shadow-sm flex items-center justify-between"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                          }`}>
                            {getCategoryEmoji(transaction.category)}
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
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
                      className="bg-card backdrop-blur-md rounded-lg p-6 shadow-sm text-center"
                    >
                      <Wallet className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-muted-foreground">No transactions found</p>
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
                <Card className="border-0 bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <BadgeGlow>
                          <h3 className="font-medium text-lg">Explore</h3>
                        </BadgeGlow>
                        <p className="text-sm text-muted-foreground mt-1">Discover budget tips and ideas</p>
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
                        className="bg-card backdrop-blur-md p-4 rounded-lg shadow-sm cursor-pointer"
                        onClick={() => toast.info("Coming soon!", { description: "This feature is under development" })}
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-medium text-sm text-card-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800/30"
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
                    className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800/30"
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
      </div>
      
      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup 
          title={currentEvent.title}
          description={currentEvent.description}
          date={currentEvent.date}
          onClose={handleCloseEventPopup}
        />
      )}
      
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
              className="bg-card p-5 rounded-xl w-full max-w-xs"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-3 text-primary">New Category</h3>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-card-foreground">Category Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-background border-border text-foreground" 
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
    </div>
  );
};

const SimpleSelect: React.FC<{options: string[], defaultValue: string, small?: boolean}> = ({ options, defaultValue, small }) => {
  return (
    <select 
      defaultValue={defaultValue} 
      className={`rounded-md border border-border bg-card text-card-foreground ${
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
