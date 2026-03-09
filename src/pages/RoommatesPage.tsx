import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Copy, MessageSquare, DollarSign, Target, ShoppingCart, UserPlus, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

const RoommatesPage: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  // Form states
  const [createGroupName, setCreateGroupName] = useState('');
  const [joinGroupCode, setJoinGroupCode] = useState('');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'groceries' });
  const [newGoal, setNewGoal] = useState({ title: '', target_amount: '', deadline: '', icon: '🎯' });
  const [newWishlistItem, setNewWishlistItem] = useState({ title: '', estimated_cost: '', priority: 'medium' });

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    if (activeGroup) {
      fetchGroupData();
      setupRealtimeSubscription();
    }
  }, [activeGroup]);

  const fetchGroups = async () => {
    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from('roommate_group_members')
        .select(`
          group_id,
          role,
          roommate_groups (
            id,
            name,
            description,
            invite_code,
            created_at,
            status
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (membershipError) throw membershipError;

      const groupsData = membershipData?.map(membership => ({
        ...membership.roommate_groups,
        role: membership.role
      })) || [];

      setGroups(groupsData);
      
      if (groupsData.length > 0 && !activeGroup) {
        setActiveGroup(groupsData[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
      setLoading(false);
    }
  };

  const fetchGroupData = async () => {
    if (!activeGroup) return;

    try {
      // Fetch members
      const { data: membersData } = await supabase
        .from('roommate_group_members')
        .select('user_id, role, is_active, joined_at')
        .eq('group_id', activeGroup.id)
        .eq('is_active', true);

      if (membersData) {
        // Get profile data for each member
        const userIds = membersData.map(m => m.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', userIds);

        const membersWithProfiles = membersData.map(member => ({
          ...member,
          profile: profilesData?.find(p => p.user_id === member.user_id) || null
        }));

        setMembers(membersWithProfiles);
      }

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('roommate_shared_expenses')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: false });

      setExpenses(expensesData || []);

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('roommate_shared_goals')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: false });

      setGoals(goalsData || []);

      // Fetch wishlist
      const { data: wishlistData } = await supabase
        .from('roommate_wishlists')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: false });

      setWishlist(wishlistData || []);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('roommate_messages')
        .select('*')
        .eq('group_id', activeGroup.id)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching group data:', error);
      toast.error('Failed to load group data');
    }
  };

  const setupRealtimeSubscription = () => {
    if (!activeGroup) return;

    const channel = supabase
      .channel(`roommate_group_${activeGroup.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'roommate_messages',
          filter: `group_id=eq.${activeGroup.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createGroup = async () => {
    if (!createGroupName.trim() || !user) return;

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('roommate_groups')
        .insert({
          name: createGroupName,
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const { error: memberError } = await supabase
        .from('roommate_group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast.success('Group created successfully!');
      setCreateGroupName('');
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const joinGroup = async () => {
    if (!joinGroupCode.trim() || !user) return;

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('roommate_groups')
        .select('id, name')
        .eq('invite_code', joinGroupCode)
        .eq('status', 'active')
        .single();

      if (groupError || !groupData) {
        toast.error('Invalid or expired invite code');
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('roommate_group_members')
        .select('id')
        .eq('group_id', groupData.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already a member of this group');
        return;
      }

      const { error: memberError } = await supabase
        .from('roommate_group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      toast.success(`Joined ${groupData.name} successfully!`);
      setJoinGroupCode('');
      fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };

  const addExpense = async () => {
    if (!newExpense.description.trim() || !newExpense.amount || !activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('roommate_shared_expenses')
        .insert({
          group_id: activeGroup.id,
          added_by: user.id,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          split_type: 'equal',
          split_details: {}
        });

      if (error) throw error;

      toast.success('Expense added successfully!');
      setNewExpense({ description: '', amount: '', category: 'groceries' });
      fetchGroupData();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const addGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.target_amount || !activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('roommate_shared_goals')
        .insert({
          group_id: activeGroup.id,
          created_by: user.id,
          title: newGoal.title,
          target_amount: parseFloat(newGoal.target_amount),
          deadline: newGoal.deadline || null,
          icon: newGoal.icon
        });

      if (error) throw error;

      toast.success('Goal created successfully!');
      setNewGoal({ title: '', target_amount: '', deadline: '', icon: '🎯' });
      fetchGroupData();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const addWishlistItem = async () => {
    if (!newWishlistItem.title.trim() || !activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('roommate_wishlists')
        .insert({
          group_id: activeGroup.id,
          added_by: user.id,
          title: newWishlistItem.title,
          estimated_cost: parseFloat(newWishlistItem.estimated_cost) || 0,
          priority: newWishlistItem.priority
        });

      if (error) throw error;

      toast.success('Item added to wishlist!');
      setNewWishlistItem({ title: '', estimated_cost: '', priority: 'medium' });
      fetchGroupData();
    } catch (error) {
      console.error('Error adding wishlist item:', error);
      toast.error('Failed to add wishlist item');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeGroup || !user) return;

    try {
      const { error } = await supabase
        .from('roommate_messages')
        .insert({
          group_id: activeGroup.id,
          sender_id: user.id,
          message: newMessage,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const copyInviteCode = () => {
    if (activeGroup?.invite_code) {
      navigator.clipboard.writeText(activeGroup.invite_code);
      toast.success('Invite code copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading roommate groups...</p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <Users className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Welcome to Roommates</h1>
          <p className="text-muted-foreground mb-8">
            Manage shared expenses, goals, and communication with your roommates all in one place.
          </p>
          
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Roommate Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to manage shared expenses with your roommates.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="e.g., Apartment 4B"
                      value={createGroupName}
                      onChange={(e) => setCreateGroupName(e.target.value)}
                    />
                  </div>
                  <Button onClick={createGroup} className="w-full">
                    Create Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Roommate Group</DialogTitle>
                  <DialogDescription>
                    Enter the invite code shared by your roommate.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inviteCode">Invite Code</Label>
                    <Input
                      id="inviteCode"
                      placeholder="Enter invite code"
                      value={joinGroupCode}
                      onChange={(e) => setJoinGroupCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={joinGroup} className="w-full">
                    Join Group
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Roommates</h1>
          <p className="text-muted-foreground">Manage shared living expenses and goals</p>
        </div>
        
        <div className="flex items-center gap-4">
          {activeGroup && (
            <Button 
              variant="outline" 
              onClick={copyInviteCode}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Invite: {activeGroup.invite_code}
            </Button>
          )}
          
          <Select value={activeGroup?.id || ''} onValueChange={(value) => {
            const group = groups.find(g => g.id === value);
            setActiveGroup(group);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeGroup && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {activeGroup.name}
                <Badge variant={activeGroup.role === 'admin' ? 'default' : 'secondary'}>
                  {activeGroup.role}
                </Badge>
              </CardTitle>
              <CardDescription>
                Invite Code: <code className="bg-muted px-2 py-1 rounded">{activeGroup.invite_code}</code>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Members:</span>
                <div className="flex -space-x-2">
                  {members.map((member) => (
                    <Avatar key={member.user_id} className="border-2 border-background">
                      <AvatarImage src={member.profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {member.profile?.display_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({members.length} member{members.length !== 1 ? 's' : ''})
                </span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Shared Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="expenseDescription">Description</Label>
                      <Input
                        id="expenseDescription"
                        placeholder="e.g., Groceries, Utilities"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenseAmount">Amount</Label>
                      <Input
                        id="expenseAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenseCategory">Category</Label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="groceries">Groceries</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="internet">Internet</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addExpense} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {expenses.map((expense) => (
                  <Card key={expense.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {expense.category} • {new Date(expense.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(expense.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          Split equally ({formatCurrency(expense.amount / members.length)} each)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Shared Goal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="goalTitle">Goal Title</Label>
                      <Input
                        id="goalTitle"
                        placeholder="e.g., Vacation Fund"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalAmount">Target Amount</Label>
                      <Input
                        id="goalAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newGoal.target_amount}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target_amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalDeadline">Deadline (Optional)</Label>
                      <Input
                        id="goalDeadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={addGoal} className="mt-4">
                    <Target className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => (
                  <Card key={goal.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>{goal.icon}</span>
                        {goal.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                          />
                        </div>
                        {goal.deadline && (
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Wishlist Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="wishlistTitle">Item</Label>
                      <Input
                        id="wishlistTitle"
                        placeholder="e.g., New Coffee Machine"
                        value={newWishlistItem.title}
                        onChange={(e) => setNewWishlistItem(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wishlistCost">Estimated Cost</Label>
                      <Input
                        id="wishlistCost"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newWishlistItem.estimated_cost}
                        onChange={(e) => setNewWishlistItem(prev => ({ ...prev, estimated_cost: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wishlistPriority">Priority</Label>
                      <Select value={newWishlistItem.priority} onValueChange={(value) => setNewWishlistItem(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addWishlistItem} className="mt-4">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {wishlist.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={
                          item.priority === 'high' ? 'destructive' : 
                          item.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {item.priority}
                        </Badge>
                        <p className="font-bold">{formatCurrency(item.estimated_cost)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Group Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default RoommatesPage;