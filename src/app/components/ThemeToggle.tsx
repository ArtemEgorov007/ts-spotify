import { useTheme } from '@/app/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

type ThemeToggleProps = {
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === 'dark' ? 'Светлая' : 'Тёмная';
  const nextThemeLabelAccusative = theme === 'dark' ? 'светлую' : 'тёмную';

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle-compact' : ''}${className ? ` ${className}` : ''}`}
      onClick={toggleTheme}
      aria-label={`Переключить тему на ${nextThemeLabelAccusative}`}
      title={`Переключить тему на ${nextThemeLabelAccusative}`}
    >
      {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      {!compact && <span>{nextThemeLabel}</span>}
    </button>
  );
}
