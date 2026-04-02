'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  TrendingUp, Target, BarChart3, Clock, Calendar, ArrowUpRight, ArrowDownRight, Sparkles, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MetricCard from '@/components/dashboard/MetricCard';
const DashboardCharts = dynamic(() => import('@/components/dashboard/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <>
      <div className="h-[400px] glass-card border-[var(--glass-border)] rounded-[32px] animate-shimmer" />
      <div className="h-[400px] glass-card border-[var(--glass-border)] rounded-[32px] animate-shimmer" />
    </>
  )
});
import { MetricSkeleton } from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/components/shared/AuthProvider';
import {
  getTrades, getWinRate, getProfitFactor, getAverageRR,
  getEquityCurve, getWinRateByGroup, getStrategyInsights,
  getExpectancy, getTrend
} from '@/lib/storage';

 

export default function Dashboard() {
  const router = useRouter();
  const { profile, isLoading: authLoading } = useAuth();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const loadData = async () => {
      try {
        const res = await getTrades();
        if (!isMounted) return;
        setTrades(res.success && Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  const totalTrades = trades.length;
  const winRate = getWinRate(trades);
  const profitFactor = getProfitFactor(trades);
  const avgRR = getAverageRR(trades);
  const expectancy = getExpectancy(trades);
  const winRateTrend = getTrend(trades, 'winRate');
  const pfTrend = getTrend(trades, 'profitFactor');
  const equityCurve = getEquityCurve(trades);
  const sessionPerf = getWinRateByGroup(trades, 'session');
  const strategyPerf = getStrategyInsights(trades);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-10 animate-fade-in">
        <div className="h-10 w-48 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl mb-8 animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] glass-card border-[var(--glass-border)] rounded-[32px] animate-shimmer" />
          <div className="h-[400px] glass-card border-[var(--glass-border)] rounded-[32px] animate-shimmer" />
        </div>
      </div>
    );
  }

  if (totalTrades === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <EmptyState
          icon={Target}
          title="Archive is Empty"
          description="Initialize your journaling engine by logging your first transaction."
          actionLabel="Log New Trade"
          onAction={() => router.push('/add-trade')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-28 md:pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full delay-700 animate-float"></div>
      
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-16">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                        <Calendar size={12} className="text-[var(--accent)]" />
                        {mounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Loading date...'}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse leading-relaxed">
                        <Sparkles size={12} /> Live Engine
                    </span>
                </div>
                <h1 className="text-2xl md:text-6xl font-black text-[var(--foreground)] tracking-tighter leading-tight mb-4 text-gradient">
                    {greeting}, {profile?.full_name?.split(' ')[0] || profile?.username || 'Trader'}
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">
                    Analyze your execution, find your edge, and scale your strategy with institutional precision.
                </p>
            </div>
            <Link 
                href="/add-trade"
                className="group relative px-6 py-4 md:px-10 md:py-5 rounded-[20px] md:rounded-[24px] bg-[var(--accent)] text-white font-black text-xs md:text-sm tracking-widest uppercase overflow-hidden shadow-2xl shadow-indigo-500/40 hover:scale-[1.03] transition-all active:scale-95 flex items-center justify-center gap-3"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center justify-center gap-3 relative z-10">
                    <ArrowUpRight size={20} />
                    Log New Trade
                </div>
            </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12 stagger-children">
            <MetricCard
                label="Win Rate"
                value={`${winRate}%`}
                subValue="Historical Ave"
                trend={winRateTrend >= 0 ? `+${winRateTrend}%` : `${winRateTrend}%`} 
                color={winRate >= 50 ? 'profit' : 'loss'}
                icon={Target}
            />
            <MetricCard
                label="Profit Factor"
                value={profitFactor}
                subValue="R Efficiency"
                trend={pfTrend >= 0 ? `+${pfTrend}` : `${pfTrend}`} 
                color={profitFactor >= 1 ? 'profit' : 'loss'}
                icon={TrendingUp}
            />
            <MetricCard
                label="Expectancy"
                value={`${expectancy >= 0 ? '+' : ''}${expectancy}R`}
                subValue="Per Execution"
                color={expectancy >= 0.3 ? 'profit' : expectancy < 0 ? 'loss' : 'accent'}
                icon={Zap}
            />
            <MetricCard
                label="Vault Sample"
                value={totalTrades}
                subValue="Total Executions"
                icon={Clock}
                color="neutral"
            />
            <MetricCard
                label="Strategic Yield"
                value={`${trades.reduce((sum, t) => sum + (parseFloat(t.rr) || 0), 0).toFixed(1)}R`}
                subValue="Total Accrual"
                icon={BarChart3}
                color="profit"
            />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 stagger-children">
            <DashboardCharts equityCurve={equityCurve} sessionPerf={sessionPerf} />
        </div>

        {/* Strategy Table */}
        <div className="glass-card rounded-[32px] md:rounded-[40px] border-[var(--glass-border)] p-6 md:p-10 shadow-premium mb-12 stagger-children">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-lg font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
                        <Target className="text-[var(--accent)]" size={20} /> SMC Performance Ledger
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Quantifying your most consistent technical bread-and-butter setups.</p>
                </div>
                <div className="px-4 py-2 rounded-2xl glass-effect border-[var(--glass-border)] text-[10px] font-black text-[var(--accent)] uppercase tracking-widest leading-relaxed">
                    Top 5 Strategies
                </div>
            </div>
            
            <div className="-mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto pb-4 custom-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            <th className="pb-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] leading-relaxed">Strategy Configuration</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-center leading-relaxed">Volume</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-center leading-relaxed">Precision</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-center leading-relaxed">Yield</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] text-right leading-relaxed">Momentum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {strategyPerf.slice(0, 5).map((strat) => (
                            <tr key={strat.name} className="group hover:bg-[var(--glass-bg)] transition-all duration-300">
                                <td className="py-6 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                                        <span className="font-black text-[15px] text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{strat.name}</span>
                                    </div>
                                </td>
                                <td className="py-6 text-center text-sm font-extrabold text-[var(--text-muted)]">{strat.trades} Trades</td>
                                <td className="py-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider ${
                                        strat.winRate >= 55 ? 'bg-[var(--profit-bg)] text-[var(--profit)]' : 
                                        strat.winRate < 45 ? 'bg-[var(--loss-bg)] text-[var(--loss)]' : 
                                        'bg-[var(--accent)]/10 text-[var(--accent)]'
                                    }`}>
                                        {strat.winRate}% WR
                                    </span>
                                </td>
                                <td className="py-6 text-center text-[15px] font-black text-[var(--foreground)]">{strat.avgRR}R</td>
                                <td className="py-6 text-right">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl glass-effect border-[var(--glass-border)] transition-transform group-hover:rotate-12">
                                        {strat.winRate >= 50 ? <ArrowUpRight size={18} className="text-[var(--profit)]" /> : <ArrowDownRight size={18} className="text-[var(--loss)]" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
