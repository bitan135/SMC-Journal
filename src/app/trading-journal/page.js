'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';

export default function TradingJournalPage() {
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
          Start Free Account →
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tightest mb-8">
          The Ultimate <span className="text-gradient">Trading Journal</span> for Consistency.
        </h1>
        <p className="text-xl text-[var(--text-muted)] font-medium leading-relaxed mb-12">
          Professional trading requires professional documentation. SMC Journal provides the tools you need to audit your edge, identify psychological leaks, and scale your strategy with data-backed confidence.
        </p>

        <section className="space-y-12">
          <div className="glass-card p-10 rounded-[40px] border-[var(--glass-border)]">
            <h2 className="text-2xl font-black mb-6">Why You Need a Digital Trading Journal</h2>
            <p className="text-[var(--text-muted)] mb-8">
              Legacy spreadsheets and physical notebooks are slow, disorganized, and impossible to analyze at scale. SMC Journal automates the heavy lifting so you can focus on the charts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Instant P&L Analytics",
                "Advanced Equity Curves",
                "Setup Confluence Tracking",
                "Emotional Bias Audit"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 font-bold text-sm">
                  <CheckCircle2 size={18} className="text-[var(--accent)]" /> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black tracking-tight">Stop Guessing. Start Growing.</h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Successful trading is a game of probability. Without a detailed log, you are simply guessing. Join over 500+ professional traders who use SMC Journal to refine their edge and master their narrative.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--accent)]/20">
              Create My Free Journal <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-[var(--glass-border)] text-center">
        <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">© 2026 SMC Journal · The Institutional Standard</p>
      </footer>
    </div>
  );
}
