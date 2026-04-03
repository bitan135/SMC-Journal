'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Crown, Zap, ShieldCheck, Target, Lock, TrendingUp, ChevronRight, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/AuthProvider';

export default function FoundingMemberClient() {
  const [spotsData, setSpotsData] = useState({ total_spots: 10, claimed_spots: 0, is_active: true });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const { data, error } = await supabase
          .from('founding_member_spots')
          .select('total_spots, claimed_spots, is_active')
          .single();
          
        if (data && !error) {
          setSpotsData(data);
        }
      } catch (err) {
        console.error("Spots fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpots();
  }, []);

  const spotsRemaining = Math.max(0, spotsData.total_spots - spotsData.claimed_spots);
  const isSoldOut = !spotsData.is_active || spotsRemaining === 0;

  const handleClaim = () => {
    const nextUrl = '/checkout/founding-member';
    if (user) {
      router.push(nextUrl);
    } else {
      // Direct pass to login with next param
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 font-sans antialiased overflow-x-hidden pt-12">
      
      {/* Navigation Backdrop */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-500">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">SMC Journal</span>
          </Link>
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">
            Login
          </Link>
        </div>
      </nav>

      <main className="relative pt-20 pb-32">
        {/* Animated Background elements - Softer for Light Mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-100 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mt-12 mb-16 max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-black uppercase tracking-[0.25em] mx-auto shadow-sm backdrop-blur-md animate-fade-in">
              <Crown size={14} className="text-amber-500" /> Exclusive Alpha Opportunity
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] stagger-in">
              Own the Edge. <br />
              <span className="text-indigo-600">For a Lifetime.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed stagger-item">
              Fund the future of institutional-grade trading journal technology. Become a Founding Member and unlock every advanced analytical capability we ever ship, permanently.
            </p>
          </div>

          {/* Pricing & Scarcity Card Wrapper */}
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-24 stagger-in">
             {/* Left Column: Benefits Detail */}
             <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 space-y-10 shadow-xl shadow-slate-200/50">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Professional Capabilities</h3>
                  <h2 className="text-3xl font-black text-slate-900">Institutional Suite</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Lifetime Pro', desc: 'Full access to professional trade logging, multi-asset data, and institutional diagnostics.', icon: Zap },
                    { title: 'Insight Engine', desc: 'Our proprietary analytical core for behavioral synthesis and statistical execution audits.', icon: Sparkles },
                    { title: 'Elite Badge', desc: 'Exclusive status identifier on your public profile, marking you as an early backer.', icon: Crown },
                    { title: 'Zero Renewal', desc: 'Never see a subscription invoice again. Inflation-proof your trading tools.', icon: ShieldCheck },
                  ].map((benefit, i) => (
                    <div key={i} className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <benefit.icon size={20} />
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{benefit.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Lock size={14} /> ENCRYPTED CRYPTOGRAPHIC CHECKOUT
                   </div>
                </div>
             </div>

             {/* Right Column: Interactive Claim Card */}
             <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[40px] p-1 shadow-2xl relative">
                <div className="bg-white h-full rounded-[38px] p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden group">
                   {/* Scarcity Indicator */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none" />
                   
                   <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
                      <Crown size={32} className="text-white" />
                   </div>

                   <div className="space-y-4 mb-10">
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">Founding Member Pass</div>
                      <div className="text-6xl font-black text-slate-900 leading-none">$79</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unlimited Lifetime Access</div>
                   </div>

                   <div className="w-full h-px bg-slate-100 mb-8" />

                   <div className="w-full space-y-6 flex-grow">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spots Remaining</span>
                           <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Urgent</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                           <div 
                              className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                              style={{ width: isLoading ? '0%' : `${((spotsData.total_spots - spotsRemaining) / spotsData.total_spots) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                           <span>{spotsData.claimed_spots} Confirmed</span>
                           {isLoading ? <span className="animate-pulse">Analyzing...</span> : <span className="text-indigo-600">{spotsRemaining} Available</span>}
                        </div>
                      </div>

                      {isSoldOut ? (
                        <a 
                          href="mailto:beta@smcjournal.app?subject=Waitlist%20for%20Founding%20Member"
                          className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                          Join Waitlist <ChevronRight size={16} />
                        </a>
                      ) : (
                        <button 
                          onClick={handleClaim}
                          disabled={isLoading}
                          className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2 group/btn"
                        >
                          Claim Your Spot
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                   </div>

                   <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" /> Instant Activation Secure Channel.
                   </p>
                </div>
             </div>
          </div>

          {/* Social Proof / Warning */}
          <div className="max-w-3xl w-full flex flex-col md:flex-row items-center gap-8 p-8 rounded-[32px] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 stagger-in">
             <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-amber-600" />
             </div>
             <div className="space-y-1 text-left">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">Financial Warning</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  SMC Journal will pivot to a subscription-only model after the beta phase. Founding Members lock in this specific pricing forever, bypassing thousands in future recurring costs.
                </p>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
           <div className="flex items-center justify-center gap-3 opacity-50">
              <TrendingUp size={20} className="text-slate-900" />
              <span className="font-black text-lg tracking-tighter text-slate-900 uppercase">SMC Journal</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Built for the disciplined few. © 2026</p>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-in {
          opacity: 0;
          animation: fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .stagger-item {
          opacity: 0;
          animation: fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
        }
      `}</style>
    </div>
  );
}


