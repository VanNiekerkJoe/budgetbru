import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, ChevronRight, Search, Plus,
  ArrowRight, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
    { id: 1, name: 'Expenses', icon: 'expenses' as CategoryType, path: '/expenses', desc: 'Track spending' },
    { id: 2, name: 'Income', icon: 'income' as CategoryType, path: '/income', desc: 'Add earnings' },
    { id: 3, name: 'Savings', icon: 'savings' as CategoryType, path: '/savings', desc: 'Set goals' },
    { id: 4, name: 'Insights', icon: 'insights' as CategoryType, path: '/insights', desc: 'View trends' },
  ];

  const financeLinks = [
    { path: '/expenses', icon: 'expenses' as CategoryType, label: 'Expenses' },
    { path: '/savings', icon: 'savings' as CategoryType, label: 'Savings' },
    { path: '/tips', icon: 'tips' as CategoryType, label: 'Tips' },
    { path: '/iou', icon: 'iou' as CategoryType, label: 'IOU' },
  ];

  const jolsLinks = [
    { path: '/map', icon: 'map' as CategoryType, label: 'Map' },
    { path: '/community', icon: 'community' as CategoryType, label: 'Community' },
    { path: '/planning', icon: 'planning' as CategoryType, label: 'Planning' },
    { path: '/vibes', icon: 'vibes' as CategoryType, label: 'Vibes Hub' },
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
      setSearchSuggestions([
        `Add expense for ${searchTerm}`,
        `Find ${searchTerm} in transactions`,
        `Budget for ${searchTerm}`,
      ]);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchTerm]);

  const handleQuickExpense = (description: string, amount: number, category: string) => {
    setTransactions(prev => [{ id: Date.now(), type: 'expense', amount, description, category, date: new Date() }, ...prev]);
    addExpense({ amount, category, description });
    toast.success(`Expense of R${amount} added!`);
  };
  
  const handleAddIncome = () => {
    setTransactions(prev => [{ id: Date.now(), type: 'income', amount: 300, description: 'Money from Mom', category: 'other', date: new Date() }, ...prev]);
    toast.success('Income of R300 added!');
  };

  const filteredTransactions = transactions.filter(
    t => t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (date: Date) => {
    const diffHrs = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };
  
  const getCategoryEmoji = (category: string) => {
    const map: Record<string, string> = { education: '📚', food: '🍔', utilities: '💡', transport: '🚗', entertainment: '🎬', income: '💰' };
    return map[category] || '💼';
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  const exploreItems = [
    { title: 'Tips for Food Budget', category: 'Food', icon: '🍔' },
    { title: 'Save on Textbooks', category: 'Education', icon: '📚' },
    { title: 'Weekend Activities', category: 'Entertainment', icon: '🎬' },
    { title: 'Transport Tips', category: 'Transport', icon: '🚗' },
  ];

  return (
    <div className="space-y-6">
      {showTutorial && (
        <TutorialGuide onComplete={() => { completeTutorial(); toast.success('Tutorial completed!'); }} onSkip={() => { skipTutorial(); toast.info('Tutorial skipped.'); }} />
      )}
      
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Hey, Bru! 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your financial snapshot</p>
        </div>
        <motion.div whileHover={{ rotate: 15 }} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Sparkles size={18} className="text-primary" />
        </motion.div>
      </motion.div>

      {/* Search */}
      <motion.div className="relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input 
          type="text"
          placeholder="Search transactions, tips, or categories..." 
          className="pl-10 bg-card border-border/50 rounded-xl h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AnimatePresence>
          {searchSuggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full mt-1.5 bg-popover text-popover-foreground rounded-xl shadow-xl z-20 overflow-hidden border border-border"
            >
              {searchSuggestions.map((s, i) => (
                <div key={i} className="flex items-center p-3 hover:bg-muted cursor-pointer text-sm transition-colors" onClick={() => { setSearchTerm(s); setSearchSuggestions([]); }}>
                  <Search size={14} className="mr-2.5 text-muted-foreground shrink-0" />
                  {s}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <BalanceCard />
      </motion.div>

      {/* Quick Add */}
      <QuickExpenseTracker onAddExpense={handleQuickExpense} />
      
      {/* Quick Actions Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map(action => (
          <Link to={action.path} key={action.id}>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow"
            >
              <CategoryIcon category={action.icon} size={22} withBackground withAnimation />
              <span className="text-sm font-medium mt-2.5 text-card-foreground">{action.name}</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</span>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-3 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
          <TabsTrigger value="explore" className="rounded-lg">Explore</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value="overview" asChild>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Recent Transactions */}
              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                <div className="flex justify-between items-center p-4 pb-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Your latest transactions</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary h-8 rounded-lg" onClick={handleAddIncome}>
                    <Plus size={14} className="mr-1" /> Add Income
                  </Button>
                </div>
                
                <div className="px-4 pb-4 space-y-1.5">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.slice(0, 4).map((t) => (
                      <motion.div 
                        key={t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-between items-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${
                            t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-rose-100 dark:bg-rose-950/40'
                          }`}>
                            {getCategoryEmoji(t.category)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{t.description}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(t.date)} · <span className="capitalize">{t.category}</span></p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {t.type === 'income' ? '+' : '-'}R{t.amount}
                        </span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="mx-auto text-muted-foreground mb-2" size={28} />
                      <p className="text-muted-foreground text-sm">No transactions found</p>
                    </div>
                  )}
                </div>
                
                {filteredTransactions.length > 4 && (
                  <div className="border-t border-border/50 p-3 text-center">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      View All <ChevronRight size={14} className="ml-0.5" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Campus Map */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-lg h-36 relative cursor-pointer group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowMap(true)}
              >
                <MapView compact />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-white font-semibold text-sm">Campus Map</p>
                      <p className="text-white/70 text-xs">Find deals near you</p>
                    </div>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Category Hubs */}
              <div className="grid grid-cols-2 gap-4">
                <CategoryHub title="Finances" icon="finances" links={financeLinks} gradient="from-primary/10 to-secondary/10" />
                <CategoryHub title="Jols" icon="jols" links={jolsLinks} gradient="from-accent/10 to-primary/10" />
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="activity" asChild>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-foreground">All Transactions</h3>
              </div>
              
              <div className="space-y-1.5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border/50 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                          t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-rose-100 dark:bg-rose-950/40'
                        }`}>
                          {getCategoryEmoji(t.category)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-card-foreground">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(t.date)} · <span className="capitalize">{t.category}</span></p>
                        </div>
                      </div>
                      <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.type === 'income' ? '+' : '-'}R{t.amount}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl p-8 text-center border border-border/50">
                    <Wallet className="mx-auto mb-2 text-muted-foreground" size={28} />
                    <p className="text-muted-foreground text-sm">No transactions found</p>
                    {searchTerm && <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => setSearchTerm('')}>Clear Search</Button>}
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="explore" asChild>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Hero banner */}
              <div className="bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Explore</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Discover budget tips and ideas</p>
                  </div>
                  <div className="text-3xl">💡</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {exploreItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border/50 p-4 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => toast.info("Coming soon!")}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="font-medium text-sm text-card-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/20 dark:to-yellow-950/20 p-4 rounded-2xl border border-amber-200/50 dark:border-amber-800/20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎓</div>
                  <div>
                    <h3 className="font-medium text-foreground">Student Discounts</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">Tap to explore special offers</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-800/20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h3 className="font-medium text-foreground">Budget Challenges</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-0.5">Join a challenge and save more</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
      
      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup title={currentEvent.title} description={currentEvent.description} date={currentEvent.date} onClose={() => setShowEventPopup(false)} />
      )}
      
      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMap(false)}>
            <motion.div className="w-full max-w-lg mx-4 h-[500px] rounded-2xl overflow-hidden" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <MapView />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Category Modal */}
      <AnimatePresence>
        {newCategoryModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewCategoryModal(false)}>
            <motion.div className="bg-card p-5 rounded-2xl w-full max-w-xs border border-border" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-semibold mb-3 text-primary">New Category</h3>
              <div className="mb-4">
                <label className="block text-sm mb-1 text-card-foreground">Category Name</label>
                <Input placeholder="e.g. Entertainment" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setNewCategoryModal(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { if (categoryName.trim()) { toast.success(`Category "${categoryName}" added!`); setNewCategoryModal(false); setCategoryName(""); } }}>Create</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Category Hub Card */
const CategoryHub: React.FC<{
  title: string;
  icon: CategoryType;
  links: { path: string; icon: CategoryType; label: string }[];
  gradient: string;
}> = ({ title, icon, links, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 border border-border/30`}>
    <div className="flex items-center gap-2 mb-3">
      <CategoryIcon category={icon} withBackground size={18} />
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      {links.map(link => (
        <Link key={link.path} to={link.path} className="flex items-center gap-2 p-2 rounded-xl bg-card/60 hover:bg-card transition-colors text-xs font-medium text-foreground">
          <CategoryIcon category={link.icon} size={14} />
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default IndexPage;
