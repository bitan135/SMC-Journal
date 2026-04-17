'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointer2, 
  LogOut, 
  Copy, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AffiliateDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  // Correcting the import inside the code
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/affiliate/me');
      if (res.ok) {
        const d = await res.json();
        setData(d);
      } else {
        if (router) router.push('/affiliate/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/affiliate/logout', { method: 'POST' });
    if (router) router.push('/affiliate/login');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 size={40} className="text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { affiliate, stats, referrals } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--accent)]/30 pb-20">
      {/* Header */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center">
              <TrendingUp size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[var(--accent)] leading-none mb-1">Partner Portal</p>
              <h1 className="text-lg font-bold tracking-tight leading-none">{affiliate.name}</h1>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2">Performance Overview</h2>
            <p className="text-white/40 font-medium tracking-tight">Track your referrals and earnings in real-time.</p>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border-white/5">
            <Calendar size={18} className="text-[var(--accent)]" />
            <span className="text-sm font-bold opacity-60">Last 30 Days</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Clicks', value: stats.totalClicks, color: 'text-blue-500', icon: MousePointer2 },
            { label: 'Signups', value: stats.totalSignups, color: 'text-purple-500', icon: Users },
            { label: 'Total Earned', value: `$${(stats.totalEarned || 0).toFixed(2)}`, color: 'text-emerald-500', icon: DollarSign },
            { label: 'Pending Payout', value: `$${(stats.pendingPayout || 0).toFixed(2)}`, color: 'text-[var(--accent)]', icon: ShieldCheck }
          ].map((s, i) => (
            <div key={i} className="p-8 rounded-[32px] glass-card border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <s.icon size={64} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{s.label}</p>
              <p className={`text-4xl font-black tracking-tight ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Referral Tool */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 rounded-[40px] glass-card border-white/5 bg-gradient-to-br from-zinc-900/50 to-black">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Globe size={20} className="text-[var(--accent)]" /> Your Promo Tool
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Personal Coupon Code</label>
                  <div className="relative group">
                    <input 
                      readOnly
                      value={affiliate.coupon_code}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-xl text-[var(--accent)] font-black outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(affiliate.coupon_code)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 hover:bg-[var(--accent)] hover:text-black transition-all"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Referral Link</label>
                  <div className="relative group">
                    <input 
                      readOnly
                      value={`https://smcjournal.app?ref=${affiliate.coupon_code}`}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/50 outline-none pr-12"
                    />
                    <button 
                      onClick={() => copyToClipboard(`https://smcjournal.app?ref=${affiliate.coupon_code}`)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 hover:bg-[var(--accent)] hover:text-black transition-all"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="pt-4 p-6 rounded-2xl bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                  <p className="text-xs font-bold leading-relaxed">
                    <span className="text-[var(--accent)]">Pro Tip:</span> Users who use your link or code get a <span className="font-black">{((affiliate.discount_rate || 0.10) * 100).toFixed(0)}% discount</span>, and you earn <span className="font-black">{((affiliate.commission_rate || 0.10) * 100).toFixed(0)}% commission</span> for life.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[40px] glass-card border-white/5">
              <h3 className="text-xl font-bold mb-4">Payout Settings</h3>
              <p className="text-white/40 text-sm mb-6">Payment threshold: $100.00</p>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (stats.pendingPayout / 100) * 100)}%` }} 
                />
              </div>
              <button disabled className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/30 text-xs font-black uppercase tracking-widest cursor-not-allowed">
                Request Payout
              </button>
            </div>
          </div>

          {/* Activity Table */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-[40px] glass-card border-white/5 h-full">
              <h3 className="text-xl font-bold mb-8">Recent Referrals</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/30">Signup Date</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/30">User ID</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/30">Plan</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/30">Earnings</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {referrals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-white/20 font-medium">No referrals yet. Start sharing your link!</td>
                      </tr>
                    ) : (
                      referrals.map((r, i) => (
                        <tr key={i} className="group">
                          <td className="py-4 text-sm font-mono text-white/40">{r.signup_date ? new Date(r.signup_date).toLocaleDateString() : '—'}</td>
                          <td className="py-4 text-sm font-bold text-white/60">...{r.user_id?.slice(-8)}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              r.plan_purchased ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'
                            }`}>
                              {r.plan_purchased || 'Free'}
                            </span>
                          </td>
                          <td className="py-4 font-bold font-mono text-emerald-400">
                             {(r.commission_earned || 0) > 0 ? `+$${Number(r.commission_earned).toFixed(2)}` : '--'}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${r.commission_paid ? 'bg-emerald-500' : 'bg-[var(--accent)] animate-pulse'}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {r.commission_paid ? 'Paid' : 'Pending'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-6">
        <div className="p-8 rounded-[40px] bg-gradient-to-r from-[var(--accent)]/10 to-purple-500/10 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h4 className="text-xl font-bold mb-2">Need Help?</h4>
            <p className="text-white/40 text-sm">Contact our partner success team for custom assets and support.</p>
          </div>
          <a href="mailto:partners@smcjournal.app" className="px-8 py-4 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
