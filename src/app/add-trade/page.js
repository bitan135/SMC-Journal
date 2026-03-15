'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Camera, Check, AlertCircle, TrendingUp, Target, Clock, Zap
} from 'lucide-react';
import { 
  saveTrade, getStrategies, INSTRUMENTS, SESSIONS, SMC_TAGS, 
  calculateRR, calculatePips, canAddTrade
} from '@/lib/storage';
import { Crown } from 'lucide-react';
import TagBadge from '@/components/ui/TagBadge';

export default function AddTrade() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    instrument: 'EURUSD',
    direction: 'Buy',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '0.01',
    result: 'Win',
    session: 'London',
    strategy: '',
    smcTags: [],
    notes: '',
    screenshotBefore: null,
    screenshotAfter: null,
  });

  const [strategies, setStrategies] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [autoCalc, setAutoCalc] = useState({ rr: 0, pips: 0 });
  const [canAdd, setCanAdd] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStrategies();
      setStrategies(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, strategy: data[0] }));
      }
      
      const allowed = await canAddTrade();
      setCanAdd(allowed);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (formData.entryPrice && formData.stopLoss && formData.takeProfit) {
      const rr = calculateRR(formData.entryPrice, formData.stopLoss, formData.takeProfit, formData.direction);
      const pips = calculatePips(formData.entryPrice, formData.stopLoss, formData.instrument);
      setAutoCalc({ rr, pips });
    }
  }, [formData.entryPrice, formData.stopLoss, formData.takeProfit, formData.direction, formData.instrument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const newTags = prev.smcTags.includes(tag)
        ? prev.smcTags.filter(t => t !== tag)
        : [...prev.smcTags, tag];
      return { ...prev, smcTags: newTags };
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // For preview, we still use FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result, [`${field}File`]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.entryPrice) newErrors.entryPrice = 'Required';
    if (!formData.stopLoss) newErrors.stopLoss = 'Required';
    if (!formData.takeProfit) newErrors.takeProfit = 'Required';
    if (!formData.strategy) newErrors.strategy = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let screenshotBeforeUrl = null;
      let screenshotAfterUrl = null;

      // Use the service directly for uploads
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
        rr: autoCalc.rr,
        pips: autoCalc.pips,
        session: formData.session,
        strategy: formData.strategy,
        smc_tags: formData.smcTags,
        notes: formData.notes,
        screenshot_before: screenshotBeforeUrl,
        screenshot_after: screenshotAfterUrl,
      };

      await saveTrade(tradeToSave);

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ global: 'Failed to save trade. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1000px] mx-auto animate-fade-in pb-20 lg:pl-60">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 shadow-lg">
          <Zap className="text-[var(--accent)]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Log New Trade</h1>
          <p className="text-sm text-[var(--text-muted)]">Record your setup and find your edge</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Trade Details */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">
                <Target size={14} />
                Trade Details
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Instrument</label>
                  <select
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleChange}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                  >
                    {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Direction</label>
                  <div className="flex p-1 bg-[var(--input-bg)] rounded-xl border border-[var(--input-border)]">
                    {['Buy', 'Sell'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, direction: d }))}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          formData.direction === d 
                            ? d === 'Buy' ? 'bg-[var(--profit)] text-white' : 'bg-[var(--loss)] text-white'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Execution */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">
                <TrendingUp size={14} />
                Execution Prices
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Entry Price', name: 'entryPrice', placeholder: '1.0850' },
                  { label: 'Stop Loss', name: 'stopLoss', placeholder: '1.0830' },
                  { label: 'Take Profit', name: 'takeProfit', placeholder: '1.0892' },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">{field.label}</label>
                    <input
                      type="number"
                      step="any"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full bg-[var(--input-bg)] border ${errors[field.name] ? 'border-[var(--loss)]' : 'border-[var(--input-border)]'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all`}
                    />
                  </div>
                ))}
              </div>
              
              {/* Auto Calcs */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[var(--background)]/50 rounded-xl p-3 border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Risk Reward</p>
                  <p className={`text-lg font-bold ${autoCalc.rr >= 2 ? 'text-[var(--profit)]' : 'text-[var(--text-primary)]'}`}>
                    {autoCalc.rr}R
                  </p>
                </div>
                <div className="bg-[var(--background)]/50 rounded-xl p-3 border border-[var(--border)]">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Pips</p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {autoCalc.pips}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Notes & Screenshots */}
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">
                <Camera size={14} />
                Context & Journal
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe your reasoning, psychological state, and feelings..."
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--accent)] transition-all min-h-[120px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['screenshotBefore', 'screenshotAfter'].map(field => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">
                      {field === 'screenshotBefore' ? 'Before Trade' : 'Result (After)'}
                    </label>
                    <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--input-bg)] cursor-pointer hover:border-[var(--accent)] transition-all overflow-hidden group">
                      {formData[field] ? (
                        <img src={formData[field]} alt="preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <>
                          <Camera className="text-[var(--text-muted)] mb-2" size={24} />
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Upload Screenshot</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, field)} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                <Clock size={14} />
                Meta Data
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Result</label>
                  <select
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                  >
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                    <option value="Break Even">Break Even</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Strategy</label>
                  <select
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    className={`w-full bg-[var(--input-bg)] border ${errors.strategy ? 'border-[var(--loss)]' : 'border-[var(--input-border)]'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all`}
                  >
                    {strategies.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Session</label>
                  <select
                    name="session"
                    value={formData.session}
                    onChange={handleChange}
                    className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                  >
                    {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Lot Size</label>
                  <input
                    type="number"
                    step="0.01"
                    name="lotSize"
                    value={formData.lotSize}
                    onChange={handleChange}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">
                <Zap size={14} />
                SMC Trace
              </div>
              <div className="flex flex-wrap gap-2">
                {SMC_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`transition-all ${formData.smcTags.includes(tag) ? 'opacity-100 scale-105' : 'opacity-60 scale-95'}`}
                  >
                    <TagBadge tag={tag} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-[var(--accent)]/30 ${
                isSuccess 
                  ? 'bg-[var(--profit)] text-white' 
                  : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check size={20} />
                  Trade Logged!
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Save Trade Setup
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Inline Validation Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="fixed bottom-24 right-8 bg-[var(--loss)] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up z-[60]">
          <AlertCircle size={20} />
          <p className="text-xs font-bold uppercase tracking-wider">Please fill all required fields</p>
        </div>
      )}

      {/* Trade Limit Overlay */}
      {!canAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-10 max-w-sm text-center shadow-2xl animate-scale-in">
            <Crown className="mx-auto mb-6 text-[var(--accent)]" size={48} />
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">Trade Limit Reached</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              You've hit the 30 trade limit on the Free plan. Upgrade to Pro to log unlimited trades and find your edge.
            </p>
            <button 
              onClick={() => router.push('/billing')}
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-2xl shadow-xl shadow-[var(--accent)]/30 hover:scale-105 transition-all mb-4"
            >
              Upgrade to Pro
            </button>
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
