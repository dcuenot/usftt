import { Clock } from 'lucide-react'
import { formatLastUpdate, getRelativeTime } from '@/utils/timestamp'
import { Skeleton } from '@/components/ui/Skeleton'

interface LastUpdateProps {
  lastModified: Date | null
  loading?: boolean
  variant?: 'full' | 'relative' | 'compact'
}

export function LastUpdate({
  lastModified,
  loading = false,
  variant = 'full',
}: LastUpdateProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2" data-testid="timestamp-skeleton">
        <Clock className="w-4 h-4 text-gray-400" />
        <Skeleton className="h-4 w-48" />
      </div>
    )
  }

  if (!lastModified) {
    return null
  }

  const getDisplayText = () => {
    switch (variant) {
      case 'relative':
        return `Mise à jour ${getRelativeTime(lastModified)}`
      case 'compact':
        const date = new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
        }).format(lastModified)
        return `MAJ: ${date}`
      case 'full':
      default:
        return formatLastUpdate(lastModified)
    }
  }

  return (
    <div
      className="flex items-center gap-2 text-sm text-gray-600"
      title={formatLastUpdate(lastModified)}
      data-testid="last-update"
    >
      <Clock className="w-4 h-4" />
      <span>{getDisplayText()}</span>
    </div>
  )
}
