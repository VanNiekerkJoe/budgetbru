import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Ban, Trash2, BarChart3, Search, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_blocked: boolean;
  created_at: string;
  roles: string[];
}

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, display_name, avatar_url, is_blocked, created_at');

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role');

    const roleMap: Record<string, string[]> = {};
    roles?.forEach(r => {
      if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
      roleMap[r.user_id].push(r.role);
    });

    const combined = (profiles || []).map(p => ({
      ...p,
      roles: roleMap[p.user_id] || ['user'],
    }));

    setUsers(combined);
    setLoading(false);
  };

  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: !currentlyBlocked })
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to update user');
    } else {
      toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    // Delete profile (cascade will handle user_roles)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to delete user');
    } else {
      toast.success('User removed');
      fetchUsers();
    }
  };

  const filtered = users.filter(u =>
    !search || (u.display_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    blocked: users.filter(u => u.is_blocked).length,
    admins: users.filter(u => u.roles.includes('admin')).length,
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive/20 to-primary/20 flex items-center justify-center">
          <Shield size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-xs text-muted-foreground">Manage users and view analytics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: stats.total, icon: Users, color: 'text-primary' },
          { label: 'Blocked', value: stats.blocked, icon: Ban, color: 'text-destructive' },
          { label: 'Admins', value: stats.admins, icon: Shield, color: 'text-[hsl(var(--success))]' },
        ].map((s, i) => (
          <Card key={i} className="border-border/60">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <s.icon size={18} className={s.color} />
              <span className="text-2xl font-bold text-foreground mt-1">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <motion.div
              key={user.user_id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/60">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                    {(user.display_name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.display_name || 'Unknown'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {user.roles.map(r => (
                        <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'} className="text-[9px] px-1.5 py-0">
                          {r}
                        </Badge>
                      ))}
                      {user.is_blocked && (
                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0">blocked</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleBlock(user.user_id, user.is_blocked)}
                      title={user.is_blocked ? 'Unblock' : 'Block'}
                    >
                      <Ban size={14} className={user.is_blocked ? 'text-[hsl(var(--success))]' : 'text-destructive'} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Delete">
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove {user.display_name}'s profile. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteUser(user.user_id)} className="bg-destructive text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No users found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
