
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Users, Heart, School, ShoppingBag, Gift } from 'lucide-react';
import { toast } from 'sonner';


import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Marketplace from '@/components/community/Marketplace';
import DonationPlanner from '@/components/community/DonationPlanner';
import MascotHelper from '@/components/MascotHelper';
import LanguageSelector from '@/components/LanguageSelector';

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
};

const mockUsers = [
  { id: '1', name: 'Sipho', status: 'online', avatar: 'S' },
  { id: '2', name: 'Lerato', status: 'online', avatar: 'L' },
  { id: '3', name: 'James', status: 'away', avatar: 'J' },
  { id: '4', name: 'Thandi', status: 'offline', avatar: 'T' },
  { id: '5', name: 'Kobus', status: 'online', avatar: 'K' }
];

const initialMessages: Message[] = [
  { 
    id: '1', 
    sender: 'Sipho', 
    text: 'Hey everyone! Has anyone gotten their financial aid for this semester yet?',
    timestamp: '10:23 AM',
    likes: 2,
    isLiked: false
  },
  { 
    id: '2', 
    sender: 'Lerato', 
    text: 'Not yet, still waiting. The admin office said it should be processed by end of week.',
    timestamp: '10:25 AM',
    likes: 0,
    isLiked: false
  },
  { 
    id: '3', 
    sender: 'You', 
    text: 'I got mine yesterday! Check your student portal, they might have updated it.',
    timestamp: '10:30 AM',
    likes: 4,
    isLiked: true
  },
  { 
    id: '4', 
    sender: 'Kobus', 
    text: 'Thanks for the heads up! Anyone going to the game on Saturday?',
    timestamp: '10:32 AM',
    likes: 3,
    isLiked: false
  }
];

const CommunityPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'people' | 'marketplace' | 'donate'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      isLiked: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  const handleLikeMessage = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { 
            ...message, 
            likes: message.isLiked ? message.likes - 1 : message.likes + 1,
            isLiked: !message.isLiked 
          } 
        : message
    ));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-theme-teal/30 dark:to-theme-navy">
      <ParticleBackground count={20} className="opacity-30" />
      
      <header className="bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 backdrop-blur-lg shadow-md py-4 px-4">
        <div className="container mx-auto max-w-md flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <MessageSquare size={24} className="mr-2 text-theme-pink" />
            Community Hub
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSelector compact />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* Tabs */}
        <Tabs defaultValue="chat" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-1">
              <Users size={14} />
              <span className="hidden sm:inline">People</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-1">
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger value="donate" className="flex items-center gap-1">
              <Gift size={14} />
              <span className="hidden sm:inline">Donate</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4">
              <div className="p-2 border-b dark:border-gray-700 flex items-center">
                <div className="flex items-center space-x-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                  <School size={12} />
                  <span>Campus General</span>
                </div>
                <div className="ml-auto flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span>5 online</span>
                </div>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : ''}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'You' ? 'order-2' : ''}`}>
                      <div className="flex items-center mb-1">
                        {message.sender !== 'You' && (
                          <div className="mr-2 h-6 w-6 rounded-full bg-gradient-to-br from-theme-pink to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                            {message.sender.charAt(0)}
                          </div>
                        )}
                        <div className={`text-xs font-medium ${message.sender === 'You' ? 'text-right mr-2' : ''}`}>
                          {message.sender}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp}
                        </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'You' 
                          ? 'bg-theme-pink text-white rounded-br-none' 
                          : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      
                      <div className={`mt-1 flex items-center ${message.sender === 'You' ? 'justify-end' : ''}`}>
                        <button 
                          className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-pink-500"
                          onClick={() => handleLikeMessage(message.id)}
                        >
                          <Heart 
                            size={12} 
                            className="mr-1" 
                            fill={message.isLiked ? "#ec4899" : "none"} 
                            stroke={message.isLiked ? "#ec4899" : "currentColor"}
                          />
                          {message.likes > 0 && message.likes}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 border-t dark:border-gray-700 flex items-center">
                <textarea
                  className="flex-1 p-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-theme-pink focus:outline-none"
                  rows={1}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  size="icon"
                  className="ml-2 bg-theme-pink hover:bg-theme-pink/90 text-white"
                  onClick={handleSendMessage}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>

            <MascotHelper
              type="insights" 
              message="Engaging with your campus community can help you find budget-friendly activities and resources!" 
            />
          </TabsContent>

          <TabsContent value="people">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium mb-4">Community Members</h3>
              <div className="space-y-3">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-theme-pink to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{user.name}</div>
                        <div className="flex items-center text-xs">
                          <div className={`h-2 w-2 rounded-full ${
                            user.status === 'online' ? 'bg-green-500' :
                            user.status === 'away' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          } mr-1`}></div>
                          <span className="text-gray-500 dark:text-gray-400 capitalize">{user.status}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="text-xs text-theme-pink px-2 py-1 border border-theme-pink rounded-full hover:bg-theme-pink/10"
                      onClick={() => toast.success(`Chat with ${user.name} coming soon!`)}
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <Marketplace />
          </TabsContent>

          <TabsContent value="donate">
            <DonationPlanner />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CommunityPage;
