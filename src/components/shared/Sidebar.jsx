'use client';

import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import { isPublicRoute } from '@/config/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Heart,
  Lock,
  Sparkles
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trades', label: 'Trades', icon: Library },
  { href: '/add-trade', label: 'Add Trade', icon: Plus },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/insights', label: 'Insights', icon: Sparkles },
  { href: '/strategies', label: 'Strategies', icon: Target },
  { href: '/billing', label: 'Billing', icon: Crown },
  { href: '/donation', label: 'Donation', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, profile, subscription, isLoading, signOut } = useAuth();
  const { isSidebarCollapsed, setSidebarCollapsed } = useTheme();

  if (isPublicRoute(pathname) || pathname === '/auth/callback') return null;

  const getPlanBadge = () => {
    const plan = subscription?.plan_id || 'free';
    if (plan === 'lifetime_legacy') return 'Legacy Elite';
    if (plan === '6_month') return '6-Month Pro';
    if (plan === 'pro') return 'Pro Trader';
    return 'Free Plan';
  };

  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] z-40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto scrollbar-hide ${
        isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        {/* Logo */}
        <div 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="shrink-0 flex items-center gap-4 px-8 h-20 mt-4 mb-2 relative cursor-pointer group/logo"
        >
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[var(--accent)] to-indigo-800 flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 group-hover/logo:scale-110 transition-transform duration-500">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[var(--foreground)] tracking-tighter leading-tight">
              SMC Journal
            </span>
            <span className="text-[7px] font-black text-[var(--accent)] uppercase tracking-[0.2em] mt-1.5 leading-relaxed max-w-[140px]">
              Professional Trade Analytics
            </span>
          </div>
          {/* Collapse Indicator Dot */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover/logo:opacity-100 transition-all duration-500 group-hover/logo:scale-125" />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)] shadow-sm border border-[var(--accent)]/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-[var(--accent)] rounded-r-full shadow-sm animate-fade-in" />
                )}
                <Icon
                  size={20}
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110 text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--foreground)] group-hover:scale-110'
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

        {/* Plan Upgrade CTA */}
        {subscription?.plan_id === 'free' && (
          <div className="shrink-0 mx-4 mb-4 p-5 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-indigo-800 relative overflow-hidden group/cta shadow-lg shadow-[var(--accent)]/10">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover/cta:rotate-12 transition-transform">
              <Sparkles size={40} className="text-white" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white text-[11px] font-black uppercase tracking-widest mb-1">Institutional Pro</h4>
              <p className="text-white/80 text-[10px] font-bold leading-relaxed mb-4">Unlock advanced quantitative analytics and max drawdown curves.</p>
              <Link
                href="/billing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[var(--accent)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className="shrink-0 p-4 mx-4 mb-6 rounded-2xl bg-[var(--sidebar-bg)] border border-[var(--border)] relative overflow-hidden group shadow-sm">
            {isLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)]" />
                    <div className="space-y-2 flex-1">
                        <div className="h-2 bg-[var(--glass-bg)] rounded w-20" />
                        <div className="h-2 bg-[var(--glass-bg)] rounded w-12" />
                    </div>
                </div>
            ) : user ? (
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent)]/20 p-0.5 shadow-sm">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon size={20} className="text-[var(--accent)]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-black text-[var(--foreground)] truncate leading-tight">
                                {profile?.full_name || user.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Sparkles size={10} className={`${subscription?.plan_id === 'free' ? 'text-[var(--text-muted)]' : 'text-[var(--accent)] animate-pulse'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${subscription?.plan_id === 'free' ? 'text-[var(--text-muted)]' : 'text-[var(--accent)]'}`}>
                                    {getPlanBadge()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--glass-bg)] text-[var(--text-muted)] hover:text-[var(--loss)] hover:bg-[var(--loss)]/10 border border-[var(--border)] hover:border-[var(--loss)]/20 transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            ) : null}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--sidebar-bg)]/95 backdrop-blur-2xl border-t border-[var(--border)] z-50 flex items-center justify-around px-2 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        {navItems
          .filter(item => ['Dashboard', 'Trades', 'Add Trade', 'Analytics', 'Settings'].includes(item.label))
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.href === '/add-trade') {
              return (
                <Link key={item.label} href="/add-trade" className="flex flex-col items-center">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isActive ? 'bg-[var(--accent)] shadow-[var(--accent)]/40 scale-105' : 'bg-[var(--accent)] shadow-[var(--accent)]/30'}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-[var(--accent)] scale-110' : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon size={22} />
                {isActive && <div className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
              </Link>
            );
          })}
      </nav>
    </>
  );
}
