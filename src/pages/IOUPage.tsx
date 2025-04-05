import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Moon, Sun, Users, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface IOUItem {
  id: string;
  person: string;
  amount: number;
  description: string;
  date: string;
  isOwedToMe: boolean;
}

const IOUPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const [iouItems, setIouItems] = useState<IOUItem[]>([
    {
      id: '1',
      person: 'James',
      amount: 150,
      description: 'Pizza night',
      date: '2025-04-01',
      isOwedToMe: true
    },
    {
      id: '2',
      person: 'Sarah',
      amount: 250,
      description: 'Concert tickets',
      date: '2025-03-28',
      isOwedToMe: false
    }
  ]);
  
  const [newIOU, setNewIOU] = useState({
    person: '',
    amount: '',
    description: '',
    isOwedToMe: true
  });
  
  const [isAddingIOU, setIsAddingIOU] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleAddIOU = () => {
    if (!newIOU.person || !newIOU.amount || !newIOU.description) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const amount = parseFloat(newIOU.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const newItem: IOUItem = {
      id: Date.now().toString(),
      person: newIOU.person,
      amount: amount,
      description: newIOU.description,
      date: new Date().toISOString().split('T')[0],
      isOwedToMe: newIOU.isOwedToMe
    };
    
    setIouItems([newItem, ...iouItems]);
    setNewIOU({
      person: '',
      amount: '',
      description: '',
      isOwedToMe: true
    });
    setIsAddingIOU(false);
    toast.success('IOU added successfully');
  };
  
  const handleRemoveIOU = (id: string) => {
    setIouItems(iouItems.filter(item => item.id !== id));
    toast.success('IOU removed');
  };
  
  // Calculate totals
  const totalOwedToMe = iouItems
    .filter(item => item.isOwedToMe)
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalIowe = iouItems
    .filter(item => !item.isOwedToMe)
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netAmount = totalOwedToMe - totalIowe;

  return (
    <div className={`min-h-screen pb-28 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative ${darkMode ? 'bg-theme-navy' : 'bg-gradient-to-r from-theme-indigo to-theme-teal'} text-white py-6 px-4 shadow-lg`}
      >
        <div className="container mx-auto max-w-md">
          <motion.h1 
            className="text-3xl font-bold flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >IOU</motion.span>
            <motion.span 
              className="ml-2 text-theme-pink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >Management</motion.span>
          </motion.h1>
          <motion.p 
            className="text-center text-sm opacity-90 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Track who owes you and who you owe
          </motion.p>
        </div>
        
        <Toggle 
          className="absolute top-4 right-4 p-2 rounded-full"
          pressed={darkMode}
          onPressedChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} className="animate-pulse-soft" /> : <Moon size={18} />}
        </Toggle>
      </motion.header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="col-span-1 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">They Owe Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">R{totalOwedToMe}</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-700 dark:text-red-300">I Owe Them</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">R{totalIowe}</p>
            </CardContent>
          </Card>
          
          <Card className={`col-span-1 ${
            netAmount >= 0 
              ? 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20' 
              : 'bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-700 dark:text-blue-300">Net Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${
                netAmount >= 0 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                R{Math.abs(netAmount)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {!isAddingIOU ? (
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setIsAddingIOU(true)}
              className="bg-theme-pink hover:bg-theme-pink/90 text-white flex items-center gap-2"
            >
              <Plus size={18} />
              Add New IOU
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
          >
            <h3 className="text-lg font-semibold mb-4 text-theme-pink">New IOU</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="person">Person</Label>
                <Input 
                  id="person"
                  placeholder="Who is involved?" 
                  value={newIOU.person}
                  onChange={(e) => setNewIOU({...newIOU, person: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount (R)</Label>
                <Input 
                  id="amount"
                  type="number" 
                  placeholder="0.00" 
                  value={newIOU.amount}
                  onChange={(e) => setNewIOU({...newIOU, amount: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  placeholder="What's it for?" 
                  value={newIOU.description}
                  onChange={(e) => setNewIOU({...newIOU, description: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={newIOU.isOwedToMe ? "default" : "outline"}
                    className={newIOU.isOwedToMe ? "bg-theme-pink hover:bg-theme-pink/90" : ""}
                    onClick={() => setNewIOU({...newIOU, isOwedToMe: true})}
                  >
                    They owe me
                  </Button>
                  <Button
                    type="button"
                    variant={!newIOU.isOwedToMe ? "default" : "outline"}
                    className={!newIOU.isOwedToMe ? "bg-theme-pink hover:bg-theme-pink/90" : ""}
                    onClick={() => setNewIOU({...newIOU, isOwedToMe: false})}
                  >
                    I owe them
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setIsAddingIOU(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddIOU} className="bg-theme-pink hover:bg-theme-pink/90">
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Your IOUs</h2>
          
          {iouItems.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-6">No IOUs yet</p>
          ) : (
            iouItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${
                  item.isOwedToMe 
                    ? 'border-green-500 dark:border-green-600'
                    : 'border-amber-500 dark:border-amber-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users size={18} className={item.isOwedToMe ? 'text-green-500' : 'text-amber-500'} />
                      <h3 className="font-medium text-lg">{item.person}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`font-bold ${
                      item.isOwedToMe 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {item.isOwedToMe ? '+' : '-'}R{item.amount}
                    </span>
                    <button 
                      onClick={() => handleRemoveIOU(item.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 mt-2"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default IOUPage;
