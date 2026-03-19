'use client';

import { useState, useEffect } from 'react';
import { 
  Users, DollarSign, TrendingUp, Link as LinkIcon, 
  Copy, Check, Sparkles, Target, Zap, ArrowRight,
  Loader2, Wallet, History, Gift
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import MetricCard from '@/components/MetricCard';

export default function AffiliateDashboard() {
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const res = await fetch('/api/affiliate/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setReferrals(data.referrals);
      }
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const res = await fetch('/api/affiliate/register', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('Vault Affiliate protocol activated!', 'success');
        fetchAffiliateData();
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Network protocols offline', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const copyLink = () => {
    if (!stats?.referral_code) return;
    const link = `${window.location.origin}?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    showToast('Referral link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen px-4 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-24 md:pb-32 relative overflow-hidden">
        {/* Empty State / Welcome */}
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-4">
           <div className="w-20 h-20 rounded-[32px] bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 mb-8 animate-pulse-glow">
              <Gift size={40} className="text-[var(--accent)]" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] tracking-tighter mb-6 text-gradient">
              Join the Institutional <br />Partner Program
           </h1>
           <p className="text-[var(--text-secondary)] font-medium max-w-xl mb-12 text-lg">
              Earn 20% lifetime commission for every trader you bring to the SMC Journal ecosystem. 
              Institutional-grade payouts, tracking, and rewards.
           </p>
           <button
             onClick={handleRegister}
             disabled={isRegistering}
             className="px-10 py-5 bg-[var(--accent)] text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4"
           >
             {isRegistering ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
             {isRegistering ? 'INITIALIZING...' : 'ACTIVATE PARTNER PROTOCOL'}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-24 md:pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 md:mb-12 px-2">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Sparkles size={12} /> Partner Command Center
                    </span>
                </div>
                <h1 className="text-2xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-tight text-gradient mb-4">
                    Institutional Affiliate
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">Tracking your influence and capital distribution in the network.</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full lg:w-auto">
               <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Your Referral Asset</p>
               <div className="flex gap-2">
                  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] flex-1 lg:min-w-[400px] flex items-center justify-between shadow-inner">
                     <span className="opacity-60">{window.location.origin}?ref=</span>
                     <span className="text-[var(--accent)]">{stats.referral_code}</span>
                  </div>
                  <button 
                    onClick={copyLink}
                    className="p-4 bg-[var(--accent)] text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
               </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-children">
            <MetricCard 
                label="Total Referrals" 
                value={stats.total_referrals} 
                icon={Users} 
                color="accent"
            />
            <MetricCard 
                label="Unpaid Earnings" 
                value={`$${stats.total_earnings_usd}`} 
                icon={DollarSign} 
                color="profit"
            />
            <MetricCard 
                label="Conversion Rate" 
                value="—" 
                icon={TrendingUp} 
                color="neutral"
            />
            <MetricCard 
                label="Current Multiplier" 
                value="20%" 
                icon={Target} 
                color="accent"
                subValue="LIFETIME"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Recent Referrals */}
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
                 <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <History className="text-[var(--accent)]" size={16} /> Activity Log
                 </h3>
                 
                 {referrals.length === 0 ? (
                    <div className="py-20 text-center opacity-30">
                       <Users size={40} className="mx-auto mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">Awaiting First Connection</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {referrals.map((ref, idx) => (
                          <div key={idx} className="flex items-center justify-between p-5 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent)]/30 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/5 flex items-center justify-center border border-[var(--glass-border)]">
                                   <Users size={16} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-[var(--foreground)]">Institutional ID: {ref.referred_user_id.slice(0, 8)}...</p>
                                   <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
                                      {new Date(ref.created_at).toLocaleDateString()}
                                   </p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-emerald-500">+${ref.commission_amount_usd}</p>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">{ref.status.toUpperCase()}</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>

           {/* Sidebar: Withdrawal & Perks */}
           <div className="space-y-8">
              <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium bg-gradient-to-br from-[var(--glass-bg)] to-transparent">
                 <h3 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <Wallet className="text-[var(--accent)]" size={16} /> Capital Exit
                 </h3>
                 <div className="space-y-6">
                    <div className="bg-[var(--glass-bg)] rounded-3xl p-6 border border-[var(--glass-border)] text-center shadow-inner">
                       <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 text-center">Available Balance</p>
                       <p className="text-4xl font-black text-[var(--foreground)] tracking-tighter">${stats.total_earnings_usd}</p>
                    </div>
                    
                    <button 
                      disabled={parseFloat(stats.total_earnings_usd) < 50}
                      className="w-full py-5 rounded-[24px] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest hover:border-[var(--accent)]/30 hover:text-[var(--foreground)] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                       Request Settlement
                       <ArrowRight size={14} />
                    </button>
                    
                    <p className="text-[9px] text-[var(--text-muted)] font-bold text-center leading-relaxed">
                       Minimum withdrawal threshold: $50.00 USD. <br />
                       Payouts processed via Arbitrum (USDC).
                    </p>
                 </div>
              </div>

              <div className="glass-card rounded-[40px] border-emerald-500/10 p-8 shadow-premium bg-emerald-500/[0.02]">
                 <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                    <Target size={16} /> Partner Perks
                 </h3>
                 <ul className="space-y-4">
                    {[
                       '20% Recursive Commission',
                       'Priority Strategy Access',
                       'Real-time Payout Tracking',
                       'Affiliate Community Badge'
                    ].map(perk => (
                       <li key={perk} className="flex items-center gap-3 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">
                          <Check size={14} className="text-emerald-500" />
                          {perk}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
