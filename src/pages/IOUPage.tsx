import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, Check, Clock, ArrowUpRight, ArrowDownLeft,
  Search, Filter, ChevronDown, ChevronUp, Send, Bell, History,
  UserPlus, HandCoins, Wallet, AlertTriangle, CheckCircle2,
  MessageSquare, Calendar, X, Share2, BarChart3, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type IOUStatus = 'pending' | 'reminded' | 'partial' | 'settled';

interface IOUItem {
  id: string;
  person: string;
  amount: number;
  paidAmount: number;
  description: string;
  date: string;
  dueDate?: string;
  isOwedToMe: boolean;
  status: IOUStatus;
  category: string;
  notes: string[];
  avatar: string;
}

interface SplitItem {
  id: string;
  title: string;
  totalAmount: number;
  participants: { name: string; share: number; paid: boolean }[];
  date: string;
}

const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Food & Drinks', emoji: '🍕' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'bills', label: 'Bills', emoji: '📄' },
  { value: 'rent', label: 'Rent', emoji: '🏠' },
  { value: 'other', label: 'Other', emoji: '💸' },
];

const AVATARS = ['😎', '🙂', '😊', '🤓', '😄', '🥳', '😏', '🧑‍💻', '👩‍🎓', '👨‍💼'];
const getAvatar = (name: string) => AVATARS[name.charCodeAt(0) % AVATARS.length];

const STATUS_META: Record<IOUStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-warning/15 text-warning', icon: <Clock size={10} /> },
  reminded: { label: 'Reminded', color: 'bg-primary/15 text-primary', icon: <Bell size={10} /> },
  partial: { label: 'Partial', color: 'bg-accent/15 text-accent-foreground', icon: <TrendingUp size={10} /> },
  settled: { label: 'Settled', color: 'bg-success/15 text-success', icon: <CheckCircle2 size={10} /> },
};

const INITIAL_IOUS: IOUItem[] = [
  { id: '1', person: 'James', amount: 150, paidAmount: 0, description: 'Pizza night', date: '2026-03-01', dueDate: '2026-03-15', isOwedToMe: true, status: 'pending', category: 'food', notes: ['Split 3 ways, he forgot wallet'], avatar: '😎' },
  { id: '2', person: 'Sarah', amount: 250, paidAmount: 0, description: 'Concert tickets', date: '2026-02-28', isOwedToMe: false, status: 'pending', category: 'entertainment', notes: [], avatar: '😊' },
  { id: '3', person: 'Thabo', amount: 400, paidAmount: 200, description: 'Uber rides (Feb)', date: '2026-02-20', isOwedToMe: true, status: 'partial', category: 'transport', notes: ['Paid R200 on 1 March'], avatar: '🤓' },
  { id: '4', person: 'Lerato', amount: 180, paidAmount: 180, description: 'Lunch at Nando\'s', date: '2026-02-15', isOwedToMe: true, status: 'settled', category: 'food', notes: ['Paid in full'], avatar: '😄' },
  { id: '5', person: 'Kyle', amount: 350, paidAmount: 0, description: 'Electricity split', date: '2026-03-05', dueDate: '2026-03-10', isOwedToMe: false, status: 'reminded', category: 'bills', notes: ['Reminded on WhatsApp'], avatar: '😏' },
  { id: '6', person: 'Naledi', amount: 120, paidAmount: 0, description: 'Groceries run', date: '2026-03-07', isOwedToMe: true, status: 'pending', category: 'food', notes: [], avatar: '🥳' },
];

const INITIAL_SPLITS: SplitItem[] = [
  { id: 's1', title: 'Birthday Dinner at Ocean Basket', totalAmount: 1200, date: '2026-03-02', participants: [
    { name: 'You', share: 300, paid: true }, { name: 'James', share: 300, paid: true },
    { name: 'Sarah', share: 300, paid: false }, { name: 'Thabo', share: 300, paid: false }
  ]},
  { id: 's2', title: 'Road Trip Fuel', totalAmount: 800, date: '2026-02-25', participants: [
    { name: 'You', share: 200, paid: true }, { name: 'Kyle', share: 200, paid: true },
    { name: 'Lerato', share: 200, paid: true }, { name: 'Naledi', share: 200, paid: false }
  ]},
];

const IOUPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [items, setItems] = useState<IOUItem[]>(INITIAL_IOUS);
  const [splits, setSplits] = useState<SplitItem[]>(INITIAL_SPLITS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'owed' | 'owe'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');

  const [newIOU, setNewIOU] = useState({ person: '', amount: '', description: '', isOwedToMe: true, category: 'other', dueDate: '' });
  const [newSplit, setNewSplit] = useState({ title: '', amount: '', participants: '' });

  const activeItems = useMemo(() => items.filter(i => i.status !== 'settled'), [items]);
  const settledItems = useMemo(() => items.filter(i => i.status === 'settled'), [items]);

  const filtered = useMemo(() => {
    let list = activeItems;
    if (filterType === 'owed') list = list.filter(i => i.isOwedToMe);
    if (filterType === 'owe') list = list.filter(i => !i.isOwedToMe);
    if (searchTerm) list = list.filter(i => i.person.toLowerCase().includes(searchTerm.toLowerCase()) || i.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeItems, filterType, searchTerm]);

  const totalOwed = useMemo(() => items.filter(i => i.isOwedToMe && i.status !== 'settled').reduce((s, i) => s + (i.amount - i.paidAmount), 0), [items]);
  const totalOwe = useMemo(() => items.filter(i => !i.isOwedToMe && i.status !== 'settled').reduce((s, i) => s + (i.amount - i.paidAmount), 0), [items]);
  const net = totalOwed - totalOwe;

  const personSummary = useMemo(() => {
    const map: Record<string, { owed: number; owe: number }> = {};
    items.filter(i => i.status !== 'settled').forEach(i => {
      const remaining = i.amount - i.paidAmount;
      if (!map[i.person]) map[i.person] = { owed: 0, owe: 0 };
      if (i.isOwedToMe) map[i.person].owed += remaining;
      else map[i.person].owe += remaining;
    });
    return Object.entries(map).map(([name, v]) => ({ name, net: v.owed - v.owe, owed: v.owed, owe: v.owe })).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }, [items]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach(i => { map[i.category] = (map[i.category] || 0) + i.amount; });
    return Object.entries(map).map(([cat, val]) => {
      const opt = CATEGORY_OPTIONS.find(c => c.value === cat);
      return { name: opt ? opt.emoji + ' ' + opt.label : cat, value: val };
    });
  }, [items]);

  const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--accent))', '#a855f7', '#6b7280'];

  const handleAdd = () => {
    if (!newIOU.person || !newIOU.amount || !newIOU.description) { toast.error('Fill in all fields'); return; }
    const amt = parseFloat(newIOU.amount);
    if (isNaN(amt) || amt <= 0) { toast.error('Enter a valid amount'); return; }
    setItems(prev => [{
      id: Date.now().toString(), person: newIOU.person, amount: amt, paidAmount: 0,
      description: newIOU.description, date: new Date().toISOString().split('T')[0],
      dueDate: newIOU.dueDate || undefined, isOwedToMe: newIOU.isOwedToMe, status: 'pending' as IOUStatus,
      category: newIOU.category, notes: [], avatar: getAvatar(newIOU.person),
    }, ...prev]);
    setNewIOU({ person: '', amount: '', description: '', isOwedToMe: true, category: 'other', dueDate: '' });
    setShowAddForm(false);
    toast.success('IOU added! 🤝');
  };

  const handleAddSplit = () => {
    if (!newSplit.title || !newSplit.amount || !newSplit.participants) { toast.error('Fill in all fields'); return; }
    const amt = parseFloat(newSplit.amount);
    const names = newSplit.participants.split(',').map(n => n.trim()).filter(Boolean);
    if (names.length === 0) { toast.error('Add at least one participant'); return; }
    const allNames = ['You', ...names];
    const share = Math.round(amt / allNames.length);
    setSplits(prev => [{ id: Date.now().toString(), title: newSplit.title, totalAmount: amt, date: new Date().toISOString().split('T')[0],
      participants: allNames.map(n => ({ name: n, share, paid: n === 'You' }))
    }, ...prev]);
    // Auto-create IOUs for each participant
    names.forEach(name => {
      setItems(prev => [{ id: `${Date.now()}-${name}`, person: name, amount: share, paidAmount: 0,
        description: `Split: ${newSplit.title}`, date: new Date().toISOString().split('T')[0],
        isOwedToMe: true, status: 'pending' as IOUStatus, category: 'other', notes: ['Auto-created from bill split'], avatar: getAvatar(name),
      }, ...prev]);
    });
    setNewSplit({ title: '', amount: '', participants: '' });
    setShowSplitForm(false);
    toast.success(`Bill split between ${allNames.length} people! 🧾`);
  };

  const markSettled = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'settled' as IOUStatus, paidAmount: i.amount, notes: [...i.notes, `Settled on ${new Date().toLocaleDateString('en-ZA')}`] } : i));
    toast.success('Marked as settled! ✅');
  };

  const sendReminder = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'reminded' as IOUStatus, notes: [...i.notes, `Reminder sent ${new Date().toLocaleDateString('en-ZA')}`] } : i));
    toast.success('Reminder sent! 📩');
  };

  const recordPartial = (id: string, amount: number) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newPaid = Math.min(i.paidAmount + amount, i.amount);
      const newStatus: IOUStatus = newPaid >= i.amount ? 'settled' : 'partial';
      return { ...i, paidAmount: newPaid, status: newStatus, notes: [...i.notes, `Received ${formatCurrency(amount)} on ${new Date().toLocaleDateString('en-ZA')}`] };
    }));
    toast.success(`Partial payment recorded! 💰`);
  };

  const addNote = (id: string) => {
    if (!newNote.trim()) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes: [...i.notes, newNote.trim()] } : i));
    setNewNote('');
    toast.success('Note added');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setExpandedId(null);
    toast.success('IOU deleted');
  };

  const getDaysLeft = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(dueDate).getTime() - today.getTime()) / (86400000));
  };

  const [partialAmt, setPartialAmt] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 pb-28">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-20 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '14s' }} />
        <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-success/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border py-5 px-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <HandCoins size={16} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">IOU Tracker</h1>
                  <p className="text-[11px] text-muted-foreground">Who owes who — sorted</p>
                </div>
              </div>
              <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 p-0 shadow-lg">
                <Plus size={18} />
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-success/10 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground">They Owe Me</p>
                <p className="text-sm font-bold text-success">{formatCurrency(totalOwed)}</p>
              </div>
              <div className="bg-destructive/10 rounded-xl p-2.5 text-center">
                <p className="text-[10px] text-muted-foreground">I Owe Them</p>
                <p className="text-sm font-bold text-destructive">{formatCurrency(totalOwe)}</p>
              </div>
              <div className={`rounded-xl p-2.5 text-center ${net >= 0 ? 'bg-primary/10' : 'bg-warning/10'}`}>
                <p className="text-[10px] text-muted-foreground">Net Balance</p>
                <p className={`text-sm font-bold ${net >= 0 ? 'text-primary' : 'text-warning'}`}>
                  {net >= 0 ? '+' : '-'}{formatCurrency(Math.abs(net))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4 max-w-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-card/60 backdrop-blur-md border border-border">
            <TabsTrigger value="active" className="text-xs gap-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Clock size={13} /> Active
            </TabsTrigger>
            <TabsTrigger value="split" className="text-xs gap-1 data-[state=active]:bg-accent/10 data-[state=active]:text-accent-foreground">
              <Users size={13} /> Split
            </TabsTrigger>
            <TabsTrigger value="people" className="text-xs gap-1 data-[state=active]:bg-warning/10 data-[state=active]:text-warning">
              <UserPlus size={13} /> People
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1 data-[state=active]:bg-success/10 data-[state=active]:text-success">
              <History size={13} /> History
            </TabsTrigger>
          </TabsList>

          {/* ACTIVE TAB */}
          <TabsContent value="active">
            <AnimatePresence mode="wait">
              <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                {/* Filter Bar */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search name or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-background/50 h-9 text-sm" />
                  </div>
                  <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                    <SelectTrigger className="w-28 bg-background/50 h-9 text-xs">
                      <Filter size={12} className="mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="owed">They Owe</SelectItem>
                      <SelectItem value="owe">I Owe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Overdue Alert */}
                {filtered.some(i => i.isOwedToMe && i.dueDate && getDaysLeft(i.dueDate)! < 0) && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-destructive flex-shrink-0" />
                    <p className="text-xs text-foreground">
                      <span className="font-semibold text-destructive">Overdue!</span> {filtered.filter(i => i.isOwedToMe && i.dueDate && getDaysLeft(i.dueDate)! < 0).length} IOU(s) past due date
                    </p>
                  </div>
                )}

                {/* IOU List */}
                {filtered.length > 0 ? (
                  <div className="space-y-2">
                    {filtered.map((item, idx) => {
                      const isExpanded = expandedId === item.id;
                      const remaining = item.amount - item.paidAmount;
                      const daysLeft = getDaysLeft(item.dueDate);
                      const isOverdue = daysLeft !== null && daysLeft < 0;
                      const catOpt = CATEGORY_OPTIONS.find(c => c.value === item.category);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          layout
                          className={`bg-card/60 backdrop-blur-xl rounded-xl border overflow-hidden transition-colors ${isOverdue ? 'border-destructive/30' : 'border-border'}`}
                        >
                          <div className="p-3.5 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-xl flex-shrink-0">
                                {item.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h3 className="text-sm font-semibold text-foreground">{item.person}</h3>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${STATUS_META[item.status].color}`}>
                                    {STATUS_META[item.status].icon} {STATUS_META[item.status].label}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{catOpt?.emoji} {item.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                                  {daysLeft !== null && item.status !== 'settled' && (
                                    <span className={`text-[10px] ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                      {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={`text-sm font-bold ${item.isOwedToMe ? 'text-success' : 'text-destructive'}`}>
                                  {item.isOwedToMe ? '+' : '-'}{formatCurrency(remaining)}
                                </p>
                                {item.paidAmount > 0 && item.paidAmount < item.amount && (
                                  <p className="text-[10px] text-muted-foreground">{formatCurrency(item.paidAmount)} paid</p>
                                )}
                                <div className="flex items-center justify-end mt-0.5">
                                  {item.isOwedToMe ? <ArrowDownLeft size={10} className="text-success" /> : <ArrowUpRight size={10} className="text-destructive" />}
                                </div>
                              </div>
                            </div>
                            {/* Progress bar for partial */}
                            {item.paidAmount > 0 && item.paidAmount < item.amount && (
                              <div className="mt-2">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(item.paidAmount / item.amount) * 100}%` }} className="h-full bg-success rounded-full" />
                                </div>
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-3.5 pb-3.5 border-t border-border pt-3 space-y-3">
                                  {/* Action Buttons */}
                                  <div className="flex gap-1.5 flex-wrap">
                                    {item.status !== 'settled' && (
                                      <>
                                        <Button size="sm" className="h-7 text-[11px] bg-success hover:bg-success/90 text-success-foreground" onClick={() => markSettled(item.id)}>
                                          <CheckCircle2 size={12} className="mr-1" /> Settle
                                        </Button>
                                        {item.isOwedToMe && (
                                          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => sendReminder(item.id)}>
                                            <Send size={12} className="mr-1" /> Remind
                                          </Button>
                                        )}
                                      </>
                                    )}
                                    <Button size="sm" variant="ghost" className="h-7 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteItem(item.id)}>
                                      <Trash2 size={12} className="mr-1" /> Delete
                                    </Button>
                                  </div>

                                  {/* Partial Payment */}
                                  {item.status !== 'settled' && item.isOwedToMe && (
                                    <div className="flex gap-2">
                                      <div className="relative flex-1">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                                        <Input type="number" placeholder="0" className="pl-6 h-8 text-xs bg-background/50" value={partialAmt} onChange={e => setPartialAmt(e.target.value)} />
                                      </div>
                                      <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={() => { const a = parseFloat(partialAmt); if (a > 0) { recordPartial(item.id, a); setPartialAmt(''); } }}>
                                        Record Payment
                                      </Button>
                                    </div>
                                  )}

                                  {/* Notes */}
                                  {item.notes.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1"><MessageSquare size={10} /> Notes</p>
                                      {item.notes.map((n, i) => (
                                        <p key={i} className="text-[11px] text-muted-foreground bg-muted/20 rounded-md px-2 py-1">• {n}</p>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <Input placeholder="Add a note..." className="h-7 text-xs bg-background/50" value={expandedId === item.id ? newNote : ''} onChange={e => setNewNote(e.target.value)} />
                                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => addNote(item.id)}>Add</Button>
                                  </div>

                                  {/* Details */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-muted/20 rounded-lg p-2 text-center">
                                      <p className="text-[9px] text-muted-foreground">Total</p>
                                      <p className="text-xs font-bold text-foreground">{formatCurrency(item.amount)}</p>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-2 text-center">
                                      <p className="text-[9px] text-muted-foreground">Paid</p>
                                      <p className="text-xs font-bold text-success">{formatCurrency(item.paidAmount)}</p>
                                    </div>
                                    <div className="bg-muted/20 rounded-lg p-2 text-center">
                                      <p className="text-[9px] text-muted-foreground">Remaining</p>
                                      <p className="text-xs font-bold text-destructive">{formatCurrency(remaining)}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <HandCoins size={32} className="mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-semibold text-foreground mb-1">No active IOUs</h3>
                    <p className="text-xs text-muted-foreground mb-3">{searchTerm ? 'Try a different search' : 'All settled up! 🎉'}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* SPLIT TAB */}
          <TabsContent value="split">
            <AnimatePresence mode="wait">
              <motion.div key="split" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/15 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Users size={14} className="text-primary" /> Bill Splitting</h3>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowSplitForm(!showSplitForm)}>
                      <Plus size={12} className="mr-1" /> New Split
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Split expenses equally — IOUs are auto-created for each person</p>
                </div>

                <AnimatePresence>
                  {showSplitForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border space-y-3">
                        <Input placeholder="What's the bill for?" value={newSplit.title} onChange={e => setNewSplit({ ...newSplit, title: e.target.value })} className="bg-background/50 h-9 text-sm" />
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                          <Input type="number" placeholder="Total amount" value={newSplit.amount} onChange={e => setNewSplit({ ...newSplit, amount: e.target.value })} className="pl-7 bg-background/50 h-9 text-sm" />
                        </div>
                        <Input placeholder="Names (comma separated): James, Sarah, Thabo" value={newSplit.participants} onChange={e => setNewSplit({ ...newSplit, participants: e.target.value })} className="bg-background/50 h-9 text-sm" />
                        {newSplit.amount && newSplit.participants && (
                          <p className="text-xs text-primary">
                            = {formatCurrency(Math.round(parseFloat(newSplit.amount || '0') / (newSplit.participants.split(',').filter(Boolean).length + 1)))} per person ({newSplit.participants.split(',').filter(Boolean).length + 1} people)
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setShowSplitForm(false)}>Cancel</Button>
                          <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddSplit}>Split Bill</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {splits.map((split, idx) => {
                  const unpaid = split.participants.filter(p => !p.paid);
                  const paidPct = Math.round(((split.participants.length - unpaid.length) / split.participants.length) * 100);
                  return (
                    <motion.div key={split.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{split.title}</h4>
                          <p className="text-[10px] text-muted-foreground">{new Date(split.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{formatCurrency(split.totalAmount)}</p>
                          <p className="text-[10px] text-muted-foreground">{formatCurrency(Math.round(split.totalAmount / split.participants.length))} each</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${paidPct}%` }} className="h-full bg-success rounded-full" />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {split.participants.map(p => (
                          <span key={p.name} className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${p.paid ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                            {p.paid ? <CheckCircle2 size={9} /> : <Clock size={9} />} {p.name}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                {splits.length === 0 && (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <Users size={28} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No bill splits yet</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* PEOPLE TAB */}
          <TabsContent value="people">
            <AnimatePresence mode="wait">
              <motion.div key="people" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-3">
                {/* Per-person summary */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <UserPlus size={14} className="text-primary" /> Balance by Person
                  </h3>
                  {personSummary.length > 0 ? (
                    <div className="space-y-2">
                      {personSummary.map(p => (
                        <div key={p.name} className="flex items-center gap-3 p-2 bg-muted/20 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center text-lg flex-shrink-0">
                            {getAvatar(p.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{p.name}</p>
                            <div className="flex gap-3 text-[10px] text-muted-foreground">
                              {p.owed > 0 && <span className="text-success">Owes me {formatCurrency(p.owed)}</span>}
                              {p.owe > 0 && <span className="text-destructive">I owe {formatCurrency(p.owe)}</span>}
                            </div>
                          </div>
                          <p className={`text-sm font-bold ${p.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {p.net >= 0 ? '+' : ''}{formatCurrency(p.net)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No active balances</p>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 size={14} className="text-accent-foreground" /> IOU Categories
                  </h3>
                  {categoryData.length > 0 ? (
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                            {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}
                  <div className="space-y-1 mt-2">
                    {categoryData.map((c, i) => (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="flex-1 text-foreground">{c.name}</span>
                        <span className="text-muted-foreground">{formatCurrency(c.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <AnimatePresence mode="wait">
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mt-3">
                <div className="bg-card/60 backdrop-blur-xl rounded-xl p-3 border border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{settledItems.length} settled IOUs</span>
                  <span className="text-xs text-success font-medium">{formatCurrency(settledItems.reduce((s, i) => s + i.amount, 0))} total</span>
                </div>

                {settledItems.length > 0 ? (
                  settledItems.map((item, idx) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                      className="bg-card/40 backdrop-blur-xl rounded-xl p-3.5 border border-border opacity-70">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center text-lg flex-shrink-0">{item.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-medium text-foreground">{item.person}</h3>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-success/15 text-success flex items-center gap-0.5"><CheckCircle2 size={8} /> Settled</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground line-through">{formatCurrency(item.amount)}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-card/60 backdrop-blur-xl rounded-xl p-8 border border-border text-center">
                    <History size={28} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No settled IOUs yet</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add IOU Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card border-t border-border rounded-t-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">New IOU</h3>
                <button onClick={() => setShowAddForm(false)}><X size={18} className="text-muted-foreground" /></button>
              </div>

              {/* Direction Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setNewIOU({ ...newIOU, isOwedToMe: true })}
                  className={`p-3 rounded-xl text-center transition-all ${newIOU.isOwedToMe ? 'bg-success/15 ring-1 ring-success/30' : 'bg-muted/20'}`}>
                  <ArrowDownLeft size={18} className={`mx-auto mb-1 ${newIOU.isOwedToMe ? 'text-success' : 'text-muted-foreground'}`} />
                  <p className="text-xs font-medium text-foreground">They owe me</p>
                </button>
                <button onClick={() => setNewIOU({ ...newIOU, isOwedToMe: false })}
                  className={`p-3 rounded-xl text-center transition-all ${!newIOU.isOwedToMe ? 'bg-destructive/15 ring-1 ring-destructive/30' : 'bg-muted/20'}`}>
                  <ArrowUpRight size={18} className={`mx-auto mb-1 ${!newIOU.isOwedToMe ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <p className="text-xs font-medium text-foreground">I owe them</p>
                </button>
              </div>

              <Input placeholder="Person's name" value={newIOU.person} onChange={e => setNewIOU({ ...newIOU, person: e.target.value })} className="bg-background/50 h-10" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                <Input type="number" placeholder="0.00" value={newIOU.amount} onChange={e => setNewIOU({ ...newIOU, amount: e.target.value })} className="pl-8 bg-background/50 h-10" />
              </div>
              <Input placeholder="What's it for?" value={newIOU.description} onChange={e => setNewIOU({ ...newIOU, description: e.target.value })} className="bg-background/50 h-10" />

              {/* Category */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {CATEGORY_OPTIONS.map(c => (
                  <button key={c.value} onClick={() => setNewIOU({ ...newIOU, category: c.value })}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 transition-all flex-shrink-0 ${newIOU.category === c.value ? 'bg-primary/15 ring-1 ring-primary/30 text-primary' : 'bg-muted/20 text-muted-foreground'}`}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              <Input type="date" value={newIOU.dueDate} onChange={e => setNewIOU({ ...newIOU, dueDate: e.target.value })} className="bg-background/50 h-10 text-sm" />
              <p className="text-[10px] text-muted-foreground -mt-2">Optional: set a due date for reminders</p>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11" onClick={handleAdd}>
                <HandCoins size={16} className="mr-2" /> Add IOU
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IOUPage;
