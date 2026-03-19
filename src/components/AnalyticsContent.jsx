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
  getExpectancy, getDrawdownCurve, getMaxDrawdown, getMonthlyPerformance
} from '@/lib/storage';

const COLORS = ['#6366F1', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

function CustomTooltip({ active, payload, label, suffix = '' }) {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card shadow-premium p-4 rounded-2xl border-[var(--glass-border)] backdrop-blur-xl">
        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] animate-pulse" />
          <p className="text-lg font-black text-[var(--foreground)] tracking-tighter">
            {payload[0].value}{suffix}
          </p>
        </div>
      </div>
    );
}

const checkIsLocked = (sub) => sub?.plan_id === 'free';

const LockOverlay = () => (
    <div className="absolute inset-x-8 inset-y-12 z-50 flex flex-col items-center justify-center text-center p-8 glass-effect rounded-[32px] border border-[var(--glass-border)] backdrop-blur-md animate-fade-in group-hover:backdrop-blur-sm transition-all duration-700">
        <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-6 animate-pulse">
            <ShieldCheck className="text-[var(--accent)]" size={32} />
        </div>
        <h3 className="text-xl font-black text-[var(--foreground)] mb-3 tracking-tighter">Pro Analytics Locked</h3>
        <p className="text-[var(--text-secondary)] text-sm font-medium max-w-[240px] mb-8 leading-[1.8]">
            Upgrade to Pro to unlock advanced analytics and discover your trading edge.
        </p>
        <button 
            onClick={() => window.location.href = '/billing'}
            className="px-8 py-3 bg-[var(--accent)] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-110 active:scale-95 transition-all"
        >
            Unleash Power
        </button>
    </div>
);

export default function AnalyticsContent() {
  const [trades, setTrades] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { getTrades, profileService } = await import('@/lib/storage');
        const [fetchedTrades, sub] = await Promise.all([
          getTrades(),
          profileService.getSubscription()
        ]);
        if (!isMounted) return;
        setTrades(fetchedTrades);
        setSubscription(sub);
      } catch (err) {
        console.error('Analytics load failed:', err?.message || err?.details || err?.code || err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-6 md:py-10 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 px-2">
            <div className="flex-1">
                <div className="h-4 w-32 bg-white/5 rounded-full mb-4 animate-shimmer" />
                <div className="h-12 w-64 bg-white/5 rounded-2xl mb-4 animate-shimmer" />
                <div className="h-4 w-48 bg-white/5 rounded-full animate-shimmer" />
            </div>
            <div className="flex items-center gap-4">
                <div className="h-[76px] w-[140px] bg-white/5 rounded-[24px] animate-shimmer" />
                <div className="h-[76px] w-[140px] bg-white/5 rounded-[24px] animate-shimmer" />
            </div>
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
  const drawdownCurve = getDrawdownCurve(trades);
  const monthlyData = getMonthlyPerformance(trades);
  const expectancy = getExpectancy(trades);
  const maxDD = getMaxDrawdown(trades);
  const sessionData = getWinRateByGroup(trades, 'session');
  const strategyData = getStrategyInsights(trades);
  const instrumentData = getWinRateByGroup(trades, 'instrument');
  const rrData = getRRDistribution(trades);

  const isLocked = checkIsLocked(subscription);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-24 md:pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full delay-1000 animate-float pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 px-2">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse leading-relaxed">
                        <Sparkles size={12} /> Institutional Intelligence
                    </span>
                </div>
                <h1 className="text-2xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-tight text-gradient mb-4">
                    Execution Analytics
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">Quantifying technical superiority and execution variance.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="glass-card px-8 py-5 rounded-[24px] border-[var(--glass-border)] shadow-premium flex flex-col items-center">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Vault Expectancy</span>
                    <span className="text-xl font-black text-[var(--foreground)]">{expectancy}R</span>
                </div>
                <div className="glass-card px-8 py-5 rounded-[24px] border-[var(--glass-border)] shadow-premium flex flex-col items-center">
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Max Drawdown</span>
                    <span className="text-xl font-black text-rose-500">{maxDD}R</span>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            {/* Row 1: Primary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChartCard 
                    title="Equity Trajectory" 
                    subtitle="Cumulative R-multiple performance curve"
                    className="lg:col-span-2 glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] group"
                >
                    <div className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={equityCurve} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} className="text-[var(--glass-border)]" vertical={false} />
                              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}R`} />
                              <Tooltip content={<CustomTooltip suffix="R" />} />
                              <Area type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={4} fillOpacity={1} fill="url(#colorCurve)" animationDuration={2500} />
                          </AreaChart>
                      </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard 
                    title="Yield Distribution" 
                    subtitle="Frequencies of winning RR clusters"
                    className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] relative group"
                >
                      {isLocked && <LockOverlay />}
                      <div className={isLocked ? 'blur-md opacity-20 pointer-events-none h-full w-full' : 'h-full w-full'}>
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={rrData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                  <Tooltip cursor={{fill: 'var(--accent)', fillOpacity: 0.05}} content={<CustomTooltip suffix="R" />} />
                                  <Bar dataKey="count" fill="var(--accent)" radius={[8, 8, 0, 0]} animationDuration={2000} />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard 
                    title="Session Performance" 
                    subtitle="Precision variance by market window"
                    className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)]"
                >
                    <div className="h-full w-full">
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
                    </div>
                </ChartCard>

                <ChartCard 
                    title="Setup Authority" 
                    subtitle="Win rates across defined strategies"
                    className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] group"
                >
                    <div className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={strategyData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                              <XAxis type="number" hide domain={[0, 100]} />
                              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }} axisLine={false} tickLine={false} width={120} />
                              <Tooltip cursor={{fill: 'var(--accent)', fillOpacity: 0.05}} content={<CustomTooltip suffix="%" />} />
                              <Bar dataKey="winRate" fill="var(--accent)" radius={[0, 12, 12, 0]} barSize={20} animationDuration={1800} />
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Row 3: Advanced Portfolio Math (PRO) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard 
                    title="Portfolio Drawdown" 
                    subtitle="Depth of peak-to-trough R-multiple variance"
                    className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] relative group"
                >
                    {isLocked && <LockOverlay />}
                    <div className={isLocked ? 'blur-md opacity-20 pointer-events-none h-full w-full' : 'h-full w-full'}>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={drawdownCurve} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorDD" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} className="text-[var(--glass-border)]" vertical={false} />
                              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}R`} />
                              <Tooltip content={<CustomTooltip suffix="R" />} />
                              <Area type="monotone" dataKey="drawdown" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDD)" animationDuration={2500} />
                          </AreaChart>
                      </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard 
                    title="Monthly P&L Velocity" 
                    subtitle="Historical performance by calendar period"
                    className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] relative group"
                >
                    {isLocked && <LockOverlay />}
                    <div className={isLocked ? 'blur-md opacity-20 pointer-events-none h-full w-full' : 'h-full w-full'}>
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="white" strokeOpacity={0.05} vertical={false} />
                              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}R`} />
                              <Tooltip cursor={{fill: 'var(--accent)', fillOpacity: 0.05}} content={<CustomTooltip suffix="R" />} />
                              <Bar dataKey="profit" animationDuration={2000} radius={[8, 8, 8, 8]}>
                                  {monthlyData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? 'var(--profit)' : 'var(--loss)'} />
                                  ))}
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Row 4: Asset Intelligence (PRO) */}
            <ChartCard 
                title="Instrument Dominance" 
                subtitle="High-fidelity success rate per institutional asset"
                height="h-[450px]"
                className="glass-card shadow-premium rounded-[40px] border-[var(--glass-border)] relative group"
            >
                {isLocked && <LockOverlay />}
                <div className={isLocked ? 'blur-md opacity-20 pointer-events-none h-full w-full' : 'h-full w-full'}>
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
                </div>
            </ChartCard>
        </div>
      </div>
    </div>
  );
}
