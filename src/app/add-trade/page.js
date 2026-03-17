'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Check, ArrowLeft, Sparkles
} from 'lucide-react';
import { 
  saveTrade, getStrategies, canAddTrade
} from '@/lib/storage';
import { Crown } from 'lucide-react';
import TradeForm from '@/components/TradeForm';

export default function AddTrade() {
  const router = useRouter();
  const [strategies, setStrategies] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      const data = await getStrategies();
      setStrategies(data);
    };
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let screenshotBeforeUrl = formData.screenshotBefore;
      let screenshotAfterUrl = formData.screenshotAfter;

      const { tradeService } = await import('@/lib/supabase');

      if (formData.screenshotBeforeFile) {
        screenshotBeforeUrl = await tradeService.uploadScreenshot(formData.screenshotBeforeFile, 'before');
      }
      if (formData.screenshotAfterFile) {
        screenshotAfterUrl = await tradeService.uploadScreenshot(formData.screenshotAfterFile, 'after');
      }

      const tradeToSave = {
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
        liquidity_sweep: formData.liquiditySweep,
        notes: formData.notes,
        screenshot_before: screenshotBeforeUrl,
        screenshot_after: screenshotAfterUrl,
        trade_date: new Date(formData.tradeDate).toISOString(),
        emotional_state: formData.emotionalState || null,
        discipline_score: formData.disciplineScore || null,
        rule_adherence: formData.ruleAdherence,
      };

      try {
        await saveTrade(tradeToSave);
      } catch (saveErr) {
        // Fallback for schema mismatches (e.g. discipline_score not yet propagated)
        if (saveErr.message?.includes('discipline_score') || saveErr.code === 'PGRST204') {
          console.warn('Persistence mismatch detected. Deploying fallback sequence...');
          const { emotional_state, discipline_score, rule_adherence, ...fallbackTrade } = tradeToSave;
          await saveTrade(fallbackTrade);
        } else {
          throw saveErr;
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      // Pass error back to form if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-[1440px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 px-2">
            <div className="flex-1">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-8 hover:text-[var(--foreground)] hover:border-[var(--accent)]/30 transition-all group w-fit leading-relaxed"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse leading-relaxed">
                        <Sparkles size={12} /> Execution Profile
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-none text-gradient mb-4">
                    New Entry Log
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">Log your institutional setups with millisecond precision.</p>
            </div>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[48px] animate-scale-in">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
              <Check className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tighter mb-2">Committed to Vault</h2>
            <p className="text-[var(--text-secondary)] font-medium">Your sequence has been archived with institutional precision.</p>
          </div>
        ) : (
          <TradeForm 
            strategies={strategies}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Log Sequence"
          />
        )}

      </div>
    </div>
  );
}
