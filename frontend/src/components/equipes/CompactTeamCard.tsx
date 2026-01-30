import { ReactNode } from 'react'
import { Team } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { Home, Plane } from 'lucide-react'

interface CompactTeamCardProps {
  team: Team
  tours: string[]
}

// Helper to get division color based on gender
function getDivisionColor(gender: string): string {
  if (gender === 'G') {
    return 'bg-blue-100 text-blue-800 border-blue-300'
  } else {
    return 'bg-violet-100 text-violet-800 border-violet-300'
  }
}

// Helper to get match result
function getMatchResult(team: Team, tour: string): { icon: string | ReactNode; color: string; bgColor: string; score: string } {
  const match = team.matches[tour]

  // If no match data or both scores are empty, match not played yet
  if (!match || (!match.score_domicile && !match.score_exterieur)) {
    // Match not yet played - show home/away indicator
    const isHome = match?.is_home === 'True'
    return {
      icon: isHome ? <Home className="w-4 h-4" /> : <Plane className="w-4 h-4" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100',
      score: ''
    }
  }

  // If at least one score exists, match was played (treat empty as 0 for forfeits)
  const isHome = match.is_home === 'True'
  const ourScore = parseInt(isHome ? (match.score_domicile || '0') : (match.score_exterieur || '0')) || 0
  const theirScore = parseInt(isHome ? (match.score_exterieur || '0') : (match.score_domicile || '0')) || 0

  if (ourScore > theirScore) {
    return { icon: '✓', color: 'text-victory', bgColor: 'bg-victory-light', score: `${ourScore}-${theirScore}` }
  } else if (ourScore < theirScore) {
    return { icon: '✗', color: 'text-defeat', bgColor: 'bg-defeat-light', score: `${ourScore}-${theirScore}` }
  } else {
    return { icon: '=', color: 'text-draw', bgColor: 'bg-draw-light', score: `${ourScore}-${theirScore}` }
  }
}

export function CompactTeamCard({ team, tours }: CompactTeamCardProps) {
  return (
    <div
      className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all overflow-hidden"
      data-testid="compact-team-card"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded border flex-shrink-0', getDivisionColor(team.gender))}>
              {team.division}
            </span>
            <span className="text-sm font-semibold text-gray-900 truncate">
              {team.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold',
              team.ranking.rang === 1 ? 'bg-yellow-100 text-yellow-800' :
              team.ranking.rang === 2 ? 'bg-gray-200 text-gray-700' :
              team.ranking.rang === 3 ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-600'
            )}>
              {team.ranking.rang}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {team.ranking.points} <span className="text-xs font-normal text-gray-500">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tour Results - Compact Grid */}
      <div className="px-2 py-2 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-7 gap-1">
          {tours.map((tour) => {
            const result = getMatchResult(team, tour)

            return (
              <div
                key={tour}
                className={cn(
                  'rounded border p-1.5 flex flex-col items-center justify-center',
                  result.bgColor,
                  result.color === 'text-gray-400' ? 'border-gray-300' :
                  result.color === 'text-victory' ? 'border-victory' :
                  result.color === 'text-defeat' ? 'border-defeat' :
                  'border-draw'
                )}
              >
                <div className="text-[10px] font-medium text-gray-600 leading-tight mb-0.5">
                  J{tour}
                </div>
                {result.score && (
                  <div className="text-[10px] font-semibold text-gray-900 leading-tight mt-0.5 whitespace-nowrap">
                    {result.score}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
