'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'auto';
    }
    return 'auto';
  });
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme) => {
      if (currentTheme === 'auto') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.setAttribute('data-theme', systemTheme);
      } else {
        root.setAttribute('data-theme', currentTheme);
      }
      
      // Only set if we have a real value to avoid overwriting during transitions
      if (currentTheme && currentTheme !== 'undefined') {
        localStorage.setItem('theme', currentTheme);
      }
    };

    applyTheme(theme);

    // Persist sidebar state
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', isSidebarCollapsed);
    }

    const handleChange = () => {
      if (theme === 'auto') applyTheme('auto');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  // or using a strategy that ensures client/server sync.
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isSidebarCollapsed, 
      setSidebarCollapsed 
    }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
