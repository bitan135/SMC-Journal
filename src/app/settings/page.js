'use client';

import { useEffect, useState } from 'react';
import { 
  Trash2, Download, Upload, ShieldCheck, Database, RefreshCcw, Bell, DollarSign, Percent, Globe, Save, Monitor, Moon, Sun, ArrowLeft, Sparkles, User, Fingerprint
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { getSettings, saveSettings, getTrades, getStrategies, migrateLocalToCloud } from '@/lib/storage';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const router = useRouter();
  const [isReseting, setIsReseting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    accountBalance: 10000,
    riskPercentage: 1,
    currency: 'USD'
  });
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Settings load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings(settings);
      alert('Institutional configuration updated.');
    } catch (err) {
      alert('Security violation: Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMigrate = async () => {
    if (confirm('Initiate local-to-cloud sync? This will bridge all legacy sequences and strategies to your professional account.')) {
        setIsMigrating(true);
        try {
            const result = await migrateLocalToCloud();
            alert(result.message);
        } catch (err) {
            alert('Migration failed: Database handshaking error.');
        } finally {
            setIsMigrating(false);
        }
    }
  };

  const exportData = async () => {
    try {
      const trades = await getTrades();
      const strategies = await getStrategies();
      const data = {
        trades,
        strategies,
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edge_ledger_vault_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      alert('Export protocol failed.');
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="h-10 w-48 bg-white/5 rounded-2xl mb-12 animate-shimmer" />
        <div className="space-y-8">
          <div className="h-64 glass-card border-white/5 rounded-[40px] animate-shimmer" />
          <div className="h-64 glass-card border-white/5 rounded-[40px] animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
                <button 
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-white/5 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:text-white hover:border-white/20 transition-all group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
                </button>
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-white/5 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Fingerprint size={12} /> Console Configuration
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none text-gradient mb-4">
                    Preference Engine
                </h1>
                <p className="text-[var(--text-secondary)] font-medium">Fine-tune your institutional workspace and data protocols.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Section 1: Execution Profile */}
          <div className="glass-card rounded-[48px] border-white/5 overflow-hidden shadow-premium">
            <div className="p-8 border-b border-white-[0.03] bg-white/[0.01]">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                    <ShieldCheck className="text-[var(--accent)]" size={16} /> Technical Profile
                </h2>
            </div>
            
            <form onSubmit={handleSaveSettings} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={14} className="text-[var(--accent)]" /> Base Capital
                  </label>
                  <input
                    type="number"
                    value={settings.accountBalance}
                    onChange={(e) => setSettings({...settings, accountBalance: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Percent size={14} className="text-[var(--accent)]" /> Risk Ceiling (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.riskPercentage}
                    onChange={(e) => setSettings({...settings, riskPercentage: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe size={14} className="text-[var(--accent)]" /> Denomination
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:border-[var(--accent)] transition-all appearance-none cursor-pointer"
                  >
                    <option value="USD" className="bg-[#0A0A0B]">USD - UNITED STATES</option>
                    <option value="EUR" className="bg-[#0A0A0B]">EUR - EUROPEAN UNION</option>
                    <option value="GBP" className="bg-[#0A0A0B]">GBP - BRITISH POUND</option>
                    <option value="JPY" className="bg-[#0A0A0B]">JPY - JAPANESE YEN</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end pt-8 border-t border-white-[0.03]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-10 py-4 bg-[var(--accent)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.03] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/30"
                >
                  {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                  Commit Configuration
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Data Protocols */}
          <div className="glass-card rounded-[48px] border-white/5 overflow-hidden shadow-premium">
            <div className="p-8 border-b border-white-[0.03] bg-white/[0.01]">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                    <Database className="text-[var(--accent)]" size={16} /> Data Bridge Protocols
                </h2>
            </div>
            
            <div className="p-10 space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">Archive Replication</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">Generate a complete high-fidelity export of your trade architecture and strategic configurations for cold storage.</p>
                </div>
                <button
                  onClick={exportData}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Download size={18} /> Export Vault
                </button>
              </div>

              <div className="h-px bg-white-[0.03]" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">Legacy Ingestion</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">Bridge legacy local storage records into your encrypted cloud session. Ideal for migrating from Alpha versions.</p>
                </div>
                <button
                  onClick={handleMigrate}
                  disabled={isMigrating}
                  className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isMigrating ? <RefreshCcw size={18} className="animate-spin" /> : <Upload size={18} />}
                  Migrate Sequences
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Interface Synthesis */}
          <div className="glass-card rounded-[48px] border-white/5 overflow-hidden shadow-premium">
            <div className="p-8 border-b border-white-[0.03] bg-white/[0.01]">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                    <Monitor className="text-[var(--accent)]" size={16} /> Atmosphere Sync
                </h2>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'auto', label: 'System Sync', icon: Monitor },
                  { id: 'light', label: 'Luminous', icon: Sun },
                  { id: 'dark', label: 'Nocturnal', icon: Moon }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    className={`flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all gap-5 group relative overflow-hidden ${
                      theme === item.id 
                        ? 'bg-[var(--accent)]/10 border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/10' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {theme === item.id && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent animate-pulse" />
                    )}
                    <item.icon size={28} className={`relative z-10 transition-transform duration-500 group-hover:scale-110 ${theme === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                    <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.2em] ${theme === item.id ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
