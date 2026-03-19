'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-inter">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled ? 'bg-black/80 backdrop-blur-xl border-white/10 py-4' : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">SMC JOURNAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('proof')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Performance</button>
            <Link href="/pricing" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold py-3 px-6 rounded-xl hover:bg-white/5 transition-colors">Log In</Link>
            <Link href="/signup" className="text-sm font-bold py-3 px-6 bg-white text-black rounded-xl hover:bg-white/90 transition-transform active:scale-95">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-[120px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <Zap size={14} />
            Institutional Grade Journaling
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-8 animate-slide-up">
            Quantify Your <span className="text-gradient">SMC Edge.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
            Stop guessing. Start tracking BOC, CHoCH, and FVG setups with institutional-grade analytics designed for Smart Money Concept traders.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-500">
            <Link href="/signup" className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-3 group border-0">
              Get Started Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={() => scrollToSection('features')} className="w-full md:w-auto px-10 py-5 glass-card border-white/10 rounded-2xl font-black text-lg hover:bg-white/5 transition-all text-white">
              Watch Demo
            </button>
          </div>

          {/* Social Proof Stats */}
          <div id="proof" className="mt-32 pt-24 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 text-center opacity-80">
            <div>
              <div className="text-4xl font-black mb-2">2,400+</div>
              <div className="text-xs font-black uppercase tracking-widest text-white/30">Trades Logged</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">800+</div>
              <div className="text-xs font-black uppercase tracking-widest text-white/30">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">150+</div>
              <div className="text-xs font-black uppercase tracking-widest text-white/30">Strategies Validated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight text-white">
                Most SMC traders fail because they lack <span className="text-indigo-500">structured data.</span>
              </h2>
              <p className="text-xl text-white/50 leading-relaxed mb-10">
                Scrolling through charts isn't "backtesting." Successful institutional trading requires rigorous data capture and cognitive analysis.
              </p>
              
              <div className="space-y-6">
                {[
                  "No clear data on setup strike rates",
                  "Undefined confluence weights",
                  "Inconsistent risk management",
                  "Zero insight into session-specific bias"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-white/80 font-bold">
                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-xs text-white/30">
                      {index + 1}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all" />
              <div className="relative glass-card border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-6">
                  <div className="h-4 bg-white/5 rounded-full w-3/4" />
                  <div className="h-4 bg-white/5 rounded-full w-1/2" />
                  <div className="h-20 bg-indigo-500/10 rounded-3xl w-full border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-indigo-400 font-black tracking-widest text-xs uppercase">Missing Analytics</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Features Section */}
      <section id="features" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">The Professional's Toolset.</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">Everything you need to turn SMC theory into a high-probability trading machine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[40px] glass-card border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-2 duration-500">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <Layers size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Contextual Logging</h3>
              <p className="text-white/40 leading-relaxed font-medium">Tag confluences like H4 Bias, M15 CHoCH, and FVG Tap in seconds. Native SMC terminology for serious traders.</p>
            </div>

            <div className="p-10 rounded-[40px] glass-card border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-2 duration-500">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Advanced Analytics</h3>
              <p className="text-white/40 leading-relaxed font-medium">Deep dive into win rates by session, drawdown curves, and equity growth. Data-driven psychological insights.</p>
            </div>

            <div className="p-10 rounded-[40px] glass-card border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-2 duration-500">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Edge Validation</h3>
              <p className="text-white/40 leading-relaxed font-medium">Is your CHoCH setup actually profitable? Our system isolates setup data to confirm what works in real market conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto rounded-[64px] bg-gradient-to-br from-indigo-600 to-purple-800 p-12 md:p-24 text-center relative overflow-hidden shadow-3xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-white">Master Your Edge <br /> Today.</h2>
            <p className="text-xl text-white/80 font-bold mb-12 max-w-xl mx-auto">Join hundreds of professional traders using SMC Journal to refine their institutional strategy.</p>
            
            <Link href="/signup" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95 border-0">
              Get Started for Free
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-indigo-500" />
              <span className="text-xl font-black tracking-tighter text-white">SMC JOURNAL</span>
            </div>
            <p className="text-sm font-bold text-white/30 leading-relaxed">
              The institutional-grade trading journal for Smart Money Concept traders. Built by traders, for traders.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Product</h4>
              <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-white/30 hover:text-indigo-400 text-left transition-colors">Features</button>
              <Link href="/pricing" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Pricing</Link>
              <Link href="/affiliate" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Affiliate</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Company</h4>
              <Link href="/privacy" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-bold text-white/20 uppercase tracking-widest">© 2026 SMC Journal. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Sustainably coded in India.</span>
          </div>
        </div>
      </footer>

      {/* Styles for simple animations */}
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .tracking-tightest { letter-spacing: -0.05em; }
        .shadow-premium { box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
}
