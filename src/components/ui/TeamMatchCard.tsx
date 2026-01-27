import { Match } from '@/types/team.types'
import { formatDate } from '@/utils/formatting'
import { cn } from '@/utils/cn'

interface TeamMatchCardProps {
  match: Match
}

export function TeamMatchCard({ match }: TeamMatchCardProps) {
  if (!match.adversaire) {
    return (
      <div className="bg-gray-50 rounded p-3 text-center text-gray-400">
        <span>-</span>
      </div>
    )
  }

  const ourScore = match.score_us || 0
  const theirScore = match.score_adv || 0

  let resultClass = 'bg-gray-50 text-draw'
  let resultLabel = 'N'

  if (ourScore > theirScore) {
    resultClass = 'bg-green-50 text-victory'
    resultLabel = 'V'
  } else if (ourScore < theirScore) {
    resultClass = 'bg-red-50 text-defeat'
    resultLabel = 'D'
  }

  return (
    <div
      className={cn('rounded p-3 transition-colors', resultClass)}
      data-testid="team-match-card"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">{match.adversaire}</span>
        <span className="text-xs font-bold px-2 py-1 bg-white rounded">
          {resultLabel}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {ourScore} - {theirScore}
        </span>
        <span className="text-xs text-gray-600">
          {match.domicile ? 'Dom.' : 'Ext.'}
        </span>
      </div>

      {match.date && (
        <div className="mt-2 text-xs text-gray-500">
          {formatDate(match.date)}
        </div>
      )}
    </div>
  )
}
