import { X, FilterX } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface ActiveFilter {
  key: string
  label: string
  value: string
  onRemove: () => void
}

interface FilterSummaryProps {
  filters: ActiveFilter[]
  onClearAll: () => void
  className?: string
}

export function FilterSummary({ filters, onClearAll, className }: FilterSummaryProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filtres actifs:
      </span>

      {/* Active filter chips */}
      {filters.map((filter) => (
        <div
          key={filter.key}
          className={cn(
            'inline-flex items-center gap-1.5',
            'px-3 py-1.5 rounded-full',
            'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
            'text-sm font-medium',
            'border border-primary-200 dark:border-primary-800',
            'animate-fadeIn'
          )}
        >
          <span className="text-xs text-primary-600 dark:text-primary-400">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={filter.onRemove}
            className={cn(
              'ml-1 rounded-full',
              'text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200',
              'hover:bg-primary-100 dark:hover:bg-primary-900/40',
              'transition-all duration-200',
              'p-0.5',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      {/* Clear all button */}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className={cn(
            'inline-flex items-center gap-1.5',
            'px-3 py-1.5 rounded-full',
            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
            'text-sm font-medium',
            'border border-red-200 dark:border-red-800',
            'hover:bg-red-100 dark:hover:bg-red-900/30',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-red-500'
          )}
        >
          <FilterX className="w-3 h-3" />
          Tout effacer
        </button>
      )}
    </div>
  )
}
