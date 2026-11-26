import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(null);

const THEME_KEY = 'sga_theme';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
      return true; // Default to dark futuristic theme
    } catch {
      return true;
    }
  });

  // Apply dark class to html document element whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const setTheme = useCallback((theme) => {
    const dark = theme === 'dark';
    setIsDark(dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const value = useMemo(
    () => ({ isDark, theme: isDark ? 'dark' : 'light', toggleTheme, setTheme }),
    [isDark, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
