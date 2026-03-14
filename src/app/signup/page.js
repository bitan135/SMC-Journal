'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const getErrorMessage = (err) => {
    if (!err) return null;
    if (err.includes('User already registered')) return 'This email is already registered. Try logging in.';
    if (err.includes('Password should be')) return 'Password must be at least 6 characters long.';
    return err;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signupError) {
      setError(getErrorMessage(signupError.message));
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] grid place-items-center p-4">
        <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-10 text-center shadow-2xl animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-[var(--profit)]/10 flex items-center justify-center mx-auto mb-6 text-[var(--profit)] border border-[var(--profit)]/20 shadow-lg shadow-[var(--profit)]/10">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Check your email</h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
            We've sent a verification link to <span className="text-[var(--text-primary)] font-bold">{email}</span>. Click it to activate your cockpit.
          </p>
          <Link 
            href="/login" 
            className="block w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-hover)] transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-6 border border-[var(--accent)]/20 shadow-xl">
            <TrendingUp className="text-[var(--accent)]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Create Your Account</h1>
          <p className="text-[var(--text-muted)] mt-2">Join 1,000+ traders scaling their edge</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
            <AlertCircle size={20} />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase ml-1 tracking-widest">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
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
            {password && password.length < 6 && (
              <p className="text-[10px] text-[var(--loss)] ml-1 font-medium italic animate-fade-in">Password is too short</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
          Already have an account? <Link href="/login" className="text-[var(--accent)] font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
