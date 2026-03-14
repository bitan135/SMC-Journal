import { useEffect, useState } from 'react';
import { 
  Trash2, Download, Upload, ShieldCheck, Database, RefreshCcw, Bell, DollarSign, Percent, Globe, Save
} from 'lucide-react';
import { getSettings, saveSettings, getTrades, getStrategies } from '@/lib/storage';

export default function Settings() {
  const [isReseting, setIsReseting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    accountBalance: 10000,
    riskPercentage: 1,
    currency: 'USD'
  });

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
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
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
      a.download = `edge_ledger_cloud_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      alert('Export failed');
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="h-10 w-48 bg-[var(--card)] rounded-lg mb-8 animate-shimmer" />
        <div className="space-y-6">
          <div className="h-64 bg-[var(--card)] rounded-2xl animate-shimmer" />
          <div className="h-64 bg-[var(--card)] rounded-2xl animate-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1000px] mx-auto animate-fade-in pb-20">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Account Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Manage your data, preferences, and workspace configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile & Trading Prefs */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background)]/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <ShieldCheck className="text-[var(--accent)]" size={20} />
              </div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Trading Profile</h2>
            </div>
          </div>
          
          <form onSubmit={handleSaveSettings} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase flex items-center gap-2">
                  <DollarSign size={14} /> Account Balance
                </label>
                <input
                  type="number"
                  value={settings.accountBalance}
                  onChange={(e) => setSettings({...settings, accountBalance: parseFloat(e.target.value)})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase flex items-center gap-2">
                  <Percent size={14} /> Risk per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.riskPercentage}
                  onChange={(e) => setSettings({...settings, riskPercentage: parseFloat(e.target.value)})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase flex items-center gap-2">
                  <Globe size={14} /> Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] transition-all"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[var(--accent)] text-white rounded-xl text-xs font-bold hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Data Management Section */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background)]/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <Database className="text-[var(--accent)]" size={20} />
              </div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Cloud Data Management</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Backup Cloud Data</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">Download your entire trade archive and strategies from the Supabase cloud to a JSON file.</p>
              </div>
              <button
                onClick={exportData}
                className="px-6 py-2.5 bg-[var(--card-hover)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Export Data
              </button>
            </div>

            <hr className="border-[var(--border)]" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-md">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Import Legacy Data</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">Have data in local storage from a previous version? Migrate it to your cloud account.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Migrate existing local storage data to Supabase? This will merge them with your cloud data.')) {
                    // This is a placeholder for a migration function we could implement in storage.js
                    alert('Migration feature coming soon to handle large local datasets.');
                  }
                }}
                className="px-6 py-2.5 bg-[var(--card-hover)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Migrate Local
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Placeholder */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] opacity-60 pointer-events-none shadow-sm">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--background)]/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <Bell className="text-[var(--accent)]" size={20} />
              </div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Notifications</h2>
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-xs text-[var(--text-muted)]">Trading session alerts and journaling reminders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
