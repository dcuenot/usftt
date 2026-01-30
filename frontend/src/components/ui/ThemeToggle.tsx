import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils/cn'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        'bg-gray-100 dark:bg-gray-800',
        'rounded-lg p-1'
      )}
      role="group"
      aria-label="Theme selector"
    >
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'flex items-center justify-center',
            'px-3 py-1.5 rounded-md',
            'text-sm font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            theme === value
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          )}
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
        >
          <Icon className="w-4 h-4" />
          <span className="ml-1.5 hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
