import { useTheme } from '@/app/providers/ThemeProvider';
import { SunIcon, MoonIcon } from '@/shared/icons/Icons';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === 'dark' ? 'Светлая' : 'Тёмная';
  const nextThemeLabelAccusative = theme === 'dark' ? 'светлую' : 'тёмную';

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle-compact' : ''}`}
      onClick={toggleTheme}
      aria-label={`Переключить тему на ${nextThemeLabelAccusative}`}
      title={`Переключить тему на ${nextThemeLabelAccusative}`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      {!compact && <span>{nextThemeLabel}</span>}
    </button>
  );
}
