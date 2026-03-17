'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ShieldCheck, Github, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const getErrorMessage = (err) => {
    if (!err) return null;
    if (err.includes('Invalid login credentials')) return 'Incorrect email or password. Please try again.';
    if (err.includes('Email not confirmed')) return 'Please verify your email address to continue.';
    return err;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(getErrorMessage(loginError.message));
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
    if (!isConfigured) {
      setError("Configuration missing. Please add Supabase credentials to Vercel.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (googleError) throw googleError;
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to initialize Google login. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full delay-700 animate-float"></div>

      <div className="w-full max-w-md glass-card shadow-premium p-10 animate-fade-in relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20 shadow-xl">
            <TrendingUp className="text-[var(--accent)]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Login to SMC Journal</h1>
          <p className="text-[var(--text-muted)] mt-2">Welcome back to your trading cockpit</p>
        </div>

        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-2 text-amber-500 animate-slide-up">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-xs font-bold leading-tight uppercase tracking-widest">Configuration Required</p>
            </div>
            <p className="text-[10px] opacity-80 font-medium">Please add your Supabase credentials to the Vercel dashboard to enable authentication.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
            <AlertCircle size={20} />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1 tracking-[0.2em]">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@smcjournal.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1 tracking-[0.2em]">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/forgot-password" className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-[0.2em] transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-[24px] bg-[var(--accent)] text-white font-black text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Dashboard'}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">or continue with</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-8 py-5 rounded-[24px] glass-effect border-[var(--glass-border)] text-[var(--foreground)] font-black text-sm hover:bg-[var(--card-hover)] transition-all flex items-center justify-center gap-3 tracking-[0.2em] uppercase"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
          Google Sync
        </button>

        <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
          Don&apos;t have an account? <Link href="/signup" className="text-[var(--accent)] font-bold hover:underline">Create for free</Link>
        </p>
      </div>
    </div>
  );
}
