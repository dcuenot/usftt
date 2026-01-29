import { Skeleton } from './Skeleton'

export function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-card shadow-card p-4 space-y-3"
      data-testid="skeleton-card"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
