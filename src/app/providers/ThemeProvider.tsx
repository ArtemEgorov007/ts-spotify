import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/app/config/storage';

type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  return 'dark';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }

  return ctx;
}
