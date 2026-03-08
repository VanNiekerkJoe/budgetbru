import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setValid(true);
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated!');
      navigate('/');
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-sm w-full"><CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">Back to Login</Button>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Card className="border-border/60 shadow-xl">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Set New Password</h2>
            </div>
            <form onSubmit={handleReset} className="space-y-3">
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input type="password" placeholder="New password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 rounded-xl" required minLength={6} />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
