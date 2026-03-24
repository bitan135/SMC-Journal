'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { PanelLeftOpen } from 'lucide-react';
import { isPublicRoute } from '@/lib/routes';

export default function LayoutWrapper({ children }) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useTheme();
  const pathname = usePathname();
  
  const isPublic = isPublicRoute(pathname);

  return (
    <div className="flex min-h-screen relative">
      {/* Restore Sidebar Trigger (Only visible when collapsed and not on public route) */}
      <button
        onClick={() => setSidebarCollapsed(false)}
        className={`fixed left-6 top-6 z-50 p-3 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-md transition-all duration-500 hover:scale-110 active:scale-95 ${
          isSidebarCollapsed && !isPublic ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0 pointer-events-none'
        }`}
        title="Restore Sidebar"
      >
        <PanelLeftOpen size={20} />
      </button>

      {/* Main Content Area */}
      <main 
        className={`flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isSidebarCollapsed || isPublic ? 'lg:pl-0' : 'lg:pl-[260px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
