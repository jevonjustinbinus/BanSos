import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--bg-card)] font-semibold text-[var(--text-main)] shadow-sm transition-colors hover:bg-[var(--bg-soft)] ${
        compact ? 'h-10 w-10 p-0' : 'px-3 py-2 text-sm'
      }`}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <>
          <Sun size={16} className="text-[var(--accent)]" />
          {!compact && <span className="hidden sm:inline">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon size={16} className="text-[var(--accent)]" />
          {!compact && <span className="hidden sm:inline">Dark Mode</span>}
        </>
      )}
    </button>
  );
}