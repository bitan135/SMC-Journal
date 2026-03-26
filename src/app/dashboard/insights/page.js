'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { 
  getTrades, 
  getWinRate, 
  getProfitFactor, 
  getAverageRR,
  getWinRateByGroup 
} from '@/lib/storage';
import { 
  Sparkles, 
  Lock, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Terminal,
  Clock,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function InsightsPage() {
  const { user, subscription } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;
        setLoading(true);
        const res = await getTrades();
        if (!res.success) {
          setError(res.error || 'Failed to sync institutional data.');
          setTrades([]);
        } else {
          setTrades(Array.isArray(res.data) ? res.data : []);
          setError(null);
        }
      } catch (err) {
        console.error('[Insights] Failed to load trades:', err);
        setError('Failed to sync institutional data. Please try again.');
        setTrades([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const tradeCount = trades?.length || 0;
  
  // Access Logic
  const planId = subscription?.plan_id || 'free';
  const isPaidUser = planId === 'pro' || planId === '6_month' || planId === 'lifetime_legacy';
  const hasBasicAccess = tradeCount >= 30; // Threshold logic still applies
  const hasAdvancedAccess = tradeCount >= 100 && isPaidUser; // Requires both 100 trades AND pro plan

  // Analytics Helpers
  const winRate = getWinRate(trades);
  const profitFactor = getProfitFactor(trades);
  const avgRR = getAverageRR(trades);

  // Deep Insights (Safe Defaults)
  const sessionData = getWinRateByGroup(trades || [], 'session') || [];
  const biasData = getWinRateByGroup(trades || [], 'bias_type') || [];
  const timeframeData = getWinRateByGroup(trades || [], 'timeframe_bias') || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] animate-pulse">Computing Alpha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-12 text-center max-w-lg space-y-6">
          <div className="w-20 h-20 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto transition-transform duration-500">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Sync Disrupted</h2>
            <p className="text-[var(--text-muted)] font-medium">
              Institutional insights could not be retrieved at this cycle.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-lg shadow-[var(--accent)]/30"
          >
            Reconnect Engine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--glass-border)]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter">
              Insight <span className="text-gradient">Engine</span>
            </h1>
          </div>
          <p className="text-[var(--text-muted)] font-medium text-sm md:text-base max-w-2xl">
            Institutional performance analysis. Unlock deeper quantitative data by maintaining your sequence discipline.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="glass-card rounded-[28px] p-6 border-[var(--glass-border)] min-w-[300px]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Sequence Status</span>
            <span className="text-2xl font-black text-[var(--foreground)] tracking-tighter">{tradeCount} <span className="text-xs text-[var(--text-muted)] uppercase">Trades</span></span>
          </div>
          <div className="relative h-2 w-full bg-[var(--glass-bg)] rounded-full overflow-hidden border border-[var(--glass-border)]">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--accent)] to-purple-500 transition-all duration-1000"
              style={{ width: `${Math.min((tradeCount / 100) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-[8px] font-black uppercase tracking-widest ${hasBasicAccess ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Basic (30)</span>
            <span className={`text-[8px] font-black uppercase tracking-widest ${hasAdvancedAccess ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Advanced (100)</span>
          </div>
        </div>
      </div>

      {!hasBasicAccess ? (
        /* Locked State: Needs 30 Trades */
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-12 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 rounded-[32px] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mx-auto shadow- premium group-hover:scale-110 transition-transform duration-500">
              <Lock size={32} className="text-[var(--accent)]" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Intelligence Threshold Not Reached</h2>
                <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto">
                    The Insight Engine requires at least <span className="text-[var(--foreground)] font-bold">30 documented trades</span> to generate statistically significant edge analysis.
                </p>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="px-6 py-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] font-black uppercase tracking-widest text-[10px] animate-pulse">
                    {30 - tradeCount} trades remaining
                </div>
                <Link href="/add-trade" className="flex items-center gap-2 px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all">
                    Log Next Position <TrendingUp size={16} />
                </Link>
            </div>
          </div>

          {/* Preview of what's coming */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 opacity-30 grayscale pointer-events-none">
             <div className="h-40 glass-card rounded-3xl border border-dashed border-[var(--glass-border)]" />
             <div className="h-40 glass-card rounded-3xl border border-dashed border-[var(--glass-border)]" />
             <div className="h-40 glass-card rounded-3xl border border-dashed border-[var(--glass-border)]" />
          </div>
        </div>
      ) : (
        /* Unlocked State */
        <div className="space-y-8 animate-fade-in">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-[28px] border-[var(--glass-border)] p-8 space-y-4 hover:border-[var(--accent)]/30 transition-all">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Win Rate
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter">{winRate}%</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] mb-1.5 capitalize">Overall Edge</span>
                </div>
            </div>
            <div className="glass-card rounded-[28px] border-[var(--glass-border)] p-8 space-y-4 hover:border-[var(--accent)]/30 transition-all">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={14} className="text-[var(--accent)]" /> Profit Factor
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter">{profitFactor}</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] mb-1.5 capitalize">Risk/Reward Efficiency</span>
                </div>
            </div>
            <div className="glass-card rounded-[28px] border-[var(--glass-border)] p-8 space-y-4 hover:border-[var(--accent)]/30 transition-all">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-emerald-500" /> Average RR
                </p>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter">{avgRR}R</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] mb-1.5 capitalize">Per Win</span>
                </div>
            </div>
          </div>

          {/* Section 1: Distribution Analysis (30+ Trades) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
            {!isPaidUser && hasBasicAccess && (
              <div className="absolute inset-0 z-30 backdrop-blur-[6px] bg-[var(--background)]/40 rounded-[40px] flex flex-col items-center justify-center p-8 text-center border border-[var(--glass-border)] shadow-2xl">
                 <div className="w-16 h-16 rounded-[28px] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-6 shadow-premium">
                    <Lock size={28} className="text-[var(--accent)]" />
                 </div>
                 <h3 className="text-xl font-black text-[var(--foreground)] tracking-tight mb-2">Unlock Qualitative Insights</h3>
                 <p className="text-[var(--text-muted)] font-medium max-w-sm mb-8 text-sm">
                    Upgrade to Pro to see your <span className="text-[var(--accent)] font-bold">Best Session</span>, <span className="text-[var(--accent)] font-bold">Bias Efficiency</span>, and <span className="text-[var(--accent)] font-bold">Performance Patterns</span>.
                 </p>
                 <Link href="/billing" className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-[var(--accent)]/30">
                    Upgrade to Unlock Insights
                 </Link>
              </div>
            )}
            
            {/* Session Performance */}
            <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <Clock size={16} /> Session Alpha
                </h3>
                <div className="space-y-4">
                    {sessionData.map(item => (
                        <div key={item.name} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">{item.name}</span>
                                <span className="text-xs font-bold text-[var(--accent)]">{item.winRate}% WR</span>
                            </div>
                            <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                                <div 
                                    className="h-full bg-[var(--accent)] transition-all duration-1000"
                                    style={{ width: `${item.winRate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bias Performance */}
            <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <LayoutDashboard size={16} /> Bias Efficiency
                </h3>
                <div className="space-y-4">
                    {biasData.map(item => (
                        <div key={item.name} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase tracking-wider text-[var(--foreground)]">{item.name}</span>
                                <span className="text-xs font-bold text-[var(--accent)]">{item.winRate}% WR</span>
                            </div>
                            <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                                <div 
                                    className="h-full bg-purple-500 transition-all duration-1000"
                                    style={{ width: `${item.winRate}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {biasData.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full py-10 opacity-50">
                            <AlertCircle size={24} className="mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Bias Data Logged Yet</p>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Section 2: Advanced Insights (100+ Trades) */}
          <div className="pt-8">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">Advanced Performance Modeling</h2>
                <div className="h-[1px] flex-1 bg-[var(--glass-border)]" />
                {!isPaidUser ? (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[8px] font-black uppercase tracking-widest">
                        <Lock size={10} /> Pro Feature
                    </div>
                ) : !hasAdvancedAccess && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest">
                        <Lock size={10} /> {100 - tradeCount} more trades
                    </div>
                )}
            </div>

            <div className={(!hasAdvancedAccess || !isPaidUser) ? 'relative' : ''}>
                {(!hasAdvancedAccess || !isPaidUser) && (
                    <div className="absolute inset-0 z-20 backdrop-blur-sm bg-black/5 rounded-[40px] flex items-center justify-center border border-[var(--glass-border)]">
                        <div className="text-center space-y-4 p-8 glass-card rounded-3xl border-[var(--glass-border)] shadow-2xl">
                             <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center mx-auto border border-[var(--glass-border)]">
                                {!isPaidUser ? <Lock size={24} className="text-[var(--accent)]" /> : <ShieldCheck size={24} className="text-[var(--accent)]" />}
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">
                                {!isPaidUser ? 'Pro Subscription Required' : 'Deep Quantitative Unlock at 100 Trades'}
                             </p>
                             {!isPaidUser ? (
                               <Link href="/billing" className="mt-2 block text-[9px] font-black text-[var(--accent)] uppercase tracking-widest hover:underline">
                                 Upgrade Now →
                               </Link>
                             ) : (
                               <div className="flex gap-2 justify-center">
                                  <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />
                                  <div className="h-1 w-8 bg-[var(--glass-border)] rounded-full" />
                                  <div className="h-1 w-8 bg-[var(--glass-border)] rounded-full" />
                               </div>
                             )}
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${!hasAdvancedAccess ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                    {/* Timeframe Alpha */}
                    <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
                        <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                           <Terminal size={16} /> Timeframe Optimization
                        </h3>
                        <div className="space-y-6">
                            {timeframeData.map(item => (
                                <div key={item.name} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[10px] font-black text-[var(--foreground)]">
                                        {item.name}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{item.trades} Trades</span>
                                            <span className="text-[9px] font-black text-[var(--foreground)]">{item.winRate}% WR</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                             <div 
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${item.winRate}%` }}
                                             />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edge Matrix */}
                    <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium flex flex-col items-center justify-center text-center space-y-6">
                         <div className="w-16 h-16 rounded-3xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 animate-pulse-glow">
                             <Sparkles size={28} className="text-[var(--accent)]" />
                         </div>
                         <div className="space-y-2">
                             <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Quantitative Edge Matrix</h4>
                             <p className="text-[10px] font-medium text-[var(--text-muted)] max-w-[240px]">
                                Sophisticated correlation analysis between setup zone, session, and bias type.
                             </p>
                         </div>
                         <div className="px-6 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">
                             Computing Sequential Alpha...
                         </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
