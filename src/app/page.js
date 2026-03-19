'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  BarChart3, 
  Brain, 
  Image as ImageIcon, 
  Check, 
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Heart,
  MousePointerClick
} from 'lucide-react';
import { captureReferral } from '@/lib/referral';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    captureReferral();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* SECTION 1 — NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl border-b border-white/5 bg-[#050505]/80' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('affiliate')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Affiliate</button>
          <a href="mailto:hello.bitanbiswas@gmail.com" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-white/60 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            Start Free
          </Link>
          <button className="md:hidden text-white/60" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-[72px] bg-[#050505] z-50 p-6 flex flex-col gap-6 animate-fade-in md:hidden border-t border-white/5">
            <button onClick={() => scrollToSection('features')} className="text-xl font-bold text-left">Features</button>
            <button onClick={() => scrollToSection('pricing')} className="text-xl font-bold text-left">Pricing</button>
            <button onClick={() => scrollToSection('affiliate')} className="text-xl font-bold text-left">Affiliate</button>
            <Link href="/login" className="text-xl font-bold text-left">Login</Link>
            <div className="mt-auto pb-10">
              <Link href="/signup" className="w-full flex items-center justify-center px-5 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold">
                Start Journaling Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* SECTION 2 — HERO */}
        <section className="relative pt-32 md:pt-48 pb-20 px-6 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles size={12} />
                <span>✦ Free Forever — No Credit Card Required</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8">
                The Free SMC <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Trading Journal.</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-white/50 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                "I got tired of paying for journals that didn't understand what a CHoCH or FVG even was. So I built one. It's free. It always will be."
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2 group">
                  Start Journaling Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button onClick={() => scrollToSection('features')} className="w-full sm:w-auto px-8 py-4 glass-card border-white/5 rounded-2xl font-black text-lg hover:border-white/10 transition-all flex items-center justify-center gap-2">
                  See Features ↓
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
                <span>Free forever</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>No credit card</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5">Built with <Heart size={10} className="text-red-500 fill-red-500" /> in Kolkata</span>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              {/* Dashboard Mockup */}
              <div className="relative group perspective-[1000px]">
                <div className="p-4 rounded-[32px] glass-card border-white/10 shadow-2xl transition-transform duration-1000 ease-out preserve-3d rotate-y-[-8deg] rotate-x-[4deg] group-hover:rotate-0">
                  <div className="bg-[#0c0c0c] rounded-[24px] overflow-hidden border border-white/5 aspect-[4/3] flex flex-col p-4">
                    {/* Header Placeholder */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5" />
                        <div className="h-4 w-32 bg-white/5 rounded" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-20 h-8 bg-white/5 rounded-lg" />
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                      </div>
                    </div>

                    {/* Metric Cards Placeholder */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {[1, 2].map(i => (
                        <div key={i} className="p-4 rounded-3xl glass-card border-white/5 flex flex-col gap-2">
                          <div className="h-2 w-16 bg-white/5 rounded" />
                          <div className="h-6 w-24 bg-indigo-500/20 rounded" />
                        </div>
                      ))}
                    </div>

                    {/* Chart Placeholder */}
                    <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/[0.05] p-6 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end px-4 pb-8 justify-between gap-2">
                        {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-indigo-500/10 border-t-2 border-indigo-500/40 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="relative z-10 flex flex-col gap-2">
                        <div className="h-3 w-40 bg-white/5 rounded" />
                        <div className="h-2 w-24 bg-white/[0.02] rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Tags */}
                <div className="absolute -top-6 -right-6 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-xl">
                  BOS Confirmed
                </div>
                <div className="absolute -bottom-6 -left-6 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest shadow-xl">
                  Liquidity Sweep
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — THE PROBLEM */}
        <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">WHY I BUILT THIS</span>
              <h2 className="text-3xl md:text-5xl font-black mt-4">The Truth About Journaling.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "No journal understood SMC",
                  text: "Edgewonk, TraderVue, Notion templates — none of them know what BOS, CHoCH, or an Order Block is. I was manually tagging everything in Excel."
                },
                {
                  title: "Good tools cost too much",
                  text: "$50/month for a journal before you've even found your edge is completely backwards. I refused to pay it, so I built my own."
                },
                {
                  title: "I couldn't see my patterns",
                  text: "I knew I had setups that worked. But I had no data to prove which session, which confluence, or which emotional state was killing my account."
                }
              ].map((card, i) => (
                <div key={i} className="p-10 rounded-[40px] glass-card border-white/5 hover:border-white/10 transition-all group">
                  <h3 className="text-xl font-black mb-4 group-hover:text-indigo-400 transition-colors">{card.title}</h3>
                  <p className="text-white/50 leading-relaxed font-bold">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">WHAT YOU GET</span>
              <h2 className="text-3xl md:text-6xl font-black mt-4 mb-6">Everything an SMC Trader Needs.</h2>
              <p className="text-lg font-bold text-white/40">Core journaling is free. Always.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: "SMC-Native Tagging",
                  desc: "Tag BOS, CHoCH, FVG, Order Block, and Liquidity Sweep on every trade. Built for how SMC traders actually think."
                },
                {
                  icon: Clock,
                  title: "Session Intelligence",
                  desc: "London? New York? Asia? Find out exactly which session your edge lives in and stop trading the ones where it doesn't."
                },
                {
                  icon: BarChart3,
                  title: "Strategy Performance",
                  desc: "See win rate, average RR, and expectancy per strategy. Know which setups to take and which ones to skip."
                },
                {
                  icon: TrendingUp,
                  title: "Equity Curve",
                  desc: "Watch your account grow trade by trade. Spot exactly when you start overtrading or drifting from your plan."
                },
                {
                  icon: Brain,
                  title: "Psychology Tracking",
                  desc: "Log your emotional state on every trade. Discover that 80% of your losses happen in FOMO mode. Then fix it."
                },
                {
                  icon: ImageIcon,
                  title: "Chart Screenshots",
                  desc: "Upload before and after screenshots on every trade. Review your setups like a professional analyst."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[36px] glass-card border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-2 duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <feature.icon size={26} />
                  </div>
                  <h3 className="text-xl font-black mb-4">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed font-bold">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — HOW IT WORKS */}
        <section className="py-24 px-6 bg-white/[0.01] border-y border-white/5 overflow-hidden relative">
          <div className="absolute -left-24 top-1/2 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full" />
          
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-20">Dead Simple to Use.</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-white/5 -z-10" />
              
              {[
                { step: "01", title: "Log your trade in a minute", desc: "Entry, SL, TP, session, strategy, SMC tags, and emotional state. Upload your chart. Done." },
                { step: "02", title: "The data builds automatically", desc: "Win rate, profit factor, expectancy, equity curve — all calculated instantly. No formulas." },
                { step: "03", title: "Find your edge", desc: "After 20 trades, patterns emerge. After 50, you'll know exactly what works for you." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-[#050505] border-2 border-indigo-500/30 flex items-center justify-center text-2xl font-black text-indigo-400 mb-8 shadow-xl shadow-indigo-500/10">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-black mb-4 px-4">{step.title}</h3>
                  <p className="text-white/40 font-bold leading-relaxed px-6">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — SOCIAL PROOF */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mb-24 py-12 rounded-[40px] glass-card border-white/5">
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-black block mb-2">---</span>
                <span className="text-xs font-black text-white/30 uppercase tracking-widest">Trades Logged</span>
              </div>
              <div className="w-[1px] h-12 bg-white/5 hidden md:block" />
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-black block mb-2">---</span>
                <span className="text-xs font-black text-white/30 uppercase tracking-widest">Traders Journaling</span>
              </div>
              <div className="w-[1px] h-12 bg-white/5 hidden md:block" />
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-black block mb-2">---</span>
                <span className="text-xs font-black text-white/30 uppercase tracking-widest">Strategies Tracked</span>
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <div className="p-10 md:p-16 rounded-[48px] glass-card border-white/10 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                  <ImageIcon size={20} className="text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-black italic mb-10 leading-snug">
                  "Finally a journal that understands SMC. Discovered my London OB trades have 71% win rate but I was losing every NY session. Changed everything."
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 mb-4 border border-white/10" />
                  <span className="text-sm font-black tracking-widest uppercase">SMC Trader, @handle</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — PRICING */}
        <section id="pricing" className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">PRICING</span>
              <h2 className="text-3xl md:text-6xl font-black mt-4 mb-6">Simple, Honest Pricing.</h2>
              <p className="text-lg font-bold text-white/40">Start free. Upgrade only if you want deeper analytics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
              {/* FREE PLAN */}
              <div className="p-10 rounded-[40px] glass-card border-white/5 flex flex-col items-center text-center">
                <h3 className="text-xl font-black mb-2">FREE</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest">forever</span>
                </div>
                <div className="w-full h-[1px] bg-white/5 my-8" />
                <ul className="space-y-4 mb-10 text-left w-full">
                  {["Unlimited trades", "SMC tag tracking", "Equity curve", "Session overview", "Strategy stats", "Psychology log", "Screenshots"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/60">
                      <Check size={16} className="text-indigo-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-4 glass-card border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-white/20 transition-all">
                  Start Free →
                </Link>
              </div>

              {/* PRO PLAN */}
              <div className="p-12 rounded-[48px] glass-card border-indigo-500/30 bg-indigo-500/[0.03] flex flex-col items-center text-center relative scale-105 shadow-2xl shadow-indigo-500/10">
                <div className="absolute -top-4 px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-black mb-2">PRO TRADER</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-black">$20</span>
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                </div>
                <div className="w-full h-[1px] bg-white/10 my-8" />
                <ul className="space-y-4 mb-10 text-left w-full">
                  <li className="flex items-center gap-3 text-sm font-black text-indigo-300">
                    <Sparkles size={16} /> Everything in Free
                  </li>
                  {["All 7 analytics", "Drawdown analysis", "Monthly P&L", "Deep strategy data", "Data export"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                      <Check size={16} className="text-indigo-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                  Upgrade to Pro →
                </Link>
              </div>

              {/* LIFETIME PLAN */}
              <div className="p-10 rounded-[40px] glass-card border-white/5 flex flex-col items-center text-center">
                <h3 className="text-xl font-black mb-2">LEGACY HERO</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">$50</span>
                  <span className="text-white/30 font-bold uppercase text-[10px] tracking-widest">once</span>
                </div>
                <div className="w-full h-[1px] bg-white/5 my-8" />
                <ul className="space-y-4 mb-10 text-left w-full">
                  <li className="flex items-center gap-3 text-sm font-black text-indigo-300">
                    <Sparkles size={16} /> Everything in Pro
                  </li>
                  {["Lifetime access", "All future features", "No monthly fees", "Priority support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/60">
                      <Check size={16} className="text-indigo-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="w-full py-4 glass-card border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-white/20 transition-all">
                  Get Lifetime →
                </Link>
              </div>
            </div>

            <p className="text-center mt-12 text-xs font-bold text-white/20 uppercase tracking-widest">
              Payments processed securely · Cancel anytime · 30-day refund guarantee
            </p>
          </div>
        </section>

        {/* SECTION 8 — ABOUT / SOLO DEV STORY */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-48 h-48 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center rotate-3 overflow-hidden shadow-2xl">
               {/* Portrait placeholder */}
               <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="h-2 w-16 bg-white/10 rounded" />
               </div>
            </div>
            
            <div className="flex-1">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">THE STORY</span>
              <h2 className="text-3xl md:text-5xl font-black mt-4 mb-8">Why I Built This.</h2>
              <div className="space-y-6 text-lg font-bold text-white/50 leading-relaxed">
                <p>I'm Bitan — a solo developer and SMC trader from Kolkata, India.</p>
                <p>I spent months journaling in Excel sheets, Notion templates, and tools that had no idea what Smart Money Concepts even were. Every time I wanted to see my win rate by session or by setup, I was manually calculating it in a spreadsheet.</p>
                <p>So I built SMC Journal. It took months of solo work. It's free because I built it for myself first — and I believe traders shouldn't have to pay just to understand their own data.</p>
                <p>If it helps your trading, amazing. If you want to support the project, there's a Pro plan and a one-time Lifetime option. No pressure. The core tool is free forever.</p>
              </div>
              <div className="mt-12 flex flex-col gap-4">
                <p className="text-sm font-black text-white">— Bitan Biswas</p>
                <p className="text-sm font-bold text-white/30">Questions? Reach me at <a href="mailto:hello.bitanbiswas@gmail.com" className="text-indigo-400 hover:underline">hello.bitanbiswas@gmail.com</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 — AFFILIATE PROGRAM PREVIEW */}
        <section id="affiliate" className="py-24 px-6 bg-indigo-600/[0.02] border-y border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Partner With SMC Journal.</h2>
              <p className="text-lg font-bold text-white/40">If you create SMC content, let's work together.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
               {[
                 { label: "Starts at 10%", sub: "Commission" },
                 { label: "Your Own Code", sub: "Like YOURNAME10" },
                 { label: "Real-Time", sub: "Dashboard" }
               ].map((pill, i) => (
                 <div key={i} className="px-8 py-5 rounded-3xl glass-card border-white/5 text-center min-w-[200px]">
                   <span className="block text-xl font-black text-indigo-400 mb-1">{pill.label}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{pill.sub}</span>
                 </div>
               ))}
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg font-bold text-white/50 leading-relaxed mb-12">
                I partner directly with SMC content creators. You get your own coupon code — your audience gets a discount, you earn commission on every sale they make. Commission starts at 10% and is negotiable based on your audience size. I review every partnership personally.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/affiliate" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95">
                  Apply to Partner →
                </Link>
                <Link href="/affiliate/login" className="w-full sm:w-auto px-8 py-4 glass-card border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-white/20 transition-all active:scale-95">
                  Partner Login →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10 — FINAL CTA BANNER */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative p-12 md:p-24 rounded-[64px] bg-gradient-to-br from-indigo-600 to-purple-800 overflow-hidden text-center group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-1000" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to find your edge?</h2>
                <p className="text-xl md:text-2xl font-bold text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Stop guessing. Start journaling. The data doesn't lie — but only if you collect it.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-700 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-950/40 hover:scale-105 transition-all active:scale-95 group">
                  Create Free Account <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest mt-8">
                  Free forever. No credit card. Takes 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 11 — FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter">SMC Journal</span>
              </div>
              <p className="text-sm font-bold text-white/30 leading-relaxed mb-6">
                The free SMC trading journal. Built by a solo trader in Kolkata, India for the global SMC community.
              </p>
              <a href="mailto:hello.bitanbiswas@gmail.com" className="text-sm font-black text-white active:text-indigo-400">hello.bitanbiswas@gmail.com</a>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-2">
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Product</h4>
                <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-white/30 hover:text-indigo-400 text-left transition-colors">Features</button>
                <button onClick={() => scrollToSection('pricing')} className="text-sm font-bold text-white/30 hover:text-indigo-400 text-left transition-colors">Pricing</button>
                <Link href="/changelog" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Changelog</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Company</h4>
                <Link href="/about" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">About</Link>
                <button onClick={() => scrollToSection('affiliate')} className="text-sm font-bold text-white/30 hover:text-indigo-400 text-left transition-colors">Affiliate Program</button>
                <a href="mailto:hello.bitanbiswas@gmail.com" className="text-sm font-bold text-white/30 hover:text-indigo-400 transition-colors">Contact</a>
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col items-center lg:items-end justify-center">
               <div className="px-6 py-4 rounded-3xl glass-card border-white/5 text-center lg:text-right">
                  <span className="block text-xl font-black text-indigo-400 mb-1">100% Free Core</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Trusted by SMC Traders</span>
               </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-white/20">© 2026 SMC Journal · Built by Bitan Biswas</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-xs font-bold text-white/20 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs font-bold text-white/20 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
