import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wallet, ChevronRight, Plus, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CategoryIcon, { CategoryType } from '@/components/CategoryIcon';
import BalanceCard from '@/components/dashboard/BalanceCard';
import EventPopup from '@/components/EventPopup';
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
  
  const [activeTab, setActiveTab] = useState("overview");
  const { addExpense } = useBudget();
  
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', amount: 50, description: 'Textbooks', category: 'education', date: new Date(Date.now() - 3600000) },
    { id: 2, type: 'income', amount: 300, description: 'Money from Mom', category: 'other', date: new Date(Date.now() - 86400000) },
    { id: 3, type: 'expense', amount: 35, description: 'Lunch with friends', category: 'food', date: new Date(Date.now() - 172800000) },
    { id: 4, type: 'expense', amount: 80, description: 'Phone data', category: 'utilities', date: new Date(Date.now() - 259200000) }
  ]);

  const quickActions = [
    { id: 1, name: 'Expenses', icon: 'expenses' as CategoryType, path: '/expenses' },
    { id: 2, name: 'Income', icon: 'income' as CategoryType, path: '/income' },
    { id: 3, name: 'Savings', icon: 'savings' as CategoryType, path: '/savings' },
    { id: 4, name: 'Insights', icon: 'insights' as CategoryType, path: '/insights' },
    { id: 5, name: 'IOUs', icon: 'iou' as CategoryType, path: '/iou' },
    { id: 6, name: 'Tips', icon: 'tips' as CategoryType, path: '/tips' },
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

  const handleQuickExpense = (description: string, amount: number, category: string) => {
    setTransactions(prev => [{ id: Date.now(), type: 'expense', amount, description, category, date: new Date() }, ...prev]);
    addExpense({ amount, category, description });
    toast.success(`Expense of R${amount} added!`);
  };
  
  const handleAddIncome = () => {
    setTransactions(prev => [{ id: Date.now(), type: 'income', amount: 300, description: 'Money from Mom', category: 'other', date: new Date() }, ...prev]);
    toast.success('Income of R300 added!');
  };

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

  return (
    <div className="space-y-4">
      {showTutorial && (
        <TutorialGuide onComplete={() => { completeTutorial(); toast.success('Tutorial completed!'); }} onSkip={() => { skipTutorial(); toast.info('Tutorial skipped.'); }} />
      )}
      
      {/* Compact Greeting + Balance */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/8 via-accent/5 to-transparent border border-border/30 p-4">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Hey, Bru! 👋</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Here's your financial snapshot</p>
          </div>
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center border border-primary/10">
            <Sparkles size={18} className="text-primary" />
          </motion.div>
        </div>
      </motion.div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Quick Actions — Horizontal scroll chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {quickActions.map(action => (
          <Link to={action.path} key={action.id}>
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-card border border-border/50 rounded-xl px-3.5 py-2.5 whitespace-nowrap hover:shadow-sm transition-shadow"
            >
              <CategoryIcon category={action.icon} size={16} withBackground />
              <span className="text-xs font-medium text-card-foreground">{action.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Add */}
      <QuickExpenseTracker onAddExpense={handleQuickExpense} />

      {/* Tabs — Overview + Activity only */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-3 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg text-xs">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg text-xs">Activity</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value="overview" asChild>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Recent Transactions */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center p-3 pb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-card-foreground">Recent Activity</h3>
                    <p className="text-[10px] text-muted-foreground">Your latest transactions</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[11px] text-primary h-7 rounded-lg" onClick={handleAddIncome}>
                    <Plus size={13} className="mr-1" /> Income
                  </Button>
                </div>
                
                <div className="px-3 pb-3 space-y-1">
                  {transactions.slice(0, 4).map((t) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between items-center p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-base ${
                          t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-rose-100 dark:bg-rose-950/40'
                        }`}>
                          {getCategoryEmoji(t.category)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{t.description}</p>
                          <p className="text-[10px] text-muted-foreground">{formatTimeAgo(t.date)} · <span className="capitalize">{t.category}</span></p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.type === 'income' ? '+' : '-'}R{t.amount}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {transactions.length > 4 && (
                  <div className="border-t border-border/50 p-2.5 text-center">
                    <Button variant="ghost" size="sm" className="text-[11px] text-primary">
                      View All <ChevronRight size={13} className="ml-0.5" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Category Hubs */}
              <div className="grid grid-cols-2 gap-3">
                <CategoryHub title="Finances" icon="finances" links={financeLinks} gradient="from-primary/10 to-secondary/10" />
                <CategoryHub title="Jols" icon="jols" links={jolsLinks} gradient="from-accent/10 to-primary/10" />
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="activity" asChild>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-foreground">All Transactions</h3>
              </div>
              
              <div className="space-y-1">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border/50 p-2.5 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                          t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-rose-100 dark:bg-rose-950/40'
                        }`}>
                          {getCategoryEmoji(t.category)}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-card-foreground">{t.description}</p>
                          <p className="text-[10px] text-muted-foreground">{formatTimeAgo(t.date)} · <span className="capitalize">{t.category}</span></p>
                        </div>
                      </div>
                      <span className={`font-semibold text-xs ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.type === 'income' ? '+' : '-'}R{t.amount}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl p-6 text-center border border-border/50">
                    <Wallet className="mx-auto mb-2 text-muted-foreground" size={24} />
                    <p className="text-muted-foreground text-xs">No transactions found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
      
      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup title={currentEvent.title} description={currentEvent.description} date={currentEvent.date} onClose={() => setShowEventPopup(false)} />
      )}
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
  <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 border border-border/30`}>
    <div className="flex items-center gap-2 mb-2.5">
      <CategoryIcon category={icon} withBackground size={16} />
      <h3 className="font-semibold text-xs text-foreground">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-1">
      {links.map(link => (
        <Link key={link.path} to={link.path} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-card/60 hover:bg-card transition-colors text-[11px] font-medium text-foreground">
          <CategoryIcon category={link.icon} size={12} />
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default IndexPage;
