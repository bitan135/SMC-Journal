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
    setIsLoading(true);
    setError(null);
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
    <div className="min-h-screen bg-[var(--background)] grid place-items-center p-4">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20 shadow-xl">
            <TrendingUp className="text-[var(--accent)]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Login to EdgeLedger</h1>
          <p className="text-[var(--text-muted)] mt-2">Welcome back to your trading cockpit</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
            <AlertCircle size={20} />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1 tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@edge.com"
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1 tracking-widest">Password</label>
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Dashboard'}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">or continue with</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-6 py-4 rounded-2xl bg-[var(--card-hover)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-sm hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
          Don't have an account? <Link href="/signup" className="text-[var(--accent)] font-bold hover:underline">Create for free</Link>
        </p>
      </div>
    </div>
  );
}
