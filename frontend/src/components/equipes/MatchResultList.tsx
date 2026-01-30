import { Match } from '@/types/team.types'
import { formatDate } from '@/utils/formatting'
import { cn } from '@/utils/cn'
import { Calendar, MapPin } from 'lucide-react'

interface MatchResultListProps {
  matches: Match[]
  tourNumbers: string[]
}

export function MatchResultList({ matches, tourNumbers }: MatchResultListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500" data-testid="empty-matches">
        <p>Aucun match pour cette équipe</p>
      </div>
    )
  }

  return (
    <div className="space-y-3" data-testid="match-result-list">
      {tourNumbers.map((tour) => {
        const match = matches.find(m => m.tour === tour)

        // Check if match exists and has scores
        const homeScore = String(match?.score_domicile || '').trim()
        const awayScore = String(match?.score_exterieur || '').trim()
        const hasScores = homeScore !== '' && awayScore !== ''

        if (!match || !hasScores) {
          return (
            <div
              key={tour}
              className="bg-gray-50 rounded-lg p-4 text-center text-gray-600"
            >
              <span className="text-sm font-medium">Tour {tour}</span>
              <p className="text-sm mt-1">Match non programmé</p>
            </div>
          )
        }

        const isHome = match.is_home === 'True'
        const ourScore = parseInt(isHome ? match.score_domicile : match.score_exterieur) || 0
        const theirScore = parseInt(isHome ? match.score_exterieur : match.score_domicile) || 0
        const opponent = isHome ? match.equipe_exterieur : match.equipe_domicile

        let resultClass = 'border-gray-300 bg-white'
        let resultBadgeClass = 'bg-gray-100 text-gray-700'
        let resultText = 'N'

        if (ourScore > theirScore) {
          resultClass = 'border-victory bg-victory-light'
          resultBadgeClass = 'bg-victory text-white'
          resultText = 'V'
        } else if (ourScore < theirScore) {
          resultClass = 'border-defeat bg-defeat-light'
          resultBadgeClass = 'bg-defeat text-white'
          resultText = 'D'
        }

        return (
          <div
            key={tour}
            className={cn('rounded-lg border-2 p-4 transition-all', resultClass)}
            data-testid="match-card"
          >
            {/* Tour and Result Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Tour {tour}</span>
              <span className={cn('text-xs font-bold px-3 py-1 rounded-full', resultBadgeClass)}>
                {resultText}
              </span>
            </div>

            {/* Opponent Name */}
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {opponent}
            </h4>

            {/* Score */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-3xl font-bold text-primary">{ourScore}</span>
              <span className="text-gray-400">-</span>
              <span className="text-3xl font-bold text-gray-600">{theirScore}</span>
            </div>

            {/* Match Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{isHome ? 'Domicile' : 'Extérieur'}</span>
              </div>

              {/* Date */}
              {match.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(match.date)}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
