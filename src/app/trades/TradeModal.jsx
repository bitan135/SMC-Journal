'use client';

import { Target, TrendingUp, Clock, BarChart3, Edit3, Trash2, Sparkles, SlidersHorizontal, Brain, ImageIcon, Zap, Smile, Frown, Shield, X } from 'lucide-react';
import Image from 'next/image';
import ModalContainer from '@/components/ui/ModalContainer';
import TradeForm from '@/components/trade/TradeForm';
import ResultBadge from '@/components/ui/ResultBadge';
import SessionBadge from '@/components/ui/SessionBadge';

export default function TradeModal({ 
  isOpen, 
  onClose, 
  selectedTrade, 
  isEditMode, 
  setIsEditMode, 
  strategies, 
  handleUpdate, 
  handleDelete, 
  isSubmitting 
}) {
  if (!selectedTrade) return null;

  return (
    <ModalContainer 
      isOpen={isOpen} 
      onClose={onClose}
      title={isEditMode ? `Modify ${selectedTrade.instrument} Sequence` : `${selectedTrade.instrument} Institutional Analysis`}
      className="max-w-4xl"
    >
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
                    <div key={idx} className="glass-card rounded-[28px] p-6 border-[var(--glass-border)] shadow-inner">
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
                        {(() => {
                            const instr = (selectedTrade.instrument || '').toUpperCase();
                            const formatPrice = (val) => {
                                if (val == null || val === '') return '—';
                                const num = parseFloat(val);
                                if (isNaN(num)) return val;
                                // Preserve full precision based on instrument
                                if (instr.includes('JPY')) return num.toFixed(3);
                                if (instr.includes('XAU') || instr.includes('GOLD')) return num.toFixed(2);
                                if (instr.includes('XAG') || instr.includes('SILVER')) return num.toFixed(3);
                                if (instr.includes('NAS') || instr.includes('US30') || instr.includes('SPX') || instr.includes('GER') || instr.includes('UK100')) return num.toFixed(1);
                                if (instr.includes('BTC') || instr.includes('ETH') || instr.includes('SOL') || instr.includes('BNB')) return num.toFixed(2);
                                // Standard forex (EURUSD, GBPUSD, etc.) — 5 decimals
                                return num.toFixed(5);
                            };
                            return [
                                { label: 'Institutional Entry', val: formatPrice(selectedTrade.entry_price || selectedTrade.entryPrice) },
                                { label: 'Safety Buffer (SL)', val: formatPrice(selectedTrade.stop_loss || selectedTrade.stopLoss) },
                                { label: 'Liquidity Target (TP)', val: formatPrice(selectedTrade.take_profit || selectedTrade.takeProfit) }
                            ].map((price, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-[28px] glass-card border-[var(--glass-border)]">
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">{price.label}</span>
                                <span className="text-lg font-black text-[var(--foreground)] font-mono">{price.val}</span>
                            </div>
                            ));
                        })()}
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
                                <div className="rounded-[40px] overflow-hidden border border-[var(--glass-border)] shadow-premium transition-transform duration-700 group-hover:scale-[1.02] relative aspect-video">
                                    <Image 
                                      src={shot.img} 
                                      alt={shot.label}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                      priority={i === 0}
                                    />
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
                        <div className="flex items-center justify-between p-4 rounded-[20px] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Emotional State</span>
                            <span className="flex items-center gap-2 text-xs font-black text-[var(--foreground)] uppercase">
                                <Zap size={12} className="text-amber-500" />
                                {selectedTrade.emotional_state || selectedTrade.emotionalState || 'Focused'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-[20px] bg-[var(--glass-bg)] border border-[var(--glass-border)]">
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
                    className="w-full py-6 rounded-[28px] bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[var(--accent)]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                >
                    <Edit3 size={20} /> Modify Sequence
                </button>
                <button
                    onClick={(e) => handleDelete(selectedTrade.id, e)}
                    className="w-full py-6 rounded-[28px] bg-rose-500/5 text-rose-500 border border-rose-500/10 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                >
                    <Trash2 size={20} /> Delete Trade
                </button>
            </div>
          </>
        )}
      </div>
    </ModalContainer>
  );
}
