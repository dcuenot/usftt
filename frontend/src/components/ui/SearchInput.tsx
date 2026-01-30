import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Rechercher...',
  label,
  className,
}: SearchInputProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="icon-sm icon-muted" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label || 'Search'}
          className={cn(
            'block w-full rounded-lg border bg-white',
            'pl-10 pr-10 py-3 md:py-2.5 text-sm text-gray-900',
            'min-h-[44px] md:min-h-0',
            'placeholder-gray-500',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'hover:border-gray-400'
          )}
          data-testid="search-input"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={cn(
              'absolute inset-y-0 right-0 pr-3',
              'flex items-center',
              'text-gray-400 hover:text-gray-700',
              'transition-all duration-200',
              'hover:scale-110 active:scale-95'
            )}
            aria-label="Clear search"
          >
            <X className="icon-sm" />
          </button>
        )}
      </div>
    </div>
  )
}
