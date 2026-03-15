'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Crown, Rocket, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/lib/storage';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['30 Trade Limit', 'Basic Analytics', 'Standard Support'],
    icon: Rocket,
    color: 'var(--neutral)',
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$10',
    description: 'For dedicated traders',
    features: ['Unlimited Trades', 'Deep Strategy Insights', 'Priority Support', 'Custom SMC Tags'],
    icon: Zap,
    color: 'var(--accent)',
    popular: true,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$50',
    description: 'Ultimate trading cockpit',
    features: ['Unlimited Trades', 'All Pro Features', 'One-time Payment', 'Exclusive Beta Access'],
    icon: Crown,
    color: 'var(--profit)',
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const router = useRouter();

  useEffect(() => {
    async function loadSub() {
      const sub = await profileService.getSubscription();
      setCurrentPlan(sub.plan_id);
    }
    loadSub();
  }, []);

  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === currentPlan) return;
    
    setLoading(planId);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ planId }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const payment = await res.json();
      if (payment.invoice_url) {
        // Option 1: Redirect to external invoice
        // window.location.href = payment.invoice_url;
        
        // Option 2: Go to our custom checkout page
        router.push(`/checkout?id=${payment.payment_id}`);
      } else {
        throw new Error(payment.error || 'Failed to create payment');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-[1200px] mx-auto animate-fade-in lg:pl-64">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
          Upgrade Your Edge
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
          Choose a plan that fits your trading journey. From free journaling to a lifetime cockpit, we've got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const isProUpgrade = plan.id !== 'free';

          return (
            <div 
              key={plan.id}
              className={`relative group bg-[var(--card)] border ${plan.popular ? 'border-[var(--accent)]' : 'border-[var(--border)]'} rounded-[32px] p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--accent)]/10`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={28} style={{ color: plan.color }} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-[var(--text-muted)] text-sm">{plan.id === 'lifetime' ? 'one-time' : '/ month'}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--profit-bg)] flex items-center justify-center">
                      <Check size={12} className="text-[var(--profit)]" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isCurrent || loading}
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? 'bg-[var(--background)] text-[var(--text-muted)] cursor-default'
                    : plan.popular
                      ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-xl shadow-[var(--accent)]/20'
                      : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isCurrent ? (
                  'Current Plan'
                ) : (
                  <>
                    {plan.id === 'free' ? 'Get Started' : 'Upgrade Now'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-20 p-8 rounded-[32px] bg-gradient-to-br from-[var(--card)] to-[var(--background)] border border-[var(--border)] text-center">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Secure Crypto Payments</h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">We accept BTC, ETH, USDT and more through NOWPayments.</p>
        <img 
          src="https://nowpayments.io/images/nowpayments-logo-white.svg" 
          className="h-6 mx-auto opacity-50 grey-invert"
          alt="Powered by NOWPayments" 
        />
      </div>
    </div>
  );
}
