
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Heart, Users, Copy, Check, Plus, Trash2, Send,
  Target, ShoppingCart, MessageCircle, LinkIcon, Unlink,
  ArrowUpDown, Gift, Star, ExternalLink, Sparkles,
  DollarSign, TrendingUp, Calendar
} from 'lucide-react';

interface CoupleLink {
  id: string;
  user_id_1: string;
  user_id_2: string | null;
  invite_code: string;
  status: string;
  created_at: string;
}

interface SharedExpense {
  id: string;
  couple_link_id: string;
  added_by: string;
  description: string;
  amount: number;
  category: string;
  split_type: string;
  split_percentage: number;
  date: string;
  created_at: string;
}

interface SharedGoal {
  id: string;
  couple_link_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
}

interface WishlistItem {
  id: string;
  couple_link_id: string;
  added_by: string;
  title: string;
  estimated_cost: number;
  priority: string;
  is_purchased: boolean;
  url: string | null;
}

interface CoupleMessage {
  id: string;
  couple_link_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface GoalContribution {
  id: string;
  goal_id: string;
  contributor_id: string;
  amount: number;
  contribution_date: string;
  created_at: string;
}

const EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Groceries', emoji: '🛒' },
  { id: 'dining', label: 'Dining', emoji: '🍽️' },
  { id: 'rent', label: 'Rent/Home', emoji: '🏠' },
  { id: 'utilities', label: 'Utilities', emoji: '💡' },
  { id: 'transport', label: 'Transport', emoji: '🚗' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'health', label: 'Health', emoji: '💊' },
  { id: 'date', label: 'Date Night', emoji: '💕' },
  { id: 'other', label: 'Other', emoji: '📦' },
];

const GOAL_ICONS = ['🎯', '🏠', '✈️', '💍', '🚗', '👶', '🎓', '💰', '🎉', '❤️'];

const CouplesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupleLink, setCoupleLink] = useState<CoupleLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Data states
  const [expenses, setExpenses] = useState<SharedExpense[]>([]);
  const [goals, setGoals] = useState<SharedGoal[]>([]);
  const [goalContributions, setGoalContributions] = useState<GoalContribution[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [messages, setMessages] = useState<CoupleMessage[]>([]);

  // Form states
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Expense form
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('other');
  const [expSplitType, setExpSplitType] = useState('50/50');
  const [expSplitPct, setExpSplitPct] = useState('50');

  // Goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎯');

  // Wishlist form
  const [wishTitle, setWishTitle] = useState('');
  const [wishCost, setWishCost] = useState('');
  const [wishPriority, setWishPriority] = useState('medium');
  const [wishUrl, setWishUrl] = useState('');

  const fetchCoupleLink = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('couple_links')
        .select('*')
        .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching couple link:', error);
        toast.error('Failed to load couple information');
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const link = data[0];
        setCoupleLink(link);
        
        if (link.status === 'pending' && link.user_id_1 === user.id) {
          setInviteCode(link.invite_code);
        }
        
        // If we have an active link and we're on auth page, redirect to couples
        if (link.status === 'active' && window.location.pathname === '/auth') {
          navigate('/couples');
        }
      } else {
        setCoupleLink(null);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
    }
    
    setLoading(false);
  }, [user, navigate]);

  const fetchAllData = useCallback(async () => {
    if (!coupleLink || coupleLink.status !== 'active') return;
    const linkId = coupleLink.id;

    const [expRes, goalRes, wishRes, msgRes] = await Promise.all([
      supabase.from('couple_shared_expenses').select('*').eq('couple_link_id', linkId).order('date', { ascending: false }),
      supabase.from('couple_shared_goals').select('*').eq('couple_link_id', linkId).order('created_at', { ascending: false }),
      supabase.from('couple_wishlists').select('*').eq('couple_link_id', linkId).order('created_at', { ascending: false }),
      supabase.from('couple_messages').select('*').eq('couple_link_id', linkId).order('created_at', { ascending: true }),
    ]);

    // Fetch contributions for the goals we found
    const goalIds = goalRes.data?.map(g => g.id) || [];
    let contributions: GoalContribution[] = [];
    
    if (goalIds.length > 0) {
      const contribRes = await supabase.from('couple_goal_contributions')
        .select('*')
        .in('goal_id', goalIds)
        .order('created_at', { ascending: false });
      contributions = contribRes.data || [];
    }

    if (expRes.data) setExpenses(expRes.data);
    if (goalRes.data) setGoals(goalRes.data);
    if (wishRes.data) setWishlist(wishRes.data);
    if (msgRes.data) setMessages(msgRes.data);
    setGoalContributions(contributions);
  }, [coupleLink]);

  useEffect(() => { fetchCoupleLink(); }, [fetchCoupleLink]);
  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // Set up real-time subscription for couple link changes
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel(`couple-links-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'couple_links',
      }, (payload: any) => {
        console.log('Couple link changed:', payload);
        
        // Check if this change is relevant to current user
        const newData = payload.new;
        const oldData = payload.old;
        
        const isRelevant = newData?.user_id_1 === user.id || 
                          newData?.user_id_2 === user.id ||
                          oldData?.user_id_1 === user.id || 
                          oldData?.user_id_2 === user.id;
        
        if (isRelevant) {
          // Refresh couple link data when any change occurs
          fetchCoupleLink();
          
          // Show toast notification when partner joins
          if (payload.eventType === 'UPDATE' && 
              newData?.status === 'active' && 
              oldData?.status === 'pending' &&
              newData?.user_id_1 === user.id) {
            toast.success('🎉 Your partner joined! You are now linked! 💑');
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchCoupleLink]);

  // Realtime messages
  useEffect(() => {
    if (!coupleLink || coupleLink.status !== 'active') return;
    const channel = supabase
      .channel(`couple-messages-${coupleLink.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'couple_messages',
        filter: `couple_link_id=eq.${coupleLink.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as CoupleMessage]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleLink]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Actions ---
  const handleCreateInvite = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('couple_links')
        .insert({ user_id_1: user.id })
        .select()
        .single();
        
      if (error) { 
        toast.error('Failed to create invite'); 
        setLoading(false);
        return; 
      }
      
      setCoupleLink(data);
      setInviteCode(data.invite_code);
      toast.success('Invite code created! Share it with your partner 💕');
      setLoading(false);
    } catch (error) {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const handleJoinCouple = async () => {
    if (!user || !joinCode.trim()) return;
    setLoading(true);
    
    try {
      const { data: link } = await supabase
        .from('couple_links')
        .select('*')
        .eq('invite_code', joinCode.trim())
        .eq('status', 'pending')
        .single();

      if (!link) { 
        toast.error('Invalid or expired invite code'); 
        setLoading(false);
        return; 
      }
      if (link.user_id_1 === user.id) { 
        toast.error("You can't join your own invite!"); 
        setLoading(false);
        return; 
      }

      const { error } = await supabase
        .from('couple_links')
        .update({ user_id_2: user.id, status: 'active' })
        .eq('id', link.id);

      if (error) { 
        toast.error('Failed to join'); 
        setLoading(false);
        return; 
      }
      
      toast.success('You are now linked! 💑');
      setJoinCode('');
      
      // Update the local state immediately
      const updatedLink = { ...link, user_id_2: user.id, status: 'active' };
      setCoupleLink(updatedLink);
      
      // Navigate to couples page if we're not already there
      if (window.location.pathname !== '/couples') {
        navigate('/couples');
      }
      
      setLoading(false);
    } catch (error) {
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    if (!coupleLink) return;
    await supabase.from('couple_links').update({ status: 'declined' }).eq('id', coupleLink.id);
    setCoupleLink(null);
    setExpenses([]);
    setGoals([]);
    setWishlist([]);
    setMessages([]);
    toast.success('Couple link removed');
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied!');
  };

  // Expenses
  const handleAddExpense = async () => {
    if (!user || !coupleLink || !expDesc.trim() || !expAmount) return;
    
    // Determine split percentage based on split type
    let splitPercentage = 50;
    if (expSplitType === 'pay_full') {
      splitPercentage = 100; // I pay 100%, partner owes 0%
    } else if (expSplitType === 'custom') {
      splitPercentage = Number(expSplitPct);
    }
    
    const { error } = await supabase.from('couple_shared_expenses').insert({
      couple_link_id: coupleLink.id,
      added_by: user.id,
      description: expDesc.trim(),
      amount: Number(expAmount),
      category: expCategory,
      split_type: expSplitType,
      split_percentage: splitPercentage,
    });
    if (error) { toast.error('Failed to add expense'); return; }
    toast.success('Expense added');
    setExpDesc(''); setExpAmount(''); setExpCategory('other'); setExpSplitType('50/50'); setShowExpenseForm(false);
    fetchAllData();
  };

  const handleDeleteExpense = async (id: string) => {
    await supabase.from('couple_shared_expenses').delete().eq('id', id);
    fetchAllData();
  };

  // Goals
  const handleAddGoal = async () => {
    if (!coupleLink || !goalTitle.trim() || !goalTarget) return;
    const { error } = await supabase.from('couple_shared_goals').insert({
      couple_link_id: coupleLink.id,
      title: goalTitle.trim(),
      target_amount: Number(goalTarget),
      deadline: goalDeadline || null,
      icon: goalIcon,
    });
    if (error) { toast.error('Failed to add goal'); return; }
    toast.success('Goal created! 🎯');
    setGoalTitle(''); setGoalTarget(''); setGoalDeadline(''); setGoalIcon('🎯'); setShowGoalForm(false);
    fetchAllData();
  };

  const handleContributeGoal = async (goal: SharedGoal, amount: number) => {
    if (!user) return;
    
    // Add the contribution record
    const { error: contribError } = await supabase.from('couple_goal_contributions').insert({
      goal_id: goal.id,
      contributor_id: user.id,
      amount: amount,
    });
    
    if (contribError) { 
      toast.error('Failed to record contribution'); 
      return; 
    }

    // Update the goal's total amount
    const newAmount = Math.min(goal.current_amount + amount, goal.target_amount);
    const { error: goalError } = await supabase.from('couple_shared_goals').update({ 
      current_amount: newAmount 
    }).eq('id', goal.id);
    
    if (goalError) { 
      toast.error('Failed to update goal'); 
      return; 
    }
    
    if (newAmount >= goal.target_amount) toast.success('🎉 Goal achieved! Congratulations!');
    else toast.success(`Added ${formatCurrency(amount)} to "${goal.title}"`);
    fetchAllData();
  };

  const handleDeleteGoal = async (id: string) => {
    await supabase.from('couple_shared_goals').delete().eq('id', id);
    fetchAllData();
  };

  // Wishlist
  const handleAddWishlistItem = async () => {
    if (!user || !coupleLink || !wishTitle.trim()) return;
    const { error } = await supabase.from('couple_wishlists').insert({
      couple_link_id: coupleLink.id,
      added_by: user.id,
      title: wishTitle.trim(),
      estimated_cost: Number(wishCost) || 0,
      priority: wishPriority,
      url: wishUrl.trim() || null,
    });
    if (error) { toast.error('Failed to add item'); return; }
    toast.success('Wishlist item added! 🎁');
    setWishTitle(''); setWishCost(''); setWishPriority('medium'); setWishUrl(''); setShowWishlistForm(false);
    fetchAllData();
  };

  const handleTogglePurchased = async (item: WishlistItem) => {
    await supabase.from('couple_wishlists').update({ is_purchased: !item.is_purchased }).eq('id', item.id);
    fetchAllData();
  };

  const handleDeleteWishlistItem = async (id: string) => {
    await supabase.from('couple_wishlists').delete().eq('id', id);
    fetchAllData();
  };

  // Messages
  const handleSendMessage = async () => {
    if (!user || !coupleLink || !newMessage.trim()) return;
    const { error } = await supabase.from('couple_messages').insert({
      couple_link_id: coupleLink.id,
      sender_id: user.id,
      message: newMessage.trim(),
    });
    if (error) { toast.error('Failed to send'); return; }
    setNewMessage('');
  };

  // --- Computed ---
  const totalSharedExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const myShare = expenses.reduce((s, e) => {
    const pct = e.added_by === user?.id ? (100 - e.split_percentage) : e.split_percentage;
    return s + (Number(e.amount) * pct / 100);
  }, 0);
  const partnerShare = totalSharedExpenses - myShare;

  // Helper function to get my contribution to a specific goal
  const getMyContribution = (goalId: string): number => {
    return goalContributions
      .filter(c => c.goal_id === goalId && c.contributor_id === user?.id)
      .reduce((sum, c) => sum + Number(c.amount), 0);
  };

  // Helper function to get partner's contribution to a specific goal
  const getPartnerContribution = (goalId: string): number => {
    return goalContributions
      .filter(c => c.goal_id === goalId && c.contributor_id !== user?.id)
      .reduce((sum, c) => sum + Number(c.amount), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not linked yet
  if (!coupleLink || coupleLink.status === 'declined') {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-8">
          <div className="w-20 h-20 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-pink-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Couples Finance</h1>
          <p className="text-muted-foreground mt-2">Link with your partner to track finances together</p>
        </motion.div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5" /> Create Invite</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Generate a code to share with your partner</p>
            <Button onClick={handleCreateInvite} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Invite Code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Join Partner</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Enter the code your partner shared with you</p>
            <div className="flex gap-2">
              <Input placeholder="Enter invite code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
              <Button onClick={handleJoinCouple} disabled={!joinCode.trim()}>Join</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending invite (creator waiting)
  if (coupleLink.status === 'pending' && coupleLink.user_id_1 === user?.id) {
    return (
      <div className="p-4 pb-24 max-w-lg mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-8">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Waiting for Partner</h1>
          <p className="text-muted-foreground mt-2">Share this code with your partner to link up</p>
        </motion.div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
              <code className="flex-1 text-center text-2xl font-bold tracking-widest text-foreground">{inviteCode}</code>
              <Button size="icon" variant="ghost" onClick={copyInviteCode}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={handleUnlink} className="w-full">
              <Unlink className="w-4 h-4 mr-2" /> Cancel Invite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active couple — full UI
  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> Couples Finance
          </h1>
          <p className="text-sm text-muted-foreground">Managing finances together 💑</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleUnlink} className="text-destructive hover:text-destructive">
          <Unlink className="w-4 h-4" />
        </Button>
      </motion.div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs">Expenses</TabsTrigger>
          <TabsTrigger value="goals" className="text-xs">Goals</TabsTrigger>
          <TabsTrigger value="wishlist" className="text-xs">Wishlist</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
        </TabsList>

        {/* DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border-pink-500/20">
              <CardContent className="pt-4 text-center">
                <DollarSign className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Total Shared</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(totalSharedExpenses)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20">
              <CardContent className="pt-4 text-center">
                <ArrowUpDown className="w-6 h-6 text-violet-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Your Share</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(myShare)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border-emerald-500/20">
              <CardContent className="pt-4 text-center">
                <Target className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Active Goals</p>
                <p className="text-lg font-bold text-foreground">{goals.filter(g => g.current_amount < g.target_amount).length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/20">
              <CardContent className="pt-4 text-center">
                <Gift className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Wishlist</p>
                <p className="text-lg font-bold text-foreground">{wishlist.filter(w => !w.is_purchased).length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent activity */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {expenses.length === 0 && goals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet — start adding shared expenses or goals!</p>
              ) : (
                <div className="space-y-2">
                  {expenses.slice(0, 5).map(e => {
                    const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
                    return (
                      <div key={e.id} className="flex items-center justify-between text-sm py-1.5">
                        <span>{cat?.emoji} {e.description}</span>
                        <span className="font-medium text-foreground">{formatCurrency(e.amount)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPENSES */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Shared Expenses</h3>
            <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <AnimatePresence>
            {showExpenseForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <Input placeholder="Description" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
                    <Input type="number" placeholder="Amount (R)" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
                    <div className="flex flex-wrap gap-1.5">
                      {EXPENSE_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setExpCategory(cat.id)}
                          className={`px-2 py-1 rounded-lg text-xs transition-all ${expCategory === cat.id ? 'bg-primary/15 text-primary ring-1 ring-primary/30' : 'bg-muted/50 text-muted-foreground'}`}>
                          {cat.emoji} {cat.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant={expSplitType === '50/50' ? 'default' : 'outline'} onClick={() => setExpSplitType('50/50')}>50/50</Button>
                      <Button size="sm" variant={expSplitType === 'pay_full' ? 'default' : 'outline'} onClick={() => setExpSplitType('pay_full')}>I'll Pay Full</Button>
                      <Button size="sm" variant={expSplitType === 'custom' ? 'default' : 'outline'} onClick={() => setExpSplitType('custom')}>Custom</Button>
                    </div>
                    {expSplitType === 'pay_full' && (
                      <p className="text-xs text-muted-foreground">You're covering this expense fully — no split.</p>
                    )}
                    {expSplitType === 'custom' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">My %:</span>
                        <Input type="number" value={expSplitPct} onChange={(e) => setExpSplitPct(e.target.value)} className="w-20" />
                      </div>
                    )}
                    <Button onClick={handleAddExpense} className="w-full" disabled={!expDesc.trim() || !expAmount}>Add Expense</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Balance summary */}
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div><p className="text-muted-foreground text-xs">Total</p><p className="font-bold">{formatCurrency(totalSharedExpenses)}</p></div>
                <div><p className="text-muted-foreground text-xs">You Owe</p><p className="font-bold text-orange-500">{formatCurrency(myShare)}</p></div>
                <div><p className="text-muted-foreground text-xs">Partner Owes</p><p className="font-bold text-emerald-500">{formatCurrency(partnerShare)}</p></div>
              </div>
            </CardContent>
          </Card>

          {expenses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No shared expenses yet</p>
          ) : (
            <div className="space-y-2">
              {expenses.map(e => {
                const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
                return (
                  <motion.div key={e.id} layout className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat?.emoji || '📦'}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{e.description}</p>
                        <p className="text-xs text-muted-foreground">{e.date} · {e.split_type === '50/50' ? '50/50' : e.split_type === 'pay_full' ? 'I paid full' : `${e.split_percentage}%`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{formatCurrency(e.amount)}</span>
                      <button onClick={() => handleDeleteExpense(e.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* GOALS */}
        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Shared Goals</h3>
            <Button size="sm" onClick={() => setShowGoalForm(!showGoalForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <AnimatePresence>
            {showGoalForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <Input placeholder="Goal title" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
                    <Input type="number" placeholder="Target amount (R)" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
                    <Input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} />
                    <div className="flex gap-1.5 flex-wrap">
                      {GOAL_ICONS.map(icon => (
                        <button key={icon} onClick={() => setGoalIcon(icon)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${goalIcon === icon ? 'bg-primary/15 ring-1 ring-primary/30' : 'bg-muted/50'}`}>
                          {icon}
                        </button>
                      ))}
                    </div>
                    <Button onClick={handleAddGoal} className="w-full" disabled={!goalTitle.trim() || !goalTarget}>Create Goal</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No shared goals yet — dream together! ✨</p>
          ) : (
            <div className="space-y-3">
              {goals.map(goal => {
                const pct = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                const completed = pct >= 100;
                const myContribution = getMyContribution(goal.id);
                const partnerContribution = getPartnerContribution(goal.id);
                return (
                  <Card key={goal.id} className={completed ? 'border-emerald-500/30 bg-emerald-500/5' : ''}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <p className="font-semibold text-foreground">{goal.title}</p>
                            {goal.deadline && <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {goal.deadline}</p>}
                          </div>
                        </div>
                        {completed && <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">🎉 Done!</Badge>}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(goal.current_amount)}</span>
                          <span>{formatCurrency(goal.target_amount)}</span>
                        </div>
                        <Progress value={Math.min(pct, 100)} className="h-2" />
                        
                        {/* Individual contributions */}
                        {(myContribution > 0 || partnerContribution > 0) && (
                          <div className="flex justify-between text-xs pt-1 border-t border-border/50">
                            <span className="text-primary font-medium">You: {formatCurrency(myContribution)}</span>
                            <span className="text-muted-foreground">Partner: {formatCurrency(partnerContribution)}</span>
                          </div>
                        )}
                      </div>
                      {!completed && (
                        <div className="flex gap-2">
                          {[50, 100, 500].map(amt => (
                            <Button key={amt} size="sm" variant="outline" onClick={() => handleContributeGoal(goal, amt)}>
                              +R{amt}
                            </Button>
                          ))}
                        </div>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* WISHLIST */}
        <TabsContent value="wishlist" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Shared Wishlist</h3>
            <Button size="sm" onClick={() => setShowWishlistForm(!showWishlistForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <AnimatePresence>
            {showWishlistForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <Input placeholder="Item name" value={wishTitle} onChange={(e) => setWishTitle(e.target.value)} />
                    <Input type="number" placeholder="Estimated cost (R)" value={wishCost} onChange={(e) => setWishCost(e.target.value)} />
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map(p => (
                        <Button key={p} size="sm" variant={wishPriority === p ? 'default' : 'outline'} onClick={() => setWishPriority(p)} className="capitalize">{p}</Button>
                      ))}
                    </div>
                    <Input placeholder="Link (optional)" value={wishUrl} onChange={(e) => setWishUrl(e.target.value)} />
                    <Button onClick={handleAddWishlistItem} className="w-full" disabled={!wishTitle.trim()}>Add to Wishlist</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {wishlist.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No wishlist items yet — start dreaming! 🎁</p>
          ) : (
            <div className="space-y-2">
              {wishlist.map(item => (
                <motion.div key={item.id} layout className={`flex items-center justify-between p-3 rounded-xl border ${item.is_purchased ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-card border-border'}`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleTogglePurchased(item)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.is_purchased ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground/30'}`}>
                      {item.is_purchased && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${item.is_purchased ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{item.priority}</Badge>
                        {item.estimated_cost > 0 && <span className="text-xs text-muted-foreground">{formatCurrency(item.estimated_cost)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => handleDeleteWishlistItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* LOVE NOTES */}
        <TabsContent value="notes" className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-500" /> Love Notes
          </h3>
          <Card className="h-[50vh] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto pt-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Send your first love note! 💌</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-3 border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <Input placeholder="Type a love note..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouplesPage;
