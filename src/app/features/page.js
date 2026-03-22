'use client';

import Link from 'next/link';
import { 
  Target, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Database
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "SMC-Native Tagging",
    desc: "Tag BOS, CHoCH, FVG, Order Block, and Liquidity Sweep on every trade. Built for how SMC traders actually think — not retrofitted from forex.",
    details: [
      "Dedicated input for Market Structure changes",
      "Point of Interest (POI) tracking",
      "Fair Value Gap (FVG) confluence logging",
      "Liquidity hunt/sweep identification"
    ]
  },
  {
    icon: Clock,
    title: "Session Intelligence",
    desc: "London? New York? Asia? Find out exactly which session your edge lives in and stop trading the ones where it doesn't.",
    details: [
      "Automatic session detection based on trade time",
      "Win rate comparison across Kill-zones",
      "Volume and volatility analysis per session",
      "Time-of-day performance heatmaps"
    ]
  },
  {
    icon: BarChart3,
    title: "Strategy Performance",
    desc: "See win rate, average RR, and expectancy per strategy. Know which setups to take and which ones to skip entirely.",
    details: [
      "Strategy-specific equity curves",
      "Average Risk-to-Reward (RR) metrics",
      "Expectancy and Profit Factor calculations",
      "Setup confluence tracking"
    ]
  },
  {
    icon: TrendingUp,
    title: "Equity Curve",
    desc: "Watch your account grow trade by trade. Spot exactly when you start overtrading, revenge trading, or drifting from your plan.",
    details: [
      "Real-time balance and equity tracking",
      "Drawdown percentage analysis",
      "P&L distribution charts",
      "Compounding effect visualization"
    ]
  },
  {
    icon: Brain,
    title: "Psychology Tracking",
    desc: "Log your emotional state on every trade. Discover that 80% of your losses happen when you're in FOMO mode. Then fix it.",
    details: [
      "Emotional state tagging (FOMO, Greed, Fear, Calm)",
      "Performance correlation with mental state",
      "Discipline score per trade",
      "Mistake and lesson logging"
    ]
  },
  {
    icon: ImageIcon,
    title: "Chart Screenshots",
    desc: "Upload before and after screenshots on every trade. Review your setups like a professional analyst. Learn from every execution.",
    details: [
      "Secure image storage in Supabase",
      "Large-scale chart previewer",
      "Comparison view for entry vs exit",
      "Direct link to TradingView screenshots"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] selection:bg-indigo-500/30">
      {/* Small Navbar */}
      <nav className="p-6 md:p-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <Link href="/signup" className="text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors">
          Start Free →
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">THE TOOLKIT</span>
        <h1 className="text-4xl md:text-7xl font-black mt-6 mb-8 tracking-tight">Everything built for <br /> <span className="text-indigo-500">SMC Traders.</span></h1>
        <p className="text-xl font-bold text-white/40 max-w-2xl mx-auto mb-24">
          I didn't just build another journal. I built a specialized performance tool that understands the language of Smart Money.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {features.map((f, i) => (
            <div key={i} className="p-10 rounded-[48px] glass-card border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <f.icon size={120} />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/20">
                <f.icon size={26} className="text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">{f.title}</h3>
              <p className="text-white/50 font-bold mb-8 leading-relaxed">{f.desc}</p>
              
              <ul className="space-y-3">
                {f.details.map((detail, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold text-white/30">
                    <Shield size={14} className="text-indigo-500" /> {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mt-40 p-12 md:p-24 rounded-[64px] glass-card border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-600/5" />
          <h2 className="text-3xl md:text-5xl font-black mb-8 relative z-10">Stop guessing. Start journaling.</h2>
          <p className="text-lg font-bold text-white/40 mb-12 max-w-2xl mx-auto relative z-10">
            The difference between a struggling trader and a professional is the data. Collect yours for free, starting today.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all active:scale-95 relative z-10 group shadow-xl shadow-indigo-600/20">
            Create Free Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 mt-20 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 opacity-20 hover:opacity-100 transition-opacity">
           <TrendingUp size={24} className="text-indigo-500" />
           <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <p className="text-xs font-bold text-white/20">© 2026 SMC Journal · Built for traders, by a trader.</p>
        <div className="flex justify-center gap-8 mt-4">
           <Link href="/" className="text-xs font-bold text-white/20 hover:text-white transition-colors">Home</Link>
           <Link href="/privacy" className="text-xs font-bold text-white/20 hover:text-white transition-colors">Privacy</Link>
           <Link href="/terms" className="text-xs font-bold text-white/20 hover:text-white transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
