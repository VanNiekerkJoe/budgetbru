import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Zap, MapPin, Wallet, 
  PartyPopper, HelpCircle, RotateCcw, User
} from 'lucide-react';

interface ChatMessage {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  query: string;
  color: string;
}

const JoziBoetChatbot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Howzit! 🤙 I'm Jozi Boet — your campus finance guide. Ask me anything about deals, budgeting, or campus life!", isBot: true, timestamp: new Date() }
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    { icon: <Wallet size={14} />, label: "Budget tips", query: "How can I budget better?", color: "from-primary/20 to-primary/5 text-primary" },
    { icon: <MapPin size={14} />, label: "Cheap eats", query: "Where's the cheapest food near campus?", color: "from-accent/20 to-accent/5 text-accent" },
    { icon: <Zap size={14} />, label: "Deals", query: "Where are the best student deals?", color: "from-warning/20 to-warning/5 text-warning-foreground" },
    { icon: <PartyPopper size={14} />, label: "Events", query: "When is the next student event?", color: "from-success/20 to-success/5 text-success" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (text?: string) => {
    const sendText = text || message;
    if (!sendText.trim()) return;

    setMessages(prev => [...prev, { text: sendText, isBot: false, timestamp: new Date() }]);
    setMessage('');
    setTyping(true);

    setTimeout(() => {
      const response = generateResponse(sendText);
      setTyping(false);
      setMessages(prev => [...prev, { text: response, isBot: true, timestamp: new Date() }]);
    }, 1200 + Math.random() * 800);
  };

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('deal') || msg.includes('discount'))
      return "Ja bru! 🔥 Check the campus map — I've marked all spots with student deals. Coffee shop near the library does 2-for-1 Tuesdays, and flash your student card at Bookville for 15% off!";

    if (msg.includes('budget') || msg.includes('save'))
      return "Budgeting is lekker with a plan! 💰 Try 50-30-20: 50% needs, 30% wants, 20% savings. Head to the Savings tab to set up proper goals — you'll be sorted in no time!";

    if (msg.includes('food') || msg.includes('eat') || msg.includes('cheap'))
      return "Eish, I know the best spots! 🍔 Student canteen has specials on Wednesdays, and Mama's Kitchen (2 blocks from North Campus) does meals under R40. All marked on the map!";

    if (msg.includes('event') || msg.includes('party') || msg.includes('jol'))
      return "Yebo! 🎉 There's a Night Market this Friday at the Student Center! Check the Community tab — there's always something popping, bru!";

    if (msg.includes('expense') || msg.includes('track'))
      return "Sharp! 📊 Hit the Expenses page to log and track everything. The Quick Add feature makes it super easy — just tap, categorise, done!";

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('howzit') || msg.includes('hey'))
      return "Howzit bru! 🤙 What can I help you with today? Deals, budgets, campus life — you name it!";

    const responses = [
      "Shot for asking! 🤙 That's a cool question. Let me dig into that for you...",
      "Ja no, good one! Check out the app's features — there might be a section just for that!",
      "Eish, let me think... 🤔 Have you tried exploring the different tabs? Lots of hidden gems in there!",
      "Lekker question! I'd suggest checking the Insights page for more details on that topic. 📈"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{ 
      text: "Fresh start! 🧹 What can I help you with, bru?", 
      isBot: true, 
      timestamp: new Date()
    }]);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex gap-2 ${msg.isBot ? 'justify-start' : 'justify-end'}`}
          >
            {msg.isBot && (
              <div className="shrink-0 mt-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles size={13} className="text-primary-foreground" />
                </div>
              </div>
            )}
            <div className={`max-w-[78%] ${msg.isBot ? '' : 'order-first'}`}>
              <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.isBot
                  ? 'bg-muted text-foreground rounded-2xl rounded-tl-md'
                  : 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] mt-1 px-1 text-muted-foreground ${msg.isBot ? '' : 'text-right'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
            {!msg.isBot && (
              <div className="shrink-0 mt-1">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <User size={13} className="text-secondary-foreground" />
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions — only show when few messages */}
      <AnimatePresence>
        {messages.length <= 2 && !typing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleSend(action.query)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${action.color} border border-border/30 text-xs font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                >
                  {action.icon}
                  {action.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="px-3 pb-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Clear chat"
          >
            <RotateCcw size={16} />
          </button>
          <div className="flex-1 flex items-center bg-muted/60 rounded-xl border border-border/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Jozi Boet..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSend()}
              disabled={!message.trim() || typing}
              className="shrink-0 m-1 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoziBoetChatbot;
