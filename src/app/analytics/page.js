'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import ChartCard from '@/components/ChartCard';
import {
  getTrades, getEquityCurve, getWinRateByGroup, getRRDistribution,
} from '@/lib/storage';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color || 'var(--text-primary)' }}>
          {entry.name === 'balance' ? `${entry.value > 0 ? '+' : ''}${entry.value}R` : 
           entry.name === 'winRate' ? `${entry.value}%` : 
           entry.name === 'count' ? `${entry.value} trades` : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTrades(getTrades());
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const equityCurve = getEquityCurve(trades);
  const sessionPerf = getWinRateByGroup(trades, 'session');
  const strategyPerf = getWinRateByGroup(trades, 'strategy');
  const instrumentPerf = getWinRateByGroup(trades, 'instrument');
  const rrDist = getRRDistribution(trades);

  const barColor = (winRate) => winRate >= 55 ? 'var(--profit)' : winRate >= 45 ? 'var(--accent)' : 'var(--loss)';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Deep dive into your trading performance</p>
      </div>

      <div className="space-y-6">
        {/* Equity Curve */}
        <ChartCard title="Equity Curve" subtitle="Cumulative R-multiple performance">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} tickFormatter={(v) => `${v}R`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: 'var(--accent)' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Session & Strategy Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Rate by Session */}
          <ChartCard title="Win Rate by Session" subtitle="Performance across trading sessions">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sessionPerf} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="winRate" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {sessionPerf.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.winRate)} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Win Rate by Strategy */}
          <ChartCard title="Win Rate by Strategy" subtitle="Which setups work best">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={strategyPerf} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="winRate" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {strategyPerf.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.winRate)} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Instrument Performance & RR Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instrument Performance */}
          <ChartCard title="Instrument Performance" subtitle="Win rate per trading pair">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={instrumentPerf} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="winRate" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {instrumentPerf.map((entry, i) => (
                    <Cell key={i} fill={barColor(entry.winRate)} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* RR Distribution */}
          <ChartCard title="RR Distribution" subtitle="Histogram of winning trade R-multiples">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rrDist} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={50} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
