
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Receipt as ReceiptIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Receipt from '@/components/ReceiptIcon';
import BillReminder from '@/components/expenses/BillReminder';

interface ExpensesLayoutProps {
  children: React.ReactNode;
  title: string;
}

const ExpensesLayout: React.FC<ExpensesLayoutProps> = ({ children, title }) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'reminders'>('expenses');
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-green-600 dark:text-green-400"
              onClick={() => window.location.href = '/receipts'}
            >
              <Receipt size={16} showAnimation={false} />
              <span className="hidden sm:inline">Receipts</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setActiveTab(activeTab === 'expenses' ? 'reminders' : 'expenses')}
            >
              <Bell size={16} />
              <span className="hidden sm:inline">Reminders</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'expenses' | 'reminders')}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="expenses">
              <ReceiptIcon size={14} className="mr-1.5" />
              <span>Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell size={14} className="mr-1.5" />
              <span>Bill Reminders</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses">
            {children}
          </TabsContent>
          
          <TabsContent value="reminders">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BillReminder />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ExpensesLayout;
