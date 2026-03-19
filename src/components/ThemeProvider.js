'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('auto');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
    
    const savedCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    setSidebarCollapsed(savedCollapsed);
  }, []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
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
      
      if (currentTheme && currentTheme !== 'undefined') {
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
