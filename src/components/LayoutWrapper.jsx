'use client';

import { useTheme } from './ThemeProvider';
import { PanelLeftOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useTheme();
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/auth/callback' ||
    pathname === '/' ||
    pathname === '/features' ||
    pathname === '/pricing' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname.startsWith('/affiliate');


  return (
    <div className="flex min-h-screen relative">
      {/* Restore Sidebar Trigger (Only visible when collapsed and not on auth page) */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className={`fixed left-6 top-6 z-50 p-3 rounded-2xl glass-card border-[var(--glass-border)] text-[var(--accent)] shadow-2xl transition-all duration-700 hover:scale-110 active:scale-95 ${
          isSidebarCollapsed && !isAuthPage ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0 pointer-events-none'
        }`}
        title="Restore Sidebar"
      >
        <PanelLeftOpen size={20} />
      </button>

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isSidebarCollapsed || isAuthPage ? 'lg:pl-0' : 'lg:pl-[260px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
