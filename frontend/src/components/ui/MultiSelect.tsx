import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Sélectionner...',
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleClearAll = () => {
    onChange([])
  }

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)

  return (
    <div className={cn('relative w-full', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between',
          'px-4 py-2.5 rounded-lg',
          'border border-gray-300 dark:border-gray-700',
          'bg-white dark:bg-gray-800',
          'text-sm text-gray-900 dark:text-gray-100',
          'hover:border-gray-400 dark:hover:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-all duration-200'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-left truncate">
          {value.length === 0 ? (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          ) : value.length === 1 ? (
            selectedLabels[0]
          ) : (
            `${value.length} sélectionnés`
          )}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 ml-2 text-gray-500 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'bg-white dark:bg-gray-800',
            'border border-gray-300 dark:border-gray-700',
            'rounded-lg shadow-lg',
            'max-h-60 overflow-auto',
            'animate-fadeIn'
          )}
          role="listbox"
        >
          {/* Clear all button */}
          {value.length > 0 && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClearAll}
                className={cn(
                  'w-full px-3 py-2 rounded-md',
                  'text-sm font-medium text-red-600 dark:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'transition-colors'
                )}
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Options */}
          <div className="p-1">
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggle(option.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md',
                    'text-sm text-left',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors',
                    isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center',
                      'w-4 h-4 rounded border',
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn(isSelected && 'font-medium text-primary')}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLabels.map((label, index) => (
            <div
              key={index}
              className={cn(
                'inline-flex items-center gap-1',
                'px-2 py-1 rounded-md',
                'bg-primary-50 dark:bg-primary-900/20',
                'text-xs font-medium text-primary-700 dark:text-primary-300',
                'border border-primary-200 dark:border-primary-800'
              )}
            >
              {label}
              <button
                type="button"
                onClick={() => handleToggle(value[index])}
                className={cn(
                  'hover:bg-primary-100 dark:hover:bg-primary-900/40',
                  'rounded-full p-0.5',
                  'transition-colors'
                )}
                aria-label={`Remove ${label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
