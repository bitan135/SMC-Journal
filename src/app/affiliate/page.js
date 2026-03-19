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
import { useState } from 'react';

export default function AffiliatePublicPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: '',
    audience: ''
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-inter">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter">SMC JOURNAL</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/affiliate/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">Partner Login</Link>
            <Link href="/" className="text-sm font-bold py-3 px-6 glass-card border-white/10 rounded-xl hover:bg-white/5 transition-all text-white">Back to Site</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
            <DollarSign size={14} />
            Partner Program Open
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
            Partner with the #1 <br /> <span className="text-gradient">SMC Journaling Tool.</span>
          </h1>
          
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium">
            Earn 30% lifetime recurring commissions by helping your audience quantify their edge with institutional-grade data.
          </p>

          <button onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-white/90 transition-all flex items-center justify-center gap-3 mx-auto shadow-2xl shadow-white/10 border-0">
            Secure Your Referral Code
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <PieChart size={28} className="text-indigo-400" />,
              title: "30% Lifetime Share",
              desc: "Earn every month as long as your referred trader remains a subscriber. No caps, no limits."
            },
            {
              icon: <Zap size={28} className="text-yellow-400" />,
              title: "Best-in-Class CR",
              desc: "High converting trial-to-subscription funnel designed specifically for the SMC community."
            },
            {
              icon: <BarChart size={28} className="text-emerald-400" />,
              title: "Real-time Metrics",
              desc: "Dedicated partner dashboard with live click-tracking and conversion data reporting."
            }
          ].map((benefit, i) => (
            <div key={i} className="p-10 rounded-[40px] glass-card border-white/5 hover:border-white/10 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">{benefit.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-40 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-white">Start Growing with Us.</h2>
            <p className="text-white/40 font-medium">Join the partner program and start earning today.</p>
          </div>

          <div className="glass-card border-white/10 p-8 md:p-12 rounded-[48px] shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-white">Application Received!</h3>
                <p className="text-white/50 mb-8">We'll review your platform and get back to you via email shortly.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black transition-all text-white border-0"
                >
                  Apply Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-white/10 text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="partner@example.com"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-white/10 text-white"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-2">Primary Platform (Link)</label>
                  <input 
                    required
                    type="text" 
                    placeholder="YouTube / X / VIP Discord Link"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-white/10 text-white"
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-white/30 ml-2">Audience Description</label>
                  <textarea 
                    required
                    placeholder="Tell us about your audience and how you plan to promote SMC Journal..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/5 rounded-3xl px-6 py-4 outline-none focus:border-indigo-500/50 transition-all font-bold placeholder:text-white/10 resize-none text-white"
                    value={formData.audience}
                    onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  />
                </div>

                <button 
                  disabled={status === 'loading'}
                  type="submit" 
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-3xl font-black text-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] border-0"
                >
                  {status === 'loading' ? 'Submitting...' : 'Apply for Program'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 opacity-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="text-indigo-500" />
            <span className="text-xl font-black tracking-tighter text-white">SMC JOURNAL</span>
          </div>
          <div className="flex gap-12 text-xs font-black uppercase tracking-widest text-white/40">
            <Link href="/" className="hover:text-white transition-all">Main Site</Link>
            <Link href="/privacy" className="hover:text-white transition-all">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-all">Terms</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-card { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
}
