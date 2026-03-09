import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, TrendingUp, PiggyBank, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: TrendingUp, label: 'Track expenses', desc: 'Every rand, accounted for' },
  { icon: PiggyBank, label: 'Save smarter', desc: 'Goals that actually stick' },
  { icon: Users, label: 'Budget together', desc: 'Couples & roommates' },
];

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

  const AuthForm = () => (
    <>
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
    </>
  );

  if (forgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 shadow-xl space-y-4">
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
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero panel */}
      <div
        className="relative lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, hsl(324, 58%, 18%) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(199, 52%, 15%) 0%, transparent 50%), linear-gradient(135deg, hsl(222, 47%, 9%) 0%, hsl(222, 47%, 12%) 100%)',
        }}
      >
        {/* Animated orb */}
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(324, 58%, 55%), hsl(199, 52%, 32%))' }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(324, 58%, 55%), hsl(324, 58%, 40%))',
                boxShadow: '0 0 40px hsl(324, 58%, 55% / 0.3)',
              }}
            >
              <span className="text-3xl font-black text-primary-foreground">B</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-black text-3xl tracking-tight" style={{ color: 'hsl(210, 40%, 98%)' }}>Budget</span>
              <span className="font-black text-3xl tracking-tight text-primary">Bru</span>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: 'hsl(210, 40%, 98%)' }}>
            You must budget, bru!
          </h1>
          <p className="text-sm mb-10" style={{ color: 'hsl(210, 40%, 98% / 0.5)' }}>
            Smart money management for South Africans
          </p>

          {/* Feature highlights */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'hsl(210, 40%, 98% / 0.06)', border: '1px solid hsl(210, 40%, 98% / 0.08)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsl(324, 58%, 55% / 0.15)' }}>
                  <f.icon size={18} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 98%)' }}>{f.label}</p>
                  <p className="text-xs" style={{ color: 'hsl(210, 40%, 98% / 0.5)' }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px lg:hidden"
          style={{ background: 'linear-gradient(90deg, transparent, hsl(324, 58%, 55% / 0.4), transparent)' }}
        />
        {/* Right edge gradient (desktop) */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px hidden lg:block"
          style={{ background: 'linear-gradient(180deg, transparent, hsl(324, 58%, 55% / 0.3), transparent)' }}
        />
      </div>

      {/* Auth panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-background relative">
        {/* Subtle orb */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mobile-only compact logo */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">B</span>
            </div>
            <span className="font-black text-lg text-foreground">BudgetBru</span>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your finances</p>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 shadow-xl">
            <AuthForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
