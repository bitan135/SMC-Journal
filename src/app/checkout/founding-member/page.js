'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/shared/AuthProvider';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, CheckCircle2, ChevronRight, Lock, TrendingUp, ArrowRight, Wallet, BadgeCheck, Sparkles, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

export default function FoundingMemberCheckout() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Billing Form State
  const [billingData, setBillingData] = useState({
    fullName: '',
    email: '',
    region: 'United States'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      const nextUrl = '/checkout/founding-member';
      router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
    } else if (user) {
      setBillingData(prev => ({
        ...prev,
        fullName: profile?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [user, profile, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Securing Session...</span>
      </div>
    );
  }

  const isFormValid = billingData.fullName.trim().length > 2 && billingData.email.includes('@');

  const handleCheckout = async () => {
    if (!isFormValid) return;
    
    try {
      setIsProcessing(true);
      setError(null);

      const res = await fetch('/api/payments/create-founding-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing: billingData })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Checkout initiation failed');
      }

      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        throw new Error('Invalid payment gateway response');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 font-sans antialiased overflow-x-hidden pt-12 relative">
      
      {/* Background Ambience - Softer for light mode */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[130px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <Link href="/founding-member" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-black text-sm tracking-tighter text-slate-900 uppercase">SMC Journal</span>
          </Link>
          
          {/* Progress Stepper */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-600/10 border border-indigo-200 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Billing</span>
             </div>
             <div className="w-8 h-px bg-slate-200" />
             <div className="flex items-center gap-2 opacity-30">
                <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment</span>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Billing Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
               <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">Billing & Member <br />Information</h1>
               <p className="text-slate-500 font-medium leading-relaxed max-w-md text-sm">
                 Complete your details to secure your permanent account status. Your Founding Member certificate and communication will be sent to this email.
               </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-xl shadow-slate-200/50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                     <input 
                        type="text" 
                        value={billingData.fullName}
                        onChange={(e) => setBillingData({...billingData, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                        placeholder="e.g. John Smith"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Billing Email</label>
                     <input 
                        type="email" 
                        value={billingData.email}
                        readOnly
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 outline-none cursor-not-allowed"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region / Country</label>
                  <select 
                     value={billingData.region}
                     onChange={(e) => setBillingData({...billingData, region: e.target.value})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all appearance-none"
                  >
                     <option>United States</option>
                     <option>United Kingdom</option>
                     <option>Europe</option>
                     <option>Asia</option>
                     <option>Africa</option>
                     <option>Oceania</option>
                     <option>South America</option>
                     <option>Middle East</option>
                  </select>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Lifetime Summary</h3>
                <ul className="space-y-4">
                  {[
                    { t: "Founding Member Insight Engine", d: "Early access to behavioral trade synthesis core.", i: Sparkles },
                    { t: "Institutional Diagnostics", d: "Advanced trade metrics and risk profiling.", i: Zap },
                    { t: "Permanent Pro Status", d: "Zero renewal fees, forever.", i: Crown },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-md bg-indigo-600/10 border border-indigo-200 flex items-center justify-center shrink-0">
                         <item.i className="text-indigo-600" size={12} />
                      </div>
                      <div className="space-y-0.5">
                         <h4 className="text-sm font-black text-slate-900 leading-tight">{item.t}</h4>
                         <p className="text-[11px] text-slate-500 font-medium">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* Right: Checkout Sidebar */}
          <div className="lg:col-span-5 sticky top-12">
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden text-slate-900 border border-slate-200">
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[40px] rounded-full pointer-events-none" />
               
               <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Summary</span>
                  <div className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest">Lifetime Only</div>
               </div>

               <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between">
                     <span className="font-bold text-slate-500">Founding Member Pass</span>
                     <span className="font-black">$79.00</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="font-bold text-slate-500">Platform Onboarding</span>
                     <span className="font-black text-emerald-600">FREE</span>
                  </div>
               </div>

               <div className="h-px bg-slate-100 mb-6" />

               <div className="flex items-baseline justify-between mb-10">
                  <span className="text-lg font-black text-slate-900">Total Due</span>
                  <span className="text-4xl font-black text-slate-900">$79</span>
               </div>

               {error && (
                 <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                   <div className="mt-0.5 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                      <Lock size={10} className="text-white" />
                   </div>
                   <p className="text-[11px] text-rose-600 font-bold leading-tight">{error}</p>
                 </div>
               )}

               <button
                 onClick={handleCheckout}
                 disabled={isProcessing || !isFormValid}
                 className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="animate-spin" size={16} />
                     Initiating...
                   </>
                 ) : (
                   <>
                     <Wallet size={16} className="group-hover:-rotate-12 transition-transform" />
                     {isFormValid ? 'Continue to Payment' : 'Fill Form Above'}
                   </>
                 )}
               </button>

               <p className="mt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Lock size={10} className="text-slate-300" /> Secure Crypto Checkout
               </p>
            </div>

            <Link href="/founding-member" className="inline-flex items-center gap-2 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mx-auto w-full justify-center">
               Cancel Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
