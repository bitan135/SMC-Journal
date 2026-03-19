'use client';

import Link from 'next/link';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 font-sans relative overflow-hidden">
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled ? 'bg-background/80 backdrop-blur-xl border-border-custom py-4' : 'bg-transparent border-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 transition-transform hover:scale-105">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-text-primary">SMC JOURNAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('features')} className="text-sm font-black text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest">Features</button>
            <Link href="/pricing" className="text-sm font-black text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest">Pricing</Link>
            <Link href="/affiliate" className="text-sm font-black text-text-secondary hover:text-text-primary transition-colors uppercase tracking-widest">Affiliate</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">Log In</Link>
            <Link href="/signup" className="text-xs font-black uppercase tracking-widest py-3 px-6 bg-accent text-white rounded-xl hover:bg-accent-hover transition-transform active:scale-95 shadow-lg shadow-accent/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-accent/5 pointer-events-none blur-[120px] rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            <Zap size={14} />
            The Institutional Standard
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-10 animate-slide-up">
            Master Your <br />
            <span className="text-gradient">SMC Edge.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-text-secondary font-medium max-w-2xl mx-auto mb-16 leading-relaxed animate-slide-up">
            Track BOC, CHoCH, and FVG setups with precision. Institutional-grade analytics designed specifically for the professional Smart Money Concept trader.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-slide-up">
            <Link href="/signup" className="w-full md:w-auto px-12 py-6 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-hover transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-accent/20">
              Launch Your Journal
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={() => scrollToSection('features')} className="w-full md:w-auto px-12 py-6 glass-card border-border-custom hover:border-accent/40 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all text-text-primary">
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-card/10 backdrop-blur-sm border-y border-border-custom">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-6xl font-black tracking-tightest mb-8 leading-[1.1] text-text-primary">
                Unstructured data is the <br /><span className="text-accent underline decoration-accent/20 underline-offset-8">silent edge killer.</span>
              </h2>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-12 font-medium">
                Theory alone won't scale you. High-frequency SMC trading requires rigorous data capture and cognitive analysis. SMC Journal provides the definitive framework for institutional scaling.
              </p>
              
              <div className="space-y-6">
                {[
                  "Setup-specific strike rate tracking",
                  "Institutional confluence weighting",
                  "Precision risk management analytics",
                  "Session-bias behavioral insights"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 text-text-primary font-black uppercase tracking-wider text-xs group">
                    <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      {index + 1}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group animate-fade-in lg:block hidden">
              <div className="absolute inset-0 bg-accent/20 blur-[120px] rounded-full group-hover:bg-accent/30 transition-all duration-1000" />
              <div className="relative glass-card border-border-custom p-12 rounded-[48px] shadow-premium overflow-hidden bg-background/40">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="space-y-8">
                  <div className="h-4 bg-text-muted/10 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-text-muted/10 rounded-full w-1/2 animate-pulse" />
                  <div className="aspect-video bg-accent/5 rounded-[32px] w-full border border-accent/20 flex flex-col items-center justify-center gap-4 group-hover:bg-accent/10 transition-all">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Activity className="text-accent" />
                    </div>
                    <span className="text-accent font-black tracking-[0.3em] text-[10px] uppercase">Quantifying Edge...</span>
                  </div>
                  <div className="h-4 bg-text-muted/10 rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Features Section */}
      <section id="features" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 animate-slide-up">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tightest leading-tight text-text-primary">Institutional Core.</h2>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-medium">Built to transform SMC fragmentation into a high-probability trading machine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            <div className="p-10 rounded-[48px] glass-card border-border-custom hover:border-accent/40 transition-all group hover:-translate-y-2 duration-500 shadow-premium">
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-10 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-accent/40">
                <Layers size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tight">Contextual Logging</h3>
              <p className="text-text-secondary leading-relaxed font-medium">Tag confluences like H4 Bias, M15 CHoCH, and FVG Tap in seconds. Native SMC terminology for specialized operators.</p>
            </div>

            <div className="p-10 rounded-[48px] glass-card border-border-custom hover:border-accent/40 transition-all group hover:-translate-y-2 duration-500 shadow-premium">
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-10 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-accent/40">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tight">Advanced Analytics</h3>
              <p className="text-text-secondary leading-relaxed font-medium">Deep dive into setup-specific win rates, session bias, and behavioral psychology logs across all technical markets.</p>
            </div>

            <div className="p-10 rounded-[48px] glass-card border-border-custom hover:border-accent/40 transition-all group hover:-translate-y-2 duration-500 shadow-premium">
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center mb-10 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-accent/40">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tight">Edge Validation</h3>
              <p className="text-text-secondary leading-relaxed font-medium">Verify your CHoCH and BOS setups with data-driven proof. Our institutional system identifies exactly what generates alpha.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto rounded-[64px] bg-accent p-12 md:p-24 text-center relative overflow-hidden shadow-premium shadow-accent/40 group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-4xl md:text-7xl font-black mb-10 leading-[1.1] text-white tracking-tightest">Secure Your <br /> Institutional Edge.</h2>
            <p className="text-xl md:text-2xl text-white/90 font-black uppercase tracking-widest mb-16 max-w-xl mx-auto border-b border-white/20 pb-8">Ready for Launch.</p>
            
            <Link href="/signup" className="inline-flex items-center gap-6 px-16 py-8 bg-white text-accent rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-3xl active:scale-95 border-none">
              Initialize Account
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-6 border-t border-border-custom bg-card/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tightest text-text-primary">SMC JOURNAL</span>
            </div>
            <p className="text-base font-medium text-text-secondary leading-relaxed mb-8">
              The premier institutional-grade system for the Smart Money Concept trader. Quantify your edge with absolute precision.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-24">
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] mb-4">Product</h4>
              <button onClick={() => scrollToSection('features')} className="text-xs font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors text-left">Features</button>
              <Link href="/pricing" className="text-xs font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors">Pricing</Link>
              <Link href="/affiliate" className="text-xs font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors">Affiliate</Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em] mb-4">Company</h4>
              <Link href="/privacy" className="text-xs font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs font-black text-text-muted hover:text-accent uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">© 2026 SMC Journal. All rights reserved.</p>
          <div className="flex gap-12">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Engineered for Alpha.</span>
          </div>
        </div>
      </footer>

      {/* Modern Global Styles */}
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .tracking-tightest { letter-spacing: -0.06em; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .glass-card { background: var(--card); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
}
