'use client';

import Link from 'next/link';
import { TrendingUp, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        <h1 className="text-4xl md:text-6xl font-black mb-12 tracking-tight text-text-primary">Privacy Policy</h1>
        
        <div className="space-y-10 text-text-secondary font-bold leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">1. Data Collection</h2>
            <p>We collect information you provide directly to us when you create an account, log trades, and communicate with us. This includes your email address, trade data, strategies, and screenshots.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">2. How We Use Data</h2>
            <p>Your data is used solely to provide the services of SMC Journal, including calculating your trading metrics, generating analytics, and providing customer support. We do not sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">3. Data Security</h2>
            <p>We use Supabase (a Google-backed infrastructure) to securely store your data. All communication is encrypted via SSL. We follow industry best practices to protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">4. Third-Party Services</h2>
            <p>We use Stripe for payment processing. We do not store your credit card information on our servers. Stripe's privacy policy governs the use of your payment data.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-widest">5. Your Rights</h2>
            <p>You can export or delete your data at any time from your account settings. If you wish to close your account and delete all associated data permanently, please contact us.</p>
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
