'use client';

import Link from 'next/link';
import { Check, TrendingUp, Sparkles, HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const faq = [
  { q: "Is the free plan really free forever?", a: "Yes. Core journaling features including unlimited trades, SMC tagging, and basic analytics are completely free and will stay that way. No hidden fees." },
  { q: "Can I cancel my Pro subscription anytime?", a: "Yes, absolutely. You can cancel with one click from your billing settings. Your Pro features will remain active until the end of your current billing period." },
  { q: "What payment methods do you accept?", a: "We currently accept all major credit cards and debit cards via Stripe. We are working on adding crypto payments soon." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee. If you're not happy with Pro, just email us within 30 days and we'll refund you, no questions asked." },
  { q: "Can I contact the developer directly?", a: "Yes — I'm Bitan, the solo developer and a trader myself. You can reach me at hello.bitanbiswas@gmail.com for any questions or feedback." }
];

const features = [
  { name: "Unlimited Trades", free: true, pro: true, sixMonth: true },
  { name: "SMC Tagging (BOS, CHoCH, etc)", free: true, pro: true, sixMonth: true },
  { name: "Equity Curve", free: true, pro: true, sixMonth: true },
  { name: "Session Overview", free: true, pro: true, sixMonth: true },
  { name: "Strategy Stats", free: true, pro: true, sixMonth: true },
  { name: "Psychology Log", free: true, pro: true, sixMonth: true },
  { name: "Chart Screenshots", free: true, pro: true, sixMonth: true },
  { name: "7+ Advanced Analytics", free: false, pro: true, sixMonth: true },
  { name: "Drawdown Analysis", free: false, pro: true, sixMonth: true },
  { name: "Monthly P&L", free: false, pro: true, sixMonth: true },
  { name: "Deep Strategy Insights", free: false, pro: true, sixMonth: true },
  { name: "Data Export (CSV/JSON)", free: false, pro: true, sixMonth: true },
  { name: "Priority Support", free: false, pro: true, sixMonth: true },
  { name: "6-Month Full Access", free: false, pro: false, sixMonth: true },
];

export default function PricingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 font-sans relative overflow-hidden">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Small Navbar */}
      <nav className="relative z-10 p-6 md:p-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-text-primary uppercase">SMC Journal</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 mr-8">
            <Link href="/features" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-accent transition-colors">Features</Link>
            <Link href="/insight-engine" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-accent transition-colors">Insight Engine</Link>
            <Link href="/affiliate" className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-accent transition-colors">Affiliate</Link>
        </div>
        <Link href="/login" className="text-sm font-black text-text-secondary hover:text-text-primary transition-colors px-6 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-border-custom">
          Login
        </Link>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-24 animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Institutional Pricing
          </span>
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tightest leading-[0.9]">
            Simple. Honest. <br />
            <span className="text-gradient">No Hidden Caps.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Built for the SMC community. Start free, upgrade only to unlock deeper data and support professional development.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-40 stagger-children">
          {/* FREE PLAN */}
          <div className="p-10 rounded-[40px] glass-card flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-all duration-500">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">The Gateway</h3>
            <div className="text-5xl font-black mb-2 text-text-primary">FREE</div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-lg font-bold text-text-muted">$0</span>
              <span className="text-text-muted/50 font-black uppercase text-[10px] tracking-widest">forever</span>
            </div>
            <div className="w-full h-[1px] bg-border-custom my-4" />
            <ul className="space-y-4 mb-12 text-left w-full flex-grow pt-6">
              {["Unlimited trades", "SMC tag tracking", "Equity curve", "Session overview", "Psychology log", "Chart Screenshots"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-text-secondary">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full py-5 glass-card border-border-custom hover:border-accent/50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-accent/5">
              Start Journaling
            </Link>
          </div>

          {/* PRO PLAN */}
          <div className="p-1 top-0 lg:-top-4 relative h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-purple-600 rounded-[52px] blur-xl opacity-20 animate-pulse-glow" />
            <div className="p-10 rounded-[48px] bg-background border-2 border-accent flex flex-col items-center text-center h-full relative z-10 shadow-2xl overflow-hidden shadow-accent/20">
              <div className="absolute top-0 right-0 px-6 py-2 rounded-bl-3xl bg-accent text-white text-[10px] font-black uppercase tracking-widest">
                MOST POPULAR
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-accent mb-4">The Professional</h3>
              <div className="text-6xl font-black mb-2 text-text-primary">PRO</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-xl font-bold text-text-primary">$20</span>
                <span className="text-text-muted font-black uppercase text-[10px] tracking-widest">/ month</span>
              </div>
              <div className="w-full h-[1px] bg-border-custom my-4" />
              <ul className="space-y-4 mb-12 text-left w-full flex-grow pt-6">
                <li className="flex items-center gap-3 text-sm font-black text-accent">
                   <div className="w-5 h-5 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Sparkles size={12} />
                  </div>
                   Everything in Free
                </li>
                {["7+ Advanced analytics", "Drawdown analysis", "Monthly P&L", "Deep strategy data", "Professional Export"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-text-primary">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-accent" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition-all animate-pulse-glow hover:scale-[1.02] shadow-xl shadow-accent/30">
                Level Up Now →
              </Link>
            </div>
          </div>

          {/* 6-MONTH PRO PLAN */}
          <div className="p-10 rounded-[40px] glass-card flex flex-col items-center text-center shadow-premium hover:-translate-y-1 transition-all duration-500">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">The Power Pack</h3>
            <div className="text-5xl font-black mb-2 text-text-primary">6-MONTH</div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-lg font-bold text-text-muted">$50</span>
              <span className="text-text-muted/50 font-black uppercase text-[10px] tracking-widest">for 6 months</span>
            </div>
            <div className="w-full h-[1px] bg-border-custom my-4" />
            <ul className="space-y-4 mb-12 text-left w-full flex-grow pt-6">
              <li className="flex items-center gap-3 text-sm font-black text-purple-400">
                <div className="w-5 h-5 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0">
                  <Sparkles size={12} />
                </div>
                Everything in Pro
              </li>
              {["6 months Pro access", "All advanced analytics", "Save $70 vs monthly", "Priority support"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-text-secondary">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-emerald-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full py-5 glass-card border-border-custom hover:border-accent/50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-accent/5">
              Get 6-Month Access
            </Link>
          </div>
        </div>

        {/* Comparison Table Redesign */}
        <div className="mb-40 overflow-hidden rounded-[40px] border border-border-custom bg-card/30 backdrop-blur-xl animate-fade-in">
          <div className="p-10 border-b border-border-custom text-center">
            <h2 className="text-2xl font-black tracking-tighter">Professional Feature Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th className="py-6 px-8 text-left font-black text-[10px] uppercase tracking-widest text-text-muted">Benefit</th>
                  <th className="py-6 px-8 text-center font-black text-[10px] uppercase tracking-widest text-text-muted">Free</th>
                  <th className="py-6 px-8 text-center font-black text-[10px] uppercase tracking-widest text-accent">Pro</th>
                  <th className="py-6 px-8 text-center font-black text-[10px] uppercase tracking-widest text-text-muted">6-Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-6 px-8 text-xs font-black text-text-secondary uppercase tracking-tight group-hover:text-text-primary transition-colors">{f.name}</td>
                    <td className="py-6 px-8 text-center">{f.free ? <Check size={18} className="mx-auto text-emerald-500" /> : <span className="text-text-muted/20">—</span>}</td>
                    <td className="py-6 px-8 text-center">{f.pro ? <Check size={18} className="mx-auto text-accent" /> : <span className="text-text-muted/20">—</span>}</td>
                    <td className="py-6 px-8 text-center">{f.sixMonth ? <Check size={18} className="mx-auto text-purple-500" /> : <span className="text-text-muted/20">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section Premium Polish */}
        <section className="max-w-4xl mx-auto mb-40 animate-fade-in">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-6xl font-black tracking-tightest">Common Inquiries</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faq.map((item, i) => (
              <div key={i} className="p-8 rounded-[32px] glass-card hover:border-accent/20 transition-all flex flex-col group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <HelpCircle size={20} />
                </div>
                <h4 className="text-lg font-black mb-3 text-text-primary">{item.q}</h4>
                <p className="text-sm font-medium text-text-secondary leading-relaxed flex-grow">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA Institutional */}
        <div className="p-12 md:p-24 rounded-[64px] bg-card border-none text-center relative overflow-hidden shadow-premium group">
           <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-600/5 transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
           <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-[10px] font-black uppercase tracking-widest mb-10 shadow-lg shadow-accent/20">
                <Mail size={14} /> Direct Developer Access
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tightest">Need custom analytics?</h2>
              <p className="text-lg md:text-xl font-medium text-text-secondary max-w-xl mx-auto mb-12">
                If you have unique setup requirements or need enterprise data solutions, let's talk SMC directly.
              </p>
              <a href="mailto:hello.bitanbiswas@gmail.com" className="inline-flex items-center gap-4 px-12 py-5 bg-text-primary text-background rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl group border-none">
                Email Bitan <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
           </div>
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-border-custom mt-20 text-center">
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 opacity-40 hover:opacity-100 transition-opacity">
           <TrendingUp size={24} className="text-accent" />
           <span className="text-lg font-black tracking-tighter text-text-primary">SMC Journal</span>
        </Link>
        <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-6">Built for precision agents by a solo operator.</p>
        <div className="flex justify-center gap-12">
           <Link href="/" className="text-[10px] font-black text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors">Home</Link>
           <Link href="/privacy" className="text-[10px] font-black text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors">Privacy</Link>
           <Link href="/terms" className="text-[10px] font-black text-text-muted hover:text-text-primary uppercase tracking-widest transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
