'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Crown, Lock, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PlanGuard({ children, requiredPlan = 'pro', featureName = 'Advanced Analytics' }) {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setSubscription(subData || { plan_id: 'free' });
      }
      setIsLoading(false);
    };
    getSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Verifying Clearance...</p>
      </div>
    );
  }

  const currentPlan = subscription?.plan_id || 'free';
  const hasAccess = 
    (requiredPlan === 'pro' && (currentPlan === 'pro' || currentPlan === 'lifetime')) ||
    (requiredPlan === 'lifetime' && currentPlan === 'lifetime') ||
    requiredPlan === 'free';

  if (!hasAccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fade-in relative overflow-hidden">
        {/* Decorative Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-xl w-full relative z-10 text-center">
          <div className="glass-card rounded-[48px] border-[var(--glass-border)] p-12 shadow-premium bg-[var(--glass-bg)]/80 backdrop-blur-3xl overflow-hidden relative">
            {/* Corner Accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--accent)]/10 blur-2xl rounded-full"></div>
            
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[var(--accent)]/20 animate-pulse-glow">
              <Lock size={32} className="text-white" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[9px] font-black uppercase tracking-widest">
                    <Crown size={10} /> {requiredPlan.toUpperCase()} ACCESS REQUIRED
                </span>
            </div>

            <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter mb-6 leading-tight">
                Unlock {featureName}
            </h1>
            
            <p className="text-[var(--text-secondary)] font-medium mb-10 leading-relaxed text-balance">
                Your institutional Clearance Level is currently set to <strong className="text-[var(--foreground)]">FREE</strong>. 
                Upgrade to a Professional license to access this high-fidelity data node and advanced execution toolkits.
            </p>

            <div className="space-y-4 mb-10">
                {[
                    { label: 'Multi-Edge Strategy Vault', icon: Zap },
                    { label: 'Advanced Quantitative Metrics', icon: ShieldCheck },
                    { label: 'Institutional Market Depth Analysis', icon: Sparkles }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--background)]/40 border border-[var(--glass-border)] group hover:border-[var(--accent)]/30 transition-all">
                        <item.icon size={16} className="text-[var(--accent)]" />
                        <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest group-hover:text-[var(--foreground)] transition-colors">{item.label}</span>
                    </div>
                ))}
            </div>

            <Link
              href="/billing"
              className="group relative flex items-center justify-center gap-3 w-full py-5 bg-[var(--accent)] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Initialize Upgrade <ArrowRight size={18} />
            </Link>
            
            <p className="mt-8 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">
                SMC Journal Institutional Protocol v4.0.2
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
