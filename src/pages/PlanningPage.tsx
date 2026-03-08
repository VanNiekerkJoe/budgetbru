
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Trash2, Users, Award, Clock, MapPin, 
  CheckCircle2, Circle, ChevronRight, X, Edit3, Timer,
  Banknote, ListChecks, Trophy, Star, Zap, Target,
  ArrowLeft, UserPlus, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type EventCategory = 'study' | 'social' | 'sports' | 'errands' | 'meeting';

type Task = {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
};

type CostItem = {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
};

type PlanEvent = {
  id: string;
  title: string;
  date: string;
  participants: string[];
  location: string;
  category: EventCategory;
  description: string;
  tasks: Task[];
  costs: CostItem[];
  budget: number;
};

const CATEGORY_CONFIG: Record<EventCategory, { label: string; emoji: string; color: string }> = {
  study: { label: 'Study', emoji: '📚', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  social: { label: 'Social', emoji: '🎉', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  sports: { label: 'Sports', emoji: '⚽', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  errands: { label: 'Errands', emoji: '🛒', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  meeting: { label: 'Meeting', emoji: '💼', color: 'bg-accent/10 text-accent' },
};

const TEMPLATES = [
  { emoji: '📖', label: 'Study Session', category: 'study' as EventCategory, budget: 0 },
  { emoji: '🍕', label: 'Group Dinner', category: 'social' as EventCategory, budget: 200 },
  { emoji: '🏃', label: 'Campus Run', category: 'sports' as EventCategory, budget: 0 },
  { emoji: '🛒', label: 'Grocery Run', category: 'errands' as EventCategory, budget: 300 },
  { emoji: '📝', label: 'Project Meeting', category: 'meeting' as EventCategory, budget: 0 },
  { emoji: '🎮', label: 'Game Night', category: 'social' as EventCategory, budget: 100 },
];

const ACHIEVEMENTS = [
  { id: '1', title: 'First Event', description: 'Create your first event', icon: '🎯', earned: true },
  { id: '2', title: 'Social Butterfly', description: 'Create 5 social events', icon: '🦋', earned: true },
  { id: '3', title: 'Budget Master', description: 'Stay under budget 3 times', icon: '💰', earned: false },
  { id: '4', title: 'Team Player', description: 'Add 10 participants total', icon: '🤝', earned: false },
  { id: '5', title: 'Task Slayer', description: 'Complete 20 tasks', icon: '⚔️', earned: false },
];

const INITIAL_EVENTS: PlanEvent[] = [
  {
    id: '1', title: 'Economics Study Group', date: '2025-04-10T15:00',
    participants: ['Me', 'John', 'Sarah', 'Mpho'], location: 'Library, 2nd Floor',
    category: 'study', description: 'Review chapters 5-8 for the mid-term exam.',
    tasks: [
      { id: 't1', title: 'Print past papers', assignee: 'Me', done: true },
      { id: 't2', title: 'Book study room', assignee: 'John', done: true },
      { id: 't3', title: 'Prepare summary notes', assignee: 'Sarah', done: false },
      { id: 't4', title: 'Bring snacks', assignee: 'Mpho', done: false },
    ],
    costs: [
      { id: 'c1', title: 'Printing', amount: 25, paidBy: 'Me' },
      { id: 'c2', title: 'Snacks', amount: 60, paidBy: 'Mpho' },
    ],
    budget: 100
  },
  {
    id: '2', title: 'Campus Run', date: '2025-04-12T08:00',
    participants: ['Me', 'Running Club'], location: 'Sports Field',
    category: 'sports', description: 'Morning 5K around campus.',
    tasks: [
      { id: 't5', title: 'Bring water bottles', assignee: 'Me', done: false },
    ],
    costs: [],
    budget: 0
  },
  {
    id: '3', title: 'Pizza Night', date: '2025-04-14T19:00',
    participants: ['Me', 'Sipho', 'Lerato', 'Thandi', 'James'], location: 'My Place',
    category: 'social', description: 'Chill evening with friends after a long week.',
    tasks: [
      { id: 't6', title: 'Order pizzas', assignee: 'Me', done: false },
      { id: 't7', title: 'Bring drinks', assignee: 'Sipho', done: false },
      { id: 't8', title: 'Set up music', assignee: 'Lerato', done: false },
    ],
    costs: [
      { id: 'c3', title: 'Pizzas (3x)', amount: 210, paidBy: 'Me' },
      { id: 'c4', title: 'Drinks', amount: 80, paidBy: 'Sipho' },
    ],
    budget: 350
  },
];

type View = 'list' | 'detail';
type DetailTab = 'overview' | 'tasks' | 'costs' | 'achievements';

const PlanningPage: React.FC = () => {
  const [events, setEvents] = useState<PlanEvent[]>(INITIAL_EVENTS);
  const [view, setView] = useState<View>('list');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [showCreate, setShowCreate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCostTitle, setNewCostTitle] = useState('');
  const [newCostAmount, setNewCostAmount] = useState('');
  const [newParticipant, setNewParticipant] = useState('');

  // Create form state
  const [createForm, setCreateForm] = useState({
    title: '', date: '', location: '', description: '', category: 'study' as EventCategory, budget: 0
  });

  const activeEvent = events.find(e => e.id === activeEventId);

  const openEvent = (id: string) => {
    setActiveEventId(id);
    setView('detail');
    setDetailTab('overview');
  };

  const goBack = () => {
    setView('list');
    setActiveEventId(null);
  };

  const handleCreate = () => {
    if (!createForm.title || !createForm.date) { toast.error('Title and date required'); return; }
    const event: PlanEvent = {
      id: Date.now().toString(),
      ...createForm,
      participants: ['Me'],
      tasks: [],
      costs: [],
    };
    setEvents(prev => [...prev, event]);
    setShowCreate(false);
    setCreateForm({ title: '', date: '', location: '', description: '', category: 'study', budget: 0 });
    toast.success('Event created! 🎉');
  };

  const handleTemplate = (template: typeof TEMPLATES[0]) => {
    setCreateForm(prev => ({ ...prev, title: template.label, category: template.category, budget: template.budget }));
    toast.success(`Template applied: ${template.label}`);
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (activeEventId === id) goBack();
    toast.success('Event removed');
  };

  const handleToggleTask = (taskId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== activeEventId) return e;
      return { ...e, tasks: e.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) };
    }));
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = { id: Date.now().toString(), title: newTaskTitle, assignee: 'Me', done: false };
    setEvents(prev => prev.map(e => e.id === activeEventId ? { ...e, tasks: [...e.tasks, task] } : e));
    setNewTaskTitle('');
    toast.success('Task added');
  };

  const handleAddCost = () => {
    if (!newCostTitle.trim() || !newCostAmount) return;
    const cost: CostItem = { id: Date.now().toString(), title: newCostTitle, amount: parseFloat(newCostAmount), paidBy: 'Me' };
    setEvents(prev => prev.map(e => e.id === activeEventId ? { ...e, costs: [...e.costs, cost] } : e));
    setNewCostTitle('');
    setNewCostAmount('');
    toast.success('Cost added');
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== activeEventId) return e;
      if (e.participants.includes(newParticipant)) { toast.error('Already added'); return e; }
      return { ...e, participants: [...e.participants, newParticipant] };
    }));
    setNewParticipant('');
    toast.success('Participant added');
  };

  const getCountdown = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const now = new Date();
    const days = differenceInDays(eventDate, now);
    const hours = differenceInHours(eventDate, now) % 24;
    if (days < 0) return 'Past';
    if (days === 0) return `${hours}h left`;
    return `${days}d ${hours}h`;
  };

  const filteredEvents = events.filter(e => categoryFilter === 'all' || e.category === categoryFilter);
  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = filteredEvents.filter(e => new Date(e.date) < new Date());

  const totalTasks = events.reduce((sum, e) => sum + e.tasks.length, 0);
  const completedTasks = events.reduce((sum, e) => sum + e.tasks.filter(t => t.done).length, 0);

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            {view === 'detail' ? (
              <>
                <button onClick={goBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-base font-semibold truncate max-w-[200px]">{activeEvent?.title}</h1>
                <div className="w-12" />
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    Planning
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">{events.length} events • {completedTasks}/{totalTasks} tasks done</p>
                </div>
                <Button size="sm" onClick={() => setShowCreate(true)}>
                  <Plus size={14} className="mr-1" /> New
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-lg">
        <AnimatePresence mode="wait">
          {/* ──── LIST VIEW ──── */}
          {view === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card rounded-xl border border-border p-3 text-center">
                  <div className="text-xl font-bold text-primary">{upcomingEvents.length}</div>
                  <div className="text-[10px] text-muted-foreground">Upcoming</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-3 text-center">
                  <div className="text-xl font-bold text-accent">{completedTasks}</div>
                  <div className="text-[10px] text-muted-foreground">Tasks Done</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-3 text-center">
                  <div className="text-xl font-bold text-foreground">R{events.reduce((s, e) => s + e.costs.reduce((cs, c) => cs + c.amount, 0), 0)}</div>
                  <div className="text-[10px] text-muted-foreground">Total Spent</div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    categoryFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key as EventCategory)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                      categoryFilter === key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                ))}
              </div>

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Upcoming</h2>
                  <div className="space-y-2">
                    {upcomingEvents.map(event => {
                      const catCfg = CATEGORY_CONFIG[event.category];
                      const tasksDone = event.tasks.filter(t => t.done).length;
                      const totalCost = event.costs.reduce((s, c) => s + c.amount, 0);
                      return (
                        <motion.button
                          key={event.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => openEvent(event.id)}
                          className="w-full text-left bg-card rounded-xl border border-border p-3.5 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            {/* Date Block */}
                            <div className="bg-primary/5 rounded-lg p-2 text-center shrink-0 w-12">
                              <div className="text-[10px] text-primary font-medium uppercase">
                                {format(new Date(event.date), 'MMM')}
                              </div>
                              <div className="text-lg font-bold text-primary">
                                {format(new Date(event.date), 'd')}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-medium text-sm truncate">{event.title}</h3>
                                <Badge className={`text-[9px] px-1.5 h-4 ${catCfg.color}`}>{catCfg.emoji}</Badge>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-0.5"><Clock size={10} />{format(new Date(event.date), 'HH:mm')}</span>
                                <span className="flex items-center gap-0.5"><MapPin size={10} />{event.location}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <Users size={10} /> {event.participants.length}
                                </span>
                                {event.tasks.length > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <ListChecks size={10} /> {tasksDone}/{event.tasks.length}
                                  </span>
                                )}
                                {totalCost > 0 && (
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Banknote size={10} /> R{totalCost}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge variant="outline" className="text-[9px] h-5">
                                <Timer size={8} className="mr-0.5" /> {getCountdown(event.date)}
                              </Badge>
                              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>

                          {/* Task progress bar */}
                          {event.tasks.length > 0 && (
                            <div className="mt-2">
                              <Progress value={(tasksDone / event.tasks.length) * 100} className="h-1" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Past</h2>
                  <div className="space-y-2 opacity-60">
                    {pastEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => openEvent(event.id)}
                        className="w-full text-left bg-card rounded-xl border border-border p-3 flex items-center gap-3"
                      >
                        <span className="text-lg">{CATEGORY_CONFIG[event.category].emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{event.title}</span>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(event.date), 'MMM d')}</span>
                        </div>
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="mx-auto mb-2" size={32} />
                  <p className="text-sm">No events yet</p>
                  <Button size="sm" className="mt-3" onClick={() => setShowCreate(true)}>
                    <Plus size={14} className="mr-1" /> Create One
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* ──── DETAIL VIEW ──── */}
          {view === 'detail' && activeEvent && (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Event Header Card */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge className={`text-[10px] mb-1.5 ${CATEGORY_CONFIG[activeEvent.category].color}`}>
                      {CATEGORY_CONFIG[activeEvent.category].emoji} {CATEGORY_CONFIG[activeEvent.category].label}
                    </Badge>
                    <h2 className="text-lg font-bold">{activeEvent.title}</h2>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Timer size={10} className="mr-0.5" /> {getCountdown(activeEvent.date)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={12} />{format(new Date(activeEvent.date), 'EEE, MMM d • HH:mm')}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} />{activeEvent.location}</span>
                </div>
                {activeEvent.description && (
                  <p className="text-sm text-muted-foreground mt-2">{activeEvent.description}</p>
                )}
              </div>

              {/* Detail Tabs */}
              <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
                {([
                  { id: 'overview', label: 'Overview', icon: Sparkles },
                  { id: 'tasks', label: 'Tasks', icon: ListChecks },
                  { id: 'costs', label: 'Costs', icon: Banknote },
                  { id: 'achievements', label: 'Awards', icon: Trophy },
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs font-medium transition-all ${
                      detailTab === tab.id ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Overview */}
                {detailTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {/* Participants */}
                    <div className="bg-card rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold flex items-center gap-1.5"><Users size={14} /> Participants ({activeEvent.participants.length})</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {activeEvent.participants.map((p, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add person..."
                          value={newParticipant}
                          onChange={(e) => setNewParticipant(e.target.value)}
                          className="h-8 text-xs flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
                        />
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleAddParticipant}>
                          <UserPlus size={12} />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-card rounded-xl border border-border p-2.5 text-center">
                        <div className="text-base font-bold text-primary">{activeEvent.tasks.filter(t => t.done).length}/{activeEvent.tasks.length}</div>
                        <div className="text-[9px] text-muted-foreground">Tasks</div>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-2.5 text-center">
                        <div className="text-base font-bold text-accent">R{activeEvent.costs.reduce((s, c) => s + c.amount, 0)}</div>
                        <div className="text-[9px] text-muted-foreground">Spent</div>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-2.5 text-center">
                        <div className="text-base font-bold">{activeEvent.budget > 0 ? `R${activeEvent.budget}` : '—'}</div>
                        <div className="text-[9px] text-muted-foreground">Budget</div>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    {activeEvent.budget > 0 && (
                      <div className="bg-card rounded-xl border border-border p-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Budget Usage</span>
                          <span className="font-medium">R{activeEvent.costs.reduce((s, c) => s + c.amount, 0)} / R{activeEvent.budget}</span>
                        </div>
                        <Progress value={(activeEvent.costs.reduce((s, c) => s + c.amount, 0) / activeEvent.budget) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Danger Zone */}
                    <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => handleDelete(activeEvent.id)}>
                      <Trash2 size={12} className="mr-1" /> Delete Event
                    </Button>
                  </motion.div>
                )}

                {/* Tasks */}
                {detailTab === 'tasks' && (
                  <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {activeEvent.tasks.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Progress value={(activeEvent.tasks.filter(t => t.done).length / activeEvent.tasks.length) * 100} className="h-1.5 flex-1" />
                        <span>{activeEvent.tasks.filter(t => t.done).length}/{activeEvent.tasks.length} done</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {activeEvent.tasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            task.done ? 'bg-muted/30 border-border' : 'bg-card border-border hover:border-primary/30'
                          }`}
                        >
                          {task.done ? (
                            <CheckCircle2 size={18} className="text-primary shrink-0" />
                          ) : (
                            <Circle size={18} className="text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className={`text-sm ${task.done ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                            <span className="text-[10px] text-muted-foreground block">{task.assignee}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a task..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="h-9 text-sm flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                      />
                      <Button size="sm" className="h-9" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Costs */}
                {detailTab === 'costs' && (
                  <motion.div key="costs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {activeEvent.budget > 0 && (
                      <div className="bg-card rounded-xl border border-border p-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Budget</span>
                          <span className="font-medium">R{activeEvent.costs.reduce((s, c) => s + c.amount, 0)} / R{activeEvent.budget}</span>
                        </div>
                        <Progress value={(activeEvent.costs.reduce((s, c) => s + c.amount, 0) / activeEvent.budget) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {activeEvent.costs.map(cost => (
                        <div key={cost.id} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                          <div>
                            <div className="text-sm font-medium">{cost.title}</div>
                            <div className="text-[10px] text-muted-foreground">Paid by {cost.paidBy}</div>
                          </div>
                          <span className="text-sm font-semibold text-primary">R{cost.amount}</span>
                        </div>
                      ))}
                    </div>

                    {activeEvent.costs.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-sm">No costs recorded yet</div>
                    )}

                    {/* Per-person split */}
                    {activeEvent.costs.length > 0 && activeEvent.participants.length > 1 && (
                      <div className="bg-primary/5 rounded-xl border border-primary/10 p-3">
                        <h4 className="text-xs font-semibold mb-1.5">Even Split</h4>
                        <div className="text-sm">
                          R{Math.round(activeEvent.costs.reduce((s, c) => s + c.amount, 0) / activeEvent.participants.length)} per person
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input placeholder="Cost item" value={newCostTitle} onChange={(e) => setNewCostTitle(e.target.value)} className="h-9 text-sm flex-1" />
                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                        <Input placeholder="0" type="number" value={newCostAmount} onChange={(e) => setNewCostAmount(e.target.value)} className="h-9 text-sm pl-6" />
                      </div>
                      <Button size="sm" className="h-9" onClick={handleAddCost} disabled={!newCostTitle.trim()}>
                        <Plus size={14} />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Achievements */}
                {detailTab === 'achievements' && (
                  <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                    {ACHIEVEMENTS.map(ach => (
                      <div
                        key={ach.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          ach.earned ? 'bg-card border-primary/20' : 'bg-muted/30 border-border opacity-60'
                        }`}
                      >
                        <span className="text-2xl">{ach.icon}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{ach.title}</div>
                          <div className="text-[10px] text-muted-foreground">{ach.description}</div>
                        </div>
                        {ach.earned ? (
                          <CheckCircle2 size={16} className="text-primary" />
                        ) : (
                          <Circle size={16} className="text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && setShowCreate(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                <h2 className="text-lg font-bold">Create Event</h2>
                <button onClick={() => setShowCreate(false)}><X size={20} className="text-muted-foreground" /></button>
              </div>

              <div className="p-4 space-y-4">
                {/* Templates */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Templates</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(tpl => (
                      <button
                        key={tpl.label}
                        onClick={() => handleTemplate(tpl)}
                        className="p-2.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
                      >
                        <span className="text-xl">{tpl.emoji}</span>
                        <div className="text-[10px] text-muted-foreground mt-1">{tpl.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Event Title *</label>
                  <Input value={createForm.title} onChange={(e) => setCreateForm(f => ({ ...f, title: e.target.value }))} placeholder="Study session, dinner..." className="h-9 text-sm" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Date & Time *</label>
                  <Input type="datetime-local" value={createForm.date} onChange={(e) => setCreateForm(f => ({ ...f, date: e.target.value }))} className="h-9 text-sm" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                  <Input value={createForm.location} onChange={(e) => setCreateForm(f => ({ ...f, location: e.target.value }))} placeholder="Library, my place..." className="h-9 text-sm" />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setCreateForm(f => ({ ...f, category: key as EventCategory }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          createForm.category === key ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'
                        }`}
                      >
                        {cfg.emoji} {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget (optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">R</span>
                    <Input type="number" value={createForm.budget || ''} onChange={(e) => setCreateForm(f => ({ ...f, budget: parseFloat(e.target.value) || 0 }))} className="h-9 text-sm pl-7" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                  <textarea
                    className="w-full bg-transparent border border-border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                    rows={2}
                    value={createForm.description}
                    onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Optional notes..."
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreate}>Create Event</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanningPage;
