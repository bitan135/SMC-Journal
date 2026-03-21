'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // Default to dark for "everyone, for now"
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Mark as mounted to prevent hydration mismatches
    setMounted(true);

    // 2. Hydrate theme from localStorage (with fallback to dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // 3. Hydrate sidebar state
    const savedCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSidebarCollapsed(c => (c === savedCollapsed ? c : savedCollapsed));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const pathname = window.location.pathname;

    // List of routes that MUST be light theme
    const forceLightRoutes = ['/', '/terms', '/privacy'];
    const isAffiliate = pathname.startsWith('/affiliate');
    const isForcedLight = forceLightRoutes.includes(pathname) || isAffiliate;

    const applyTheme = (currentTheme) => {
      // If the route is forced light, ignore the state and force 'light'
      const activeTheme = isForcedLight ? 'light' : currentTheme;

      if (activeTheme === 'auto') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.setAttribute('data-theme', systemTheme);
      } else {
        root.setAttribute('data-theme', activeTheme);
      }
      
      // Only persist if not forced
      if (!isForcedLight && currentTheme && currentTheme !== 'undefined') {
        localStorage.setItem('theme', currentTheme);
      }
    };

    applyTheme(theme);

    const handleChange = () => {
      if (theme === 'auto') applyTheme('auto');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', isSidebarCollapsed);
    }
  }, [isSidebarCollapsed, mounted]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  // or using a strategy that ensures client/server sync.
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isSidebarCollapsed, 
      setSidebarCollapsed 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
