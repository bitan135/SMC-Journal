'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Search, Filter, X, Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Eye,
} from 'lucide-react';
import { getTrades, INSTRUMENTS, SESSIONS } from '@/lib/storage';

function TradeDetailModal({ trade, onClose }) {
  if (!trade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-[var(--card)] rounded-2xl border border-[var(--border)] w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[var(--text-primary)]">{trade.instrument}</span>
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
              trade.direction === 'Buy' ? 'bg-[var(--profit)]/15 text-[var(--profit)]' : 'bg-[var(--loss)]/15 text-[var(--loss)]'
            }`}>
              {trade.direction === 'Buy' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trade.direction}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Result Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
            trade.result === 'Win'
              ? 'bg-[var(--profit)]/15 text-[var(--profit)]'
              : trade.result === 'Loss'
                ? 'bg-[var(--loss)]/15 text-[var(--loss)]'
                : 'bg-[var(--neutral)]/15 text-[var(--neutral)]'
          }`}>
            {trade.result} • {trade.rr}R
          </div>

          {/* Trade Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Entry', value: trade.entryPrice },
              { label: 'Stop Loss', value: trade.stopLoss },
              { label: 'Take Profit', value: trade.takeProfit },
              { label: 'Lot Size', value: trade.lotSize },
              { label: 'Session', value: trade.session },
              { label: 'Strategy', value: trade.strategy },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[var(--input-bg)] rounded-lg p-3">
                <p className="text-xs text-[var(--text-muted)]">{label}</p>
                <p className="text-sm font-medium text-[var(--text-primary)] mt-0.5">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* SMC Tags */}
          {trade.smcTags?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">SMC Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {trade.smcTags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[var(--accent)]/15 text-[var(--accent)] text-xs rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Screenshots */}
          {(trade.screenshotBefore || trade.screenshotAfter) && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Screenshots</p>
              <div className="grid grid-cols-2 gap-3">
                {trade.screenshotBefore && (
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] mb-1">Before</p>
                    <img src={trade.screenshotBefore} alt="Before trade" className="w-full rounded-lg" />
                  </div>
                )}
                {trade.screenshotAfter && (
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] mb-1">After</p>
                    <img src={trade.screenshotAfter} alt="After trade" className="w-full rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Notes</p>
              <p className="text-sm text-[var(--text-secondary)] bg-[var(--input-bg)] rounded-lg p-3">{trade.notes}</p>
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-[var(--text-muted)]">
            {new Date(trade.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            {' '} at {new Date(trade.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    instrument: '',
    strategy: '',
    session: '',
    result: '',
  });

  useEffect(() => {
    setTrades(getTrades());
    setIsLoaded(true);
  }, []);

  const strategies = useMemo(() => [...new Set(trades.map(t => t.strategy).filter(Boolean))], [trades]);

  const filteredTrades = useMemo(() => {
    return trades
      .filter(t => {
        if (filters.instrument && t.instrument !== filters.instrument) return false;
        if (filters.strategy && t.strategy !== filters.strategy) return false;
        if (filters.session && t.session !== filters.session) return false;
        if (filters.result && t.result !== filters.result) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            t.instrument?.toLowerCase().includes(q) ||
            t.strategy?.toLowerCase().includes(q) ||
            t.notes?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [trades, filters, search]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const clearFilters = () => setFilters({ instrument: '', strategy: '', session: '', result: '' });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Trade Library</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{filteredTrades.length} of {trades.length} trades</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trades..."
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              showFilters || hasActiveFilters
                ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30'
                : 'bg-[var(--card)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 mb-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select
              value={filters.instrument}
              onChange={(e) => setFilters(f => ({ ...f, instrument: e.target.value }))}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">All Instruments</option>
              {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select
              value={filters.strategy}
              onChange={(e) => setFilters(f => ({ ...f, strategy: e.target.value }))}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">All Strategies</option>
              {strategies.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.session}
              onChange={(e) => setFilters(f => ({ ...f, session: e.target.value }))}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">All Sessions</option>
              {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filters.result}
              onChange={(e) => setFilters(f => ({ ...f, result: e.target.value }))}
              className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">All Results</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Break Even">Break Even</option>
            </select>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-3 text-xs text-[var(--accent)] hover:underline">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {['Pair', 'Strategy', 'Session', 'Direction', 'RR', 'Result', 'Date', ''].map(col => (
                <th key={col} className="text-left px-4 py-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade, i) => (
              <tr
                key={trade.id}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                onClick={() => setSelectedTrade(trade)}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{trade.instrument}</span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{trade.strategy || '—'}</td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{trade.session || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    trade.direction === 'Buy' ? 'text-[var(--profit)]' : 'text-[var(--loss)]'
                  }`}>
                    {trade.direction === 'Buy' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trade.direction}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{trade.rr}R</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                    trade.result === 'Win'
                      ? 'bg-[var(--profit)]/15 text-[var(--profit)]'
                      : trade.result === 'Loss'
                        ? 'bg-[var(--loss)]/15 text-[var(--loss)]'
                        : 'bg-[var(--neutral)]/15 text-[var(--neutral)]'
                  }`}>
                    {trade.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                  {new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <Eye size={14} className="text-[var(--text-muted)]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTrades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <Search size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No trades found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filteredTrades.map(trade => (
          <div
            key={trade.id}
            onClick={() => setSelectedTrade(trade)}
            className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]/30 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">{trade.instrument}</span>
                <span className={`flex items-center gap-0.5 text-xs ${
                  trade.direction === 'Buy' ? 'text-[var(--profit)]' : 'text-[var(--loss)]'
                }`}>
                  {trade.direction === 'Buy' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {trade.direction}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                trade.result === 'Win'
                  ? 'bg-[var(--profit)]/15 text-[var(--profit)]'
                  : trade.result === 'Loss'
                    ? 'bg-[var(--loss)]/15 text-[var(--loss)]'
                    : 'bg-[var(--neutral)]/15 text-[var(--neutral)]'
              }`}>
                {trade.result}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span>{trade.strategy || '—'}</span>
              <span>•</span>
              <span>{trade.session || '—'}</span>
              <span>•</span>
              <span className="font-medium text-[var(--text-secondary)]">{trade.rr}R</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              {new Date(trade.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        ))}

        {filteredTrades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
            <Search size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No trades found</p>
          </div>
        )}
      </div>

      {/* Trade Detail Modal */}
      <TradeDetailModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
    </div>
  );
}
