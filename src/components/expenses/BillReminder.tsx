import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Check, Plus, Trash2, TimerReset, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  is_recurring: boolean;
  frequency?: string | null;
  notification_days?: string | null;
}

const BillReminder: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '', amount: 0, due_date: new Date().toISOString().split('T')[0], is_recurring: false, frequency: 'monthly' as string, notification_days: '3'
  });

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('bill_reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });
    if (error) {
      console.error('Error fetching reminders:', error);
    } else {
      setReminders(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const totalUpcoming = reminders.filter(r => !r.is_paid).reduce((s, r) => s + Number(r.amount), 0);
  const paidCount = reminders.filter(r => r.is_paid).length;

  const handleAddReminder = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    if (!newReminder.title || newReminder.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    const { error } = await supabase.from('bill_reminders').insert({
      user_id: user.id,
      title: newReminder.title,
      amount: newReminder.amount,
      due_date: newReminder.due_date,
      is_recurring: newReminder.is_recurring,
      frequency: newReminder.is_recurring ? newReminder.frequency : null,
      notification_days: newReminder.notification_days,
    });
    if (error) {
      toast.error('Failed to add reminder');
      console.error(error);
      return;
    }
    toast.success(`Reminder added for ${newReminder.title}`);
    setShowAddForm(false);
    setNewReminder({ title: '', amount: 0, due_date: new Date().toISOString().split('T')[0], is_recurring: false, frequency: 'monthly', notification_days: '3' });
    fetchReminders();
  };

  const handleTogglePaid = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    const newPaid = !reminder.is_paid;
    const { error } = await supabase.from('bill_reminders').update({ is_paid: newPaid }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
      return;
    }
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_paid: newPaid } : r));
    toast.success(newPaid ? 'Marked as paid ✅' : 'Marked as unpaid');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('bill_reminders').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
      return;
    }
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  const getDaysLeft = (dueDate: string) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Math.ceil((new Date(dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusStyle = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return 'bg-success/15 text-success';
    const d = getDaysLeft(dueDate);
    if (d < 0) return 'bg-destructive/15 text-destructive';
    if (d <= 3) return 'bg-warning/15 text-warning';
    return 'bg-primary/10 text-primary';
  };

  const getStatusText = (dueDate: string, isPaid: boolean) => {
    if (isPaid) return 'Paid ✓';
    const d = getDaysLeft(dueDate);
    if (d < 0) return `Overdue ${Math.abs(d)}d`;
    if (d === 0) return 'Due today';
    return `${d}d left`;
  };

  if (!user) {
    return (
      <div className="bg-card/60 backdrop-blur-xl rounded-xl p-6 border border-border text-center">
        <Bell size={28} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Sign in to manage bill reminders</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell size={16} className="text-primary" /> Bill Reminders
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setShowAddForm(!showAddForm)} className="h-7 w-7 p-0">
            <Plus size={14} />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Upcoming</p>
            <p className="text-sm font-bold text-destructive">{formatCurrency(totalUpcoming)}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Bills</p>
            <p className="text-sm font-bold text-foreground">{reminders.length}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-sm font-bold text-success">{paidCount}/{reminders.length}</p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="bg-card/60 backdrop-blur-xl rounded-xl p-4 border border-border space-y-3">
              <h4 className="text-sm font-medium text-foreground">New Reminder</h4>
              <Input placeholder="Bill name" value={newReminder.title} onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} className="bg-background/50 h-9 text-sm" />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R</span>
                  <Input type="number" placeholder="0.00" className="pl-7 bg-background/50 h-9 text-sm" value={newReminder.amount || ''} onChange={e => setNewReminder({ ...newReminder, amount: parseFloat(e.target.value) || 0 })} />
                </div>
                <Input type="date" className="flex-1 bg-background/50 h-9 text-sm" value={newReminder.due_date} onChange={e => setNewReminder({ ...newReminder, due_date: e.target.value })} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch id="recurring" checked={newReminder.is_recurring} onCheckedChange={(c) => setNewReminder({ ...newReminder, is_recurring: c, frequency: c ? 'monthly' : 'monthly' })} />
                  <label htmlFor="recurring" className="text-xs text-muted-foreground">Recurring</label>
                </div>
                {newReminder.is_recurring && (
                  <select className="text-xs bg-muted/30 border border-border rounded-md px-2 py-1 text-foreground" value={newReminder.frequency} onChange={e => setNewReminder({ ...newReminder, frequency: e.target.value })}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddReminder}>Add</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminders List */}
      <div className="space-y-2">
        {loading ? (
          <div className="bg-card/60 backdrop-blur-xl rounded-xl p-6 border border-border text-center">
            <Loader2 size={24} className="mx-auto text-muted-foreground mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="bg-card/60 backdrop-blur-xl rounded-xl p-6 border border-border text-center">
            <Bell size={28} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No bill reminders yet</p>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(true)} className="mt-2 text-xs">
              <Plus size={14} className="mr-1" /> Add your first
            </Button>
          </div>
        ) : (
          reminders.map(reminder => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card/60 backdrop-blur-xl rounded-xl p-3.5 border transition-all ${reminder.is_paid ? 'border-success/20 opacity-70' : 'border-border'}`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => handleTogglePaid(reminder.id)} className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${reminder.is_paid ? 'bg-success/20' : 'bg-muted/30 hover:bg-muted/50'}`}>
                  {reminder.is_paid ? <Check size={14} className="text-success" /> : <Bell size={14} className="text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${reminder.is_paid ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{reminder.title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusStyle(reminder.due_date, reminder.is_paid)}`}>
                      {getStatusText(reminder.due_date, reminder.is_paid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(Number(reminder.amount))}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Calendar size={10} /> {new Date(reminder.due_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
                      {reminder.is_recurring && <span className="flex items-center gap-0.5"><TimerReset size={10} /> {reminder.frequency}</span>}
                      <button onClick={() => handleDelete(reminder.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillReminder;
