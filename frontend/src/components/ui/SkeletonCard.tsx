import { Skeleton } from './Skeleton'

interface SkeletonCardProps {
  message?: string
}

export function SkeletonCard({ message }: SkeletonCardProps) {
  return (
    <div className="space-y-3">
      {message && (
        <p className="text-sm text-gray-500 animate-pulse">{message}</p>
      )}
      <div
        className="bg-white rounded-card shadow-card p-4 space-y-3"
        data-testid="skeleton-card"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" animation="shimmer" />
          <Skeleton className="h-5 w-16" animation="shimmer" />
        </div>
        <Skeleton className="h-4 w-24" animation="shimmer" />
        <Skeleton className="h-8 w-20" animation="shimmer" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" animation="shimmer" />
          <Skeleton className="h-6 w-16" animation="shimmer" />
          <Skeleton className="h-6 w-16" animation="shimmer" />
        </div>
        <Skeleton className="h-4 w-full" animation="shimmer" />
      </div>
    </div>
  )
}
