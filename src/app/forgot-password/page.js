'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setIsLoading(false);
    } else {
      setIsSent(true);
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Recovery Protocol</h1>
          <p className="text-[var(--text-muted)] mt-2">Re-establish access to your trading engine</p>
        </div>

        {isSent ? (
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">Transmission Successful</h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
              Check your inbox — we've sent a password reset link to <span className="text-[var(--accent)] font-bold">{email}</span>
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--accent)] uppercase tracking-widest hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
                <AlertCircle size={20} />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase ml-1 tracking-[0.2em]">Authorized Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@smcjournal.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-2xl text-sm outline-none focus:border-[var(--accent)] transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-[24px] bg-[var(--accent)] text-white font-black text-sm tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-[var(--accent)]/20 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] hover:text-[var(--accent)] transition-all"
                >
                  <ArrowLeft size={12} /> Return to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
