'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, Sparkles, CreditCard, Tag, User, MapPin, 
  ArrowRight, Loader2, Check, AlertCircle, Zap, Crown, Copy, ExternalLink, RefreshCcw, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/shared/AuthProvider';

const planDetails = {
  pro: { name: 'Pro Trader', price: 20, icon: Zap, color: '#6366F1' },
  '6_month': { name: '6-Month Pro', price: 50, icon: Crown, color: '#10B981' }
};

function CheckoutFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'pro';
  const paymentIdParam = searchParams.get('id');
  const plan = planDetails[planId] || planDetails.pro;
  
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: 'United States',
  });

  // Payment Status State
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const { user, profile, isLoading: authLoading } = useAuth();

  // 1. Initial Profile/Form Data Fill
  useEffect(() => {
    if (user || profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile?.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
      }));
    }
  }, [user, profile]);

  // 2. Handle Payment Loading (if ID is present)
  useEffect(() => {
    if (paymentIdParam) {
      fetchPaymentDetails(paymentIdParam);
      const interval = setInterval(() => {
        fetchPaymentDetails(paymentIdParam, true);
      }, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [paymentIdParam]);

  const fetchPaymentDetails = async (id, isSilent = false) => {
    if (!isSilent) setIsCheckingStatus(true);
    try {
      const res = await fetch(`/api/payments/${id}`);
      const data = await res.json();
      if (data.payment_id) {
        setPaymentDetails(data);
        // If finished, redirect after a short delay
        if (data.payment_status === 'finished') {
          setTimeout(() => {
            router.push('/dashboard?payment=success');
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Failed to fetch payment details:', err);
    } finally {
      if (!isSilent) setIsCheckingStatus(false);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (coupon.toUpperCase() === 'SMC2026') {
      setDiscount(plan.price * 0.2); // 20% discount
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ 
          planId,
          billingDetails: formData,
          coupon: discount > 0 ? coupon : null
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const payment = await res.json();
      if (payment.payment_id) {
        router.push(`/billing/checkout?id=${payment.payment_id}`);
      } else {
        throw new Error(payment.error || 'Initiation failed');
      }
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const finalPrice = Math.max(0, plan.price - discount);

  // --- RENDER PAYMENT STATUS VIEW ---
  if (paymentIdParam && (paymentDetails || isCheckingStatus)) {
    if (isCheckingStatus && !paymentDetails) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 animate-fade-in">
          <Loader2 className="animate-spin text-[var(--accent)] mb-4" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Retrieving Settlement Protocol...</p>
        </div>
      );
    }

    const isFinished = paymentDetails?.payment_status === 'finished';
    const isPending = paymentDetails?.payment_status === 'waiting' || paymentDetails?.payment_status === 'confirming';

    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-4xl mx-auto animate-fade-in relative z-10">
        <Link 
          href="/billing"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-12 hover:text-[var(--foreground)] transition-all group w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Abandon Settlement
        </Link>

        <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium">
          <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-between">
            <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
              <ShieldCheck className="text-[var(--accent)]" size={16} /> Settlement Verification
            </h2>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                isFinished ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
              }`}>
                {isFinished ? <Check size={12} /> : <Clock size={12} />}
                {paymentDetails?.payment_status?.toUpperCase() || 'SYNCHRONIZING'}
              </span>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {isFinished ? (
              <div className="text-center py-10 space-y-6 animate-fade-in-up">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Check className="text-emerald-500" size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-[var(--foreground)] tracking-tighter mb-2">Protocol Secured</h3>
                  <p className="text-[var(--text-secondary)] font-medium">Payment confirmed. Your institutional access is being provisioned.</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] animate-pulse">Redirecting to Dashboard...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">USDT Deployment Amount (ARB)</label>
                    <div className="flex gap-2">
                       <div className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-5 text-2xl font-black text-[var(--foreground)] tracking-tight">
                        {paymentDetails?.pay_amount} <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">USDT</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(paymentDetails?.pay_amount, 'amount')}
                        className="p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all active:scale-95"
                        title="Copy Amount"
                      >
                        {copiedField === 'amount' ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Settlement Node (Address)</label>
                    <div className="flex gap-2">
                       <div className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-5 text-sm font-bold text-[var(--foreground)] break-all font-mono leading-relaxed overflow-hidden">
                        {paymentDetails?.pay_address}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(paymentDetails?.pay_address, 'address')}
                        className="p-5 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all active:scale-95 shrink-0"
                        title="Copy Address"
                      >
                        {copiedField === 'address' ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle size={14} /> Crucial Protocol
                    </h4>
                    <p className="text-xs text-amber-500/80 font-medium leading-relaxed">
                      Deploy funds ONLY via the <strong>Arbitrum (ARB)</strong> network. Initiating transfers via other protocols (ERC-20, BSC) will result in permanent loss of assets.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-[var(--glass-bg)] p-8 rounded-[32px] border border-[var(--glass-border)] space-y-6">
                    <h3 className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-[0.3em]">Network Verification</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-muted)] font-black uppercase tracking-widest">Network</span>
                        <span className="text-emerald-500 font-black tracking-widest uppercase">Arbitrum One</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-muted)] font-black uppercase tracking-widest">Currency</span>
                        <span className="text-[var(--foreground)] font-bold">USDT (Tether)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text-muted)] font-black uppercase tracking-widest">Payment ID</span>
                        <span className="text-[var(--foreground)] font-mono">{paymentDetails?.payment_id}</span>
                      </div>
                    </div>
                    <div className="h-px bg-[var(--glass-border)]" />
                    <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
                      <RefreshCcw size={14} className="animate-spin text-[var(--accent)]" />
                      Polling network for confirmation...
                    </div>
                  </div>

                  <button 
                    onClick={() => fetchPaymentDetails(paymentIdParam)}
                    className="w-full py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest rounded-2xl hover:border-[var(--accent)]/30 transition-all active:scale-95"
                  >
                    Force Manual Re-Sync
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER BILLING FORM (INITIAL) ---
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-6xl mx-auto animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      
      <Link 
        href="/billing"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-12 hover:text-[var(--foreground)] transition-all group w-fit relative z-10"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Change Plan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        {/* Left: Billing Form */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium">
            <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-between">
              <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                <CreditCard className="text-[var(--accent)]" size={16} /> Billing Profile
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Account Email</label>
                  <input
                    required
                    readOnly
                    type="email"
                    className="w-full bg-[var(--background)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-secondary)] cursor-not-allowed"
                    value={formData.email}
                  />
                  <p className="text-[9px] font-bold text-[var(--text-muted)] mt-1.5 ml-1">This is your account email. Update it in Settings.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Billing Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      placeholder="Street address, apartment, suite"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">City</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Country</label>
                  <select
                    className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] appearance-none outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              <div className="pt-8 border-t border-[var(--glass-border)]">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[var(--accent)] text-white font-black rounded-3xl shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Proceed to Crypto Settlement
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Summary & Coupon */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card rounded-[48px] border-[var(--glass-border)] p-10 shadow-premium">
            <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <ShieldCheck className="text-[var(--accent)]" size={16} /> Final Computation
            </h3>
            
            <div className="flex items-start gap-6 mb-10 p-6 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5`}>
                    <plan.icon size={24} style={{ color: plan.color }} />
                </div>
                <div>
                    <h4 className="text-xl font-black text-[var(--foreground)] tracking-tight">{plan.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Institutional Upgrade</p>
                </div>
                <div className="ml-auto">
                    <span className="text-xl font-black text-[var(--foreground)]">${plan.price}</span>
                </div>
            </div>

            <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span className="text-[var(--foreground)] font-bold">${plan.price}.00</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium text-emerald-500">
                        <span className="flex items-center gap-2 italic">
                            <Tag size={12} /> Discount Applied
                        </span>
                        <span className="font-bold">-${discount}.00</span>
                    </div>
                )}
                <div className="h-px bg-[var(--glass-border)] my-2" />
                <div className="flex justify-between items-center">
                    <span className="text-[var(--foreground)] font-black uppercase text-[10px] tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-[var(--foreground)] tracking-tighter">${finalPrice}.00</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-500" /> Redemption Token (Coupon)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-xs font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all uppercase tracking-widest"
                        value={coupon}
                        onChange={e => setCoupon(e.target.value)}
                    />
                    <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-6 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[10px] font-black uppercase tracking-widest text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all active:scale-95"
                    >
                        Apply
                    </button>
                </div>
                {couponError && (
                    <p className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1.5 mt-2 ml-1">
                        <AlertCircle size={10} /> {couponError}
                    </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center"><Loader2 className="animate-spin text-[var(--accent)]" /></div>}>
      <CheckoutFormContent />
    </Suspense>
  );
}
