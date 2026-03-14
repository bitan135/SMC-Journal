'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, Target, BarChart3, Clock,
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import {
  getTrades, seedDemoData, getWinRate, getProfitFactor, getAverageRR,
  getEquityCurve, getWinRateByGroup, getStrategyInsights,
} from '@/lib/storage';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">
        {payload[0].value > 0 ? '+' : ''}{payload[0].value}R
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    seedDemoData();
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

  const totalTrades = trades.length;
  const winRate = getWinRate(trades);
  const profitFactor = getProfitFactor(trades);
  const avgRR = getAverageRR(trades);
  const equityCurve = getEquityCurve(trades);
  const sessionPerf = getWinRateByGroup(trades, 'session');
  const strategyPerf = getStrategyInsights(trades);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Your trading performance at a glance
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 stagger-children">
        <MetricCard
          label="Win Rate"
          value={`${winRate}%`}
          subValue={`${totalTrades} trades`}
          color={winRate >= 50 ? 'profit' : 'loss'}
          icon={Target}
        />
        <MetricCard
          label="Profit Factor"
          value={profitFactor}
          subValue="reward / risk"
          color={profitFactor >= 1 ? 'profit' : 'loss'}
          icon={TrendingUp}
        />
        <MetricCard
          label="Avg RR"
          value={`${avgRR}R`}
          subValue="on winning trades"
          color="accent"
          icon={BarChart3}
        />
        <MetricCard
          label="Total Trades"
          value={totalTrades}
          subValue={`${trades.filter(t => t.result === 'Win').length}W / ${trades.filter(t => t.result === 'Loss').length}L`}
          icon={Clock}
        />
      </div>

      {/* Equity Curve */}
      <ChartCard title="Equity Curve" subtitle="Cumulative R performance over time" className="mb-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={equityCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              tickFormatter={(v) => `${v}R`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: 'var(--accent)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Session & Strategy Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Session Performance */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Session Performance
          </h3>
          <div className="space-y-3">
            {sessionPerf.map((session) => (
              <div key={session.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[var(--text-secondary)]">{session.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)]">{session.trades} trades</span>
                    <span className={`text-sm font-semibold ${session.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                      {session.winRate}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${session.winRate >= 50 ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`}
                    style={{ width: `${session.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Performance */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Strategy Performance
          </h3>
          <div className="space-y-3">
            {strategyPerf.slice(0, 5).map((strat) => (
              <div key={strat.name} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-secondary)] truncate">{strat.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{strat.trades} trades</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${strat.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                    {strat.winRate}%
                  </span>
                  <span className="text-xs text-[var(--text-muted)] w-12 text-right">{strat.avgRR}R</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
