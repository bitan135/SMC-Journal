'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Save, Download, Upload, Trash2, Plus, X, AlertTriangle,
} from 'lucide-react';
import {
  getSettings, saveSettings, getStrategies, saveStrategies, addStrategy, removeStrategy,
  exportAllData, importAllData, clearAllData,
} from '@/lib/storage';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [strategies, setStrategiesState] = useState([]);
  const [newStrategy, setNewStrategy] = useState('');
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSettings(getSettings());
    setStrategiesState(getStrategies());
    setIsLoaded(true);
  }, []);

  const handleSaveSettings = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddStrategy = () => {
    if (newStrategy.trim()) {
      const updated = addStrategy(newStrategy.trim());
      setStrategiesState(updated);
      setNewStrategy('');
    }
  };

  const handleRemoveStrategy = (name) => {
    const updated = removeStrategy(name);
    setStrategiesState(updated);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edgeledger-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importAllData(data);
        setSettings(getSettings());
        setStrategiesState(getStrategies());
        alert('Data imported successfully! Refresh the page to see changes.');
      } catch {
        alert('Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Configure your trading journal</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Account Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">$</span>
                <input
                  type="number"
                  value={settings.accountBalance || ''}
                  onChange={(e) => setSettings(s => ({ ...s, accountBalance: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg pl-7 pr-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Default Lot Size</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.defaultLotSize || ''}
                  onChange={(e) => setSettings(s => ({ ...s, defaultLotSize: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Risk % per Trade</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.riskPercentage || ''}
                    onChange={(e) => setSettings(s => ({ ...s, riskPercentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 pr-7 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">%</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Strategies Management */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Custom Strategies</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              placeholder="New strategy name"
              className="flex-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]/40"
              onKeyDown={(e) => e.key === 'Enter' && handleAddStrategy()}
            />
            <button
              onClick={handleAddStrategy}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {strategies.map(strat => (
              <span key={strat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-secondary)] group">
                {strat}
                <button
                  onClick={() => handleRemoveStrategy(strat)}
                  className="w-4 h-4 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--loss)] opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Data Management</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
            >
              <Download size={16} />
              Export All Data (JSON)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
            >
              <Upload size={16} />
              Import Data (JSON)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--loss)]/20 p-5">
          <h3 className="text-sm font-semibold text-[var(--loss)] mb-3">Danger Zone</h3>
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--loss)]/30 text-[var(--loss)] text-sm font-medium rounded-lg hover:bg-[var(--loss)]/10 transition-colors"
            >
              <Trash2 size={14} />
              Clear All Data
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-[var(--loss)]/10 rounded-lg p-4">
              <AlertTriangle size={20} className="text-[var(--loss)] shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-primary)] font-medium">Are you sure?</p>
                <p className="text-xs text-[var(--text-muted)]">This will permanently delete all trades, strategies, and settings.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowClearConfirm(false)} className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button>
                <button onClick={handleClearAll} className="px-3 py-1.5 bg-[var(--loss)] text-white text-xs font-medium rounded-lg">Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
