'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp, Target, BarChart3, Clock, Calendar, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import { MetricSkeleton } from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';
import {
  getTrades, getWinRate, getProfitFactor, getAverageRR,
  getEquityCurve, getWinRateByGroup, getStrategyInsights,
} from '@/lib/storage';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card shadow-premium p-4 rounded-2xl border-white/5 backdrop-blur-xl">
      <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
        <p className="text-lg font-black text-white tracking-tighter">
          {payload[0].value > 0 ? '+' : ''}{payload[0].value}R
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const loadData = async () => {
      try {
        const fetchedTrades = await getTrades();
        setTrades(fetchedTrades);
      } catch (err) {
        console.error('Dashboard load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const totalTrades = trades.length;
  const winRate = getWinRate(trades);
  const profitFactor = getProfitFactor(trades);
  const avgRR = getAverageRR(trades);
  const equityCurve = getEquityCurve(trades);
  const sessionPerf = getWinRateByGroup(trades, 'session');
  const strategyPerf = getStrategyInsights(trades);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="h-10 w-48 bg-white/5 rounded-2xl mb-8 animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] glass-card border-white/5 rounded-[32px] animate-shimmer" />
          <div className="h-[400px] glass-card border-white/5 rounded-[32px] animate-shimmer" />
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float"></div>
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full delay-700 animate-float"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-3">
                     <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Calendar size={12} className="text-[var(--accent)]" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Sparkles size={12} /> Live Engine
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4 text-gradient">
                    {greeting}, Trader
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">
                    Analyze your execution, find your edge, and scale your strategy with institutional precision.
                </p>
            </div>
            <button 
                onClick={() => router.push('/add-trade')}
                className="group relative px-10 py-5 rounded-[24px] bg-[var(--accent)] text-white font-black text-sm tracking-widest uppercase overflow-hidden shadow-2xl shadow-indigo-500/40 hover:scale-[1.03] transition-all active:scale-95"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="flex items-center justify-center gap-3 relative z-10">
                    <ArrowUpRight size={20} />
                    Log New Trade
                </div>
            </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 stagger-children">
            <MetricCard
                label="Win Rate"
                value={`${winRate}%`}
                subValue="Historical Ave"
                trend="+2.4%" 
                color={winRate >= 50 ? 'profit' : 'loss'}
                icon={Target}
            />
            <MetricCard
                label="Profit Factor"
                value={profitFactor}
                subValue="R Efficiency"
                trend="+0.12" 
                color={profitFactor >= 1 ? 'profit' : 'loss'}
                icon={TrendingUp}
            />
            <MetricCard
                label="Average RR"
                value={`${avgRR}R`}
                subValue="Median Capture"
                color="accent"
                icon={BarChart3}
            />
            <MetricCard
                label="Vault Sample"
                value={totalTrades}
                subValue="Total Executions"
                icon={Clock}
                color="neutral"
            />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 stagger-children">
            <ChartCard title="Equity Trajectory" subtitle="Cumulative R performance" className="lg:col-span-2 glass-card">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityCurve} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}R`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="var(--accent)"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Session Liquidity" subtitle="Win Rates via Window" className="glass-card">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionPerf} layout="vertical" margin={{ top: 10, right: 30, left: -10, bottom: 10 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} 
                            axisLine={false} 
                            tickLine={false} 
                            width={80} 
                        />
                        <Tooltip cursor={{fill: 'white', fillOpacity: 0.03}} content={({active, payload}) => {
                            if (!active || !payload?.length) return null;
                            return (
                                <div className="glass-card p-3 rounded-xl border-white/10 shadow-premium">
                                    <p className="text-sm font-black text-white">{payload[0].value}% Precision</p>
                                </div>
                            );
                        }} />
                        <Bar 
                            dataKey="winRate" 
                            radius={[0, 12, 12, 0]} 
                            barSize={24}
                            animationDuration={1500}
                        >
                            {sessionPerf.map((entry, index) => (
                                <Area key={`cell-${index}`} fill={entry.winRate >= 50 ? 'var(--profit)' : 'var(--loss)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-8 flex justify-between px-4">
                    {sessionPerf.map(s => (
                        <div key={s.name} className="flex flex-col items-center">
                            <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-1">{s.name}</p>
                            <p className={`text-sm font-black ${s.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>{s.winRate}%</p>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>

        {/* Strategy Table */}
        <div className="glass-card rounded-[40px] border-white/5 p-10 overflow-hidden shadow-premium mb-12 stagger-children">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-[0.2em] mb-2 flex items-center gap-3">
                        <Target className="text-[var(--accent)]" size={20} /> SMC Performance Ledger
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] font-medium">Quantifying your most consistent technical bread-and-butter setups.</p>
                </div>
                <div className="px-4 py-2 rounded-2xl glass-effect border-white/5 text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
                    Top 5 Strategies
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white-[0.05]">
                            <th className="pb-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Strategy Configuration</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Volume</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Precision</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Yield</th>
                            <th className="pb-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-right">Momentum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white-[0.02]">
                        {strategyPerf.slice(0, 5).map((strat) => (
                            <tr key={strat.name} className="group hover:bg-white/[0.02] transition-all duration-300">
                                <td className="py-6 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-40 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                                        <span className="font-black text-[15px] text-white/90 group-hover:text-white transition-colors">{strat.name}</span>
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
                                <td className="py-6 text-center text-[15px] font-black text-white">{strat.avgRR}R</td>
                                <td className="py-6 text-right">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl glass-effect border-white/5 transition-transform group-hover:rotate-12">
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
