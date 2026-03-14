'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, Eye, Trash2, Calendar, TrendingUp, Target, Clock, Image as ImageIcon
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
    const matchesSearch = trade.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-48 bg-[var(--card)] rounded-lg animate-shimmer" />
          <div className="h-10 w-32 bg-[var(--card)] rounded-lg animate-shimmer" />
        </div>
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {[1,2,3,4,5].map(i => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Trade Library</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Archive of your executed setups and performance data</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search instruments or strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-all w-full md:w-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8 bg-[var(--card)] p-3 rounded-2xl border border-[var(--border)] shadow-sm">
        <select
          value={filters.instrument}
          onChange={(e) => setFilters({...filters, instrument: e.target.value})}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="All">All Instruments</option>
          {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select
          value={filters.strategy}
          onChange={(e) => setFilters({...filters, strategy: e.target.value})}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="All">All Strategies</option>
          {[...DEFAULT_STRATEGIES].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.session}
          onChange={(e) => setFilters({...filters, session: e.target.value})}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="All">All Sessions</option>
          {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.result}
          onChange={(e) => setFilters({...filters, result: e.target.value})}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="All">All Results</option>
          <option value="Win">Wins</option>
          <option value="Loss">Losses</option>
          <option value="Break Even">Break Even</option>
        </select>
        <button 
          onClick={() => setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' })}
          className="md:col-span-1 lg:col-span-1 border border-dashed border-[var(--border)] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
        >
          Reset Filters
        </button>
      </div>

      {filteredTrades.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching trades"
          description="Try adjusting your filters or search term to find what you're looking for."
          actionLabel="Clear Search"
          onAction={() => { setSearchTerm(''); setFilters({ instrument: 'All', strategy: 'All', session: 'All', result: 'All' }); }}
        />
      ) : (
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl">
          {/* Desktop Table */}
          <table className="w-full text-left hidden md:table">
            <thead>
              <tr className="bg-[var(--background)]/50 border-b border-[var(--border)]">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Pair</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Strategy</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Session</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">RR</th>
                <th className="px-4 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Result</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredTrades.map((trade) => (
                <tr 
                  key={trade.id} 
                  onClick={() => openTradeDetails(trade)}
                  className="group hover:bg-[var(--card-hover)]/40 transition-all cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-8 rounded-full ${trade.direction === 'Buy' ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`} />
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{trade.instrument}</p>
                        <p className={`text-[10px] font-bold uppercase ${trade.direction === 'Buy' ? 'text-[var(--profit)]' : 'text-[var(--loss)]'}`}>{trade.direction}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">{trade.strategy}</td>
                  <td className="px-6 py-4 text-center">
                    <SessionBadge session={trade.session} />
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-sm text-[var(--text-primary)]">{trade.rr}R</td>
                  <td className="px-4 py-4 text-center">
                    <ResultBadge result={trade.result} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-bold text-[var(--text-muted)]">{new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-[var(--text-muted)] opacity-60 font-medium">{new Date(trade.created_at || trade.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-[var(--border)]">
            {filteredTrades.map((trade) => (
              <div 
                key={trade.id} 
                onClick={() => openTradeDetails(trade)}
                className="p-4 active:bg-[var(--card-hover)] transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full ${trade.direction === 'Buy' ? 'bg-[var(--profit)]' : 'bg-[var(--loss)]'}`} />
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{trade.instrument}</p>
                      <p className="text-xs text-[var(--text-muted)]">{trade.strategy}</p>
                    </div>
                  </div>
                  <ResultBadge result={trade.result} />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] border-t border-[var(--border)] pt-3">
                  <div className="flex items-center gap-4">
                    <SessionBadge session={trade.session} />
                    <span>{trade.rr}R</span>
                  </div>
                  <span>{new Date(trade.created_at || trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Detail Modal */}
      <ModalContainer 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`${selectedTrade?.instrument} ${selectedTrade?.direction} Details`}
      >
        {selectedTrade && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Result</p>
                <ResultBadge result={selectedTrade.result} />
              </div>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Risk Reward</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{selectedTrade.rr}R</p>
              </div>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Session</p>
                <SessionBadge session={selectedTrade.session} />
              </div>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Pips</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">{selectedTrade.pips}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                <Target size={14} /> 
                Entry Context
              </h4>
              <div className="grid grid-cols-3 gap-6 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Entry</p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{selectedTrade.entry_price || selectedTrade.entryPrice}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Stop Loss</p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{selectedTrade.stop_loss || selectedTrade.stopLoss}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Take Profit</p>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{selectedTrade.take_profit || selectedTrade.takeProfit}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                <SlidersHorizontal size={14} /> 
                SMC Trace
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTrade.smc_tags?.length > 0 ? (
                  selectedTrade.smc_tags.map(tag => <TagBadge key={tag} tag={tag} />)
                ) : selectedTrade.smcTags?.length > 0 ? (
                  selectedTrade.smcTags.map(tag => <TagBadge key={tag} tag={tag} />)
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">No tags recorded.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                <TrendingUp size={14} /> 
                Journal Notes
              </h4>
              <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-6">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic whitespace-pre-wrap">
                  "{selectedTrade.notes || 'No journal notes for this trade.'}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
                <ImageIcon size={14} /> 
                Evidence (Screenshots)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Before Setup</p>
                  {selectedTrade.screenshot_before || selectedTrade.screenshotBefore ? (
                    <img src={selectedTrade.screenshot_before || selectedTrade.screenshotBefore} className="rounded-2xl border border-[var(--border)] w-full shadow-lg" alt="before" />
                  ) : (
                    <div className="aspect-video bg-[var(--background)] border border-[var(--border)] rounded-2xl flex items-center justify-center italic text-xs text-[var(--text-muted)]">No screenshot</div>
                  )}
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Post Result</p>
                  {selectedTrade.screenshot_after || selectedTrade.screenshotAfter ? (
                    <img src={selectedTrade.screenshot_after || selectedTrade.screenshotAfter} className="rounded-2xl border border-[var(--border)] w-full shadow-lg" alt="after" />
                  ) : (
                    <div className="aspect-video bg-[var(--background)] border border-[var(--border)] rounded-2xl flex items-center justify-center italic text-xs text-[var(--text-muted)]">No screenshot</div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => handleDelete(selectedTrade.id, e)}
              className="w-full py-4 rounded-2xl bg-[#EF444410] text-[var(--loss)] border border-[#EF444420] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#EF444420] transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Permanently
            </button>
          </div>
        )}
      </ModalContainer>
    </div>
  );
}
