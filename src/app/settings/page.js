'use client';

import { useEffect, useState } from 'react';
import { 
  Trash2, Download, Upload, ShieldCheck, Database, RefreshCcw, Bell, DollarSign, Percent, Globe, Save, Monitor, Moon, Sun, ArrowLeft, Sparkles, User, Fingerprint
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { getSettings, saveSettings, getTrades, getStrategies, migrateLocalToCloud, profileService } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmModal';

export default function Settings() {
  const router = useRouter();
  const [isReseting, setIsReseting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [settings, setSettings] = useState({
    accountBalance: 10000,
    riskPercentage: 1,
    currency: 'USD'
  });
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, prof] = await Promise.all([
          getSettings(),
          profileService.getProfile()
        ]);
        if (data) setSettings(data);
        if (prof) {
          setProfile(prof);
          setFullName(prof.full_name || '');
        }
      } catch (err) {
        console.error('Settings load failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await profileService.updateProfile({ full_name: fullName });
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showToast('Passwords do not match.', 'error');
    }
    if (newPassword.length < 6) {
      return showToast('Password must be at least 6 characters.', 'error');
    }
    
    setIsUpdatingPassword(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast('Password updated successfully.', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    showConfirm({
      title: 'CRITICAL: Delete Account',
      message: 'This will permanently destroy your execution vault and all strategic data. This action is irreversible.',
      confirmLabel: 'Destroy Account',
      onConfirm: async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          // Call the delete_user RPC which deletes the auth user (cascades to all data)
          const { error } = await supabase.rpc('delete_user');
          if (error) throw error;
          await supabase.auth.signOut();
          router.push('/signup');
        } catch (err) {
          // If RPC not yet created, fall back to sign-out with instructions
          console.error('Account deletion error:', err);
          showToast('Deletion failed. Please run the Supabase migration first, or contact support.', 'error');
        }
      }
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings(settings);
      showToast('Configuration saved successfully.', 'success');
    } catch (err) {
      showToast('Failed to save configuration. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMigrate = async () => {
    showConfirm({
      title: 'Migrate Local Data',
      message: 'This will bridge all legacy sequences and strategies from this browser to your professional account.',
      confirmLabel: 'Migrate Now',
      onConfirm: async () => {
        setIsMigrating(true);
        try {
          const result = await migrateLocalToCloud();
          showToast(result.message, 'success');
        } catch (err) {
          showToast('Migration failed. Please try again.', 'error');
        } finally {
          setIsMigrating(false);
        }
      }
    });
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
      a.download = `smc_journal_vault_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const [activeTab, setActiveTab] = useState('identity');

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <div className="h-10 w-48 bg-[var(--glass-border)] rounded-2xl mb-12 animate-shimmer" />
        <div className="space-y-8">
          <div className="h-64 glass-card border-[var(--glass-border)] rounded-[40px] animate-shimmer" />
          <div className="h-64 glass-card border-[var(--glass-border)] rounded-[40px] animate-shimmer" />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'trading', label: 'Trading', icon: ShieldCheck },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'interface', label: 'Interface', icon: Monitor },
    { id: 'security', label: 'Security', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 max-w-[1440px] mx-auto animate-fade-in pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-5%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-float pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 px-2">
            <div className="flex-1">
                <button 
                  onClick={() => router.push('/')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-effect border-[var(--glass-border)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-8 hover:text-[var(--foreground)] hover:border-[var(--accent)]/30 transition-all group w-fit"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
                </button>
                <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full glass-effect border-[var(--glass-border)] text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Sparkles size={12} /> Console Configuration
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter leading-none text-gradient mb-4">
                    Settings Console
                </h1>
                <p className="text-[var(--text-secondary)] font-medium max-w-lg">Fine-tune your institutional workspace and data protocols.</p>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Tabs Sidebar */}
          <div className="lg:w-64 flex flex-row lg:flex-col gap-2 p-2 glass-card border-[var(--glass-border)] rounded-[32px] overflow-x-auto lg:overflow-visible shrink-0 h-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'identity' && (
              <div className="space-y-10 animate-fade-in-up">
                <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium">
                    <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                        <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                            <User className="text-[var(--accent)]" size={16} /> Operator Identity
                        </h2>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="p-10 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Full Character Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Email Index</label>
                            <div className="w-full bg-[var(--background)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--text-muted)] opacity-60">
                                {profile?.email || 'authenticated@user.id'}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="w-full py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--accent)]/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            {isUpdatingProfile ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                            Sync Identity
                        </button>
                    </form>
                </div>

                <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium">
                    <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                        <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                            <Fingerprint className="text-[var(--accent)]" size={16} /> Credentials Matrix
                        </h2>
                    </div>
                    <form onSubmit={handleUpdatePassword} className="p-10 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">New Access Token</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Confirm Allocation</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdatingPassword}
                            className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20"
                        >
                            {isUpdatingPassword ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                            Recalibrate Access
                        </button>
                    </form>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium animate-fade-in-up">
                <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                    <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                        <ShieldCheck className="text-[var(--accent)]" size={16} /> Technical Profile
                    </h2>
                </div>
                <form onSubmit={handleSaveSettings} className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <DollarSign size={14} className="text-[var(--accent)]" /> Base Capital
                      </label>
                      <input
                        type="number"
                        value={settings.accountBalance}
                        onChange={(e) => setSettings({...settings, accountBalance: parseFloat(e.target.value)})}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Percent size={14} className="text-[var(--accent)]" /> Risk Ceiling (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.riskPercentage}
                        onChange={(e) => setSettings({...settings, riskPercentage: parseFloat(e.target.value)})}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe size={14} className="text-[var(--accent)]" /> Denomination
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({...settings, currency: e.target.value})}
                        className="w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl px-6 py-4 text-sm font-black text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all shadow-inner"
                      >
                        <option value="USD">USD - UNITED STATES</option>
                        <option value="EUR">EUR - EUROPEAN UNION</option>
                        <option value="GBP">GBP - BRITISH POUND</option>
                        <option value="JPY">JPY - JAPANESE YEN</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 bg-[var(--accent)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.03] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/30"
                  >
                    {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                    Commit Configuration
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium animate-fade-in-up">
                <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                    <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
                        <Database className="text-[var(--accent)]" size={16} /> Data Bridge Protocols
                    </h2>
                </div>
                <div className="p-10 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                      <h3 className="text-lg font-black text-[var(--foreground)] mb-2 tracking-tight">Archive Replication</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">Generate a complete high-fidelity export of your trade architecture.</p>
                    </div>
                    <button
                      onClick={exportData}
                      className="px-8 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest hover:border-[var(--accent)]/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Download size={18} /> Export Vault
                    </button>
                  </div>
                  <div className="h-px bg-[var(--glass-border)]" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                      <h3 className="text-lg font-black text-[var(--foreground)] mb-2 tracking-tight">Legacy Ingestion</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">Bridge legacy local storage records into your encrypted cloud session.</p>
                    </div>
                    <button
                      onClick={handleMigrate}
                      disabled={isMigrating}
                      className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isMigrating ? <RefreshCcw size={18} className="animate-spin" /> : <Upload size={18} />}
                      Migrate Sequences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interface' && (
              <div className="glass-card rounded-[48px] border-[var(--glass-border)] overflow-hidden shadow-premium animate-fade-in-up">
                <div className="p-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]">
                    <h2 className="text-[11px] font-black text-[var(--foreground)] uppercase tracking-[0.4em] flex items-center gap-3">
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
                            : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--accent)]/30'
                        }`}
                      >
                        <item.icon size={28} className={`relative z-10 ${theme === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                        <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.2em] ${theme === item.id ? 'text-[var(--foreground)]' : 'text-[var(--text-muted)]'}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-card rounded-[48px] border-rose-500/10 overflow-hidden shadow-2xl shadow-rose-500/5 bg-rose-500/[0.02] animate-fade-in-up">
                <div className="p-8 border-b border-rose-500/10 bg-rose-500/[0.03]">
                    <h2 className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em] flex items-center gap-3">
                        <Trash2 size={16} /> Danger Zone
                    </h2>
                </div>
                <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                      <h3 className="text-lg font-black text-[var(--foreground)] mb-2 tracking-tight">Decommission Character</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">Permanently wipe your execution history. This cannot be reversed.</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-10 py-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      <Trash2 size={18} /> Destroy Account
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
