'use client';

import Link from 'next/link';
import { Check, TrendingUp, Sparkles, HelpCircle, Mail, ArrowRight } from 'lucide-react';

const faq = [
  { q: "Is the free plan really free forever?", a: "Yes. Core journaling features including unlimited trades, SMC tagging, and basic analytics are completely free and will stay that way. No hidden fees." },
  { q: "Can I cancel my Pro subscription anytime?", a: "Yes, absolutely. You can cancel with one click from your billing settings. Your Pro features will remain active until the end of your current billing period." },
  { q: "What payment methods do you accept?", a: "We currently accept all major credit cards and debit cards via Stripe. We are working on adding crypto payments soon." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee. If you're not happy with Pro, just email us within 30 days and we'll refund you, no questions asked." },
  { q: "Can I contact the developer directly?", a: "Yes — I'm Bitan, the solo developer and a trader myself. You can reach me at hello.bitanbiswas@gmail.com for any questions or feedback." }
];

const features = [
  { name: "Unlimited Trades", free: true, pro: true, legacy: true },
  { name: "SMC Tagging (BOS, CHoCH, etc)", free: true, pro: true, legacy: true },
  { name: "Equity Curve", free: true, pro: true, legacy: true },
  { name: "Session Overview", free: true, pro: true, legacy: true },
  { name: "Strategy Stats", free: true, pro: true, legacy: true },
  { name: "Psychology Log", free: true, pro: true, legacy: true },
  { name: "Chart Screenshots", free: true, pro: true, legacy: true },
  { name: "7+ Advanced Analytics", free: false, pro: true, legacy: true },
  { name: "Drawdown Analysis", free: false, pro: true, legacy: true },
  { name: "Monthly P&L", free: false, pro: true, legacy: true },
  { name: "Deep Strategy Insights", free: false, pro: true, legacy: true },
  { name: "Data Export (CSV/JSON)", free: false, pro: true, legacy: true },
  { name: "Priority Support", free: false, pro: false, legacy: true },
  { name: "Lifetime Updates", free: false, pro: false, legacy: true },
];

export default function PricingPage() {
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
        <Link href="/login" className="text-sm font-black text-white/40 hover:text-white transition-colors">
          Login
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-24">
          <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em]">PRICING</span>
          <h1 className="text-4xl md:text-7xl font-black mt-6 mb-8 tracking-tight">Simple, Honest <br /> <span className="text-indigo-500">Pricing.</span></h1>
          <p className="text-xl font-bold text-white/40 max-w-2xl mx-auto">
            I built this for the SMC community. Start free, upgrade only if you want to support development and unlock deeper data.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-40">
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
              <div className="p-12 rounded-[48px] glass-card border-indigo-500/30 bg-indigo-500/[0.03] flex flex-col items-center text-center relative scale-105 shadow-2xl shadow-indigo-500/10 z-10">
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

        {/* Comparison Table */}
        <div className="mb-40 overflow-x-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Full Feature Comparison</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-6 px-4 text-left font-black text-xs uppercase tracking-widest text-white/30">Feature</th>
                <th className="py-6 px-4 text-center font-black text-xs uppercase tracking-widest text-white/30">Free</th>
                <th className="py-6 px-4 text-center font-black text-xs uppercase tracking-widest text-white/30 text-indigo-400">Pro</th>
                <th className="py-6 px-4 text-center font-black text-xs uppercase tracking-widest text-white/30">Legacy</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                  <td className="py-5 px-4 text-sm font-bold text-white/60">{f.name}</td>
                  <td className="py-5 px-4 text-center">{f.free ? <Check size={18} className="mx-auto text-emerald-500" /> : <span className="text-white/10">—</span>}</td>
                  <td className="py-5 px-4 text-center">{f.pro ? <Check size={18} className="mx-auto text-indigo-500" /> : <span className="text-white/10">—</span>}</td>
                  <td className="py-5 px-4 text-center">{f.legacy ? <Check size={18} className="mx-auto text-purple-500" /> : <span className="text-white/10">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-40">
          <h2 className="text-3xl md:text-5xl font-black mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="p-8 rounded-[32px] glass-card border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1 uppercase text-[10px] font-black text-indigo-400">Q</div>
                  <div>
                    <h4 className="text-lg font-black mb-3">{item.q}</h4>
                    <p className="text-white/40 font-bold leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="p-12 md:p-20 rounded-[48px] glass-card border-white/5 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5 transition-opacity duration-1000 group-hover:opacity-100 opacity-50" />
           <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8">
                <Mail size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black mb-6">Need more info?</h2>
              <p className="text-lg font-bold text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
                If you have custom requirements, need help with billing, or just want to chat about SMC, I'm here.
              </p>
              <a href="mailto:hello.bitanbiswas@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl group">
                Email Bitan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
           </div>
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 mt-20 text-center">
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
