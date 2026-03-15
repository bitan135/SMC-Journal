'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, Trash2, Target, TrendingUp, BarChart3, Clock, LayoutGrid, Zap, Sparkles, ShieldCheck, ArrowRight
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
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <div className="h-10 w-48 bg-white/5 rounded-2xl animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-64 glass-card border-white/5 rounded-[32px] animate-shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[25%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Target size={12} /> Strategic Ops
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Zap size={12} /> Multi-Edge Sync
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none text-gradient mb-4">
                    Edge Repository
                </h1>
                <p className="text-[var(--text-secondary)] font-medium">Archiving institutional-grade technical setups.</p>
            </div>
            
            <form onSubmit={handleAdd} className="flex gap-4 w-full lg:w-auto">
                <div className="relative group flex-1 lg:flex-none">
                    <input
                        type="text"
                        placeholder="New configuration (e.g. SMT Reversal)"
                        value={newStrategy}
                        onChange={(e) => setNewStrategy(e.target.value)}
                        className="w-full lg:w-[320px] bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/20 outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                    />
                </div>
                <button
                    type="submit"
                    className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-indigo-500/30"
                >
                    <Plus size={18} /> Add Logic
                </button>
            </form>
        </div>

        {strategies.length === 0 ? (
          <div className="glass-card py-20 rounded-[var(--card-radius)] border-white/5 text-center shadow-premium">
            <EmptyState
              icon={Target}
              title="Zero Strategy Definitions"
              description="Initialize your technical categorization by defining your primary market edge."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {strategies.map((name) => {
              const insight = insights.find(i => i.name === name) || { winRate: 0, trades: 0, avgRR: 0 };
              const isWinning = insight.winRate >= 50;
              
              return (
                <div key={name} className="relative group">
                    {/* Hover Glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-indigo-600 rounded-[40px] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>
                    
                    <div className="relative glass-card rounded-[40px] border-white/5 p-8 transition-all duration-500 group-hover:-translate-y-2 shadow-premium bg-white-[0.01]">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                                <Zap className="text-[var(--accent)]" size={24} />
                            </div>
                            <button
                                onClick={() => handleDelete(name)}
                                className="p-3 text-[var(--text-muted)] hover:text-[var(--loss)] hover:bg-[var(--loss)]/10 rounded-xl transition-all active:scale-90"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h3 className="text-xl font-black text-white mb-2 truncate tracking-tight">{name}</h3>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
                            <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em]">{insight.trades} Total Executions</p>
                        </div>

                        <div className="space-y-6">
                            {/* Win Rate Module */}
                            <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                                <div className="flex justify-between items-end mb-3 px-1">
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Execution Accuracy</span>
                                    <span className={`text-sm font-black ${isWinning ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {insight.winRate}%
                                    </span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isWinning ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}
                                        style={{ width: `${insight.winRate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Secondary Data Hub */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.03] rounded-3xl p-4 border border-white/5 group-hover:border-[var(--accent)]/20 transition-all">
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1">Median RR</p>
                                    <p className="text-lg font-black text-white font-mono">{insight.avgRR}R</p>
                                </div>
                                <div className="bg-white/[0.03] rounded-3xl p-4 border border-white/5 group-hover:border-[var(--accent)]/20 transition-all">
                                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1">Expected Yield</p>
                                    <p className={`text-lg font-black font-mono ${(insight.trades * insight.avgRR * (insight.winRate / 100)) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        +{(insight.trades * insight.avgRR * (insight.winRate / 100)).toFixed(1)}R
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white-[0.03] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                             <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[var(--accent)]" />
                                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Institutional Verified</span>
                             </div>
                             <ArrowRight size={16} className="text-[var(--text-muted)]" />
                        </div>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
