'use client';

import { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trades', label: 'Trades', icon: Library },
  { href: '/add-trade', label: 'Add Trade', icon: Plus },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/strategies', label: 'Strategies', icon: Target },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Don't show sidebar on login/signup pages or while loading initial auth
  if (pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback') return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] z-40">
        <div className="hidden lg:block w-[240px]" /> {/* Spacer to prevent overlap on main content */}
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
            EdgeLedger
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--accent)] rounded-r-full shadow-[0_0_10px_var(--accent)]" />
                )}
                <Icon
                  size={19}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                  }`}
                />
                {item.label}
                {item.href === '/add-trade' && !isActive && (
                  <span className="ml-auto w-5 h-5 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-[10px] font-bold">
                    +
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="px-4 py-4 border-t border-[var(--border)] space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[var(--card-hover)] animate-pulse" />
              <div className="flex-1 h-3 bg-[var(--card-hover)] rounded animate-pulse" />
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={16} className="text-[var(--accent)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {profile?.full_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">Pro Plan</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--loss)] hover:bg-[var(--loss)]/10 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link 
              href="/login"
              className="w-full flex items-center justify-center py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:bg-[var(--accent-hover)] transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--sidebar-bg)] border-t border-[var(--border)] z-50 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[52px] ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {item.href === '/add-trade' ? (
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center -mt-5 shadow-lg shadow-[var(--accent)]/30">
                    <Icon size={20} className="text-white" />
                  </div>
                ) : (
                  <Icon size={20} />
                )}
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          {/* Mobile Profile/Logout Icon would go here if space permits, or usually in a top bar */}
        </div>
      </nav>
    </>
  );
}
