
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Users, Heart, School, ShoppingBag, Gift, 
  Search, Plus, Smile, Reply, Pin, Megaphone, BarChart3, 
  CheckCircle2, Circle, Clock, UserPlus, X, TrendingUp,
  Flame, Star, ThumbsUp, ImageIcon, Hash
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Marketplace from '@/components/community/Marketplace';
import DonationPlanner from '@/components/community/DonationPlanner';

type Reaction = '❤️' | '😂' | '🔥' | '👍' | '😮';

type Message = {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions: Record<Reaction, number>;
  myReactions: Reaction[];
  replyTo?: { sender: string; text: string };
  isPinned?: boolean;
  isAnnouncement?: boolean;
};

type Channel = {
  id: string;
  name: string;
  icon: React.ReactNode;
  unread: number;
  members: number;
  description: string;
};

type Poll = {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  myVote: number | null;
  endsIn: string;
  author: string;
};

type CommunityMember = {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  bio: string;
  mutualFriends: number;
  isFriend: boolean;
  campus: string;
  points: number;
};

const REACTIONS: Reaction[] = ['❤️', '😂', '🔥', '👍', '😮'];

const CHANNELS: Channel[] = [
  { id: 'general', name: 'General', icon: <Hash size={14} />, unread: 3, members: 245, description: 'Campus-wide chat' },
  { id: 'finance', name: 'Money Talk', icon: <TrendingUp size={14} />, unread: 1, members: 89, description: 'Budgeting tips & deals' },
  { id: 'study', name: 'Study Groups', icon: <School size={14} />, unread: 0, members: 156, description: 'Find study partners' },
  { id: 'events', name: 'Events', icon: <Megaphone size={14} />, unread: 5, members: 312, description: 'Campus happenings' },
];

const INITIAL_MESSAGES: Message[] = [
  { 
    id: '0', sender: 'Admin', avatar: '🛡️', 
    text: '📢 Welcome to Campus General! Be kind, share tips, and help each other save money. New marketplace feature is live!',
    timestamp: '9:00 AM', reactions: { '❤️': 12, '😂': 0, '🔥': 5, '👍': 8, '😮': 0 }, myReactions: [], isPinned: true, isAnnouncement: true
  },
  { 
    id: '1', sender: 'Sipho', avatar: 'S', 
    text: 'Hey everyone! Has anyone gotten their financial aid for this semester yet?',
    timestamp: '10:23 AM', reactions: { '❤️': 0, '😂': 0, '🔥': 0, '👍': 2, '😮': 0 }, myReactions: []
  },
  { 
    id: '2', sender: 'Lerato', avatar: 'L', 
    text: 'Not yet, still waiting. The admin office said it should be processed by end of week.',
    timestamp: '10:25 AM', reactions: { '❤️': 0, '😂': 0, '🔥': 0, '👍': 0, '😮': 0 }, myReactions: [],
    replyTo: { sender: 'Sipho', text: 'Has anyone gotten their financial aid...' }
  },
  { 
    id: '3', sender: 'You', avatar: '🙋', 
    text: 'I got mine yesterday! Check your student portal, they might have updated it.',
    timestamp: '10:30 AM', reactions: { '❤️': 2, '😂': 0, '🔥': 1, '👍': 4, '😮': 0 }, myReactions: ['👍']
  },
  { 
    id: '4', sender: 'Kobus', avatar: 'K', 
    text: 'Thanks for the heads up! Also - found an amazing R15 lunch deal at the campus cafeteria today 🍕',
    timestamp: '10:32 AM', reactions: { '❤️': 3, '😂': 0, '🔥': 7, '👍': 0, '😮': 2 }, myReactions: []
  },
];

const MOCK_POLLS: Poll[] = [
  {
    id: '1', question: 'Best budget food spot on campus?', 
    options: [
      { text: 'Campus Cafeteria', votes: 45 },
      { text: 'Food Truck Alley', votes: 32 },
      { text: 'Student Center Deli', votes: 28 },
      { text: 'Pack from home 💪', votes: 51 }
    ],
    totalVotes: 156, myVote: null, endsIn: '2 days', author: 'Thandi'
  },
  {
    id: '2', question: 'How much do you spend on transport monthly?',
    options: [
      { text: 'Under R200', votes: 67 },
      { text: 'R200-R500', votes: 89 },
      { text: 'R500-R1000', votes: 34 },
      { text: 'Over R1000', votes: 12 }
    ],
    totalVotes: 202, myVote: null, endsIn: '5 days', author: 'James'
  }
];

const MOCK_MEMBERS: CommunityMember[] = [
  { id: '1', name: 'Sipho M.', status: 'online', avatar: 'S', bio: 'Economics major, saving enthusiast', mutualFriends: 4, isFriend: true, campus: 'Main Campus', points: 1240 },
  { id: '2', name: 'Lerato K.', status: 'online', avatar: 'L', bio: 'Finance student, side hustle queen', mutualFriends: 2, isFriend: true, campus: 'Main Campus', points: 980 },
  { id: '3', name: 'James T.', status: 'away', avatar: 'J', bio: 'CS major, freelance developer', mutualFriends: 1, isFriend: false, campus: 'Tech Campus', points: 2100 },
  { id: '4', name: 'Thandi N.', status: 'offline', avatar: 'T', bio: 'Business studies, budgeting pro', mutualFriends: 3, isFriend: false, campus: 'Main Campus', points: 1560 },
  { id: '5', name: 'Kobus V.', status: 'online', avatar: 'K', bio: 'Engineering, deal hunter extraordinaire', mutualFriends: 5, isFriend: true, campus: 'Engineering Campus', points: 890 },
  { id: '6', name: 'Naledi P.', status: 'online', avatar: 'N', bio: 'Med student, meal prep expert', mutualFriends: 0, isFriend: false, campus: 'Health Sciences', points: 3200 },
];

const tabs = [
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'polls', label: 'Polls', icon: BarChart3 },
  { id: 'people', label: 'People', icon: Users },
  { id: 'marketplace', label: 'Market', icon: ShoppingBag },
  { id: 'donate', label: 'Give', icon: Gift },
] as const;

type TabId = typeof tabs[number]['id'];

const CommunityPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [activeChannel, setActiveChannel] = useState('general');
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [polls, setPolls] = useState(MOCK_POLLS);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [searchPeople, setSearchPeople] = useState('');
  const [showChannels, setShowChannels] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 4) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      sender: 'You', avatar: '🙋',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: { '❤️': 0, '😂': 0, '🔥': 0, '👍': 0, '😮': 0 },
      myReactions: [],
      replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text.slice(0, 50) + '...' } : undefined
    };
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);
  };

  const handleReaction = (msgId: string, reaction: Reaction) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      const hasReaction = msg.myReactions.includes(reaction);
      return {
        ...msg,
        reactions: { ...msg.reactions, [reaction]: msg.reactions[reaction] + (hasReaction ? -1 : 1) },
        myReactions: hasReaction ? msg.myReactions.filter(r => r !== reaction) : [...msg.myReactions, reaction]
      };
    }));
    setShowReactions(null);
  };

  const handleVote = (pollId: string, optionIdx: number) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId || poll.myVote !== null) return poll;
      const newOptions = poll.options.map((opt, i) => i === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt);
      return { ...poll, options: newOptions, totalVotes: poll.totalVotes + 1, myVote: optionIdx };
    }));
    toast.success('Vote recorded! 🗳️');
  };

  const handleToggleFriend = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      toast.success(m.isFriend ? `Removed ${m.name}` : `Added ${m.name} as friend!`);
      return { ...m, isFriend: !m.isFriend };
    }));
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchPeople.toLowerCase()) ||
    m.bio.toLowerCase().includes(searchPeople.toLowerCase())
  );

  const onlineCount = members.filter(m => m.status === 'online').length;
  const currentChannel = CHANNELS.find(c => c.id === activeChannel)!;

  const pinnedMessages = messages.filter(m => m.isPinned);

  return (
    <div className="min-h-screen pb-28 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare size={18} className="text-primary" />
                </div>
                Community
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {onlineCount} online • {members.length} members
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                <Flame size={12} className="mr-1" /> 1,240 pts
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="sticky top-[73px] z-10 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto max-w-lg px-4">
          <div className="flex overflow-x-auto gap-1 py-2 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 max-w-lg">
        <AnimatePresence mode="wait">
          {/* ──── CHAT TAB ──── */}
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              {/* Channel Selector */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                      activeChannel === ch.id 
                        ? 'bg-primary/10 border-primary/30 text-primary' 
                        : 'border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {ch.icon}
                    {ch.name}
                    {ch.unread > 0 && (
                      <span className="h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 px-1">
                <span>#{currentChannel.name} • {currentChannel.members} members</span>
                <span className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {onlineCount} online
                </span>
              </div>

              {/* Pinned Message */}
              {pinnedMessages.length > 0 && (
                <div className="mb-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-xs">
                  <div className="flex items-center gap-1 text-primary font-medium mb-1">
                    <Pin size={10} /> Pinned
                  </div>
                  <p className="text-foreground line-clamp-1">{pinnedMessages[0].text}</p>
                </div>
              )}

              {/* Messages */}
              <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="h-[380px] overflow-y-auto p-3 space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group flex ${msg.sender === 'You' ? 'justify-end' : ''}`}
                    >
                      <div className={`max-w-[85%] ${msg.sender === 'You' ? 'order-2' : ''}`}>
                        {msg.replyTo && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5 pl-2 border-l-2 border-primary/30">
                            <Reply size={8} /> {msg.replyTo.sender}: {msg.replyTo.text}
                          </div>
                        )}
                        <div className="flex items-end gap-2">
                          {msg.sender !== 'You' && (
                            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs text-primary-foreground font-bold shrink-0">
                              {msg.avatar}
                            </div>
                          )}
                          <div>
                            <div className={`flex items-center gap-1.5 mb-0.5 ${msg.sender === 'You' ? 'justify-end' : ''}`}>
                              <span className="text-[11px] font-semibold">{msg.sender}</span>
                              <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                              {msg.isAnnouncement && <Megaphone size={10} className="text-primary" />}
                            </div>
                            <div 
                              className={`px-3 py-2 rounded-2xl text-sm relative ${
                                msg.isAnnouncement 
                                  ? 'bg-primary/10 border border-primary/20 text-foreground' 
                                  : msg.sender === 'You' 
                                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                                    : 'bg-muted rounded-bl-sm'
                              }`}
                            >
                              {msg.text}
                            </div>
                            {/* Reactions */}
                            <div className={`flex items-center gap-1 mt-1 flex-wrap ${msg.sender === 'You' ? 'justify-end' : ''}`}>
                              {REACTIONS.filter(r => msg.reactions[r] > 0).map(r => (
                                <button
                                  key={r}
                                  onClick={() => handleReaction(msg.id, r)}
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full border transition-all ${
                                    msg.myReactions.includes(r)
                                      ? 'bg-primary/10 border-primary/30'
                                      : 'bg-muted border-border hover:bg-muted/80'
                                  }`}
                                >
                                  {r} {msg.reactions[r]}
                                </button>
                              ))}
                              {/* Action buttons on hover */}
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                                <button 
                                  onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                                  className="p-1 rounded hover:bg-muted"
                                >
                                  <Smile size={12} className="text-muted-foreground" />
                                </button>
                                <button 
                                  onClick={() => setReplyingTo(msg)}
                                  className="p-1 rounded hover:bg-muted"
                                >
                                  <Reply size={12} className="text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                            {/* Reaction Picker */}
                            {showReactions === msg.id && (
                              <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex gap-1 mt-1 p-1.5 bg-card border border-border rounded-full shadow-lg"
                              >
                                {REACTIONS.map(r => (
                                  <button key={r} onClick={() => handleReaction(msg.id, r)} className="text-sm hover:scale-125 transition-transform p-0.5">
                                    {r}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      Sipho is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Bar */}
                {replyingTo && (
                  <div className="px-3 py-1.5 border-t border-border bg-muted/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <Reply size={10} className="inline mr-1" />
                      Replying to <strong>{replyingTo.sender}</strong>
                    </span>
                    <button onClick={() => setReplyingTo(null)}><X size={14} className="text-muted-foreground" /></button>
                  </div>
                )}

                {/* Input */}
                <div className="p-2.5 border-t border-border flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    className="flex-1 h-9 text-sm"
                  />
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ──── POLLS TAB ──── */}
          {activeTab === 'polls' && (
            <motion.div key="polls" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" /> Community Polls
                </h2>
                <Button size="sm" variant="outline" onClick={() => toast.info('Create poll coming soon!')}>
                  <Plus size={14} className="mr-1" /> New Poll
                </Button>
              </div>

              {polls.map(poll => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-sm">{poll.question}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">by {poll.author} • ends in {poll.endsIn}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{poll.totalVotes} votes</Badge>
                  </div>
                  <div className="space-y-2">
                    {poll.options.map((opt, i) => {
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      const isMyVote = poll.myVote === i;
                      const hasVoted = poll.myVote !== null;
                      return (
                        <button
                          key={i}
                          onClick={() => handleVote(poll.id, i)}
                          disabled={hasVoted}
                          className={`w-full text-left rounded-lg p-2.5 text-sm relative overflow-hidden border transition-all ${
                            isMyVote 
                              ? 'border-primary bg-primary/5' 
                              : hasVoted 
                                ? 'border-border bg-muted/30' 
                                : 'border-border hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          {hasVoted && (
                            <div 
                              className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          )}
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isMyVote ? (
                                <CheckCircle2 size={14} className="text-primary" />
                              ) : hasVoted ? (
                                <Circle size={14} className="text-muted-foreground" />
                              ) : (
                                <Circle size={14} className="text-muted-foreground" />
                              )}
                              <span className={isMyVote ? 'font-medium' : ''}>{opt.text}</span>
                            </div>
                            {hasVoted && <span className="text-xs font-medium text-muted-foreground">{pct}%</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ──── PEOPLE TAB ──── */}
          {activeTab === 'people' && (
            <motion.div key="people" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Online', value: onlineCount, color: 'text-green-500' },
                  { label: 'Friends', value: members.filter(m => m.isFriend).length, color: 'text-primary' },
                  { label: 'Total', value: members.length, color: 'text-muted-foreground' },
                ].map(s => (
                  <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input 
                  placeholder="Search members..." 
                  className="pl-9 h-9 text-sm"
                  value={searchPeople}
                  onChange={(e) => setSearchPeople(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredMembers.map(member => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl border border-border p-3 flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
                        member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-yellow-500' : 'bg-muted-foreground/30'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{member.name}</span>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                          <Star size={8} className="mr-0.5" />{member.points}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{member.bio}</p>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {member.campus} • {member.mutualFriends} mutual friends
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={member.isFriend ? "outline" : "default"}
                      className="h-8 text-xs shrink-0"
                      onClick={() => handleToggleFriend(member.id)}
                    >
                      {member.isFriend ? (
                        <><CheckCircle2 size={12} className="mr-1" /> Friends</>
                      ) : (
                        <><UserPlus size={12} className="mr-1" /> Add</>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ──── MARKETPLACE TAB ──── */}
          {activeTab === 'marketplace' && (
            <motion.div key="market" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Marketplace />
            </motion.div>
          )}

          {/* ──── DONATE TAB ──── */}
          {activeTab === 'donate' && (
            <motion.div key="donate" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <DonationPlanner />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CommunityPage;
