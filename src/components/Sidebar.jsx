'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Plus,
  Library,
  BarChart3,
  Target,
  Settings,
  TrendingUp,
  LogOut,
  User as UserIcon,
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trades', label: 'Trades', icon: Library },
  { href: '/add-trade', label: 'Add Trade', icon: Plus },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/strategies', label: 'Strategies', icon: Target },
  { href: '/billing', label: 'Billing', icon: Crown },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarCollapsed, setSidebarCollapsed } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (authUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        setProfile(profileData);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.signOut();
    router.push('/login');
    router.refresh();
  };

  if (pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback') return null;

  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--sidebar-bg)] border-r border-white/5 z-40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        {/* Decorative Ambience */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <div 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="flex items-center gap-4 px-8 h-20 mb-6 relative cursor-pointer group/logo"
        >
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center shadow-xl shadow-[var(--accent)]/20 animate-pulse-glow group-hover/logo:scale-110 transition-transform duration-500">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter text-gradient leading-none">
              EdgeLedger
            </span>
            <span className="text-[8px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mt-1 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500">
              Collapse
            </span>
          </div>
          {/* Collapse Indicator Dot */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover/logo:opacity-100 transition-all duration-500 group-hover/logo:scale-125" />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-500 group overflow-hidden ${
                  isActive
                    ? 'bg-white/5 text-white shadow-premium border border-white/5'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white-[0.02]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-[var(--accent)] rounded-r-full shadow-[0_0_15px_var(--accent)] animate-fade-in" />
                )}
                <Icon
                  size={20}
                  className={`transition-all duration-500 ${
                    isActive ? 'scale-110 text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-white group-hover:scale-110'
                  }`}
                />
                <span className="relative z-10 tracking-tight">{item.label}</span>
                {item.href === '/add-trade' && !isActive && (
                  <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                    <Plus size={14} className="text-[var(--accent)]" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 mx-4 mb-4 rounded-[32px] glass-card border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {isLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="space-y-2 flex-1">
                        <div className="h-2 bg-white/5 rounded w-20" />
                        <div className="h-2 bg-white/5 rounded w-12" />
                    </div>
                </div>
            ) : user ? (
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center border border-white/10 p-0.5 shadow-inner">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon size={20} className="text-[var(--accent)]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-black text-white truncate leading-tight">
                                {profile?.full_name || user.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Sparkles size={10} className="text-[var(--accent)] animate-pulse" />
                                <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">Pro Elite</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[var(--text-muted)] hover:text-[var(--loss)] hover:bg-[var(--loss)]/10 border border-transparent hover:border-[var(--loss)]/20 transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            ) : null}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-20 glass-card rounded-[32px] border-white/10 z-50 flex items-center justify-around px-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                isActive ? 'text-[var(--accent)] scale-110' : 'text-[var(--text-muted)]'
              }`}
            >
              {item.href === '/add-trade' ? (
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center -mt-12 shadow-2xl shadow-[var(--accent)]/40 border-4 border-[var(--sidebar-bg)]">
                  <Icon size={24} className="text-white" />
                </div>
              ) : (
                <>
                    <Icon size={22} />
                    {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[var(--accent)]" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
