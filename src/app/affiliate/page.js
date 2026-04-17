'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart, 
  ArrowRight, 
  Zap, 
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AffiliatePublicPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    audience: ''
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          platform: formData.platform,
          audience: formData.audience,
        })
      });
      
      if (res.ok) setStatus('success');
      else {
        const data = await res.json().catch(() => ({}));
        if (data.error?.includes('already exists')) {
          setStatus('duplicate');
        } else {
          setStatus('error');
        }
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 font-sans relative overflow-hidden">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-text-primary">SMC JOURNAL</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/affiliate/login" className="text-xs font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Partner Login</Link>
            <Link href="/" className="text-xs font-black uppercase tracking-widest py-3 px-6 glass-card border-border-custom hover:border-accent/40 rounded-xl transition-all text-text-primary">Back to Site</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-56 pb-20 md:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            <DollarSign size={14} />
            Partner Program Open
          </div>
          
          <h1 className="text-4xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tightest text-text-primary">
            Scale With The <br /> <span className="text-gradient">SMC Standard.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-text-secondary max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            Earn 10% negotiable recurring commissions by helping your community quantify their edge. High transparency, institutional reporting, zero friction.
          </p>

          <button onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })} className="px-12 py-6 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl shadow-accent/20 border-none group">
            Secure Your Referral Code
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 md:py-32 px-6 bg-card/10 backdrop-blur-sm border-y border-border-custom">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {[
            {
              icon: <PieChart size={32} />,
              title: "10% Negotiable Share",
              desc: "Earn every month as long as your referred trader remains a subscriber. Transparent and scalable."
            },
            {
              icon: <Zap size={32} />,
              title: "Institutional CR",
              desc: "High converting trial-to-subscription funnel designed specifically for professional SMC traders."
            },
            {
              icon: <BarChart size={32} />,
              title: "Real-time Metrics",
              desc: "Dedicated internal dashboard with live click-tracking and conversion transparency reporting."
            }
          ].map((benefit, i) => (
            <div key={i} className="p-8 md:p-12 rounded-[48px] glass-card border-border-custom hover:border-accent/40 transition-all group hover:-translate-y-2 duration-500 shadow-premium">
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-10 border border-border-custom text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tightest uppercase">{benefit.title}</h3>
              <p className="text-text-secondary leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-32 md:py-48 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-text-primary tracking-tightest">Start Growing.</h2>
            <p className="text-lg text-text-muted font-medium uppercase tracking-[0.2em]">Partner Application</p>
          </div>

          <div className="glass-card border-border-custom p-6 md:p-16 rounded-[40px] md:rounded-[64px] shadow-premium animate-fade-in">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8 border border-accent/20">
                  <CheckCircle2 size={48} className="text-accent" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-text-primary tracking-tightest">Application Received!</h3>
                <p className="text-text-secondary mb-10 font-medium">We'll review your platform and get back to you shortly.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-6 py-4 md:px-10 md:py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border-none shadow-xl shadow-accent/20"
                >
                  Apply Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Institutional Name"
                      className="w-full bg-background/50 border border-border-custom rounded-2xl px-5 py-4 md:px-6 md:py-5 outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/30 text-text-primary text-base"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="partner@vault.com"
                      className="w-full bg-background/50 border border-border-custom rounded-2xl px-5 py-4 md:px-6 md:py-5 outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/30 text-text-primary text-base"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Primary Platform (Link)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="YouTube / X / Discord / Trading Community"
                    className="w-full bg-background/50 border border-border-custom rounded-2xl px-5 py-4 md:px-6 md:py-5 outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/30 text-text-primary text-base"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-2">Audience Description</label>
                  <textarea 
                    required
                    placeholder="Audience size, strategy focus, and promotion plan..."
                    rows={4}
                    className="w-full bg-background/50 border border-border-custom rounded-3xl px-5 py-5 md:px-6 md:py-6 outline-none focus:border-accent transition-all font-bold placeholder:text-text-muted/30 resize-none text-text-primary text-base"
                    value={formData.audience}
                    onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  />
                </div>

                <button 
                  disabled={status === 'loading'}
                  type="submit" 
                  className="w-full py-5 md:py-8 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-premium shadow-accent/30 active:scale-[0.98] border-none"
                >
                  {status === 'loading' ? 'Transmitting...' : 'Initialize Program Membership'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-32 px-6 border-t border-border-custom bg-card/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <TrendingUp size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tightest text-text-primary">SMC JOURNAL</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-all">Main Portal</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-all">Privacy</Link>
            <Link href="/terms" className="hover:text-text-primary transition-all">Terms</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tracking-tightest { letter-spacing: -0.06em; }
        .glass-card { background: var(--card); backdrop-filter: blur(20px); }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
