
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Clock, Check, Plus, Trash2, TimerReset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  isRecurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  notificationTime?: string;
}

const BillReminder: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Rent',
      amount: 3500,
      dueDate: '2023-09-01',
      isPaid: false,
      isRecurring: true,
      frequency: 'monthly',
      notificationTime: '3'
    },
    {
      id: '2',
      title: 'Internet',
      amount: 599,
      dueDate: '2023-09-05',
      isPaid: true,
      isRecurring: true,
      frequency: 'monthly',
      notificationTime: '2'
    },
    {
      id: '3',
      title: 'Phone Bill',
      amount: 350,
      dueDate: '2023-09-15',
      isPaid: false,
      isRecurring: true,
      frequency: 'monthly',
      notificationTime: '1'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id' | 'isPaid'>>({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    notificationTime: '3'
  });
  
  const handleAddReminder = () => {
    if (!newReminder.title || newReminder.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const reminder: Reminder = {
      ...newReminder,
      id: Date.now().toString(),
      isPaid: false
    };
    
    setReminders([...reminders, reminder]);
    setShowAddForm(false);
    setNewReminder({
      title: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      isRecurring: false,
      notificationTime: '3'
    });
    
    toast.success('Reminder added', {
      description: `We'll remind you about ${reminder.title} before it's due`,
    });
    
    // Simulate a notification
    setTimeout(() => {
      toast('Bill due soon!', {
        description: `${reminder.title}: R${reminder.amount} due on ${new Date(reminder.dueDate).toLocaleDateString()}`,
        action: {
          label: 'Mark as paid',
          onClick: () => handleTogglePaid(reminder.id)
        },
        icon: '⏰',
        duration: 5000,
      });
    }, 5000);
  };
  
  const handleTogglePaid = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isPaid: !reminder.isPaid } 
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast.success(`${!reminder.isPaid ? 'Marked as paid' : 'Marked as unpaid'}`, {
        description: reminder.title
      });
    }
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted');
  };
  
  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getStatusColor = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    
    const daysLeft = getDaysLeft(dueDate);
    if (daysLeft < 0) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (daysLeft <= 3) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  };
  
  const getStatusText = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return 'Paid';
    
    const daysLeft = getDaysLeft(dueDate);
    if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}`;
    if (daysLeft === 0) return 'Due today';
    return `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-theme-pink" />
            <span>Bill Reminders</span>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-8 w-8 p-0"
          >
            <Plus size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border rounded-md p-3 mb-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-medium mb-3">Add New Reminder</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Bill Name</label>
                <Input 
                  placeholder="e.g., Rent, Electricity"
                  value={newReminder.title}
                  onChange={e => setNewReminder({...newReminder, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Amount (R)</label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={newReminder.amount || ''}
                  onChange={e => setNewReminder({...newReminder, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Due Date</label>
                <Input 
                  type="date"
                  value={newReminder.dueDate}
                  onChange={e => setNewReminder({...newReminder, dueDate: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring-bill"
                    checked={newReminder.isRecurring}
                    onCheckedChange={(checked) => setNewReminder({
                      ...newReminder, 
                      isRecurring: checked,
                      frequency: checked ? 'monthly' : undefined
                    })}
                  />
                  <label htmlFor="recurring-bill" className="text-xs font-medium">
                    Recurring Bill
                  </label>
                </div>
                {newReminder.isRecurring && (
                  <select 
                    className="text-xs border rounded p-1"
                    value={newReminder.frequency}
                    onChange={(e) => setNewReminder({
                      ...newReminder,
                      frequency: e.target.value as 'weekly' | 'monthly' | 'yearly'
                    })}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Remind me before due date</label>
                <select 
                  className="w-full text-sm border rounded p-2 bg-white dark:bg-gray-700"
                  value={newReminder.notificationTime}
                  onChange={(e) => setNewReminder({...newReminder, notificationTime: e.target.value})}
                >
                  <option value="1">1 day before</option>
                  <option value="2">2 days before</option>
                  <option value="3">3 days before</option>
                  <option value="7">1 week before</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleAddReminder}
                >
                  Add Reminder
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {reminders.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No bill reminders set</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="mt-2"
              >
                <Plus size={16} className="mr-1" />
                Add your first reminder
              </Button>
            </div>
          ) : (
            reminders.map(reminder => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{reminder.title}</div>
                    <div className="text-lg font-semibold">R{reminder.amount}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(reminder.dueDate, reminder.isPaid)}`}>
                      {getStatusText(reminder.dueDate, reminder.isPaid)}
                    </div>
                    <div className="text-xs flex items-center mt-1 text-gray-500 dark:text-gray-400">
                      <Calendar size={12} className="mr-1" />
                      {new Date(reminder.dueDate).toLocaleDateString()}
                      {reminder.isRecurring && (
                        <span className="ml-2 flex items-center">
                          <TimerReset size={12} className="mr-1" />
                          {reminder.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <Button 
                    size="sm" 
                    variant={reminder.isPaid ? "outline" : "default"}
                    className={`text-xs flex-1 ${reminder.isPaid ? '' : 'bg-green-500 hover:bg-green-600'}`}
                    onClick={() => handleTogglePaid(reminder.id)}
                  >
                    <Check size={14} className="mr-1" />
                    {reminder.isPaid ? 'Marked Paid' : 'Mark as Paid'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-xs ml-2"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillReminder;
