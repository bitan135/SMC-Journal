'use client';

import { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Library, Trash2, TrendingUp, Target, Clock, Image as ImageIcon, SearchX, Sparkles, ChevronRight, BarChart3, Edit3, X, Brain, Smile, Frown, Shield, Zap
} from 'lucide-react';
import { getTrades, deleteTrade, updateTrade, getStrategies, INSTRUMENTS, SESSIONS, DEFAULT_STRATEGIES } from '@/lib/storage';
import ResultBadge from '@/components/ui/ResultBadge';
import SessionBadge from '@/components/ui/SessionBadge';
import ModalContainer from '@/components/ui/ModalContainer';
import { TableRowSkeleton } from '@/components/ui/SkeletonLoader';
import TradeForm from '@/components/TradeForm';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedTrades, fetchedStrategies] = await Promise.all([
          getTrades(),
          getStrategies()
        ]);
        setTrades(fetchedTrades.sort((a, b) => 
          new Date(b.trade_date || b.created_at) - new Date(a.trade_date || a.created_at)
        ));
        setStrategies(fetchedStrategies);
      } catch (err) {
        console.error('Library load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    showConfirm({
      title: 'Delete Trade',
      message: 'This trade will be permanently removed from your vault. This action cannot be undone.',
      confirmLabel: 'Delete Trade',
      onConfirm: async () => {
        try {
          await deleteTrade(id);
          setTrades(prev => prev.filter(t => t.id !== id));
          setIsModalOpen(false);
          showToast('Trade removed from vault.', 'success');
        } catch (err) {
          showToast('Failed to delete trade.', 'error');
        }
      }
    });
  };

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    try {
      let screenshotBeforeUrl = formData.screenshotBefore;
      let screenshotAfterUrl = formData.screenshotAfter;

      const { tradeService } = await import('@/lib/supabase');

      // Upload new screenshots if files are provided
      if (formData.screenshotBeforeFile) {
        screenshotBeforeUrl = await tradeService.uploadScreenshot(formData.screenshotBeforeFile, 'before');
      }
      if (formData.screenshotAfterFile) {
        screenshotAfterUrl = await tradeService.uploadScreenshot(formData.screenshotAfterFile, 'after');
      }

      const updates = {
        instrument: formData.instrument,
        direction: formData.direction,
        entry_price: parseFloat(formData.entryPrice),
        stop_loss: parseFloat(formData.stopLoss),
        take_profit: parseFloat(formData.takeProfit),
        lot_size: parseFloat(formData.lotSize),
        result: formData.result,
        rr: formData.rr,
        pips: formData.pips,
        session: formData.session,
        strategy: formData.strategy,
        smc_tags: formData.smcTags,
        notes: formData.notes,
        screenshot_before: screenshotBeforeUrl,
        screenshot_after: screenshotAfterUrl,
        trade_date: new Date(formData.tradeDate).toISOString(),
        emotional_state: formData.emotionalState || null,
        discipline_score: formData.disciplineScore || null,
        rule_adherence: formData.ruleAdherence,
      };

      const updated = await updateTrade(selectedTrade.id, updates);
      
      setTrades(prev => prev.map(t => t.id === selectedTrade.id ? updated : t));
      setSelectedTrade(updated);
      setIsEditMode(false);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

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

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const pagedTrades = filteredTrades.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openTradeDetails = (trade) => {
    setSelectedTrade(trade);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="flex items-center justify-between mb-12">
          <div className="h-10 w-64 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl animate-shimmer" />
          <div className="h-12 w-48 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl animate-shimmer" />
        </div>
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] overflow-hidden">
          {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-[1440px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent)]/5 blur-[150px] rounded-full animate-float pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                        <Library size={12} /> Execution Archives
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-tight text-gradient">
                    The Vault
                </h1>
                <p className="text-[var(--text-secondary)] font-medium mt-3">Comprehensive records of your technical evolution on the charts.</p>
                {!isLoading && trades.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                      {trades.length} Execution{trades.length !== 1 ? 's' : ''} Archived
                    </span>
                  </div>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-all duration-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search configurations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-14 pr-6 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[24px] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all w-full lg:w-[320px] shadow-inner font-bold"
                    />
                </div>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12 glass-card p-4 rounded-[32px] border-[var(--glass-border)] shadow-premium">
            {[
                { value: filters.instrument, options: INSTRUMENTS, label: 'Pair', key: 'instrument' },
                { value: filters.strategy, options: [...new Set([...DEFAULT_STRATEGIES, ...strategies])], label: 'Setup', key: 'strategy' },
                { value: filters.session, options: SESSIONS, label: 'Window', key: 'session' },
                { value: filters.result, options: ['Win', 'Loss', 'Break Even'], label: 'Outcome', key: 'result' }
            ].map((f) => (
                <div key={f.key} className="relative group">
                    <select
                        value={f.value}
                        onChange={(e) => setFilters({...filters, [f.key]: e.target.value})}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-5 py-3 text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider outline-none focus:border-[var(--accent)] hover:bg-[var(--card-hover)] cursor-pointer transition-all appearance-none"
                    >
                        <option key="all" value="All" className="bg-[var(--background)]">All {f.label}s</option>
                        {f.options.map(opt => <option key={opt} value={opt} className="bg-[var(--background)]">{opt}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="rotate-90" />
                    </div>
                </div>
            ))}
            <button 
                onClick={() => setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' })}
                className="flex items-center justify-center border border-dashed border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-[var(--glass-border)] transition-all active:scale-95"
            >
                Clear Filters
            </button>
        </div>

        {filteredTrades.length === 0 ? (
            <div className="glass-card py-24 rounded-[48px] flex flex-col items-center justify-center text-center px-6 bg-[var(--glass-bg)]">
                <div className="w-20 h-20 bg-[var(--glass-bg)] rounded-[32px] flex items-center justify-center mb-8 border border-[var(--glass-border)]">
                    <SearchX size={40} className="text-[var(--text-muted)]" />
                </div>
                <h3 className="text-xl font-black text-[var(--foreground)] mb-2 uppercase tracking-tighter">Zero Correlation</h3>
                <p className="text-[var(--text-secondary)] font-medium max-w-xs mx-auto mb-10">No records match your current filter parameters.</p>
                <button 
                    onClick={() => { setSearchTerm(''); setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' }); }}
                    className="px-8 py-3 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all"
                >
                    Reset Visual
                </button>
            </div>
        ) : (
            <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium stagger-children">
            <table className="w-full text-left hidden lg:table">
                <thead>
                <tr className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)]">
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] leading-relaxed">Institutional Configuration</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] leading-relaxed">Setup</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center leading-relaxed">Market Window</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center leading-relaxed">Yield</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-center leading-relaxed">Outcome</th>
                    <th className="px-10 py-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] text-right leading-relaxed">Settlement</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                {pagedTrades.map((trade) => (
                    <tr 
                    key={trade.id} 
                    onClick={() => openTradeDetails(trade)}
                    className="group hover:bg-[var(--glass-bg)] transition-all cursor-pointer"
                    >
                    <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                            <div className={`w-1.5 h-10 rounded-full shadow-lg ${trade.direction === 'Buy' ? 'bg-[var(--profit)] shadow-emerald-500/20' : 'bg-[var(--loss)] shadow-rose-500/20'}`} />
                            <div>
                                <p className="text-lg font-black text-[var(--foreground)] tracking-tighter leading-none mb-1.5">{trade.instrument}</p>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${trade.direction === 'Buy' ? 'bg-[var(--profit-bg)] text-[var(--profit)]' : 'bg-[var(--loss-bg)] text-[var(--loss)]'}`}>
                                    <TrendingUp size={10} className={trade.direction === 'Sell' ? 'rotate-180' : ''} /> {trade.direction}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-10 py-6">
                        <span className="text-sm font-black text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors tracking-tight">{trade.strategy}</span>
                    </td>
                    <td className="px-10 py-6 text-center">
                        <SessionBadge session={trade.session} />
                    </td>
                    <td className="px-10 py-6 text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl glass-effect border-[var(--glass-border)] text-sm font-black text-[var(--foreground)] shadow-inner">
                            {trade.rr}R
                        </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                        <ResultBadge result={trade.result} />
                    </td>
                    <td className="px-10 py-6 text-right">
                        <p className="text-xs font-black text-[var(--foreground)] opacity-80">{new Date(trade.trade_date || trade.tradeDate || trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{new Date(trade.trade_date || trade.tradeDate || trade.created_at || trade.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[var(--glass-border)]">
                {pagedTrades.map((trade) => (
                <div 
                    key={trade.id} 
                    onClick={() => openTradeDetails(trade)}
                    className="p-6 active:bg-[var(--glass-bg)] transition-colors"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-12 rounded-full ${trade.direction === 'Buy' ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`} />
                            <div>
                                <p className="text-lg font-black text-[var(--foreground)] tracking-tighter leading-none mb-1">{trade.instrument}</p>
                                <p className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider">{trade.strategy}</p>
                            </div>
                        </div>
                        <ResultBadge result={trade.result} />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                        <div className="flex items-center gap-4">
                            <SessionBadge session={trade.session} />
                            <span className="text-sm font-black text-[var(--foreground)]">{trade.rr}R</span>
                        </div>
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                                currentPage === i + 1 
                                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20' 
                                    : 'glass-card border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--accent)]/30'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card border-[var(--glass-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}
      </div>

      {/* Trade Detail / Edit Modal */}
      <ModalContainer 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setIsEditMode(false); }}
        title={isEditMode ? `Modify ${selectedTrade?.instrument} Sequence` : `${selectedTrade?.instrument} Institutional Analysis`}
        className="max-w-4xl"
      >
        {selectedTrade && (
          <div className="space-y-12 animate-fade-in p-2">
            {isEditMode ? (
              <div className="animate-fade-in pt-4">
                <button 
                  onClick={() => setIsEditMode(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-8 hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all group"
                >
                  <X size={14} /> Discard Changes
                </button>
                <TradeForm 
                  initialData={selectedTrade}
                  strategies={strategies}
                  onSubmit={handleUpdate}
                  isSubmitting={isSubmitting}
                  submitLabel="Refine Execution"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Outcome', value: <ResultBadge result={selectedTrade.result} />, icon: Target },
                        { label: 'Efficiency', value: `${selectedTrade.rr}R`, icon: TrendingUp },
                        { label: 'Window', value: <SessionBadge session={selectedTrade.session} />, icon: Clock },
                        { label: 'Volume', value: `${selectedTrade.pips} Pips`, icon: BarChart3 },
                    ].map((item, idx) => (
                        <div key={idx} className="glass-card rounded-[32px] p-6 border-[var(--glass-border)] shadow-inner">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                               <item.icon size={12} className="text-[var(--accent)]" /> {item.label}
                            </p>
                            <div className="text-xl font-black text-[var(--foreground)]">{item.value}</div>
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
                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl glasseffect glass-card border-[var(--glass-border)]">
                                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{price.label}</span>
                                    <span className="text-lg font-black text-[var(--foreground)] font-mono">{price.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">
                            <SlidersHorizontal size={16} /> SMC Confluences
                        </h4>
                        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 h-full min-h-[200px]">
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

                {/* Psychology Profile Section */}
                {(selectedTrade.emotional_state || selectedTrade.discipline_score !== null || selectedTrade.rule_adherence !== null) && (
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em]">
                      <Brain size={16} /> Psychology Profile
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedTrade.emotional_state && (
                        <div className="glass-card rounded-[28px] p-5 border-[var(--glass-border)]">
                          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking- Brace[0.2em] mb-3">State</p>
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            selectedTrade.emotional_state === 'Focused' || selectedTrade.emotional_state === 'Neutral'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : selectedTrade.emotional_state === 'FOMO' || selectedTrade.emotional_state === 'Greed' || selectedTrade.emotional_state === 'Revenge'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          }`}>
                            {selectedTrade.emotional_state}
                          </span>
                        </div>
                      )}
                      {selectedTrade.discipline_score !== null && selectedTrade.discipline_score !== undefined && (
                        <div className="glass-card rounded-[28px] p-5 border-[var(--glass-border)]">
                          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3">Discipline</p>
                          <p className="text-xl font-black text-[var(--foreground)]">
                            {selectedTrade.discipline_score}<span className="text-[10px] text-[var(--text-muted)] font-bold">/5</span>
                          </p>
                        </div>
                      )}
                      {selectedTrade.rule_adherence !== null && selectedTrade.rule_adherence !== undefined && (
                        <div className="glass-card rounded-[28px] p-5 border-[var(--glass-border)]">
                          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3">Rules</p>
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            selectedTrade.rule_adherence
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {selectedTrade.rule_adherence ? 'Followed' : 'Broken'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                                    <div className="rounded-[40px] overflow-hidden border border-[var(--glass-border)] shadow-premium transition-transform duration-700 group-hover:scale-[1.02]">
                                        <img src={shot.img} className="w-full object-cover" alt={shot.label} />
                                    </div>
                                ) : (
                                    <div className="aspect-video glass-card border-[var(--glass-border)] rounded-[40px] flex items-center justify-center italic text-xs text-[var(--text-muted)] font-black uppercase tracking-widest opacity-20">NO CAPTURE</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-10 h-full">
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8">
                            <TrendingUp size={16} /> Journal Log
                        </h4>
                        <p className="text-lg font-medium text-[var(--text-secondary)] leading-relaxed italic whitespace-pre-wrap">
                            &ldquo;{selectedTrade.notes || 'Institutional logic not logged.'}&rdquo;
                        </p>
                    </div>
                    
                    <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-10">
                        <h4 className="flex items-center gap-3 text-[11px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8">
                            <Brain size={16} /> Psychological Reflection
                        </h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Emotional State</span>
                                <span className="flex items-center gap-2 text-xs font-black text-[var(--foreground)] uppercase">
                                    <Zap size={12} className="text-amber-500" />
                                    {selectedTrade.emotional_state || selectedTrade.emotionalState || 'Focused'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Discipline Score</span>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className={`w-3 h-1 rounded-full ${i <= (selectedTrade.discipline_score || selectedTrade.disciplineScore || 5) ? 'bg-[var(--accent)]' : 'bg-[var(--glass-border)]'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className={`flex items-center justify-between p-6 rounded-[24px] border ${
                                (selectedTrade.rule_adherence ?? selectedTrade.ruleAdherence ?? true)
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                    : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                            }`}>
                                <div className="flex items-center gap-3">
                                    {(selectedTrade.rule_adherence ?? selectedTrade.ruleAdherence ?? true) ? <Smile size={18} /> : <Frown size={18} />}
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {(selectedTrade.rule_adherence ?? selectedTrade.ruleAdherence ?? true) ? 'Protocol Followed' : 'Impulsive / Rule Break'}
                                    </span>
                                </div>
                                <Shield size={16} className="opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="w-full py-6 rounded-[32px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[var(--accent)]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                    >
                        <Edit3 size={20} /> Modify Sequence
                    </button>
                    <button
                        onClick={(e) => handleDelete(selectedTrade.id, e)}
                        className="w-full py-6 rounded-[32px] bg-rose-500/5 text-rose-500 border border-rose-500/10 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                    >
                        <Trash2 size={20} /> Delete Trade
                    </button>
                </div>
              </>
            )}
          </div>
        )}
      </ModalContainer>
    </div>
  );
}
