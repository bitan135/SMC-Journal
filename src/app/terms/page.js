'use client';

import Link from 'next/link';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      <nav className="p-6 md:p-10 flex items-center justify-between border-b border-border-custom">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-text-primary">SMC Journal</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm font-black text-text-secondary hover:text-text-primary transition-all">
          <ArrowLeft size={16} /> Back
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight text-text-primary">Terms of Service</h1>
        
        <div className="space-y-10 text-text-secondary font-bold leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">1. Acceptance of Terms</h2>
            <p>By creating an account on SMC Journal, you agree to these terms. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">2. Description of Service</h2>
            <p>SMC Journal is a performance tracking tool for traders. We provide analytics, journaling capabilities, and data visualization. The &quot;Free&quot; plan is provided at no cost, while &quot;Pro&quot; and &quot;Legacy&quot; are paid subscriptions or one-time purchases.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">3. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account. You agree not to use the service for any illegal or unauthorized purpose.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">4. Limitation of Liability</h2>
            <p>Trading financial markets involves significant risk. SMC Journal is a tool for tracking data and does not provide financial advice. We are not responsible for any trading losses you may incur.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">5. Modifications</h2>
            <p>We reserve the right to modify or terminate the service for any reason, without notice, at any time. We also reserve the right to change these terms periodicially.</p>
          </section>

          <section className="pt-10 border-t border-border-custom">
            <p className="text-sm">Last updated: March 2026</p>
            <p className="text-sm mt-2 font-black text-text-primary">Questions? hello.bitanbiswas@gmail.com</p>
          </section>
        </div>
      </main>

      <footer className="py-20 text-center border-t border-border-custom mt-20">
         <p className="text-xs font-bold text-text-muted">© 2026 SMC Journal · Built for traders, by a trader.</p>
      </footer>
    </div>
  );
}
