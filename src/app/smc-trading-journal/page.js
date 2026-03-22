'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  BrainCircuit,
  Target,
  Sparkles
} from 'lucide-react';

export default function SMCTradingJournalPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-[var(--glass-border)]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter">SMC Journal</span>
        </Link>
        <Link href="/signup" className="text-sm font-black text-[var(--accent)] hover:underline">
          Go Pro Free →
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <span className="text-[var(--accent)] text-xs font-black uppercase tracking-[0.3em] mb-4 block">INSTITUTIONAL GRADE</span>
        <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-8">
          The #1 Specialized <br /> <span className="text-gradient">SMC Trading Journal</span>.
        </h1>
        <p className="text-xl text-[var(--text-muted)] font-medium leading-relaxed mb-12">
          Stop using generic journals that don't understand BOC, CHoCH, or FVG. SMC Journal was built specifically for the Smart Money community to help you track market narrative and identify sponsoring intent.
        </p>

        <section className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-amber-400/10 flex items-center justify-center text-amber-500">
                  <Sparkles size={24} />
               </div>
               <h3 className="text-2xl font-black">HTF to LTF Correlation</h3>
               <p className="text-sm text-[var(--text-muted)]">Automatically correlate your daily bias with your 1M or 5M entries. Find exactly where your multi-timeframe alignment fails.</p>
            </div>
            <div className="space-y-6">
               <div className="w-12 h-12 rounded-2xl bg-purple-400/10 flex items-center justify-center text-purple-500">
                  <BrainCircuit size={24} />
               </div>
               <h3 className="text-2xl font-black">Liquidity Sweep Audit</h3>
               <p className="text-sm text-[var(--text-muted)]">Tag inducement and liquidity sweeps on every trade. Audit which liquidity types provide the highest ROI for your setup.</p>
            </div>
          </div>

          <div className="p-12 glass-card rounded-[50px] border-[var(--glass-border)] bg-[var(--card-hover)] text-center space-y-8">
             <h2 className="text-3xl font-black tracking-tight">Built for Serious SMC Traders.</h2>
             <p className="text-[var(--text-muted)] max-w-xl mx-auto">Don't settle for less. Use a journal that speaks your language. Join 500+ institutional-minded traders today.</p>
             <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all">
                Access SMC Engine Now <ArrowRight size={18} />
             </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-[var(--glass-border)] text-center mt-20">
        <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">© 2026 SMC Journal · Master Your Narrative</p>
      </footer>
    </div>
  );
}
