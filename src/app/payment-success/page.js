'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, Loader2, PartyPopper } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full delay-1000 animate-float pointer-events-none"></div>

      <div className="max-w-xl w-full glass-card rounded-[48px] bg-white p-12 shadow-premium border border-white relative z-10 transition-all hover:scale-[1.01]">
        <div className="mb-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 relative">
                <CheckCircle2 className="text-emerald-500 animate-in fade-in zoom-in duration-700" size={64} />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 uppercase">
               Settlement Verified
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4 leading-none">
              Success. <br />Access Secured.
            </h1>
            
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              Your cryptographic settlement was successful. Your **{plan.replace('_', ' ').toUpperCase()}** protocol is now fully active across all systems.
            </p>
        </div>

        <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between text-left transition-all hover:border-indigo-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                        <PartyPopper className="text-indigo-500" size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Membership Active</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Institutional Status Applied</p>
                    </div>
                </div>
            </div>

            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-500/20 hover:bg-black transition-all text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 group"
            >
              Enter Dashboard 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
               Redirecting automatically in {countdown}s...
            </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <img 
                src="https://nowpayments.io/images/nowpayments-logo-black.svg" 
                className="h-4 opacity-50 grey-invert" 
                alt="NOWPayments" 
                onError={(e) => {
                    // Fallback to the one user provided if official URL fails
                    e.currentTarget.src = 'https://nowpayments.io/images/nowpayments-logo-black.svg';
                }}
            />
            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
               <ShieldCheck size={12} className="text-indigo-400" /> Secure Financial Protocol
            </div>
        </div>
      </div>

      <div className="mt-12 text-center relative z-10">
          <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-2">Technical Support</p>
          <p className="text-slate-900 font-black text-xs">support@smcjournal.app</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-slate-400"><Loader2 className="animate-spin mr-2" /> Handshaking...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
