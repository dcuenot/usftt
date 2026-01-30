import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'shimmer'
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'shimmer'
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  const animationClasses = {
    pulse: 'animate-pulse bg-gray-200',
    shimmer: 'animate-shimmer',
  }

  return (
    <div
      className={cn(
        'overflow-hidden',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      data-testid="skeleton"
      aria-busy="true"
      aria-label="Loading..."
    />
  )
}
