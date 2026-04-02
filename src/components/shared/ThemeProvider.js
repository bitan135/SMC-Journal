'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Default to light
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Mark as mounted to prevent hydration mismatches
    setMounted(true);

    // 2. Hydrate theme from localStorage (with fallback to light)
    const savedTheme = localStorage.getItem('theme') || 'light';
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

    const applyTheme = (currentTheme) => {
      const root = window.document.documentElement;
      if (currentTheme === 'auto') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.setAttribute('data-theme', systemTheme);
      } else {
        root.setAttribute('data-theme', currentTheme);
      }
      localStorage.setItem('theme', currentTheme);
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
