'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  BrainCircuit, 
  Binary,
  ArrowRight,
  CheckCircle2,
  Activity,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-500">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-900">SMC JOURNAL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/insight-engine" className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-colors">Insight Engine</Link>
            <Link href="/pricing" className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/affiliate" className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-colors">Affiliate</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="hidden sm:block text-xs font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-colors px-4">Login</Link>
            <Link href="/signup" className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-slate-900/10">
              Get Started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white/95 backdrop-blur-xl border-t border-slate-100 ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-4 space-y-1">
            {[
              { href: '/features', label: 'Features' },
              { href: '/insight-engine', label: 'Insight Engine' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/affiliate', label: 'Affiliate' },
              { href: '/login', label: 'Login' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-16 sm:pt-20">
        
        {/* Minimalist Hero Section */}
        <section className="relative pt-20 sm:pt-32 pb-20 sm:pb-40 overflow-hidden flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[85vh] bg-white border-b border-slate-200">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50 rounded-bl-full opacity-60 pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.25em] mx-auto shadow-sm">
              <Activity size={12} className="text-indigo-600" /> Professional Trade Analytics
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-slate-900">
                The Journal Built for <br />
                <span className="text-indigo-600">Smart Money Concepts.</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed tracking-tight">
                Generic retail journals log entry and exit prices. We log structural narrative, Fair Value Gaps, mitigating order blocks, and liquidity sweeps. 
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-[0.15em] text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 flex items-center justify-center gap-3">
                Start Journaling <ArrowRight size={16} />
              </Link>
              <Link href="#features" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-xl font-black uppercase tracking-[0.15em] text-xs hover:bg-slate-50 transition-all shadow-sm">
                Explore The Tool
              </Link>
            </div>
          </div>
        </section>

        {/* Phase 2: Feature Breakdown */}
        <section id="features" className="py-32 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               {/* Context Column */}
               <div className="lg:col-span-5 space-y-8 sticky top-32">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-slate-900">
                     Track Structural Intent, <span className="text-indigo-600">Not Just Prices.</span>
                  </h2>
                  <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
                     <p>
                        Most trading journals fail because they treat SMC strategies like simple indicator crosses. If you cannot track the specific killzone a setup occurred in or the HTF POI it reacted from, your data is incomplete.
                     </p>
                     <p>
                        Our platform is engineered exclusively to quantify structural variables. Find out exactly which setups provide a legitimate edge and which are emotional leaks.
                     </p>
                  </div>
               </div>

               {/* Bento Box Grid */}
               <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-indigo-300 transition-all shadow-sm group">
                     <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                        <Binary size={22} className="text-indigo-600 group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight mb-3 text-slate-900">Narrative Tracking</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">Log Break of Structure, Change of Character, and exact mitigation points on every execution.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-emerald-300 transition-all shadow-sm group md:translate-y-8">
                     <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-6 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
                        <BarChart3 size={22} className="text-emerald-600 group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight mb-3 text-slate-900">Edge Expectancy</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">Instantly calculate the mathematical expectancy of specific chart models.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-rose-300 transition-all shadow-sm group">
                     <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 mb-6 group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors">
                        <BrainCircuit size={22} className="text-rose-500 group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight mb-3 text-slate-900">Behavioral Audits</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">Tag executions with psychological states to isolate the exact financial cost of undisciplined trading.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl hover:border-amber-300 transition-all shadow-sm group md:translate-y-8">
                     <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 mb-6 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                        <Target size={22} className="text-amber-600 group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight mb-3 text-slate-900">Session Logic</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed">Correlate win rates against specific liquidity windows like Asian sweep or NY Open.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Abstract CSS Visual (Insight Engine) */}
        <section id="insight-engine" className="py-32 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
            <div className="space-y-6 max-w-3xl mx-auto">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                 Quantify Your <span className="text-indigo-600">Trading Model.</span>
               </h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed">
                 Transform raw chart execution into actionable insight. Know clearly which specific setup yields the highest risk-to-reward ratio for your personality.
               </p>
            </div>

            {/* Abstract Analytics Chart Mockup */}
            <div className="relative max-w-4xl mx-auto">
               <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl flex flex-col justify-end h-80 relative">
                  
                  {/* Legend */}
                  <div className="absolute top-8 left-8 flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-full shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Model Expectancy Flow</span>
                  </div>
                  
                  <div className="flex items-end justify-between gap-1 md:gap-3 h-48 mt-auto border-b border-slate-200 pb-0">
                     {[30, 45, -15, 60, 50, -25, 70, 95, 85, 100].map((height, i) => (
                        <div key={i} className="flex-1 w-full relative group">
                           {/* Positive Bar */}
                           {height > 0 ? (
                               <div 
                                 className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm opacity-80 group-hover:bg-indigo-600 transition-colors" 
                                 style={{ height: `${height}%` }} 
                               />
                           ) : (
                               /* Negative Bar simulating drawdown */
                               <div 
                                 className="absolute top-0 w-full bg-rose-400 rounded-b-sm opacity-80 group-hover:bg-rose-500 transition-colors" 
                                 style={{ height: `${Math.abs(height)}%` }} 
                               />
                           )}
                           {/* Tooltip Simulation */}
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              Trade #{i + 1}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Phase 4: Extreme SEO Targeting Section */}
        <section className="py-24 bg-slate-50">
           <div className="max-w-4xl mx-auto px-6 space-y-12">
              <div className="text-center">
                 <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-6">A Trading Journal Designed for Smart Money Concepts</h2>
                 <p className="text-slate-500 leading-relaxed font-medium">
                    SMC Journal provides the technical framework necessary for forex, crypto, and indices traders adopting the structural logic of smart money. Standard tracking applications focus solely on price delivery; our architecture inherently requires you to categorize structural intent, ensuring your analytical data precisely mirrors the reality of institutional market operations.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-200 text-left">
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-4">
                       <CheckCircle2 size={16} className="text-indigo-600" /> Forex Performance Tracker
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Log complex setups across critical volatility sessions, engineered with specific instrument analytics perfect for forex price action.</p>
                 </div>
                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-4">
                       <CheckCircle2 size={16} className="text-indigo-600" /> Structural Bias Analytics
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">Calculate how consistently your higher timeframe narrative analysis aligns with lower timeframe execution outcomes.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Phase 5: CTA */}
        <section className="py-32 bg-indigo-600 text-white relative overflow-hidden">
           <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Start Logging Structural Data.</h2>
                 <p className="text-xl font-medium text-indigo-100 max-w-2xl mx-auto">Build discipline, discover your true expectancy, and treat your trading like a probability business.</p>
              </div>
              <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-900 rounded-xl font-black uppercase tracking-[0.15em] text-xs hover:scale-105 transition-transform shadow-2xl">
                 Create Your Account <ChevronRight size={16} />
              </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-white" />
            <span className="font-black text-lg tracking-tighter text-white">SMC JOURNAL</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            © 2026 SMC Journal. Built for disciplined traders.
          </p>
        </div>
      </footer>
    </div>
  );
}
