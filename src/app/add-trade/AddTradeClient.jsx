'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Check, ArrowLeft, Sparkles, AlertCircle
} from 'lucide-react';
import { 
  saveTrade, getStrategies, canAddTrade, getTrades
} from '@/lib/storage';
import { posthog } from '@/lib/posthog';
import { Crown } from 'lucide-react';
import TradeForm from '@/components/TradeForm';

export default function AddTrade() {
  const router = useRouter();
  const [strategies, setStrategies] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitProgress, setSubmitProgress] = useState(''); // New progress indicator
  useEffect(() => {
    const loadData = async () => {
      const res = await getStrategies();
      setStrategies(res.success ? res.data : []);
    };
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let screenshotBeforeUrl = formData.screenshotBefore;
      let screenshotAfterUrl = formData.screenshotAfter;

      const { tradeService } = await import('@/lib/supabase');
      
      // Add a timeout helper
      const withTimeout = (promise, ms, actionName) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error(`${actionName} timed out after ${ms/1000}s`)), ms))
        ]);
      };

      // Add a simple image compression helper
      const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas to Blob failed'));
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }, 'image/jpeg', quality);
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (err) => reject(err);
        });
      };

      if (formData.screenshotBeforeFile) {
        setSubmitProgress('Optimizing setup configuration...');
        const compressed = await compressImage(formData.screenshotBeforeFile).catch(err => {
          console.warn('Compression failed, using original:', err);
          return formData.screenshotBeforeFile;
        });
        
        setSubmitProgress('Uploading setup configuration...');
        screenshotBeforeUrl = await withTimeout(
          tradeService.uploadScreenshot(compressed, 'before'),
          45000, 
          'Image upload (before)'
        );
      }
      if (formData.screenshotAfterFile) {
        setSubmitProgress('Optimizing settlement view...');
        const compressed = await compressImage(formData.screenshotAfterFile).catch(err => {
          console.warn('Compression failed, using original:', err);
          return formData.screenshotAfterFile;
        });

        setSubmitProgress('Uploading settlement view...');
        screenshotAfterUrl = await withTimeout(
          tradeService.uploadScreenshot(compressed, 'after'),
          45000,
          'Image upload (after)'
        );
      }

      setSubmitProgress('Archiving to institutional vault...');

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
        setup_zone: formData.setupZone || formData.setup_zone || null,
        poi_type: formData.poi_type || null,
        timeframe_bias: formData.timeframe_bias || null,
        bias_type: formData.bias_type || null,
      };

      try {
        const res = await withTimeout(saveTrade(tradeToSave), 15000, 'Database save');
        if (!res.success) throw new Error(res.error);
        
        setSubmitProgress('Deduplicating local cache...');
        // Track Event
        const [tradesRes] = await Promise.all([
          withTimeout(getTrades(), 5000, 'Cache sync').catch(() => ({ success: false })),
          posthog.capture('trade_logged', {
            instrument: tradeToSave.instrument,
            result: tradeToSave.result,
            rr: tradeToSave.rr
          })
        ]);
        
        const allTrades = tradesRes?.success ? tradesRes.data : [];
        if (allTrades.length === 1) {
          posthog.capture('first_trade_logged');
        }
      } catch (saveErr) {
        // Fallback for schema mismatches — strips all optional psychology/new columns on any schema error
        // Includes: PGRST204 (Missing column), 42703 (Undefined column), 23514 (Check constraint violation - e.g. poi_type)
        const isSchemaError = saveErr.code === 'PGRST204' || 
                             saveErr.code === '42703' || 
                             saveErr.code === '23514' ||
                             saveErr.message?.toLowerCase().includes('column') || 
                             saveErr.message?.toLowerCase().includes('schema') ||
                             saveErr.message?.toLowerCase().includes('constraint');

        if (isSchemaError) {
          console.warn('[TRADE_LOG] Schema/Constraint mismatch — retrying with legacy core fields only:', saveErr.message);
          
          // Strip ALL non-core fields to ensure a successful retry on older schemas
          const { 
            emotional_state, discipline_score, rule_adherence, 
            setup_zone, liquidity_sweep, trade_date,
            poi_type, timeframe_bias, bias_type,
            ...fallbackTrade 
          } = tradeToSave;

          const fallbackRes = await saveTrade(fallbackTrade);
          if (!fallbackRes.success) {
            console.error('[TRADE_LOG] Fallback also failed:', fallbackRes.error);
            throw new Error(fallbackRes.error);
          }
        } else {
          throw saveErr;
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('[TRADE_LOG] Submission error:', err);
      const msg = err?.message || 'Failed to save trade. Please check your connection and try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto animate-fade-in pb-24 md:pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 md:mb-16 px-2">
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
                <h1 className="text-2xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-none text-gradient mb-4">
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
          <>
            {submitError && (
              <div className="mb-6 p-4 bg-[#EF444410] border border-[#EF444420] rounded-2xl flex items-center gap-3 text-[var(--loss)] animate-slide-up">
                <AlertCircle size={20} />
                <p className="text-xs font-bold leading-tight">{submitError}</p>
              </div>
            )}
            <TradeForm 
              strategies={strategies}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Log Sequence"
              progressMessage={submitProgress}
            />
          </>
        )}

      </div>
    </div>
  );
}
