'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Crown, Rocket, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { posthog } from '@/lib/posthog';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Build your trading habit',
    features: ['Full Trade Vault', 'Legacy Journaling', 'Psychology Logging', 'Screenshot Backups'],
    icon: Rocket,
    color: '#94A3B8',
    gradient: 'from-slate-500/10 to-transparent',
  },
  {
    id: 'pro',
    name: 'Pro Trader',
    price: '$20',
    description: 'Master technical insights',
    features: ['All Free Features', 'Institutional Analytics', 'Win Rate Optimization', 'Session Performance', 'Early Alpha Access'],
    icon: Zap,
    color: '#6366F1',
    gradient: 'from-indigo-600/20 to-transparent',
    popular: true,
  },
  {
    id: '6_month',
    name: '6-Month Pro',
    price: '$50',
    description: '6 months of full Pro access',
    features: ['6 Months Pro Access', 'All Advanced Analytics', 'Save $70 vs Monthly', 'Priority Support'],
    icon: Crown,
    color: '#10B981',
    gradient: 'from-emerald-600/20 to-transparent',
  },
];

export default function BillingPage() {
  const { subscription, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  const currentPlan = subscription?.plan_id || 'free';

  const handleUpgrade = (planId) => {
    if (planId === 'free') return;
    posthog.capture('upgrade_clicked', { plan_id: planId });
    router.push(`/billing/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-24 md:pb-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full delay-1000 animate-float pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 w-full pt-10">

        <div className="text-center mb-12 md:mb-24 animate-fade-in px-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-xs font-black uppercase tracking-[0.2em] mb-8">
            <Sparkles size={14} className="animate-pulse" /> Precision Pricing
          </div>
          <h1 className="text-3xl md:text-7xl font-black tracking-tighter mb-8 text-gradient">
            Evolve Your <br />Trading Edge
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
            Join the elite circle of traders using the most advanced journaling engine in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;

            return (
              <div 
                key={plan.id}
                className={`relative group rounded-[var(--card-radius)] p-10 transition-all duration-500 hover:scale-[1.02] shadow-premium glass-card ${
                  plan.popular ? 'border-[var(--accent)]/30 scale-[1.05] z-20' : 'border-[var(--glass-border)] md:scale-95 hover:scale-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-lg shadow-indigo-500/40 border border-[var(--accent)]/50">
                    Elite Choice
                  </div>
                )}

                <div className="mb-10">
                  <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-8 border border-white/5 transition-transform group-hover:rotate-6`}>
                    <Icon size={32} style={{ color: plan.color }} />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--foreground)] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-5xl font-black text-[var(--foreground)]">{plan.price}</span>
                    <span className="text-[var(--text-muted)] text-sm font-bold tracking-tight">
                        {plan.id === '6_month' ? 'FOR 6 MONTHS' : plan.id === 'free' ? '' : 'PER MONTH'}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-12">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full glass-effect flex items-center justify-center border-[var(--glass-border)]">
                        <Check size={14} className="text-[var(--accent)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--foreground)] transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.id === 'free' ? '#' : `/billing/checkout?plan=${plan.id}`}
                  className={`w-full py-5 rounded-[24px] font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    plan.id === 'free' 
                      ? 'bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border)] cursor-default'
                      : plan.popular
                        ? 'bg-[var(--accent)] text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20'
                        : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 hover:shadow-xl'
                  }`}
                  onClick={(e) => {
                    if (plan.id === 'free') e.preventDefault();
                  }}
                >
                  {loading === plan.id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : plan.id === 'free' ? (
                    'SELECTED'
                  ) : (
                    <>
                      UPGRADE NOW
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-24 p-12 rounded-[var(--card-radius)] glass-card border-[var(--glass-border)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck size={24} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">Institutional Security</h3>
                <p className="text-[var(--text-secondary)] mb-10 max-w-xl font-medium">
                    Payments are handled exclusively through the **Arbitrum Network** for sub-cent fees and instant finality. 100% Secure & On-Chain.
                </p>
                <div className="flex items-center gap-6 saturate-50 hover:saturate-100 transition-all">
                    <img 
                        src="https://nowpayments.io/images/nowpayments-logo-white.svg" 
                        className="h-7 grey-invert opacity-80"
                        alt="NOWPayments" 
                    />
                    <div className="w-px h-6 bg-[var(--glass-border)]"></div>
                    <img 
                        src="https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=032" 
                        className="h-8 shadow-sm"
                        alt="Arbitrum" 
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
