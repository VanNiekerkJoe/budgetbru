import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Check your email to confirm.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email first'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset email sent!');
      setForgotPassword(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(String(result.error));
    }
    setLoading(false);
  };

  if (forgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Card className="border-border/60 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 rounded-xl" required />
                </div>
                <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
              <button onClick={() => setForgotPassword(false)} className="text-sm text-primary hover:underline w-full text-center">
                Back to login
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-black text-lg leading-none">B</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-black text-xl text-foreground tracking-tight">Budget</span>
            <span className="font-black text-xl text-primary tracking-tight">Bru</span>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardContent className="p-6">
            <Tabs value={tab} onValueChange={v => setTab(v as 'login' | 'signup')}>
              <TabsList className="w-full grid grid-cols-2 mb-5">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-0">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 rounded-xl" required />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 rounded-xl" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button type="button" onClick={() => setForgotPassword(true)} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                  <Button type="submit" className="w-full rounded-xl gap-2" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Log In</span><ArrowRight size={16} /></>}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-0">
                <form onSubmit={handleSignup} className="space-y-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="pl-10 rounded-xl" required />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 rounded-xl" required />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 rounded-xl" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full rounded-xl gap-2" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-xl gap-2" onClick={() => handleOAuth('google')} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </Button>
              <Button variant="outline" className="rounded-xl gap-2" onClick={() => handleOAuth('apple')} disabled={loading}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
