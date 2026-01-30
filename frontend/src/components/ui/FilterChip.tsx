import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
  className?: string
}

export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-3 py-1.5 rounded-full',
        'bg-primary-50 text-primary-700',
        'text-sm font-medium',
        'border border-primary-200',
        'animate-fadeIn',
        className
      )}
    >
      <span className="text-xs text-primary-600">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className={cn(
          'ml-1 rounded-full',
          'text-primary-600 hover:text-primary-800',
          'hover:bg-primary-100',
          'transition-all duration-200',
          'hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-primary-500'
        )}
        aria-label={`Remove ${label} filter`}
      >
        <X className="icon-xs" />
      </button>
    </div>
  )
}
