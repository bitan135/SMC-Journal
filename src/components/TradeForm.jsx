'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Camera, Check, Target, TrendingUp, Binary, BarChart3, AlertCircle, Calendar, Brain, Shield, Smile, Frown, Zap, RefreshCcw
} from 'lucide-react';
import { 
  INSTRUMENTS, SESSIONS, SMC_TAGS, 
  calculateRR, calculatePips, calculateRiskAmount
} from '@/lib/storage';

export default function TradeForm({ initialData = null, onSubmit, isSubmitting, submitLabel = 'Log Sequence', strategies = [] }) {
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
    setup_zone: 'Supply', // Standardized naming
    smcTags: [],
    notes: '',
    screenshotBefore: null,
    screenshotAfter: null,
    tradeDate: new Date().toISOString().slice(0, 16),
    emotionalState: 'Neutral',  // consistent default
    disciplineScore: 5,
    ruleAdherence: true,
    // Overrides for edit mode — all come from initialData
    ...initialData ? {
      entryPrice: initialData?.entry_price || initialData?.entryPrice || '',
      stopLoss: initialData?.stop_loss || initialData?.stopLoss || '',
      takeProfit: initialData?.take_profit || initialData?.takeProfit || '',
      lotSize: initialData?.lot_size || initialData?.lotSize || '0.01',
      smcTags: initialData?.smc_tags || initialData?.smcTags || [],
      screenshotBefore: initialData?.screenshot_before || initialData?.screenshotBefore || null,
      screenshotAfter: initialData?.screenshot_after || initialData?.screenshotAfter || null,
      tradeDate: initialData?.trade_date
        ? new Date(initialData.trade_date).toISOString().slice(0, 16)
        : initialData?.tradeDate || new Date().toISOString().slice(0, 16),
      emotionalState: initialData?.emotional_state || initialData?.emotionalState || 'Neutral',
      disciplineScore: initialData?.discipline_score || initialData?.disciplineScore || 5,
      ruleAdherence: initialData?.rule_adherence ?? initialData?.ruleAdherence ?? true,
      setup_zone: initialData?.setup_zone || 'Supply',
    } : {},
  });

  const [errors, setErrors] = useState({});

  const [prevStrategies, setPrevStrategies] = useState(strategies);

  if (strategies !== prevStrategies) {
    setPrevStrategies(strategies);
    if (strategies.length > 0 && !formData.strategy) {
      setFormData(prev => ({ ...prev, strategy: strategies[0] }));
    }
  }

  const autoCalc = (formData.entryPrice && formData.stopLoss && formData.takeProfit) ? {
    rr: calculateRR(formData.entryPrice, formData.stopLoss, formData.takeProfit, formData.direction),
    pips: calculatePips(formData.entryPrice, formData.stopLoss, formData.instrument),
    riskAmount: calculateRiskAmount(formData.entryPrice, formData.stopLoss, formData.lotSize, formData.instrument)
  } : { rr: 0, pips: 0, riskAmount: 0 };

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;
    
    // Prepare data for submission
    const finalData = {
      ...formData,
      rr: autoCalc.rr,
      pips: autoCalc.pips,
      riskAmount: autoCalc.riskAmount,
      tradeDate: formData.tradeDate,
      emotionalState: formData.emotionalState,
      disciplineScore: formData.disciplineScore,
      ruleAdherence: formData.ruleAdherence,
    };
    
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Core Data */}
      <div className="lg:col-span-2 space-y-8">
        {/* Section 1: Instrument & Direction */}
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium stagger-children">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] flex items-center gap-2">
              <Target size={14} /> Configuration
            </h3>
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl">
              <Calendar size={12} className="text-[var(--text-muted)]" />
              <input
                type="datetime-local"
                name="tradeDate"
                value={formData.tradeDate}
                onChange={handleChange}
                className="bg-transparent text-[10px] font-black text-[var(--foreground)] uppercase tracking-wider outline-none cursor-pointer"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Asset Pair</label>
                <select
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all appearance-none cursor-pointer"
                >
                  {INSTRUMENTS.map(i => <option key={i} value={i} className="bg-[var(--background)]">{i}</option>)}
                </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Order Flow</label>
              <div className="flex p-1.5 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] h-[58px]">
                {['Buy', 'Sell'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, direction: d }))}
                    className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-black rounded-xl transition-all ${
                      formData.direction === d 
                        ? d === 'Buy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    <TrendingUp size={14} className={d === 'Sell' ? 'rotate-180' : ''} />
                    {d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing Logic */}
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium stagger-children">
          <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <Binary size={14} /> Execution Math
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Institutional Entry', name: 'entryPrice', placeholder: '1.08540' },
              { label: 'Safety Cut (SL)', name: 'stopLoss', placeholder: '1.08320' },
              { label: 'Final Target (TP)', name: 'takeProfit', placeholder: '1.08980' },
            ].map(field => (
              <div key={field.name} className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">{field.label}</label>
                <input
                  type="number"
                  step="any"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full bg-[var(--glass-bg)] border ${errors[field.name] ? 'border-rose-500/50' : 'border-[var(--glass-border)]'} rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all`}
                />
              </div>
            ))}
          </div>
          
          {/* Real-time Analytics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--glass-bg)] rounded-3xl p-6 border border-[var(--glass-border)] group hover:border-[var(--accent)]/30 transition-all">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <BarChart3 size={12} className="text-[var(--accent)]" /> Performance Ratio
              </p>
              <p className={`text-2xl font-black tracking-tighter ${autoCalc.rr >= 2 ? 'text-emerald-500' : 'text-[var(--foreground)]'}`}>
                {autoCalc.rr}R
              </p>
            </div>
            <div className="bg-[var(--glass-bg)] rounded-3xl p-6 border border-[var(--glass-border)] group hover:border-[var(--accent)]/30 transition-all">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap size={12} className="text-amber-500" /> Total Displacement
              </p>
              <p className="text-2xl font-black text-[var(--foreground)] tracking-tighter">
                {autoCalc.pips} <span className="text-[10px] text-[var(--text-muted)] uppercase font-black ml-1">Pips</span>
              </p>
            </div>
            <div className="bg-[var(--glass-bg)] rounded-3xl p-6 border border-[var(--glass-border)] group hover:border-rose-500/30 transition-all">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Shield size={12} className="text-rose-500" /> Risk Assessment
              </p>
              <p className="text-2xl font-black text-rose-500 tracking-tighter uppercase">
                ${autoCalc.riskAmount} <span className="text-[10px] text-[var(--text-muted)] uppercase font-black ml-1">USD</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Psychology & Discipline */}
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
          <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <Brain size={14} /> Psychology & Discipline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Emotional State</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Focused', 'Fear', 'Greed', 'FOMO', 'Neutral', 'Revenge'].map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, emotionalState: state }))}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        formData.emotionalState === state 
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg' 
                          : 'bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)] hover:border-[var(--accent)]/30'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex justify-between items-end">
                  Discipline Score 
                  <span className="text-[var(--accent)] font-mono text-xs">{formData.disciplineScore}/5</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  name="disciplineScore"
                  value={formData.disciplineScore}
                  onChange={handleChange}
                  className="w-full accent-[var(--accent)] h-1.5 bg-[var(--glass-bg)] rounded-full appearance-none cursor-pointer border border-[var(--glass-border)]"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Protocol Adherence</label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, ruleAdherence: !prev.ruleAdherence }))}
                  className={`w-full p-6 rounded-[32px] border flex items-center justify-between transition-all ${
                    formData.ruleAdherence 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/5' 
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                      formData.ruleAdherence ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-rose-500/20 border-rose-500/30'
                    }`}>
                      {formData.ruleAdherence ? <Smile size={20} /> : <Frown size={20} />}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">Rules Followed?</p>
                      <p className="text-xs font-bold opacity-70">{formData.ruleAdherence ? 'Institutional Discipline' : 'Security Breach / Impulsive'}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-all ${formData.ruleAdherence ? 'bg-emerald-500' : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.ruleAdherence ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Visual & Journal */}
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium">
          <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <Camera size={14} /> Intelligence Archive
          </h3>
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Execution Reasoning</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Log your technical confluences and psychological state..."
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[24px] px-8 py-6 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all min-h-[160px] resize-none leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['screenshotBefore', 'screenshotAfter'].map(field => (
                <div key={field} className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">
                    {field === 'screenshotBefore' ? 'Setup Configuration' : 'Settlement View'}
                  </label>
                  <label className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--glass-border)] rounded-[40px] bg-[var(--glass-bg)] cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--card-hover)] transition-all overflow-hidden group">
                    {formData[field] ? (
                      <img src={formData[field]} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center border border-[var(--glass-border)] group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <Camera className="text-[var(--text-muted)]" size={20} />
                        </div>
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Add Frame</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, field)} className="hidden" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Meta & Meta-logic */}
      <div className="space-y-8">
        <div className="glass-card rounded-[40px] border-[var(--glass-border)] p-8 shadow-premium sticky top-10">
          <h3 className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <Binary size={14} /> Sequence Data
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Outcome</label>
              <select
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all appearance-none cursor-pointer"
              >
                <option value="Win" className="bg-[var(--background)]">PROFITABLE (WIN)</option>
                <option value="Loss" className="bg-[var(--background)]">LIQUIDATED (LOSS)</option>
                <option value="Break Even" className="bg-[var(--background)]">NEUTRAL (BE)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest ml-1 flex items-center gap-2">
                <Target size={12} /> Setup Type
              </label>
              <div className="flex p-1.5 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)] h-[58px]">
                {['Supply', 'Demand'].map(z => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, setup_zone: z }))}
                    className={`flex-1 flex items-center justify-center gap-2 text-[11px] font-black rounded-xl transition-all ${
                      formData.setup_zone === z 
                        ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20'
                        : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {z.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Institutional Strategy</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className={`w-full bg-[var(--glass-bg)] border ${errors.strategy ? 'border-rose-500/50' : 'border-[var(--glass-border)]'} rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all appearance-none cursor-pointer`}
              >
                {!formData.strategy && <option value="" disabled>SELECT STRATEGY</option>}
                {strategies.map(s => <option key={s} value={s} className="bg-[var(--background)]">{s.toUpperCase()}</option>)}
                {strategies.length === 0 && <option value="" disabled>LOADING ASSETS...</option>}
              </select>
            </div>
            <div className="space-y-3 font-bold">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Market Window</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all appearance-none cursor-pointer"
              >
                {SESSIONS.map(s => <option key={s} value={s} className="bg-[var(--background)]">{s.toUpperCase()} SESSION</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1">Risk Exposure (Lots)</label>
              <input
                type="number"
                step="0.01"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleChange}
                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:bg-[var(--card-hover)] transition-all"
              />
            </div>

            <div className="pt-4 border-t border-[var(--glass-border)]">
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">Confluence Trace</p>
              <div className="flex flex-wrap gap-2">
                {SMC_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.smcTags.includes(tag) 
                        ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 border border-[var(--accent)]/50' 
                        : 'bg-[var(--glass-bg)] text-[var(--text-muted)] border border-[var(--glass-border)] hover:border-[var(--accent)]/30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {errors.global && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-shake">
                <AlertCircle size={14} /> {errors.global}
              </div>
            )}

            {isSubmitting && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                <RefreshCcw size={14} className="animate-spin" /> Transmitting to Vault...
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-[24px] font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl bg-[var(--accent)] text-white hover:scale-[1.02] active:scale-95 shadow-indigo-500/40 disabled:opacity-50`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Plus size={20} /> {submitLabel}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
