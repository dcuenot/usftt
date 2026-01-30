import { Download, FileSpreadsheet } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ExportButtonProps {
  onClick: () => void
  label?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  showIcon?: boolean
}

export function ExportButton({
  onClick,
  label = 'Exporter CSV',
  variant = 'secondary',
  size = 'md',
  className,
  disabled = false,
  showIcon = true,
}: ExportButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variantClasses = {
    primary: cn(
      'bg-primary text-white',
      'hover:bg-primary-600',
      'focus:ring-primary',
      'disabled:bg-primary-300'
    ),
    secondary: cn(
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      'border border-gray-300 dark:border-gray-700',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'focus:ring-gray-500',
      'disabled:bg-gray-100 dark:disabled:bg-gray-900'
    ),
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2',
        'rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      {showIcon && (
        <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
      )}
      <span>{label}</span>
      <Download className="w-4 h-4" aria-hidden="true" />
    </button>
  )
}
