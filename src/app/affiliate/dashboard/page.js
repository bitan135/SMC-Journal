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
        <Loader2 size={40} className="text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const { affiliate, stats, referrals } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 pb-20 font-sans">
      {/* Header */}
      <nav className="border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-purple-400 leading-none mb-0.5">Partner Portal</p>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight leading-none text-white truncate">{affiliate.name}</h1>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[10px] sm:text-xs font-bold text-white/60 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter mb-1 sm:mb-2 text-white">Performance Overview</h2>
            <p className="text-white/30 font-medium tracking-tight text-sm">Track your referrals and earnings in real-time.</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <Calendar size={16} className="text-purple-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-white/40 whitespace-nowrap">All Time</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {[
            { label: 'Total Clicks', value: stats.totalClicks, color: 'text-blue-400', icon: MousePointer2, bg: 'bg-blue-500/5 border-blue-500/10' },
            { label: 'Signups', value: stats.totalSignups, color: 'text-purple-400', icon: Users, bg: 'bg-purple-500/5 border-purple-500/10' },
            { label: 'Total Earned', value: `$${(stats.totalEarned || 0).toFixed(2)}`, color: 'text-emerald-400', icon: DollarSign, bg: 'bg-emerald-500/5 border-emerald-500/10' },
            { label: 'Pending Payout', value: `$${(stats.pendingPayout || 0).toFixed(2)}`, color: 'text-amber-400', icon: ShieldCheck, bg: 'bg-amber-500/5 border-amber-500/10' }
          ].map((s, i) => (
            <div key={i} className={`p-5 sm:p-8 rounded-2xl sm:rounded-[32px] ${s.bg} border relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-[0.07] group-hover:scale-110 transition-transform">
                <s.icon size={48} className="text-white" />
              </div>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25 mb-1 sm:mb-2 whitespace-nowrap truncate">{s.label}</p>
              <p className={`text-2xl sm:text-4xl font-black tracking-tight ${s.color} whitespace-nowrap`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Referral Tool */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 flex items-center gap-3 text-white">
                <Globe size={20} className="text-purple-400" /> Your Promo Tool
              </h3>
              
              <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Personal Coupon Code</label>
                  <div className="relative group">
                    <input 
                      readOnly
                      value={affiliate.coupon_code}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] font-mono text-lg sm:text-xl text-purple-400 font-black outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(affiliate.coupon_code)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg sm:rounded-xl bg-white/[0.06] hover:bg-purple-500 hover:text-white transition-all text-white/40"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Referral Link</label>
                  <div className="relative group">
                    <input 
                      readOnly
                      value={`https://smcjournal.app?ref=${affiliate.coupon_code}`}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[10px] sm:text-xs text-white/40 outline-none pr-12 font-mono"
                    />
                    <button 
                      onClick={() => copyToClipboard(`https://smcjournal.app?ref=${affiliate.coupon_code}`)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg sm:rounded-xl bg-white/[0.06] hover:bg-purple-500 hover:text-white transition-all text-white/40"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-purple-500/[0.06] border border-purple-500/[0.12]">
                  <p className="text-[11px] sm:text-xs font-bold leading-relaxed text-white/60">
                    <span className="text-purple-400 font-black">Pro Tip:</span> Users who use your link or code get a <span className="font-black text-white">{((affiliate.discount_rate || 0.10) * 100).toFixed(0)}% discount</span>, and you earn <span className="font-black text-white">{((affiliate.commission_rate || 0.10) * 100).toFixed(0)}% commission</span> for life.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Payout Settings</h3>
              <p className="text-white/30 text-xs sm:text-sm mb-4 sm:mb-6">Payment threshold: $100.00</p>
              <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden mb-6 sm:mb-8">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, ((stats.pendingPayout || 0) / 100) * 100)}%` }} 
                />
              </div>
              <button disabled className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] text-white/20 text-[10px] sm:text-xs font-black uppercase tracking-widest cursor-not-allowed">
                Request Payout
              </button>
            </div>
          </div>

          {/* Activity Table */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-white/[0.02] border border-white/[0.06] h-full">
              <h3 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 text-white">Recent Referrals</h3>
              
              <div className="overflow-x-auto -mx-2">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                    <tr className="text-left border-b border-white/[0.06]">
                      <th className="pb-3 sm:pb-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25">Signup Date</th>
                      <th className="pb-3 sm:pb-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25">User ID</th>
                      <th className="pb-3 sm:pb-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25">Plan</th>
                      <th className="pb-3 sm:pb-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25">Earnings</th>
                      <th className="pb-3 sm:pb-4 px-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/25">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {referrals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-16 sm:py-20 text-center text-white/15 font-medium text-sm">No referrals yet. Start sharing your link!</td>
                      </tr>
                    ) : (
                      referrals.map((r, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 sm:py-4 px-2 text-xs sm:text-sm font-mono text-white/35">{r.signup_date ? new Date(r.signup_date).toLocaleDateString() : '—'}</td>
                          <td className="py-3 sm:py-4 px-2 text-xs sm:text-sm font-bold text-white/50">...{r.user_id?.slice(-8)}</td>
                          <td className="py-3 sm:py-4 px-2">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                              r.plan_purchased ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/[0.04] text-white/25 border border-white/[0.06]'
                            }`}>
                              {r.plan_purchased || 'Free'}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-2 font-bold font-mono text-emerald-400 text-xs sm:text-sm">
                             {(r.commission_earned || 0) > 0 ? `+$${Number(r.commission_earned).toFixed(2)}` : '--'}
                          </td>
                          <td className="py-3 sm:py-4 px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.commission_paid ? 'bg-emerald-500' : 'bg-purple-500 animate-pulse'}`} />
                              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40 whitespace-nowrap">
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

      {/* Help Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[40px] bg-gradient-to-r from-purple-500/[0.08] to-indigo-500/[0.08] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">Need Help?</h4>
            <p className="text-white/30 text-xs sm:text-sm">Contact our partner success team for custom assets and support.</p>
          </div>
          <a href="mailto:partners@smcjournal.app" className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-black text-[10px] sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl whitespace-nowrap">
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
