'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Lock,
  Search,
  ChevronRight
} from 'lucide-react';

export default function InsightEngineLanding() {
  return (
    <div className="min-h-screen bg-white text-[#0f172a] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Navbar */}
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/features" className="text-sm font-bold text-slate-500 hover:text-[#0f172a] transition-colors">Features</Link>
          <Link href="/pricing" className="text-sm font-bold text-slate-500 hover:text-[#0f172a] transition-colors">Pricing</Link>
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-[#0f172a] transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <Sparkles size={14} /> Institutional Performance Modeling
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
            Meet the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Insight Engine.</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop guessing where your edge is. Our quantitative engine analyzes your trade data to find exactly where you're profitable — and where you're bleeding.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-[#0f172a] text-white rounded-[24px] font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 group">
                Start Logging Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="#how-it-works" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-[#0f172a] rounded-[24px] font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                See How It Works <ChevronRight />
             </Link>
          </div>
        </div>

        {/* The Three Pillars */}
        <section id="how-it-works" className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
               <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">Data-Driven Alpha.</h2>
               <p className="text-lg font-bold text-slate-500 max-w-xl mx-auto">
                 The Insight Engine doesn't just show stats. It identifies patterns across sessions, biases, and timeframes.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Session Alpha */}
              <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 transform group-hover:scale-110 transition-transform">
                  <Clock size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Session Alpha</h3>
                <p className="text-slate-500 font-bold leading-relaxed mb-6">
                  Automatically detects London, New York, and Asia kill-zones to tell you exactly which session you actually perform best in.
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                   <ShieldCheck className="text-emerald-500" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time-of-day Optimization</span>
                </div>
              </div>

              {/* Bias Efficiency */}
              <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 transform group-hover:scale-110 transition-transform">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Bias Efficiency</h3>
                <p className="text-slate-500 font-bold leading-relaxed mb-6">
                   Are you a Continuation king or a Reversal victim? The engine tracks your bias types to find your high-probability setups.
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                   <ShieldCheck className="text-emerald-500" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Behavioral Analysis</span>
                </div>
              </div>

              {/* Quantitative Edge */}
              <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 transform group-hover:scale-110 transition-transform">
                  <BarChart3 size={28} />
                </div>
                <h3 className="text-2xl font-black mb-4">Quantitative Edge</h3>
                <p className="text-slate-500 font-bold leading-relaxed mb-6">
                  Calculate win rates and profit factors per timeframe. Find out if your 15M entries are actually as good as they feel on Twitter.
                </p>
                <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                   <ShieldCheck className="text-emerald-500" size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Multi-Timeframe Correlation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Threshold Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/30 -skew-x-12 transform translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
                <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em]">THE SEQUENCE DISCIPLINE</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                   Unlock Hidden <br /> Intelligence.
                </h2>
                <p className="text-xl font-bold text-slate-500 leading-relaxed">
                   Meaningful data requires a significant sequence. To ensure institutional-grade results, the Insight Engine unlocks in two stages:
                </p>
                <div className="space-y-4">
                   <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-600">
                         <Zap size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-lg">30 Trades: Basic Engine</h4>
                         <p className="text-sm font-bold text-slate-400">Session win rates, overall profit factor, and average RR tracking.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 p-6 bg-[#0f172a] text-white rounded-3xl border border-slate-800 shadow-2xl">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                         <Sparkles size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-lg">100 Trades: Advanced Modeling</h4>
                         <p className="text-sm font-bold text-white/40">Multi-timeframe optimization, bias-correlation matrix, and strategy expectancy modelling.</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
                <div className="bg-slate-900 rounded-[48px] p-8 md:p-12 border border-slate-800 shadow-2xl transform hover:-rotate-2 transition-transform duration-500">
                   {/* Mockup UI */}
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
                            <Sparkles size={16} className="text-white" />
                         </div>
                         <div className="h-4 w-32 bg-slate-700 rounded-full" />
                      </div>
                      <Lock size={16} className="text-slate-600" />
                   </div>
                   <div className="space-y-6">
                      <div className="h-2 bg-slate-800 rounded-full w-full overflow-hidden">
                         <div className="h-full bg-indigo-600 w-2/3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-slate-800/50 rounded-2xl border border-slate-700" />
                         <div className="h-24 bg-slate-800/50 rounded-2xl border border-slate-700" />
                      </div>
                      <div className="h-40 bg-slate-800/50 rounded-3xl border border-slate-700 p-6 space-y-3">
                         <div className="h-2 bg-slate-700 rounded-full w-3/4" />
                         <div className="h-2 bg-slate-700 rounded-full w-1/2" />
                         <div className="h-2 bg-slate-700 rounded-full w-2/3" />
                         <div className="h-2 bg-slate-700 rounded-full w-1/4" />
                      </div>
                   </div>
                   <div className="mt-8 flex justify-center">
                      <div className="px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                         Analyzing Edge...
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 bg-indigo-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">Your edge is in the data.</h2>
            <p className="text-xl md:text-2xl font-bold text-white/70 mb-12">
              Start logging your SMC setups today and let the Insight Engine find your true competitive advantage.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-6 bg-white text-indigo-600 rounded-[28px] font-black text-xl hover:scale-105 transition-all shadow-2xl">
              Get Started Free <ArrowRight size={24} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 opacity-40 hover:opacity-100 transition-opacity">
           <TrendingUp size={24} className="text-indigo-600" />
           <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <p className="text-xs font-bold text-slate-400">© 2026 SMC Journal · Built for traders, by a trader.</p>
        <div className="flex justify-center gap-8 mt-4">
           <Link href="/" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Home</Link>
           <Link href="/privacy" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Privacy</Link>
           <Link href="/terms" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
