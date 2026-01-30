import { Sparkles, TrendingUp, Users, Trophy } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface FilterPreset {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  apply: () => void
}

interface FilterPresetsProps {
  presets: FilterPreset[]
  className?: string
}

export function FilterPresets({ presets, className }: FilterPresetsProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-3', className)}>
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={preset.apply}
          className={cn(
            'flex flex-col items-center gap-2',
            'p-4 rounded-lg',
            'bg-white dark:bg-gray-800',
            'border-2 border-gray-200 dark:border-gray-700',
            'hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/10',
            'transition-all duration-200',
            'group'
          )}
          title={preset.description}
        >
          <div
            className={cn(
              'w-10 h-10 rounded-full',
              'bg-primary-100 dark:bg-primary-900/30',
              'flex items-center justify-center',
              'text-primary',
              'group-hover:scale-110',
              'transition-transform'
            )}
          >
            {preset.icon}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            {preset.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// Export preset icons for convenience
export const presetIcons = {
  Sparkles,
  TrendingUp,
  Users,
  Trophy,
}
