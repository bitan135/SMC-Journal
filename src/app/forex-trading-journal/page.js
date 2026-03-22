'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Zap,
  Binary
} from 'lucide-react';

export default function ForexTradingJournalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <Link href="/signup" className="text-sm font-black text-indigo-400 hover:underline">
          Join Traders →
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <Globe size={14} /> Optimized for Global Markets
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-8">
          The Best <span className="text-indigo-500">Forex Trading Journal</span> for Session Traders.
        </h1>
        <p className="text-xl text-white/50 font-medium leading-relaxed mb-12">
          From London Open to New York Close—track every pip with institutional precision. SMC Journal is optimized for high-frequency forex traders who need speed and multi-timeframe correlation.
        </p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="p-10 rounded-[40px] bg-white/5 border border-white/10">
            <h2 className="text-xl font-black mb-6">Session Intelligence</h2>
            <p className="text-white/40 text-sm mb-6">Automatically track performance across London, New York, and Asian Kill-zones. Identify which sessions steal your capital.</p>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
              <Zap size={24} />
            </div>
          </div>
          <div className="p-10 rounded-[40px] bg-white/5 border border-white/10">
            <h2 className="text-xl font-black mb-6">M1 to D1 Correlation</h2>
            <p className="text-white/40 text-sm mb-6">Log your HTF bias and correlate it with your LTF execution. Perfect for top-down institutional analysis.</p>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
              <Binary size={24} />
            </div>
          </div>
        </section>

        <div className="text-center p-20 rounded-[64px] bg-gradient-to-br from-indigo-600 to-purple-600">
           <h2 className="text-3xl md:text-5xl font-black mb-12">Start Your Forex Journey for Free.</h2>
           <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl">
              Get Started Now <ArrowRight size={18} />
           </Link>
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 text-center mt-20">
        <p className="text-xs font-black text-white/20 uppercase tracking-widest">© 2026 SMC Journal · Built for the Session Traders</p>
      </footer>
    </div>
  );
}
