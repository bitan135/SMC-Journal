'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Protocols mismatch: Passwords do not correlate.");
      return;
    }

    if (password.length < 6) {
      setError("Security violation: Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.updateUser({
      password: password,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Access Reset</h1>
          <p className="text-[var(--text-muted)] mt-2">Establish new security parameters</p>
        </div>

        {isSuccess ? (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">Parameters Updated</h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
              Security credentials synchronized. Redirecting to login terminal...
            </p>
            <div className="w-full h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-progress origin-left" />
            </div>
          </div>
        ) : (
          <>
            {(!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-2 text-amber-500 animate-slide-up">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold leading-tight uppercase tracking-widest">Configuration Required</p>
                </div>
                <p className="text-[10px] opacity-80 font-medium">Please add your Supabase credentials to the Vercel dashboard to enable reset.</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
                <AlertCircle size={20} />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1 tracking-[0.2em]">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all font-bold"
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

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1 tracking-[0.2em]">Confirm New Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-[24px] bg-[var(--accent)] text-white font-black text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sync New Credentials'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
