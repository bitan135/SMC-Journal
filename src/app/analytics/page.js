'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { Target, TrendingUp, BarChart3, Clock, PieChart as PieIcon, Activity } from 'lucide-react';
import ChartCard from '@/components/ChartCard';
import EmptyState from '@/components/ui/EmptyState';
import { ChartSkeleton } from '@/components/ui/SkeletonLoader';
import {
  getTrades, getEquityCurve, getWinRateByGroup, getStrategyInsights, getRRDistribution,
} from '@/lib/storage';

const COLORS = ['#6366F1', '#22C55E', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

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
      <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8 h-10 w-48 bg-[var(--card)] rounded-lg animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          title="No analytics data"
          description="We need trade data to generate insights. Log a few trades to see your performance charts."
          actionLabel="Add First Trade"
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto animate-fade-in pb-20">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Advanced Analytics</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Quantifying your performance to identify your true edge</p>
      </div>

      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard 
            title="Equity Curve (Growth)" 
            subtitle="Cumulative R-multiple performance over time. Upward slope indicates a positive expectancy."
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}R`} />
                <Tooltip 
                  content={({active, payload}) => active && payload && (
                    <div className="custom-tooltip">
                      <p className="text-xs font-bold text-[var(--accent)] mb-1">{payload[0].payload.date}</p>
                      <p className="text-sm font-bold">{payload[0].value}R Multiplier</p>
                    </div>
                  )}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorCurve)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="RR Distribution" 
            subtitle="Frequency of won trade multiples. Shows if you're hitting your targets."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rrData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--card-hover)', opacity: 0.4}} content={({active, payload}) => active && payload && (
                  <div className="custom-tooltip">
                    <p className="text-sm font-bold">{payload[0].value} trades at {payload[0].payload.name}R</p>
                  </div>
                )} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard 
            title="Win Rate by Session" 
            subtitle="Comparing profitability across London, NY, and Asia sessions to optimize trading hours."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Bar dataKey="winRate" radius={[0, 4, 4, 0]} barSize={24}>
                  {sessionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.winRate >= 50 ? 'var(--profit)' : 'var(--loss)'} />
                  ))}
                </Bar>
                <Tooltip cursor={{fill: 'transparent'}} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="Strategy Performance" 
            subtitle="Win rate comparison across your top strategies. Identify your high-probability setups."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={120} />
                <Bar dataKey="winRate" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={20} />
                <Tooltip cursor={{fill: 'transparent'}} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Row 3 */}
        <ChartCard 
          title="Instrument Win Rate" 
          subtitle="Success rate per asset. Professional traders focus only on assets where they have a statistical advantage."
          height="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={instrumentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip cursor={{fill: 'var(--card-hover)', opacity: 0.4}} />
              <Bar dataKey="winRate" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40}>
                {instrumentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
