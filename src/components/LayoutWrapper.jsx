'use client';

import { useTheme } from './ThemeProvider';
import { PanelLeftOpen } from 'lucide-react';

export default function LayoutWrapper({ children }) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useTheme();

  return (
    <div className="flex min-h-screen relative">
      {/* Restore Sidebar Trigger (Only visible when collapsed) */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className={`fixed left-6 top-6 z-50 p-3 rounded-2xl glass-card border-white/10 text-[var(--accent)] shadow-2xl transition-all duration-700 hover:scale-110 active:scale-95 ${
          isSidebarCollapsed ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0 pointer-events-none'
        }`}
        title="Restore Sidebar"
      >
        <PanelLeftOpen size={20} />
      </button>

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-[260px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
