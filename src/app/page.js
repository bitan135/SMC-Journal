'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp, Target, BarChart3, Clock, Calendar, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import { MetricSkeleton } from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';
import {
  getTrades, seedDemoData, getWinRate, getProfitFactor, getAverageRR,
  getEquityCurve, getWinRateByGroup, getStrategyInsights,
} from '@/lib/storage';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        <p className="text-sm font-bold text-[var(--text-primary)]">
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
        <div className="h-10 w-48 bg-[var(--card)] rounded-lg mb-8 animate-shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-[var(--card)] border border-[var(--border)] rounded-2xl animate-shimmer" />
          <div className="h-[400px] bg-[var(--card)] border border-[var(--border)] rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  if (totalTrades === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <EmptyState
          icon={Target}
          title="No trades recorded yet"
          description="Log your first trade to start tracking your performance and finding your edge."
          actionLabel="Add First Trade"
          onAction={() => router.push('/add-trade')}
        />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto animate-fade-in lg:pl-60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {greeting}, Trader
          </h1>
        </div>
        <button 
          onClick={() => router.push('/add-trade')}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm shadow-xl shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] transition-all hover:scale-105 active:scale-95"
        >
          <ArrowUpRight size={18} />
          Log New Trade
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Win Rate"
          value={`${winRate}%`}
          subValue="Total Performance"
          trend="+2.4%" // Mocked trend
          color={winRate >= 50 ? 'profit' : 'loss'}
          icon={Target}
        />
        <MetricCard
          label="Profit Factor"
          value={profitFactor}
          subValue="Reward/Risk Efficiency"
          trend="+0.12" // Mocked trend
          color={profitFactor >= 1 ? 'profit' : 'loss'}
          icon={TrendingUp}
        />
        <MetricCard
          label="Average RR"
          value={`${avgRR}R`}
          subValue="Winning Trade Median"
          color="accent"
          icon={BarChart3}
        />
        <MetricCard
          label="Total Trades"
          value={totalTrades}
          subValue="Sample Size"
          icon={Clock}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ChartCard title="Equity Curve" subtitle="Cumulative R performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}R`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--accent)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Session Win Rates" subtitle="Best trading window">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionPerf} layout="vertical" margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip cursor={{fill: 'transparent'}} content={({active, payload}) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="custom-tooltip">
                    <p className="text-sm font-bold">{payload[0].value}% Win Rate</p>
                  </div>
                );
              }} />
              <Bar 
                dataKey="winRate" 
                radius={[0, 4, 4, 0]} 
                barSize={20}
                fill="var(--accent)"
              >
                {sessionPerf.map((entry, index) => (
                  <Area key={`cell-${index}`} fill={entry.winRate >= 50 ? 'var(--profit)' : 'var(--loss)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-between px-2">
            {sessionPerf.map(s => (
              <div key={s.name} className="text-center">
                <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{s.name}</p>
                <p className={`text-xs font-bold ${s.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>{s.winRate}%</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Strategy Table */}
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Strategy performance</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Deep dive into your most consistent setups</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Strategy</th>
                <th className="pb-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Trades</th>
                <th className="pb-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Win Rate</th>
                <th className="pb-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Avg RR</th>
                <th className="pb-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {strategyPerf.slice(0, 5).map((strat) => (
                <tr key={strat.name} className="group hover:bg-[var(--card-hover)]/30 transition-colors">
                  <td className="py-4 font-semibold text-sm text-[var(--text-secondary)]">{strat.name}</td>
                  <td className="py-4 text-center text-sm font-medium text-[var(--text-muted)]">{strat.trades}</td>
                  <td className="py-4 text-center">
                    <span className={`text-sm font-bold ${strat.winRate >= 55 ? 'text-[var(--profit)]' : strat.winRate < 45 ? 'text-[var(--loss)]' : 'text-[var(--accent)]'}`}>
                      {strat.winRate}%
                    </span>
                  </td>
                  <td className="py-4 text-center text-sm font-bold text-[var(--text-primary)]">{strat.avgRR}R</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {strat.winRate >= 50 ? <ArrowUpRight size={14} className="text-[var(--profit)]" /> : <ArrowDownRight size={14} className="text-[var(--loss)]" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
