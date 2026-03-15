'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { Target, TrendingUp, BarChart3, Clock, PieChart as PieIcon, Activity, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import ChartCard from '@/components/ChartCard';
import EmptyState from '@/components/ui/EmptyState';
import { ChartSkeleton } from '@/components/ui/SkeletonLoader';
import {
  getTrades, getEquityCurve, getWinRateByGroup, getStrategyInsights, getRRDistribution,
} from '@/lib/storage';

const COLORS = ['#6366F1', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

function CustomTooltip({ active, payload, label, suffix = '' }) {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card shadow-premium p-4 rounded-2xl border-white/5 backdrop-blur-xl">
        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
          <p className="text-lg font-black text-white tracking-tighter">
            {payload[0].value}{suffix}
          </p>
        </div>
      </div>
    );
}

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedTrades = await getTrades();
        setTrades(fetchedTrades);
      } catch (err) {
        console.error('Analytics load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <div className="h-10 w-64 bg-white/5 rounded-2xl animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <EmptyState
          icon={Activity}
          title="Archive is Silent"
          description="We require execution data to generate high-fidelity technical insights."
          actionLabel="Log First Trade"
          onAction={() => window.location.href = '/add-trade'}
        />
      </div>
    );
  }

  const equityCurve = getEquityCurve(trades);
  const sessionData = getWinRateByGroup(trades, 'session');
  const strategyData = getStrategyInsights(trades);
  const instrumentData = getWinRateByGroup(trades, 'instrument');
  const rrData = getRRDistribution(trades);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full delay-1000 animate-float pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Activity size={12} /> Performance Intelligence
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <BarChart3 size={12} /> Institutional Grade
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none text-gradient mb-4">
                    Edge Analytics
                </h1>
                <p className="text-[var(--text-secondary)] font-medium">Quantifying technical superiority and execution variance.</p>
            </div>
        </div>

        <div className="space-y-8">
            {/* Row 1: Primary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard 
                    title="Equity Trajectory" 
                    subtitle="Cumulative R-multiple performance curve"
                    className="lg:col-span-2 glass-card shadow-premium rounded-[40px] border-white/5"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equityCurve} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}R`} />
                            <Tooltip content={<CustomTooltip suffix="R" />} />
                            <Area type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorCurve)" animationDuration={2500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="Yield Distribution" 
                    subtitle="Frequencies of winning RR clusters"
                    className="glass-card shadow-premium rounded-[40px] border-white/5"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rrData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'white', fillOpacity: 0.03}} content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} animationDuration={2000} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 2: Optimization Engines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard 
                    title="Session Performance" 
                    subtitle="Precision variance by market window"
                    className="glass-card shadow-premium rounded-[40px] border-white/5"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sessionData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip cursor={{fill: 'white', fillOpacity: 0.03}} content={<CustomTooltip suffix="%" />} />
                            <Bar dataKey="winRate" radius={[0, 12, 12, 0]} barSize={24} animationDuration={1800}>
                                {sessionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.winRate >= 50 ? 'var(--profit)' : 'var(--loss)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="Setup Authority" 
                    subtitle="Win rates across defined strategies"
                    className="glass-card shadow-premium rounded-[40px] border-white/5"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={strategyData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} axisLine={false} tickLine={false} width={120} />
                            <Tooltip cursor={{fill: 'white', fillOpacity: 0.03}} content={<CustomTooltip suffix="%" />} />
                            <Bar dataKey="winRate" fill="var(--accent)" radius={[0, 12, 12, 0]} barSize={20} animationDuration={1800} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Row 3: Asset Intelligence */}
            <ChartCard 
                title="Instrument Dominance" 
                subtitle="High-fidelity success rate per institutional asset"
                height="h-[450px]"
                className="glass-card shadow-premium rounded-[40px] border-white/5"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={instrumentData} margin={{ top: 30, right: 30, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} dy={15} />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                        <Tooltip cursor={{fill: 'white', fillOpacity: 0.03}} content={<CustomTooltip suffix="%" />} />
                        <Bar dataKey="winRate" radius={[10, 10, 0, 0]} barSize={50} animationDuration={2200}>
                            {instrumentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
      </div>
    </div>
  );
}
