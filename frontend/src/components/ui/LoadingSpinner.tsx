import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'base' | 'lg' | 'xl'
  variant?: 'primary' | 'success' | 'minimal' | 'dots'
  className?: string
}

export function LoadingSpinner({
  size = 'base',
  variant = 'primary',
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    base: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }

  const variantClasses = {
    primary: 'border-gray-200 border-t-primary',
    success: 'border-gray-200 border-t-victory',
    minimal: 'border-gray-200 border-t-gray-600',
    dots: '', // Handled separately
  }

  if (variant === 'dots') {
    return (
      <div className={cn('loading-dots', className)} role="status" aria-label="Loading">
        <span />
        <span />
        <span />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
