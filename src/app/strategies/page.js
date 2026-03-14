'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Target, TrendingUp, BarChart3, Clock, LayoutGrid, Zap
} from 'lucide-react';
import { 
  getStrategies, addStrategy, deleteStrategy, getStrategyInsights, getTrades 
} from '@/lib/storage';
import EmptyState from '@/components/ui/EmptyState';
import { MetricSkeleton } from '@/components/ui/SkeletonLoader';

export default function Strategies() {
  const [strategies, setStrategies] = useState([]);
  const [insights, setInsights] = useState([]);
  const [newStrategy, setNewStrategy] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [strats, trades] = await Promise.all([
          getStrategies(),
          getTrades()
        ]);
        setStrategies(strats);
        setInsights(getStrategyInsights(trades));
      } catch (err) {
        console.error('Strategies load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newStrategy && !strategies.includes(newStrategy)) {
      try {
        await addStrategy(newStrategy);
        const updated = await getStrategies();
        setStrategies(updated);
        setNewStrategy('');
      } catch (err) {
        alert('Failed to add strategy');
      }
    }
  };

  const handleDelete = async (name) => {
    if (confirm(`Delete strategy "${name}"? This will not delete trades associated with it.`)) {
      try {
        await deleteStrategy(name);
        const updated = await getStrategies();
        setStrategies(updated);
      } catch (err) {
        alert('Failed to delete strategy');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="h-10 w-48 bg-[var(--card)] rounded-lg mb-8 animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-[var(--card)] rounded-2xl animate-shimmer" />
          <div className="h-48 bg-[var(--card)] rounded-2xl animate-shimmer" />
          <div className="h-48 bg-[var(--card)] rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Strategy Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Define and track your edge across different market setups</p>
        </div>
        
        <form onSubmit={handleAdd} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="New strategy name (e.g. MSS + FVG)"
            value={newStrategy}
            onChange={(e) => setNewStrategy(e.target.value)}
            className="flex-1 md:w-[250px] bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl font-bold text-sm hover:bg-[var(--accent-hover)] transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Strategy</span>
          </button>
        </form>
      </div>

      {strategies.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No strategies defined"
          description="Create your first trading strategy to start categorization and performance tracking."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((name) => {
            const insight = insights.find(i => i.name === name) || { winRate: 0, trades: 0, avgRR: 0 };
            const isWinning = insight.winRate >= 50;
            
            return (
              <div key={name} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 hover:border-[var(--accent)]/30 transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2.5 h-10 w-10 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center border border-[var(--accent)]/20">
                    <Zap className="text-[var(--accent)]" size={20} />
                  </div>
                  <button
                    onClick={() => handleDelete(name)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--loss)] hover:bg-[var(--loss)]/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 truncate">{name}</h3>
                <p className="text-xs text-[var(--text-muted)] font-medium mb-6 uppercase tracking-wider">{insight.trades} Trades Tracked</p>

                <div className="space-y-4">
                  {/* Win Rate Progress */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Win Rate</span>
                      <span className={`text-sm font-bold ${isWinning ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                        {insight.winRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isWinning ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`}
                        style={{ width: `${insight.winRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-[var(--background)]/50 rounded-xl p-3 border border-[var(--border)]">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Avg RR</p>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{insight.avgRR}R</p>
                    </div>
                    <div className="bg-[var(--background)]/50 rounded-xl p-3 border border-[var(--border)]">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Net Profit</p>
                      <p className={`text-sm font-bold ${insight.avgRR >= 0 ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>
                        {(insight.trades * insight.avgRR * (insight.winRate / 100)).toFixed(1)}R
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
