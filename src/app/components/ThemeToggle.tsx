import { useTheme } from '@/app/providers/ThemeProvider';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === 'dark' ? 'Светлая' : 'Тёмная';
  const nextThemeLabelAccusative = theme === 'dark' ? 'светлую' : 'тёмную';
  const icon = theme === 'dark' ? '☀' : '◐';

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle-compact' : ''}`}
      onClick={toggleTheme}
      aria-label={`Переключить тему на ${nextThemeLabelAccusative}`}
      title={`Переключить тему на ${nextThemeLabelAccusative}`}
    >
      {compact ? icon : `${icon} ${nextThemeLabel}`}
    </button>
  );
}
