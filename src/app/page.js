'use client';

import Link from 'next/link';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  Binary,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--accent)] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#050505]/70 border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 transition-transform duration-500">
              <TrendingUp size={22} className="text-white relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white">SMC JOURNAL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Platform</Link>
            <Link href="#audits" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Behavioral Audits</Link>
            <Link href="/pricing" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors px-4">Login</Link>
            <Link href="/signup" className="px-6 py-3 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-white/10">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Abstract Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          {/* Pure CSS Geometric Background representing "Data grids" */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-muted),transparent_70%)] opacity-20 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent blur-md opacity-50 block rotate-[-5deg]" />

          <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.25em] mx-auto backdrop-blur-sm">
              <Activity size={12} className="text-[var(--accent)] animate-pulse" /> Precision Engineering for SMC Practitioners
            </div>
            
            <div className="space-y-8">
              <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.9] text-white selection:bg-white selection:text-black">
                The Quantitative Edge <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">For SMC Traders.</span>
              </h1>
              <p className="text-lg md:text-2xl font-medium text-white/40 max-w-3xl mx-auto leading-relaxed tracking-tight">
                Retail journals log entries and exits. Institutional journals log narrative, liquidity sweeps, and behavioral leaks. Discover the exact statistical probability of your setups.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link href="/signup" className="px-12 py-5 bg-[var(--accent)] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-[var(--accent)]/90 transition-all shadow-2xl shadow-[var(--accent)]/20 hover:scale-105 flex items-center gap-3">
                Start Logging <ArrowRight size={16} />
              </Link>
              <Link href="#features" className="px-12 py-5 bg-transparent border border-white/10 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-white/5 transition-all">
                Audit Your Edge
              </Link>
            </div>
            
            {/* Pure Typographic Trust Bar */}
            <div className="pt-24 border-t border-white/5 mt-24">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Auditing Over 250,000+ Executions Annually</p>
               <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale">
                  <span className="text-xl font-black tracking-tighter uppercase italic text-white">SmartMoney</span>
                  <span className="text-xl font-black tracking-tighter uppercase text-white tracking-[0.2em]">Institutional</span>
                  <span className="text-xl font-black tracking-tighter uppercase text-white font-serif italic">Liquidity</span>
               </div>
            </div>
          </div>
        </section>

        {/* Phase 2: The Core Problem vs Solution */}
        <section id="features" className="py-32 bg-[#0A0A0A] border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-10">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                     Why Generic Retail Journals <span className="text-rose-500">Fail You.</span>
                  </h2>
                  <div className="space-y-6 text-white/50 text-lg font-medium leading-relaxed">
                     <p>
                        Most trading journals assume you trade generic indicators. They ask for entry prices and stop losses, completely ignoring the structural narrative that defines Smart Money Concepts.
                     </p>
                     <p>
                        If you cannot track exactly how an Order Block was mitigated, or whether a Fair Value Gap was respected on multiple timeframes, you are missing the structural data that actually dictates institutional price delivery.
                     </p>
                  </div>
                  <div className="pl-6 border-l-2 border-rose-500/30">
                     <p className="font-black text-rose-500 uppercase tracking-widest text-xs mb-2">The Result?</p>
                     <p className="text-white/60 font-medium">You repeat the same behavioral errors blindly, mistaking poor execution for a broken strategy.</p>
                  </div>
               </div>

               {/* Bento Box: The SMC Solution */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors space-y-6 group">
                     <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                        <Binary size={20} className="text-[var(--accent)]" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight group-hover:text-[var(--accent)] transition-colors">Narrative Logging</h3>
                     <p className="text-xs text-white/40 font-medium leading-relaxed">Dedicated fields for BOS, CHoCH, exact liquidity sweep zones, and mitigation tracking.</p>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors space-y-6 group md:-translate-y-8">
                     <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <BarChart3 size={20} className="text-emerald-500" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight group-hover:text-emerald-500 transition-colors">Edge Expectancy</h3>
                     <p className="text-xs text-white/40 font-medium leading-relaxed">Calculates exact mathematical expectancy per setup. Know instantly which model provides your edge.</p>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors space-y-6 group">
                     <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <BrainCircuit size={20} className="text-purple-500" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight group-hover:text-purple-500 transition-colors">Neural Auditing</h3>
                     <p className="text-xs text-white/40 font-medium leading-relaxed">Tag executions with emotional states. Isolate exactly how much "FOMO" is costing you in hard currency.</p>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-colors space-y-6 group md:-translate-y-8">
                     <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <Target size={20} className="text-amber-500" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight group-hover:text-amber-500 transition-colors">Session Analytics</h3>
                     <p className="text-xs text-white/40 font-medium leading-relaxed">Correlate performance against specific killzones. Stop giving back London profits during New York.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Abstract CSS Data Visualization (Insight Engine) */}
        <section id="audits" className="py-40 bg-black relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
            <div className="space-y-6 max-w-3xl mx-auto">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                 Quantify The <span className="text-[var(--accent)]">Unseen.</span>
               </h2>
               <p className="text-lg text-white/40 font-medium leading-relaxed">
                 Transform qualitative price action into rigorous quantitative data. High-fidelity analytics engineered specifically for structural traders.
               </p>
            </div>

            {/* Abstract Equity/Winrate Visualization (Pure CSS) */}
            <div className="relative max-w-4xl mx-auto">
               <div className="absolute -inset-10 bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none" />
               <div className="relative bg-[#080808] border border-white/5 rounded-3xl p-12 overflow-hidden shadow-2xl flex flex-col justify-end h-80 group">
                  {/* Abstract Chart UI */}
                  <div className="absolute top-8 left-8 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Live Model Expectancy</span>
                  </div>
                  
                  <div className="flex items-end justify-between gap-2 h-40 mt-auto border-b border-white/5 pb-0">
                     {[30, 45, 25, 60, 50, 80, 70, 95, 85, 100].map((height, i) => (
                        <div key={i} className="flex-1 space-y-2 flex flex-col justify-end group-hover:opacity-100 opacity-60 transition-opacity" style={{ transitionDelay: `${i * 50}ms` }}>
                           <div className="w-full bg-gradient-to-t from-[var(--accent)]/10 to-[var(--accent)]/80 rounded-t-sm transition-all duration-1000" style={{ height: `${height}%` }} />
                        </div>
                     ))}
                  </div>
                  
                  {/* Overlay Data Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-[2px]">
                     <div className="text-center space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <p className="text-4xl font-black text-white">4.2R</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Average Edge Expectancy</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-10">
               <Link href="/features" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:text-[var(--accent)] transition-colors">
                 Explore the Analytics Engine <ArrowRight size={14} />
               </Link>
            </div>
          </div>
        </section>

        {/* Phase 4: Extreme SEO Targeting Section (Semantic Structure) */}
        <section className="py-24 bg-[#050505] border-t border-white/5">
           <div className="max-w-4xl mx-auto px-6 space-y-16">
              
              <div className="text-center">
                 <h2 className="text-3xl font-black tracking-tight text-white mb-6">The Elite Smart Money Concepts Trading Journal</h2>
                 <p className="text-white/40 leading-relaxed font-medium">
                    SMC Journal is engineered explicitly for forex, crypto, and indices traders adopting the structural logic of smart money. Standard retail journals ask you to input prices; we require you to input structural intent. Our architecture is globally optimized to deliver zero-latency execution logging for active day traders.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                 <div className="space-y-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500" /> Forex Performance Tracker
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed font-medium">Log complex setups across major sessions (London, NY) with specific instrument analytics optimized for forex price action.</p>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-lg font-black text-white flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500" /> Structural Bias Analytics
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed font-medium">Calculate exactly how often your higher timeframe structural read correctly aligns with lower timeframe execution outcomes.</p>
                 </div>
              </div>

           </div>
        </section>

        {/* Phase 5: CTA Terminal */}
        <section className="py-40 bg-[var(--accent)] text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-black/20" />
           <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Ready to Audit <br/> Your Narrative?</h2>
                 <p className="text-xl font-medium text-white/80">Join the apex of institutional retail traders improving their execution.</p>
              </div>
              <Link href="/signup" className="inline-block px-12 py-6 bg-black text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform shadow-2xl">
                 Create Your Free Account
              </Link>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <TrendingUp size={20} className="text-white" />
            <span className="font-black text-lg tracking-tighter text-white">SMC JOURNAL</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            © 2026 SMC Journal. Built for the disciplined.
          </p>
        </div>
      </footer>
    </div>
  );
}
