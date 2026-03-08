
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Heart, Star, MessageCircle, Share2, MapPin, Clock, Users, 
  TrendingUp, Flame, Bookmark, Send, Image, Smile, Plus, Search,
  ThumbsUp, Music, Zap, Coffee, PartyPopper, GraduationCap, Trophy,
  ChevronRight, X, CheckCircle2, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type EventCategory = 'social' | 'academic' | 'sports' | 'arts' | 'party' | 'food';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  likes: number;
  category: EventCategory;
  attendees: number;
  maxAttendees?: number;
  price: number;
  isRSVP: boolean;
  isSaved: boolean;
  description: string;
  host: string;
};

type Story = {
  id: string;
  user: string;
  avatar: string;
  isViewed: boolean;
  isLive: boolean;
};

type VibePost = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  date: string;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  type: 'text' | 'poll' | 'mood' | 'achievement';
};

type TrendingTopic = {
  tag: string;
  posts: number;
  trending: 'up' | 'hot' | 'new';
};

const CATEGORY_CONFIG: Record<EventCategory, { label: string; emoji: string; color: string }> = {
  social: { label: 'Social', emoji: '🎉', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  academic: { label: 'Academic', emoji: '📚', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  sports: { label: 'Sports', emoji: '⚽', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  arts: { label: 'Arts', emoji: '🎨', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  party: { label: 'Party', emoji: '🪩', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  food: { label: 'Food', emoji: '🍕', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
};

const STORIES: Story[] = [
  { id: 'you', user: 'Your Story', avatar: '➕', isViewed: false, isLive: false },
  { id: '1', user: 'SiphoM', avatar: 'S', isViewed: false, isLive: true },
  { id: '2', user: 'LeratoK', avatar: 'L', isViewed: false, isLive: false },
  { id: '3', user: 'JamesT', avatar: 'J', isViewed: true, isLive: false },
  { id: '4', user: 'ThandiN', avatar: 'T', isViewed: false, isLive: true },
  { id: '5', user: 'KobusV', avatar: 'K', isViewed: true, isLive: false },
  { id: '6', user: 'NalediP', avatar: 'N', isViewed: false, isLive: false },
];

const EVENTS: Event[] = [
  {
    id: '1', title: 'Campus Night Market', date: 'Apr 8', time: '18:00', location: 'Student Center',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    likes: 45, category: 'food', attendees: 89, maxAttendees: 200, price: 0, isRSVP: false, isSaved: false,
    description: 'Street food, live music, and great vibes. Free entry!', host: 'Student Council'
  },
  {
    id: '2', title: 'End of Semester Bash', date: 'May 15', time: '20:00', location: 'Club XYZ',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    likes: 112, category: 'party', attendees: 342, price: 50, isRSVP: true, isSaved: true,
    description: 'The biggest party of the year. DJs, dancers, and more!', host: 'Events Committee'
  },
  {
    id: '3', title: 'Exam Prep Workshop', date: 'Apr 20', time: '14:00', location: 'Library Hall',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
    likes: 28, category: 'academic', attendees: 45, maxAttendees: 60, price: 0, isRSVP: false, isSaved: false,
    description: 'Study techniques and past paper walkthroughs.', host: 'Academic Society'
  },
  {
    id: '4', title: 'Inter-Res Soccer Final', date: 'Apr 12', time: '15:00', location: 'Sports Field',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
    likes: 67, category: 'sports', attendees: 156, price: 0, isRSVP: false, isSaved: false,
    description: 'The final match of the inter-residence tournament!', host: 'Sports Council'
  },
  {
    id: '5', title: 'Open Mic Night', date: 'Apr 18', time: '19:00', location: 'Arts Building',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80',
    likes: 34, category: 'arts', attendees: 67, price: 10, isRSVP: false, isSaved: false,
    description: 'Poetry, music, comedy — share your talent!', host: 'Creative Arts Club'
  },
];

const VIBE_POSTS: VibePost[] = [
  {
    id: '1', author: 'JohannesBRU', avatar: 'J',
    content: 'Just aced my Economics final! Celebrating at Aandklas tonight if anyone wants to join! 🎉💰',
    likes: 24, comments: 5, shares: 2, date: '2h ago', isLiked: false, isSaved: false, tags: ['ExamSeason', 'Winning'],
    type: 'achievement'
  },
  {
    id: '2', author: 'MphoVibes', avatar: 'M',
    content: 'The campus food court is serving free coffee today until 2pm. Get it while it\'s hot! ☕',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    likes: 42, comments: 8, shares: 15, date: '4h ago', isLiked: true, isSaved: true, tags: ['FreeCoffee', 'CampusLife'],
    type: 'text'
  },
  {
    id: '3', author: 'BudgetBoss', avatar: 'B',
    content: 'Saved R500 this month just by meal prepping! Here\'s my weekly grocery list that costs under R150 🛒',
    likes: 89, comments: 23, shares: 45, date: '6h ago', isLiked: false, isSaved: false, tags: ['BudgetTips', 'MealPrep', 'Savings'],
    type: 'text'
  },
  {
    id: '4', author: 'LekkerLeigh', avatar: 'L',
    content: 'Current campus mood: stressed but blessed 😅📖 Who else is living in the library this week?',
    likes: 56, comments: 18, shares: 3, date: '1d ago', isLiked: false, isSaved: false, tags: ['ExamSeason', 'LibraryLife'],
    type: 'mood'
  },
];

const TRENDING: TrendingTopic[] = [
  { tag: '#ExamSeason', posts: 234, trending: 'hot' },
  { tag: '#BudgetHacks', posts: 156, trending: 'up' },
  { tag: '#CampusLife', posts: 98, trending: 'up' },
  { tag: '#MealPrep', posts: 67, trending: 'new' },
  { tag: '#FreeStuff', posts: 45, trending: 'hot' },
];

const MOOD_OPTIONS = [
  { emoji: '🔥', label: 'Lit' },
  { emoji: '📚', label: 'Studying' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🎉', label: 'Vibing' },
  { emoji: '😤', label: 'Stressed' },
  { emoji: '💪', label: 'Motivated' },
];

type TabId = 'events' | 'vibes' | 'trending';

const VibesHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('events');
  const [events, setEvents] = useState(EVENTS);
  const [posts, setPosts] = useState(VIBE_POSTS);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [searchEvents, setSearchEvents] = useState('');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const handleRSVP = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const newRSVP = !e.isRSVP;
      toast.success(newRSVP ? 'You\'re going! 🎉' : 'RSVP cancelled');
      return { ...e, isRSVP: newRSVP, attendees: e.attendees + (newRSVP ? 1 : -1) };
    }));
  };

  const handleSaveEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      toast.success(e.isSaved ? 'Removed from saved' : 'Event saved! 🔖');
      return { ...e, isSaved: !e.isSaved };
    }));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) };
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      toast.success(p.isSaved ? 'Removed from saved' : 'Post saved!');
      return { ...p, isSaved: !p.isSaved };
    }));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) { toast.error('Write something first!'); return; }
    const post: VibePost = {
      id: Date.now().toString(), author: 'You', avatar: '🙋',
      content: newPost + (selectedMood ? ` ${selectedMood}` : ''),
      likes: 0, comments: 0, shares: 0, date: 'now', isLiked: false, isSaved: false, tags: [], type: 'text'
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedMood(null);
    toast.success('Posted! +5 vibes ✨');
  };

  const filteredEvents = events.filter(e => {
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
    const matchSearch = !searchEvents || e.title.toLowerCase().includes(searchEvents.toLowerCase());
    return matchCat && matchSearch;
  });

  const tabs = [
    { id: 'events' as TabId, label: 'Events', icon: Calendar, count: events.length },
    { id: 'vibes' as TabId, label: 'Vibes', icon: Flame, count: posts.length },
    { id: 'trending' as TabId, label: 'Trending', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Zap size={18} className="text-primary-foreground" />
                </div>
                Vibes Hub
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Campus life, events & social</p>
            </div>
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-xs">
              <Star size={12} className="mr-1" /> 2,450 vibes
            </Badge>
          </div>
        </div>
      </header>

      {/* Stories */}
      <div className="bg-card/50 border-b border-border">
        <div className="container mx-auto max-w-lg px-4 py-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {STORIES.map(story => (
              <button
                key={story.id}
                onClick={() => story.id === 'you' ? toast.info('Story creation coming soon!') : toast.info(`Viewing ${story.user}'s story`)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className={`relative h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  story.id === 'you' 
                    ? 'border-2 border-dashed border-muted-foreground/30 text-muted-foreground' 
                    : story.isViewed 
                      ? 'bg-muted text-muted-foreground' 
                      : 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                } ${!story.isViewed && story.id !== 'you' ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                  {story.avatar}
                  {story.isLive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] bg-destructive text-destructive-foreground px-1.5 rounded-full font-medium">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground w-12 truncate text-center">{story.user}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sticky top-[73px] z-10 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-lg px-4">
          <div className="flex gap-1 py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.count && (
                  <span className={`text-[10px] px-1.5 rounded-full ${
                    activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 max-w-lg">
        <AnimatePresence mode="wait">
          {/* ──── EVENTS TAB ──── */}
          {activeTab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  placeholder="Search events..." 
                  className="pl-9 h-9 text-sm"
                  value={searchEvents}
                  onChange={(e) => setSearchEvents(e.target.value)}
                />
              </div>

              {/* Category Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    categoryFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All Events
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

              {/* Event Cards */}
              {filteredEvents.map(event => {
                const catCfg = CATEGORY_CONFIG[event.category];
                const isExpanded = expandedEvent === event.id;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <Badge className={`text-[10px] ${catCfg.color}`}>{catCfg.emoji} {catCfg.label}</Badge>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button
                          onClick={() => handleSaveEvent(event.id)}
                          className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                            event.isSaved ? 'bg-primary/80 text-primary-foreground' : 'bg-black/30 text-white hover:bg-black/50'
                          }`}
                        >
                          <Bookmark size={14} fill={event.isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-3 right-3">
                        <h3 className="text-white font-semibold text-lg leading-tight">{event.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-white/80 text-xs">
                          <span className="flex items-center gap-1"><Calendar size={10} />{event.date}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                              <div key={i} className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 border border-card text-[8px] flex items-center justify-center text-primary-foreground font-bold">
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{event.attendees} going</span>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {event.price === 0 ? 'FREE' : `R${event.price}`}
                        </div>
                      </div>

                      {event.maxAttendees && (
                        <div className="mb-2">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                            <span>Spots filling up</span>
                            <span>{event.attendees}/{event.maxAttendees}</span>
                          </div>
                          <Progress value={(event.attendees / event.maxAttendees) * 100} className="h-1" />
                        </div>
                      )}

                      {/* Expand */}
                      <button
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        className="text-[11px] text-primary font-medium mb-2 flex items-center gap-0.5"
                      >
                        {isExpanded ? 'Show less' : 'More details'}
                        <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <p className="text-xs text-muted-foreground mb-3">Hosted by <strong>{event.host}</strong></p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          variant={event.isRSVP ? 'outline' : 'default'}
                          onClick={() => handleRSVP(event.id)}
                        >
                          {event.isRSVP ? (
                            <><CheckCircle2 size={12} className="mr-1" /> Going</>
                          ) : (
                            <><Plus size={12} className="mr-1" /> RSVP</>
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => { navigator.clipboard.writeText(`Check out: ${event.title}`); toast.success('Link copied!'); }}>
                          <Share2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="mx-auto mb-2" size={32} />
                  <p className="text-sm">No events found</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ──── VIBES TAB ──── */}
          {activeTab === 'vibes' && (
            <motion.div key="vibes" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              {/* Composer */}
              <div className="bg-card rounded-xl border border-border p-3">
                <textarea
                  className="w-full bg-transparent resize-none text-sm placeholder:text-muted-foreground focus:outline-none"
                  rows={2}
                  placeholder="What's the vibe? ✨"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                {/* Mood picker */}
                <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                  {MOOD_OPTIONS.map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(selectedMood === mood.emoji ? null : mood.emoji)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition-all ${
                        selectedMood === mood.emoji 
                          ? 'bg-primary/10 border-primary/30 text-primary' 
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-primary transition-colors"><Image size={16} /></button>
                    <button className="text-muted-foreground hover:text-primary transition-colors"><Smile size={16} /></button>
                  </div>
                  <Button size="sm" className="h-7 text-xs" onClick={handleSubmitPost} disabled={!newPost.trim()}>
                    <Send size={12} className="mr-1" /> Post
                  </Button>
                </div>
              </div>

              {/* Campus Mood Meter */}
              <div className="bg-card rounded-xl border border-border p-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Campus Mood Right Now</h3>
                <div className="flex justify-between">
                  {[
                    { emoji: '📚', label: 'Studying', pct: 35 },
                    { emoji: '🎉', label: 'Vibing', pct: 25 },
                    { emoji: '😴', label: 'Tired', pct: 20 },
                    { emoji: '💪', label: 'Motivated', pct: 15 },
                    { emoji: '😤', label: 'Stressed', pct: 5 },
                  ].map(m => (
                    <div key={m.label} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{m.emoji}</span>
                      <div className="h-12 w-3 bg-muted rounded-full overflow-hidden flex flex-col-reverse">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${m.pct}%` }}
                          className="bg-primary rounded-full"
                          transition={{ delay: 0.3, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts */}
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm">{post.author}</span>
                          {post.type === 'achievement' && <Trophy size={12} className="text-yellow-500" />}
                          {post.type === 'mood' && <Smile size={12} className="text-primary" />}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{post.date}</span>
                      </div>
                      <button onClick={() => handleSavePost(post.id)}>
                        <Bookmark size={16} className={post.isSaved ? 'text-primary fill-primary' : 'text-muted-foreground'} />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 mb-2 flex-wrap">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-primary font-medium">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.image && (
                    <img src={post.image} alt="" className="w-full h-48 object-cover" loading="lazy" />
                  )}
                  <div className="px-3 py-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 transition-colors ${post.isLiked ? 'text-primary' : 'hover:text-primary'}`}
                    >
                      <Heart size={14} fill={post.isLiked ? 'currentColor' : 'none'} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary" onClick={() => toast.info('Comments coming soon!')}>
                      <MessageCircle size={14} /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary" onClick={() => toast.info('Share coming soon!')}>
                      <Share2 size={14} /> {post.shares}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ──── TRENDING TAB ──── */}
          {activeTab === 'trending' && (
            <motion.div key="trending" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> What's Trending
              </h2>

              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                {TRENDING.map((topic, i) => (
                  <button
                    key={topic.tag}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    onClick={() => toast.info(`Showing posts for ${topic.tag}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground/50">{i + 1}</span>
                      <div>
                        <div className="font-medium text-sm">{topic.tag}</div>
                        <div className="text-[11px] text-muted-foreground">{topic.posts} posts</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${
                      topic.trending === 'hot' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      topic.trending === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30' :
                      'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {topic.trending === 'hot' && <><Flame size={10} className="mr-0.5" /> Hot</>}
                      {topic.trending === 'up' && <><TrendingUp size={10} className="mr-0.5" /> Rising</>}
                      {topic.trending === 'new' && <><Zap size={10} className="mr-0.5" /> New</>}
                    </Badge>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-xl border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-primary">1.2K</div>
                  <div className="text-xs text-muted-foreground">Posts Today</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 text-center">
                  <div className="text-2xl font-bold text-accent">348</div>
                  <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
              </div>

              {/* Popular Tags Cloud */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {['StudentLife', 'BudgetHacks', 'ExamSeason', 'FreeStuff', 'MealPrep', 'SideHustle', 'CampusFood', 'StudyGroup', 'Deals', 'Motivation', 'Jozi', 'Varsity'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => toast.info(`#${tag}`)}
                      className="px-2.5 py-1 rounded-full text-xs border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default VibesHubPage;
