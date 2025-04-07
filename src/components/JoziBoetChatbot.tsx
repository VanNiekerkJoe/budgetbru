
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, ChevronDown, ArrowUp, Volume2, BookOpen, Settings, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Define types for chat messages
interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
  read?: boolean;
}

interface SuggestedQuestion {
  text: string;
  category: string;
}

const JoziBoetChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Howzit bru! I'm Jozi Boet, your campus guide. How can I help you today?", isBot: true, timestamp: new Date(), read: true }
  ]);
  const [activeTab, setActiveTab] = useState("chat");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Sample suggested questions
  const suggestedQuestions: SuggestedQuestion[] = [
    { text: "Where are the best student deals?", category: "Campus" },
    { text: "How can I budget better?", category: "Finance" },
    { text: "Where's the cheapest food near campus?", category: "Food" },
    { text: "When is the next student event?", category: "Events" },
    { text: "How do I track my expenses?", category: "App" },
    { text: "What are emergency fund tips?", category: "Finance" },
  ];
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check for unread messages when chat is closed
  useEffect(() => {
    if (!isOpen) {
      const unreadCount = messages.filter(msg => msg.isBot && !msg.read).length;
      setNotificationCount(unreadCount);
      if (unreadCount > 0) {
        setHasUnread(true);
      }
    } else {
      // Mark all as read when chat is opened
      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
      setHasUnread(false);
      setNotificationCount(0);
    }
  }, [isOpen, messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = { text: message, isBot: false, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setTyping(true);
    
    // Simulate bot response with typing effect
    setTimeout(() => {
      const responses = generateResponse(message);
      setTyping(false);
      setMessages(prev => [...prev, { text: responses, isBot: true, timestamp: new Date() }]);
    }, 1500);
  };
  
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    if (lowerCaseMsg.includes('deal') || lowerCaseMsg.includes('discount')) {
      return "Ja bru! Check the campus map - I've marked all the places with student deals. The coffee shop near the library does 2-for-1 on Tuesdays, and don't forget to show your student card at Bookville for 15% off!";
    }
    
    if (lowerCaseMsg.includes('budget') || lowerCaseMsg.includes('save')) {
      return "Budgeting is lekker when you've got a plan! Try the 50-30-20 rule: 50% on needs, 30% on wants, and 20% on savings. Check the Savings tab for some proper goals you can set up!";
    }
    
    if (lowerCaseMsg.includes('food') || lowerCaseMsg.includes('eat')) {
      return "Eish, I know all the best spots for cheap eats! The student canteen has specials on Wednesdays, and there's a sweet little place called Mama's Kitchen two blocks from North Campus with meals under R40. Check the map, I've marked them all!";
    }
    
    if (lowerCaseMsg.includes('event') || lowerCaseMsg.includes('party') || lowerCaseMsg.includes('jol')) {
      return "Yebo, there's a lekker Night Market this Friday at the Student Center! Also keep an eye on the Community tab - there's always something happening, bru!";
    }
    
    const genericResponses = [
      "Shot for asking! That's a cool question. Let me help you with that.",
      "Howzit! Here's what I know about that...",
      "Ja no, that's a good one! Here's what I reckon...",
      "Eish, let me think about that... Okay, so here's the deal:",
      "That's quite lekker that you asked! Have you tried looking in the app's features? There's a section for that!"
    ];
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    handleSend();
  };
  
  const clearConversation = () => {
    setMessages([{ 
      text: "Conversation cleared! How else can I help you today, bru?", 
      isBot: true, 
      timestamp: new Date(), 
      read: true 
    }]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      <motion.div
        className="fixed bottom-24 right-4 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          <Button
            onClick={toggleChatbot}
            className="rounded-full h-14 w-14 bg-theme-teal text-white shadow-lg hover:bg-theme-indigo transition-all duration-300"
            variant="default"
          >
            <Bot size={24} />
          </Button>
          
          {/* Notification indicator */}
          <AnimatePresence>
            {hasUnread && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-theme-pink text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-900"
              >
                {notificationCount}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="bg-theme-teal p-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative">
                  <Bot size={20} className="text-white mr-2" />
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">Jozi Boet</h3>
                  <p className="text-white/70 text-xs">Campus Expert</p>
                </div>
              </div>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10" onClick={clearConversation}>
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button onClick={toggleChatbot} variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10">
                  <X size={16} />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="help" className="flex-1">Help Topics</TabsTrigger>
                <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="m-0">
                <div className="h-80 overflow-y-auto p-3 flex flex-col gap-3" style={{ scrollBehavior: 'smooth' }}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isBot 
                          ? "bg-gray-100 dark:bg-gray-700 self-start rounded-tl-none" 
                          : "bg-theme-teal text-white self-end rounded-tr-none"
                      }`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index === messages.length - 1 ? 0 : 0 }}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className={`text-[10px] mt-1 ${msg.isBot ? "text-gray-500 dark:text-gray-400" : "text-white/70"} flex justify-between items-center`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {!msg.isBot && <ArrowUp size={10} className="ml-1" />}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {typing && (
                    <motion.div
                      className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-700 self-start rounded-tl-none"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex space-x-1">
                        <motion.div
                          className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* This empty div helps us scroll to the bottom */}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-3 pt-0">
                  {/* Suggested questions */}
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {suggestedQuestions.slice(0, 3).map((q, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap py-1"
                        onClick={() => handleSuggestedQuestion(q.text)}
                      >
                        {q.text}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 border-t dark:border-gray-700 pt-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Jozi Boet..."
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-theme-teal dark:bg-gray-700 dark:text-white"
                    />
                    <Button
                      onClick={handleSend}
                      className="bg-theme-teal hover:bg-theme-teal/80 rounded-lg"
                      size="sm"
                      disabled={!message.trim()}
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="help" className="m-0 p-0">
                <div className="h-80 overflow-y-auto p-4">
                  <h4 className="font-medium mb-3 text-theme-teal">Popular Topics</h4>
                  
                  <div className="space-y-2">
                    {suggestedQuestions.map((q, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setActiveTab("chat");
                          handleSuggestedQuestion(q.text);
                        }}
                        className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium">{q.text}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{q.category}</Badge>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="m-0 p-0">
                <div className="h-80 overflow-y-auto p-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-theme-teal flex items-center justify-center">
                      <Bot size={36} className="text-white" />
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-center text-lg mb-1">Jozi Boet</h4>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">Your Campus Assistant</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <Info size={18} className="text-theme-teal mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">About Me</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          I'm Jozi Boet, your friendly campus guide. I can help you find deals, budget better, and navigate student life like a pro!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <BookOpen size={18} className="text-theme-teal mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">How I Can Help</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-4 space-y-1">
                          <li>Find student discounts</li>
                          <li>Budget advice</li>
                          <li>Campus navigation</li>
                          <li>Event information</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <Volume2 size={18} className="text-theme-teal mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Languages</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          I speak English with South African slang to keep things lekker!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <Settings size={18} className="text-theme-teal mt-0.5" />
                      <div>
                        <h5 className="font-medium text-sm">Preferences</h5>
                        <Button variant="outline" size="sm" className="mt-1 text-xs">
                          Notification Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="px-3 py-2 text-[10px] text-center text-gray-400 border-t dark:border-gray-700">
              Powered by BudgetBru AI • Campus Assistant v1.2
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JoziBoetChatbot;
