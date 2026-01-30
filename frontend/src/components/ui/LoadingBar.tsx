import { cn } from '@/utils/cn'

interface LoadingBarProps {
  loading?: boolean
  variant?: 'primary' | 'success' | 'minimal'
}

export function LoadingBar({ loading = true, variant = 'primary' }: LoadingBarProps) {
  if (!loading) return null

  const variantClasses = {
    primary: 'bg-primary shadow-sm shadow-primary/20',
    success: 'bg-victory shadow-sm shadow-victory/20',
    minimal: 'bg-gray-400',
  }

  const bgClasses = {
    primary: 'bg-primary-50',
    success: 'bg-victory-50',
    minimal: 'bg-gray-100',
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-1',
        bgClasses[variant]
      )}
      data-testid="loading-bar"
      role="progressbar"
      aria-label="Loading"
      aria-busy="true"
    >
      <div
        className={cn(
          'h-full',
          variantClasses[variant]
        )}
        style={{
          width: '30%',
          animation: 'loading-bar 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}
