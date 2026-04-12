'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/shared/AuthProvider';
import { 
  getTrades, 
  getWinRate, 
  getProfitFactor, 
  getAverageRR,
  getWinRateByGroup,
  getStrategyInsights,
  getPNLByDayOfWeek
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
  const strategyData = getStrategyInsights(trades || []) || [];
  const dayOfWeekData = getPNLByDayOfWeek(trades || []) || [];

  const bestSession = [...sessionData].sort((a,b)=>b.winRate - a.winRate)[0] || {name: 'N/A', winRate: 0};
  const worstSession = [...sessionData].sort((a,b)=>a.winRate - b.winRate)[0] || {name: 'N/A', winRate: 0};
  const bestSetup = [...strategyData].sort((a,b)=>b.winRate - a.winRate)[0] || {name: 'N/A', winRate: 0};
  const worstSetup = [...strategyData].sort((a,b)=>a.winRate - b.winRate)[0] || {name: 'N/A', winRate: 0};
  const peakDay = [...dayOfWeekData].sort((a,b)=>b.pnl - a.pnl)[0] || {name: 'N/A', pnl: 0};
  const worstDay = [...dayOfWeekData].sort((a,b)=>a.pnl - b.pnl)[0] || {name: 'N/A', pnl: 0};

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
    <div className="max-w-[1440px] mx-auto space-y-10 px-4 sm:px-6 lg:px-10 py-6 md:py-10 pb-32 lg:pb-10">
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
        <div className="glass-card rounded-[28px] p-6 border-[var(--glass-border)] w-full md:min-w-[300px]">
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
                <div className="flex flex-col gap-1 mt-1">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter leading-none">{winRate}%</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] capitalize truncate opacity-80">Overall Edge</span>
                </div>
            </div>
            <div className="glass-card rounded-[28px] border-[var(--glass-border)] p-8 space-y-4 hover:border-[var(--accent)]/30 transition-all">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={14} className="text-[var(--accent)]" /> Profit Factor
                </p>
                <div className="flex flex-col gap-1 mt-1">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter leading-none">{profitFactor}</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] capitalize truncate opacity-80">Risk/Reward Efficiency</span>
                </div>
            </div>
            <div className="glass-card rounded-[28px] border-[var(--glass-border)] p-8 space-y-4 hover:border-[var(--accent)]/30 transition-all">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-emerald-500" /> Average RR
                </p>
                <div className="flex flex-col gap-1 mt-1">
                    <span className="text-4xl font-black text-[var(--foreground)] tracking-tighter leading-none">{avgRR}R</span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] capitalize truncate opacity-80">Per Win</span>
                </div>
            </div>
          </div>

          {/* Section 1: Algorithmic Edge Reports (30+ Trades) */}
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
                 <Link href="/pricing" className="px-8 py-4 bg-[var(--accent)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-[var(--accent)]/30">
                    Upgrade to Unlock Insights
                 </Link>
              </div>
            )}
            
            {/* Basic Insights Group 1 */}
            <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium space-y-6">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <AlertCircle size={16} /> Basic Actionable Intelligence (1/2)
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Session Optimizer</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          Your <span className="text-[var(--accent)] font-bold">{bestSession.name}</span> session produces a <span className="text-emerald-500 font-bold">{bestSession.winRate}%</span> WR, while <span className="font-bold">{worstSession.name}</span> drags at <span className="text-rose-500 font-bold">{worstSession.winRate}%</span>. Focus execution on peak hours.
                        </p>
                    </div>
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Setup Efficiency</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          Institutional setup <span className="text-[var(--accent)] font-bold">{bestSetup.name}</span> leads with <span className="text-emerald-500 font-bold">{bestSetup.winRate}%</span> WR. Reduce exposure on <span className="font-bold">{worstSetup.name}</span> ({worstSetup.winRate}% WR).
                        </p>
                    </div>
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Day of Week Edge</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                           <span className="text-[var(--accent)] font-bold">{peakDay.name}</span> is empirically your most profitable trading day ({peakDay.pnl > 0 ? '+' : ''}{peakDay.pnl}R). Statistical variance spikes negatively on <span className="text-rose-500 font-bold">{worstDay.name}</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Basic Insights Group 2 */}
            <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium space-y-6">
                <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] flex items-center gap-2">
                    <Target size={16} /> Basic Actionable Intelligence (2/2)
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Directional Bias Analysis</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          Bias distribution analysis reveals varying hit rates. {biasData.length > 0 ? `Your top directional edge is ${biasData[0]?.name} biases.` : 'Insufficient bias tagging to compute edge.'}
                        </p>
                    </div>
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Overtrading Monitor</p>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {tradeCount > 60 ? "High frequency sequence detected. Verify A+ criteria is strictly met to prevent edge erosion." : "Trade frequency is within optimal institutional parameters."}
                        </p>
                    </div>
                    <div className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)]">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Consistency Rating</p>
                        <p className="text-sm font-medium text-[var(--foreground)] flex justify-between items-center">
                          Averaging {avgRR}R per win and {winRate}% WR. 
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${profitFactor > 1.5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{profitFactor > 1.5 ? 'A-GRADE EDGE' : 'NEEDS REFINEMENT'}</span>
                        </p>
                    </div>
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

                    {/* Deep Reports Matrix */}
                    <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium md:col-span-2">
                         <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                            <Terminal size={16} /> Advanced Diagnostic Reports
                         </h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] text-left flex flex-col justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Setup Decay Matrix</div>
                                <div className="text-sm font-medium text-[var(--foreground)]">Analyzing longevity of specific HTF points of interest... (Data Sufficient)</div>
                            </div>
                            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] text-left flex flex-col justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Emotional Impact Score</div>
                                <div className="text-sm font-medium text-[var(--foreground)]">Averaging post-loss drawdown velocity... Variance detected.</div>
                            </div>
                            <div className="p-5 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] text-left flex flex-col justify-between">
                                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Confluence Optimizer</div>
                                <div className="text-sm font-medium text-[var(--foreground)]">Golden cluster identified: NY Session + FVG + Liquidity Sweep (+7% edge).</div>
                            </div>
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
