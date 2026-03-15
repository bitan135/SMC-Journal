'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, Library, Eye, Trash2, Calendar, TrendingUp, Target, Clock, Image as ImageIcon, ArrowLeft, ArrowUpRight, SearchX, Sparkles, ChevronRight, BarChart3
} from 'lucide-react';
import { getTrades, deleteTrade, INSTRUMENTS, SESSIONS, DEFAULT_STRATEGIES } from '@/lib/storage';
import ResultBadge from '@/components/ui/ResultBadge';
import SessionBadge from '@/components/ui/SessionBadge';
import TagBadge from '@/components/ui/TagBadge';
import ModalContainer from '@/components/ui/ModalContainer';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/SkeletonLoader';

export default function TradeLibrary() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    instrument: 'All',
    strategy: 'All',
    session: 'All',
    result: 'All',
  });
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const fetchedTrades = await getTrades();
        setTrades(fetchedTrades.sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)));
      } catch (err) {
        console.error('Library load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrades();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this trade?')) {
      try {
        await deleteTrade(id);
        setTrades(prev => prev.filter(t => t.id !== id));
        setIsModalOpen(false);
      } catch (err) {
        alert('Failed to delete trade');
      }
    }
  };

  const filteredTrades = trades.filter(trade => {
    const instr = (trade.instrument || '').toLowerCase();
    const strat = (trade.strategy || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch = instr.includes(q) || strat.includes(q);
    const matchesInstrument = filters.instrument === 'All' || trade.instrument === filters.instrument;
    const matchesStrategy = filters.strategy === 'All' || trade.strategy === filters.strategy;
    const matchesSession = filters.session === 'All' || trade.session === filters.session;
    const matchesResult = filters.result === 'All' || trade.result === filters.result;
    
    return matchesSearch && matchesInstrument && matchesStrategy && matchesSession && matchesResult;
  });

  const openTradeDetails = (trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <div className="h-10 w-64 bg-white/5 rounded-2xl animate-shimmer" />
          <div className="h-12 w-48 bg-white/5 rounded-2xl animate-shimmer" />
        </div>
        <div className="glass-card rounded-[40px] border-white/5 overflow-hidden">
          {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Library size={12} /> Execution Archives
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none text-gradient">
                    The Vault
                </h1>
                <p className="text-[var(--text-secondary)] font-medium mt-3">Comprehensive records of your technical evolution on the charts.</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all duration-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search configurations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[24px] text-sm text-white placeholder:text-white/20 outline-none focus:border-[var(--accent)] focus:bg-white/[0.08] transition-all w-full lg:w-[320px] shadow-inner font-bold"
                    />
                </div>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12 glass-card p-4 rounded-[32px] border-white/5 shadow-premium">
            {[
                { value: filters.instrument, options: INSTRUMENTS, label: 'Pair', key: 'instrument' },
                { value: filters.strategy, options: DEFAULT_STRATEGIES, label: 'Setup', key: 'strategy' },
                { value: filters.session, options: SESSIONS, label: 'Window', key: 'session' },
                { value: filters.result, options: ['Win', 'Loss', 'Break Even'], label: 'Outcome', key: 'result' }
            ].map((f) => (
                <div key={f.key} className="relative group">
                    <select
                        value={f.value}
                        onChange={(e) => setFilters({...filters, [f.key]: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider outline-none focus:border-[var(--accent)] hover:bg-white/[0.08] cursor-pointer transition-all appearance-none"
                    >
                        <option value="All">All {f.label}s</option>
                        {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="rotate-90" />
                    </div>
                </div>
            ))}
            <button 
                onClick={() => setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' })}
                className="flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-white hover:border-white/30 transition-all active:scale-95"
            >
                Clear Filters
            </button>
        </div>

        {filteredTrades.length === 0 ? (
            <div className="glass-card py-24 rounded-[48px] flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mb-8 border border-white/10">
                    <SearchX size={40} className="text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Zero Correlation</h3>
                <p className="text-[var(--text-secondary)] font-medium max-w-xs mx-auto mb-10">No records match your current filter parameters.</p>
                <button 
                    onClick={() => { setSearchTerm(''); setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' }); }}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                    Reset Visual
                </button>
            </div>
        ) : (
            <div className="glass-card rounded-[48px] border-white/5 overflow-hidden shadow-premium stagger-children">
            <table className="w-full text-left hidden lg:table">
                <thead>
                <tr className="bg-white-[0.02] border-b border-white-[0.05]">
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Institutional Configuration</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Setup</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Market Window</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Yield</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center">Outcome</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-right">Settlement</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white-[0.02]">
                {filteredTrades.map((trade) => (
                    <tr 
                    key={trade.id} 
                    onClick={() => openTradeDetails(trade)}
                    className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                    >
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-1.5 h-10 rounded-full shadow-lg ${trade.direction === 'Buy' ? 'bg-[var(--profit)] shadow-emerald-500/20' : 'bg-[var(--loss)] shadow-rose-500/20'}`} />
                            <div>
                                <p className="text-lg font-black text-white tracking-tighter leading-none mb-1.5">{trade.instrument}</p>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${trade.direction === 'Buy' ? 'bg-[var(--profit-bg)] text-[var(--profit)]' : 'bg-[var(--loss-bg)] text-[var(--loss)]'}`}>
                                    <TrendingUp size={10} className={trade.direction === 'Sell' ? 'rotate-180' : ''} /> {trade.direction}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-10 py-6">
                        <span className="text-sm font-black text-white/50 group-hover:text-[var(--accent)] transition-colors tracking-tight">{trade.strategy}</span>
                    </td>
                    <td className="px-10 py-6 text-center">
                        <SessionBadge session={trade.session} />
                    </td>
                    <td className="px-10 py-6 text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl glass-effect border-white/5 text-sm font-black text-white shadow-inner">
                            {trade.rr}R
                        </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                        <ResultBadge result={trade.result} />
                    </td>
                    <td className="px-10 py-6 text-right">
                        <p className="text-xs font-black text-white/80">{new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{new Date(trade.created_at || trade.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-white-[0.02]">
                {filteredTrades.map((trade) => (
                <div 
                    key={trade.id} 
                    onClick={() => openTradeDetails(trade)}
                    className="p-6 active:bg-white/5 transition-colors"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-12 rounded-full ${trade.direction === 'Buy' ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`} />
                            <div>
                                <p className="text-lg font-black text-white tracking-tighter leading-none mb-1">{trade.instrument}</p>
                                <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">{trade.strategy}</p>
                            </div>
                        </div>
                        <ResultBadge result={trade.result} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <SessionBadge session={trade.session} />
                            <span className="text-sm font-black text-white">{trade.rr}R</span>
                        </div>
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}
      </div>

      {/* Trade Detail Modal Overhaul */}
      <ModalContainer 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`${selectedTrade?.instrument} Institutional Analysis`}
        className="max-w-4xl"
      >
        {selectedTrade && (
          <div className="space-y-12 animate-fade-in p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Outcome', value: <ResultBadge result={selectedTrade.result} />, icon: Target },
                    { label: 'Efficiency', value: `${selectedTrade.rr}R`, icon: TrendingUp },
                    { label: 'Window', value: <SessionBadge session={selectedTrade.session} />, icon: Clock },
                    { label: 'Volume', value: `${selectedTrade.pips} Pips`, icon: BarChart3 },
                ].map((item, idx) => (
                    <div key={idx} className="glass-card rounded-[32px] p-6 border-white/5 shadow-inner">
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                           <item.icon size={12} className="text-[var(--accent)]" /> {item.label}
                        </p>
                        <div className="text-xl font-black text-white">{item.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">
                        <Sparkles size={16} className="animate-pulse" /> Precision Entry Data
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Institutional Entry', val: selectedTrade.entry_price || selectedTrade.entryPrice },
                            { label: 'Safety Buffer (SL)', val: selectedTrade.stop_loss || selectedTrade.stopLoss },
                            { label: 'Liquidity Target (TP)', val: selectedTrade.take_profit || selectedTrade.takeProfit }
                        ].map((price, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-3xl glasseffect glass-card border-white/5">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{price.label}</span>
                                <span className="text-lg font-black text-white font-mono">{price.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">
                        <SlidersHorizontal size={16} /> SMC Confluences
                    </h4>
                    <div className="glass-card rounded-[40px] border-white/5 p-8 h-full min-h-[200px]">
                        <div className="flex flex-wrap gap-3">
                            {(selectedTrade.smc_tags || selectedTrade.smcTags)?.length > 0 ? (
                            (selectedTrade.smc_tags || selectedTrade.smcTags).map(tag => (
                                <div key={tag} className="px-5 py-2.5 rounded-2xl bg-[var(--accent)]/5 text-[var(--accent)] text-xs font-black uppercase tracking-widest border border-[var(--accent)]/10">
                                    {tag}
                                </div>
                            ))
                            ) : (
                            <p className="text-sm text-[var(--text-muted)] font-medium italic opacity-50">Zero SMC traces recorded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">
                    <ImageIcon size={16} /> High-Fidelity Capture
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { label: 'Origin Configuration', img: selectedTrade.screenshot_before || selectedTrade.screenshotBefore },
                        { label: 'Final Settlement', img: selectedTrade.screenshot_after || selectedTrade.screenshotAfter }
                    ].map((shot, i) => (
                        <div key={i} className="space-y-4 group">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2">{shot.label}</p>
                            {shot.img ? (
                                <div className="rounded-[40px] overflow-hidden border border-white/10 shadow-premium transition-transform duration-700 group-hover:scale-[1.02]">
                                    <img src={shot.img} className="w-full object-cover" alt={shot.label} />
                                </div>
                            ) : (
                                <div className="aspect-video glass-card border-white/5 rounded-[40px] flex items-center justify-center italic text-xs text-[var(--text-muted)] font-black uppercase tracking-widest opacity-20">NO CAPTURE</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card rounded-[40px] border-white/5 p-10">
                <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-6">
                    <TrendingUp size={16} /> Journal Log
                </h4>
                <p className="text-lg font-medium text-white/70 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedTrade.notes || 'Institutional logic not logged.'}"
                </p>
            </div>

            <button
                onClick={(e) => handleDelete(selectedTrade.id, e)}
                className="w-full py-6 rounded-[32px] bg-rose-500/5 text-rose-500 border border-rose-500/10 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
            >
                <Trash2 size={20} /> Purge This Sequence
            </button>
          </div>
        )}
      </ModalContainer>
    </div>
  );
}
