'use client';

import { useAuth } from './AuthProvider';
import { useTheme } from './ThemeProvider';
import { isPublicRoute } from '@/lib/routes';
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
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-200 z-40 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto scrollbar-hide ${
        isSidebarCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}>
        {/* Logo */}
        <div 
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="flex items-center gap-4 px-8 h-20 mt-4 mb-2 relative cursor-pointer group/logo"
        >
          <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover/logo:scale-110 transition-transform duration-500">
            <TrendingUp size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tighter leading-tight">
              SMC Journal
            </span>
            <span className="text-[7px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1.5 leading-relaxed max-w-[140px]">
              Professional Trade Analytics
            </span>
          </div>
          {/* Collapse Indicator Dot */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 opacity-0 group-hover/logo:opacity-100 transition-all duration-500 group-hover/logo:scale-125" />
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
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-indigo-600 rounded-r-full shadow-sm animate-fade-in" />
                )}
                <Icon
                  size={20}
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110 text-indigo-700' : 'text-slate-400 group-hover:text-slate-900 group-hover:scale-110'
                  }`}
                />
                <span className="relative z-10 tracking-tight">{item.label}</span>
                {item.href === '/add-trade' && !isActive && (
                  <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100">
                    <Plus size={14} className="text-indigo-600" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Plan Upgrade CTA */}
        {subscription?.plan_id === 'free' && (
          <div className="mx-4 mb-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 relative overflow-hidden group/cta shadow-lg shadow-indigo-600/10">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover/cta:rotate-12 transition-transform">
              <Sparkles size={40} className="text-white" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white text-[11px] font-black uppercase tracking-widest mb-1">Institutional Pro</h4>
              <p className="text-white/80 text-[10px] font-bold leading-relaxed mb-4">Unlock advanced quantitative analytics and max drawdown curves.</p>
              <Link
                href="/billing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className="p-4 mx-4 mb-6 rounded-2xl bg-white border border-slate-200 relative overflow-hidden group shadow-sm">
            {isLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="space-y-2 flex-1">
                        <div className="h-2 bg-slate-100 rounded w-20" />
                        <div className="h-2 bg-slate-100 rounded w-12" />
                    </div>
                </div>
            ) : user ? (
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 p-0.5 shadow-sm">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <UserIcon size={20} className="text-indigo-600" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-black text-slate-900 truncate leading-tight">
                                {profile?.full_name || user.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Sparkles size={10} className={`${subscription?.plan_id === 'free' ? 'text-slate-400' : 'text-indigo-600 animate-pulse'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest leading-relaxed ${subscription?.plan_id === 'free' ? 'text-slate-500' : 'text-indigo-600'}`}>
                                    {getPlanBadge()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            ) : null}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 md:h-20 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 z-50 flex items-center justify-around px-2 shadow-xl shadow-slate-200/50">
        {navItems
          .filter(item => ['Dashboard', 'Trades', 'Add Trade', 'Analytics', 'Settings'].includes(item.label))
          .concat([{ href: '#', label: 'Logout', icon: LogOut, onClick: signOut }])
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick || null}
                {...(item.href !== '#' ? { as: Link, href: item.href } : {})}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-slate-900'
                } ${item.label === 'Logout' ? 'hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl' : ''}`}
              >
                {item.href === '/add-trade' ? (
                  <Link href="/add-trade">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center -mt-8 shadow-xl shadow-indigo-600/40 border-4 border-slate-50">
                      <Icon size={24} className="text-white" />
                    </div>
                  </Link>
                ) : item.href !== '#' ? (
                  <Link href={item.href} className="flex flex-col items-center p-2 rounded-xl">
                      <Icon size={22} />
                      {isActive && <div className="absolute bottom-0 w-1 h-1 rounded-full bg-indigo-600" />}
                  </Link>
                ) : (
                  <div className="flex flex-col items-center" onClick={item.onClick}>
                      <Icon size={22} />
                  </div>
                )}
              </button>
            );
          })}
      </nav>
    </>
  );
}
