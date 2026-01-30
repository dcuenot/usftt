import { Skeleton } from './Skeleton'

interface SkeletonTableProps {
  rows?: number
  columns?: number
  message?: string
}

export function SkeletonTable({ rows = 5, columns = 6, message }: SkeletonTableProps) {
  return (
    <div>
      {message && (
        <p className="text-sm text-gray-500 mb-4 animate-pulse">{message}</p>
      )}
      <div className="overflow-x-auto" data-testid="skeleton-table">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" animation="shimmer" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" animation="shimmer" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
