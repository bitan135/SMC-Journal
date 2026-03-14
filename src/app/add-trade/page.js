'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight, ArrowDownRight, Camera, X, Check,
} from 'lucide-react';
import {
  saveTrade, getStrategies, addStrategy, calculateRR, calculatePips,
  INSTRUMENTS, SESSIONS, SMC_TAGS, getSettings,
} from '@/lib/storage';

export default function AddTrade() {
  const router = useRouter();
  const [strategies, setStrategies] = useState([]);
  const [settings, setSettings] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [newStrategy, setNewStrategy] = useState('');
  const [showNewStrategy, setShowNewStrategy] = useState(false);

  const [form, setForm] = useState({
    instrument: '',
    direction: 'Buy',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    lotSize: '',
    result: '',
    session: '',
    strategy: '',
    smcTags: [],
    notes: '',
    screenshotBefore: null,
    screenshotAfter: null,
  });

  useEffect(() => {
    setStrategies(getStrategies());
    setSettings(getSettings());
  }, []);

  const rr = calculateRR(form.entryPrice, form.stopLoss, form.takeProfit, form.direction);
  const pips = calculatePips(form.entryPrice, form.stopLoss, form.instrument);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleSMCTag = useCallback((tag) => {
    setForm(prev => ({
      ...prev,
      smcTags: prev.smcTags.includes(tag)
        ? prev.smcTags.filter(t => t !== tag)
        : [...prev.smcTags, tag],
    }));
  }, []);

  const handleScreenshot = useCallback((field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField(field, reader.result);
    reader.readAsDataURL(file);
  }, [updateField]);

  const handleAddStrategy = useCallback(() => {
    if (newStrategy.trim()) {
      const updated = addStrategy(newStrategy.trim());
      setStrategies(updated);
      updateField('strategy', newStrategy.trim());
      setNewStrategy('');
      setShowNewStrategy(false);
    }
  }, [newStrategy, updateField]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!form.instrument || !form.result) {
      alert('Please fill in at least Instrument and Result');
      return;
    }

    saveTrade({
      ...form,
      rr,
      pips,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setForm({
        instrument: '',
        direction: 'Buy',
        entryPrice: '',
        stopLoss: '',
        takeProfit: '',
        lotSize: '',
        result: '',
        session: '',
        strategy: '',
        smcTags: [],
        notes: '',
        screenshotBefore: null,
        screenshotAfter: null,
      });
    }, 1500);
  }, [form, rr, pips]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1000px] mx-auto">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--card)] rounded-2xl p-8 flex flex-col items-center gap-4 animate-scale-in border border-[var(--border)]">
            <div className="w-16 h-16 rounded-full bg-[var(--profit)]/20 flex items-center justify-center">
              <Check size={32} className="text-[var(--profit)]" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">Trade Saved!</p>
            <p className="text-sm text-[var(--text-muted)]">Keep building your edge.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Add Trade
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Log your trade in under 15 seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column — Trade Details */}
          <div className="space-y-5">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Trade Details</h3>

              {/* Instrument */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Instrument</label>
                <select
                  value={form.instrument}
                  onChange={(e) => updateField('instrument', e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  <option value="">Select instrument</option>
                  {INSTRUMENTS.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Buy', 'Sell'].map(dir => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => updateField('direction', dir)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        form.direction === dir
                          ? dir === 'Buy'
                            ? 'bg-[var(--profit)]/20 text-[var(--profit)] border border-[var(--profit)]/40'
                            : 'bg-[var(--loss)]/20 text-[var(--loss)] border border-[var(--loss)]/40'
                          : 'bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--input-border)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      {dir === 'Buy' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { field: 'entryPrice', label: 'Entry Price' },
                  { field: 'stopLoss', label: 'Stop Loss' },
                  { field: 'takeProfit', label: 'Take Profit' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">{label}</label>
                    <input
                      type="number"
                      step="any"
                      value={form[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40"
                    />
                  </div>
                ))}
              </div>

              {/* Lot Size */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Lot Size</label>
                <input
                  type="number"
                  step="any"
                  value={form.lotSize}
                  onChange={(e) => updateField('lotSize', e.target.value)}
                  placeholder={settings.defaultLotSize?.toString() || '0.01'}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40"
                />
              </div>

              {/* Auto Calculated */}
              {(form.entryPrice && form.stopLoss) && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
                  <div className="bg-[var(--input-bg)] rounded-lg p-3">
                    <p className="text-xs text-[var(--text-muted)]">Risk:Reward</p>
                    <p className="text-lg font-bold text-[var(--accent)]">{rr}R</p>
                  </div>
                  <div className="bg-[var(--input-bg)] rounded-lg p-3">
                    <p className="text-xs text-[var(--text-muted)]">Pips Risk</p>
                    <p className="text-lg font-bold text-[var(--text-primary)]">{pips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Tags & Meta */}
          <div className="space-y-5">
            {/* Result */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Trade Result</h3>
              <div className="grid grid-cols-3 gap-2">
                {['Win', 'Loss', 'Break Even'].map(result => (
                  <button
                    key={result}
                    type="button"
                    onClick={() => updateField('result', result)}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      form.result === result
                        ? result === 'Win'
                          ? 'bg-[var(--profit)]/20 text-[var(--profit)] border border-[var(--profit)]/40'
                          : result === 'Loss'
                            ? 'bg-[var(--loss)]/20 text-[var(--loss)] border border-[var(--loss)]/40'
                            : 'bg-[var(--neutral)]/20 text-[var(--neutral)] border border-[var(--neutral)]/40'
                        : 'bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--input-border)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    {result}
                  </button>
                ))}
              </div>
            </div>

            {/* Session & Strategy */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Session & Strategy</h3>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Session</label>
                <select
                  value={form.session}
                  onChange={(e) => updateField('session', e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  <option value="">Select session</option>
                  {SESSIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Strategy</label>
                {!showNewStrategy ? (
                  <div className="flex gap-2">
                    <select
                      value={form.strategy}
                      onChange={(e) => updateField('strategy', e.target.value)}
                      className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    >
                      <option value="">Select strategy</option>
                      {strategies.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewStrategy(true)}
                      className="px-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStrategy}
                      onChange={(e) => setNewStrategy(e.target.value)}
                      placeholder="New strategy name"
                      className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStrategy())}
                    />
                    <button type="button" onClick={handleAddStrategy} className="px-3 bg-[var(--accent)] rounded-lg text-white text-sm font-medium">Add</button>
                    <button type="button" onClick={() => setShowNewStrategy(false)} className="px-2 text-[var(--text-muted)]"><X size={16} /></button>
                  </div>
                )}
              </div>
            </div>

            {/* SMC Tags */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">SMC Setup Tags</h3>
              <div className="flex flex-wrap gap-2">
                {SMC_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleSMCTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.smcTags.includes(tag)
                        ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40'
                        : 'bg-[var(--input-bg)] text-[var(--text-muted)] border border-[var(--input-border)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Screenshots</h3>
              <div className="grid grid-cols-2 gap-3">
                {['screenshotBefore', 'screenshotAfter'].map(field => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                      {field === 'screenshotBefore' ? 'Before Trade' : 'After Trade'}
                    </label>
                    {form[field] ? (
                      <div className="relative group">
                        <img src={form[field]} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => updateField(field, null)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-[var(--input-border)] rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors">
                        <Camera size={20} className="text-[var(--text-muted)] mb-1" />
                        <span className="text-xs text-[var(--text-muted)]">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleScreenshot(field, e)}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Notes</h3>
              <textarea
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="e.g. Entered after liquidity sweep + FVG..."
                rows={3}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/30 active:scale-[0.99]"
        >
          Save Trade
        </button>
      </form>
    </div>
  );
}
