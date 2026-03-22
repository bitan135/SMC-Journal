'use client';

import Link from 'next/link';
import { 
  Plus, 
  BarChart3, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  MousePointer2,
  Binary,
  ArrowRight,
  ChevronRight,
  Quote,
  CheckCircle2,
  XCircle,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 group-hover:scale-105 transition-transform duration-500">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter text-gradient">SMC JOURNAL</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Features</Link>
            <Link href="/insight-engine" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Insight Engine</Link>
            <Link href="/pricing" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Pricing</Link>
            <Link href="/affiliate" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Affiliate</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors px-4">Login</Link>
            <Link href="/signup" className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/10">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Phase 1: Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--accent-muted),transparent_60%)] opacity-30" />
          
          <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
              <Zap size={14} className="animate-pulse" /> The Institutional Gold Standard
            </div>
            
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] animate-slide-up">
                  Trade Like an <span className="text-gradient">Institution</span>, Not a Retail Gambler.
                </h1>
                <p className="text-lg md:text-2xl font-black text-rose-500 tracking-tight animate-slide-up [animation-delay:100ms]">
                  You’re not losing because of strategy. You’re losing because you repeat the same mistakes.
                </p>
              </div>
              <p className="text-md md:text-lg text-[var(--text-muted)] font-medium max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
                Stop the cycle of undisciplined execution. SMC Journal identifies your behavioral triggers so you can fix your edge and master the market narrative.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up [animation-delay:400ms]">
              <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 transition-all shadow-2xl shadow-[var(--accent)]/30 group">
                Start Journaling → Fix Your Mistakes
              </Link>
              <Link href="#demo" className="w-full sm:w-auto px-10 py-5 glass-card border-[var(--glass-border)] text-[var(--foreground)] rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-[var(--card-hover)] transition-all">
                See How It Works
              </Link>
            </div>

            {/* Product Screenshot Placeholder */}
            <div className="mt-20 relative max-w-6xl mx-auto group animate-fade-in [animation-delay:600ms]">
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-[4rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative glass-card rounded-[2.5rem] border border-[var(--glass-border)] p-4 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center bg-[var(--card-hover)]">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--background)] flex items-center justify-center mx-auto shadow-xl">
                        <TrendingUp size={32} className="text-[var(--accent)]" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]" aria-label="SMC Journal Dashboard Preview - Institutional Trade Tracking">
                        [DASHBOARD_PREVIEW_SCREENSHOT]
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 2: Product Demo Section */}
        <section id="demo" className="py-32 bg-[var(--card-hover)]/30">
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">How It Works: See Your Trading <span className="text-gradient">Clearly</span></h2>
              <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto">Proof over intuition. High-fidelity data capture for the professional SMC practitioner.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20">
                    <Binary size={24} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Log Trades With Structure</h3>
                  <p className="text-[var(--text-muted)] font-medium leading-relaxed">
                    Stop guessing. Capture every institutional detail—entry timeframes, multi-timeframe bias, risk exposure, and strategy convergence—in seconds.
                  </p>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Timeframe Bias Tracking</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Institutional Narrative Capture</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Image Proof for Every Execution</span>
                   </div>
                </div>
              </div>
              <div className="glass-card rounded-[32px] border-[var(--glass-border)] aspect-square flex items-center justify-center p-8 bg-[var(--background)] shadow-xl rotate-2">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]" aria-label="Add Trade Form - Structured SMC Data Entry">
                    [ADD_TRADE_FORM_SCREENSHOT]
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Problem -> Solution Section */}
        <section className="py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
             <div className="glass-card rounded-[50px] border-[var(--glass-border)] p-12 md:p-24 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent)]/5 to-transparent" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                   <div className="space-y-12">
                      <div className="space-y-4">
                         <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Why Traders <span className="text-rose-500">Fail</span></h2>
                         <p className="text-[var(--text-muted)] font-medium">It's not your strategy. It's your habits.</p>
                      </div>

                      <div className="space-y-8">
                         <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                               <XCircle size={24} className="text-rose-500" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Repeating Bad Trades</p>
                               <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">You take the same low-probability setups over and over because they "look" right, even when they aren't.</p>
                            </div>
                         </div>
                         <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                               <Zap size={24} className="text-rose-500" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Breaking Rules After Losses</p>
                               <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">Emotions take over after a stop-out. You revenge trade or skip your verification steps.</p>
                            </div>
                         </div>
                         <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                               <Target size={24} className="text-rose-500" />
                            </div>
                            <div className="space-y-2">
                               <p className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Blind to Your Best Assets</p>
                               <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">You don't actually know which setups or timeframes make you money—and which ones steal it.</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-8">
                         <Link href="/signup" className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                            Start Fixing My Trading →
                         </Link>
                      </div>
                   </div>

                   <div className="relative group">
                      <div className="absolute -inset-2 bg-[var(--accent)] rounded-[40px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="relative glass-card rounded-[40px] border-[var(--glass-border)] bg-[var(--card-hover)] aspect-[4/5] flex items-center justify-center p-8 -rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]" aria-label="SMC Performance Audit - Logic and Execution Analytics">
                            [PERFORMANCE_AUDIT_SCREENSHOT]
                          </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Phase 4: Solution Positioning */}
        <section className="py-32 bg-[var(--background)]">
           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-6 p-8 glass-card border-[var(--glass-border)] rounded-[40px] hover:border-[var(--accent)]/30 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Binary size={24} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight">Structured Data Capture</h3>
                 <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">Log every institucional detail in seconds. No more messy spreadsheets or vague notes.</p>
              </div>
              <div className="space-y-6 p-8 glass-card border-[var(--glass-border)] rounded-[40px] hover:border-[var(--accent)]/30 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <XCircle size={24} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight">Identify Execution Errors</h3>
                 <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">Our engine automatically flags when you break your rules, making behavioral leaks impossible to ignore.</p>
              </div>
              <div className="space-y-6 p-8 glass-card border-[var(--glass-border)] rounded-[40px] hover:border-[var(--accent)]/30 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp size={24} />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight">Better Decision Making</h3>
                 <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">Trade with confidence. Use hard data to decide which setups to scale and which to drop forever.</p>
              </div>
           </div>
        </section>

        {/* Phase 5: Insight Engine Highlight */}
        <section id="insights" className="py-32 bg-black text-white selection:bg-white selection:text-black">
           <div className="max-w-7xl mx-auto px-6 text-center space-y-20">
              <div className="space-y-6 max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                   <Sparkles size={14} className="text-amber-400" /> The Secret to Consistency
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter">See exactly what is <span className="text-[var(--accent)]">working</span></h2>
                 <p className="text-white/60 font-medium text-lg leading-relaxed">
                   After 100 trades, your edge isn't a theory—it's a mathematical fact. No more guessing which market conditions favor your personality.
                 </p>
              </div>

              <div className="relative max-w-5xl mx-auto">
                 <div className="absolute inset-0 bg-[var(--accent)] rounded-[3rem] blur-[100px] opacity-20" />
                 <div className="relative bg-[#111] rounded-[3rem] border border-white/10 p-6 aspect-[16/10] flex items-center justify-center group overflow-hidden shadow-3xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="text-center space-y-6 z-10 transition-transform duration-700 group-hover:scale-105">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto border border-white/20">
                            <TrendingUp size={28} className="text-[var(--accent)]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30" aria-label="Trader Insight Engine - Mathematical Edge Verification">
                            [INSIGHT_ENGINE_UNLOCKED_SCREENSHOT]
                        </p>
                    </div>
                    <div className="absolute bottom-12 inset-x-0 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-700">
                        <Link href="/signup" className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px]">Verify My Edge Now</Link>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                 <div className="space-y-4">
                    <p className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                       <Zap size={14} className="text-amber-400" /> Your Best Setup
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed">Stop trading 10 different models. Identify the subset of setups that actually account for 80% of your profits.</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-blue-400" /> Behavioral Mastery
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed">Know exactly how "revenge trading" or "skipping checks" impacts your equity curve in real dollar terms.</p>
                 </div>
                 <div className="space-y-4">
                    <p className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                       <Target size={14} className="text-rose-400" /> When You Lose Most
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed">Pinpoint the specific hours or session overlaps where your performance degrades, and stop trading them.</p>
                 </div>
              </div>

              <div className="pt-12">
                 <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:scale-105 transition-all shadow-2xl shadow-[var(--accent)]/30 group">
                    Unlock My Insights <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>
        </section>

        {/* Phase 5: Feature Visuals Section */}
        <section id="features" className="py-32">
           <div className="max-w-7xl mx-auto px-6 space-y-32">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black tracking-tighter">SMC Trading Journal <span className="text-gradient">Features</span></h2>
                 <p className="text-[var(--text-muted)] font-medium max-w-xl mx-auto">The complete operating system for the modern SMC trader.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 space-y-8 flex flex-col group hover:border-[var(--accent)]/40 transition-all">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">Trade Logging</p>
                       <h3 className="text-2xl font-black tracking-tight">Structured <br /> Data Capture</h3>
                       <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">Capture the "Why" behind every trade, not just the "How". Structured fields ensure clean data for analytics.</p>
                    </div>
                    <div className="flex-1 bg-[var(--background)] border border-[var(--glass-border)] rounded-3xl aspect-[4/3] flex items-center justify-center p-4 shadow-inner">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-center opacity-50">
                           [LOGGING_UI_MINI_PREVIEW]
                        </p>
                    </div>
                 </div>
                 <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 space-y-8 flex flex-col group hover:border-[var(--accent)]/40 transition-all">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Analytics</p>
                       <h3 className="text-2xl font-black tracking-tight">Performance <br /> Pulse Dashboard</h3>
                       <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">Real-time equity curves, win-rate segmentation, and risk-reward optimization dials at a glance.</p>
                    </div>
                    <div className="flex-1 bg-[var(--background)] border border-[var(--glass-border)] rounded-3xl aspect-[4/3] flex items-center justify-center p-4 shadow-inner">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-center opacity-50">
                           [DASHBOARD_UI_MINI_PREVIEW]
                        </p>
                    </div>
                 </div>
                 <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 space-y-8 flex flex-col group hover:border-[var(--accent)]/40 transition-all">
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Strategies</p>
                       <h3 className="text-2xl font-black tracking-tight">Strategy <br /> Edge Auditing</h3>
                       <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">Define your setups and let our engine calculate exactly which model has the highest expectancy.</p>
                    </div>
                    <div className="flex-1 bg-[var(--background)] border border-[var(--glass-border)] rounded-3xl aspect-[4/3] flex items-center justify-center p-4 shadow-inner">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] text-center opacity-50">
                           [STRATEGY_UI_MINI_PREVIEW]
                        </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SEO Phase: Educational Sections */}
        <section className="py-24 bg-[var(--card-hover)]/20">
           <div className="max-w-7xl mx-auto px-6 space-y-32">
              
              {/* Section 1: Free Trading Journal for SMC Traders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tightest">Free <span className="text-gradient">Trading Journal</span> for SMC Traders</h2>
                    <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed">
                       SMC Journal was built from the ground up to solve the specific needs of Smart Money Concept traders. Unlike generic journals that only track entry and exit, we provide native fields for BOC (Break of Character), CHoCH (Change of Character), and FVG (Fair Value Gaps).
                    </p>
                    <div className="space-y-4">
                       <p className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-[var(--accent)]" /> Built for Price Action
                       </p>
                       <p className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-[var(--accent)]" /> Institutional Narrative Tracking
                       </p>
                    </div>
                 </div>
                 <div className="glass-card rounded-[48px] border-[var(--glass-border)] p-12 bg-[var(--background)] shadow-2xl space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                       <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Focus on the Narrative</h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Identify exactly where liquidity was swept and how the institutional move was sponsored. Stop logging just prices; start logging intent.</p>
                 </div>
              </div>

              {/* Section 2: Why Use a Trading Journal? */}
              <div className="text-center space-y-12 max-w-4xl mx-auto">
                 <h2 className="text-4xl md:text-5xl font-black tracking-tightest">Why Use a <span className="text-gradient">Trading Journal</span>?</h2>
                 <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed">
                    Most traders fail not because their strategy is bad, but because they lack the discipline to follow it. A professional trading journal acts as a mirror, reflecting your execution errors in cold, hard data. Without a log, you are simply gambling on intuition.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="p-8 glass-card border-[var(--glass-border)] rounded-3xl">
                       <h4 className="text-sm font-black uppercase tracking-widest mb-4">Eliminate Emotions</h4>
                       <p className="text-xs text-[var(--text-muted)] font-medium">Neutralize the impact of FOMO and revenge trading by following a systematic logging process.</p>
                    </div>
                    <div className="p-8 glass-card border-[var(--glass-border)] rounded-3xl">
                       <h4 className="text-sm font-black uppercase tracking-widest mb-4">Audit Your Edge</h4>
                       <p className="text-xs text-[var(--text-muted)] font-medium">Use quantitative data to prove your strategy works before scaling with institutional size.</p>
                    </div>
                    <div className="p-8 glass-card border-[var(--glass-border)] rounded-3xl">
                       <h4 className="text-sm font-black uppercase tracking-widest mb-4">Master Discipline</h4>
                       <p className="text-xs text-[var(--text-muted)] font-medium">Build the habit of professional documentation that separates retail gamblers from institutional traders.</p>
                    </div>
                 </div>
              </div>

              {/* Section 3: Best Trading Journal for Forex Traders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="order-2 lg:order-1 glass-card rounded-[48px] border-[var(--glass-border)] p-12 bg-black text-white shadow-2xl space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Institutional Speed</h3>
                    <p className="text-sm text-white/50 font-medium">Log trades in under 15 seconds. Designed for active session trading where every second of focus counts.</p>
                 </div>
                 <div className="order-1 lg:order-2 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tightest">Best <span className="text-gradient">Trading Journal</span> for Forex Traders</h2>
                    <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed">
                       Built by a forex trader for forex traders. We optimized SMC Journal for high-frequency session trading. Whether you scalp the 1M or swing the 4H, our interface stays clean and out of your way.
                    </p>
                    <ul className="space-y-4">
                       <li className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500" /> Advanced Drawdown Analytics
                       </li>
                       <li className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500" /> Multi-Timeframe Bias Correlation
                       </li>
                       <li className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-500" /> Secure Cloud Infrastructure
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* Phase 6: CTA Section */}
        <section className="py-32 relative">
           <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Ready to Master <span className="text-gradient">Your Narrative?</span></h2>
                 <p className="text-lg text-[var(--text-muted)] font-medium">Trusted by 500+ SMC traders improving their execution daily.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <Link href="/signup" className="w-full sm:w-auto px-12 py-6 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[14px] hover:scale-110 transition-all shadow-2xl shadow-[var(--accent)]/30">
                    Improve My Trading Now <ArrowRight className="inline-block ml-2" size={20} />
                 </Link>
                 <Link href="/pricing" className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] hover:text-[var(--accent)] transition-colors underline-offset-8 underline decoration-[var(--accent)]/30">
                    See Professional Plans
                 </Link>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] pt-8">
                 Free 7-Day sequence. No high-frequency risk.
              </p>
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="font-black text-sm tracking-tighter text-gradient">SMC JOURNAL</span>
              </Link>
              <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                The institutional standard for professional trader documentation and performance analysis.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Product</p>
              <nav className="flex flex-col gap-2">
                <Link href="/features" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Features</Link>
                <Link href="/insight-engine" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Insight Engine</Link>
                <Link href="/pricing" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">SEO Hub</p>
              <nav className="flex flex-col gap-2">
                <Link href="/trading-journal" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Trading Journal</Link>
                <Link href="/forex-trading-journal" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Forex Journal</Link>
                <Link href="/smc-trading-journal" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">SMC Journal</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Legal</p>
              <nav className="flex flex-col gap-2">
                <Link href="/terms" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">Privacy Policy</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">Mission</p>
              <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                Dedicated to helping traders achieve consistent profitability through quantitative discipline.
              </p>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
              © 2026 SMC Journal. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
               <MousePointer2 size={16} className="text-[var(--text-muted)]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Institutional Grade</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
