
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JoziBoetChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string, isBot: boolean }[]>([
    { text: "Howzit bru! I'm Jozi Boet, your campus guide. How can I help you today?", isBot: true }
  ]);
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: message, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "Ya bru, I can help with that!",
        "Check by the student center later, there's a jol happening!",
        "Eish, that's a tough one. Let me think...",
        "Lekker! Let me show you where to find that info.",
        "Yebo, that's how we roll in Jozi!",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, isBot: true }]);
    }, 1000);
    
    setMessage('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  return (
    <>
      <motion.div
        className="fixed bottom-24 right-4 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChatbot}
          className="rounded-full h-14 w-14 bg-theme-teal text-white shadow-lg hover:bg-theme-indigo"
          variant="default"
        >
          <Bot size={24} />
        </Button>
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
                <Bot size={20} className="text-white mr-2" />
                <h3 className="text-white font-medium">Jozi Boet</h3>
              </div>
              <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="h-80 overflow-y-auto p-3 flex flex-col gap-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`max-w-[80%] p-2 rounded-lg ${
                    msg.isBot 
                      ? "bg-gray-100 dark:bg-gray-700 self-start" 
                      : "bg-theme-teal text-white self-end"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <p className="text-sm">{msg.text}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="p-3 border-t dark:border-gray-700 flex gap-2">
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
              >
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JoziBoetChatbot;
