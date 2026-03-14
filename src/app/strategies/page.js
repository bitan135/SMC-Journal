'use client';

import { useEffect, useState } from 'react';
import { Target, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getTrades, getStrategyInsights } from '@/lib/storage';

export default function Strategies() {
  const [trades, setTrades] = useState([]);
  const [insights, setInsights] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  useEffect(() => {
    const t = getTrades();
    setTrades(t);
    setInsights(getStrategyInsights(t));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedData = selectedStrategy
    ? trades.filter(t => t.strategy === selectedStrategy).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Strategy Insights</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Discover which strategies give you a real edge</p>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-children">
        {insights.map((strat) => (
          <button
            key={strat.name}
            onClick={() => setSelectedStrategy(selectedStrategy === strat.name ? null : strat.name)}
            className={`bg-[var(--card)] rounded-xl border p-5 text-left transition-all duration-300 hover:shadow-lg group ${
              selectedStrategy === strat.name
                ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10'
                : 'border-[var(--border)] hover:border-[var(--accent)]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate pr-2">{strat.name}</h3>
              <ArrowRight size={14} className={`text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-all ${
                selectedStrategy === strat.name ? 'rotate-90 text-[var(--accent)]' : ''
              }`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Trades</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{strat.trades}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Win Rate</p>
                <p className={`text-lg font-bold ${strat.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                  {strat.winRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Avg RR</p>
                <p className="text-lg font-bold text-[var(--accent)]">{strat.avgRR}R</p>
              </div>
            </div>

            {/* Win/Loss visual bar */}
            <div className="mt-4 flex gap-0.5 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[var(--profit)] rounded-l-full transition-all duration-500"
                style={{ width: `${strat.winRate}%` }}
              />
              <div
                className="bg-[var(--loss)] rounded-r-full transition-all duration-500"
                style={{ width: `${100 - strat.winRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-[var(--profit)]">{strat.wins}W</span>
              <span className="text-[10px] text-[var(--loss)]">{strat.losses}L</span>
            </div>
          </button>
        ))}
      </div>

      {/* Summary Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Strategy', 'Trades', 'Wins', 'Losses', 'Win Rate', 'Avg RR'].map(col => (
                  <th key={col} className="text-left px-5 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {insights.map(strat => (
                <tr key={strat.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{strat.name}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{strat.trades}</td>
                  <td className="px-5 py-3 text-sm text-[var(--profit)]">{strat.wins}</td>
                  <td className="px-5 py-3 text-sm text-[var(--loss)]">{strat.losses}</td>
                  <td className="px-5 py-3">
                    <span className={`text-sm font-semibold ${strat.winRate >= 50 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                      {strat.winRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-[var(--accent)]">{strat.avgRR}R</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Strategy Trades */}
      {selectedStrategy && selectedData.length > 0 && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden animate-fade-in">
          <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {selectedStrategy} — Trade History
            </h3>
            <button onClick={() => setSelectedStrategy(null)} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Close
            </button>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {selectedData.map(trade => (
              <div key={trade.id} className="flex items-center justify-between px-5 py-3 hover:bg-[var(--card-hover)] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{trade.instrument}</span>
                  <span className="text-xs text-[var(--text-muted)]">{trade.session}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{trade.rr}R</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                    trade.result === 'Win' ? 'bg-[var(--profit)]/15 text-[var(--profit)]' : 'bg-[var(--loss)]/15 text-[var(--loss)]'
                  }`}>
                    {trade.result}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
