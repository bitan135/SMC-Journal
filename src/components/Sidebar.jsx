'use client';

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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-500 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
            EdgeLedger
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[var(--sidebar-active)] text-[var(--accent)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card)]'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                  }`}
                />
                {item.label}
                {item.href === '/add-trade' && (
                  <span className="ml-auto w-5 h-5 rounded-md bg-[var(--accent)] text-white flex items-center justify-center text-xs">
                    +
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)]">
            EdgeLedger v1.0
          </p>
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
        </div>
      </nav>
    </>
  );
}
