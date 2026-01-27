import { Team } from '@/types/team.types'
import { cn } from '@/utils/cn'

interface TeamCardProps {
  team: Team
  onSelect: () => void
}

// Helper to get division color based on gender
function getDivisionColor(gender: string): string {
  if (gender === 'G') {
    // Blue for men
    return 'bg-blue-100 text-blue-800 border-blue-300'
  } else {
    // Pink for women
    return 'bg-pink-100 text-pink-800 border-pink-300'
  }
}

export function TeamCard({ team, onSelect }: TeamCardProps) {
  // Calculate stats from matches
  const matches = Object.values(team.matches)

  // Filter played matches (both scores are not empty)
  const playedMatches = matches.filter(m => {
    const homeScore = String(m.score_domicile || '').trim()
    const awayScore = String(m.score_exterieur || '').trim()
    return homeScore !== '' && awayScore !== ''
  })

  // Calculate victories, defeats, draws
  const victories = playedMatches.filter(m => {
    const isHome = m.is_home === 'True'
    const ourScore = parseInt(isHome ? m.score_domicile : m.score_exterieur) || 0
    const theirScore = parseInt(isHome ? m.score_exterieur : m.score_domicile) || 0
    return ourScore > theirScore
  }).length

  const defeats = playedMatches.filter(m => {
    const isHome = m.is_home === 'True'
    const ourScore = parseInt(isHome ? m.score_domicile : m.score_exterieur) || 0
    const theirScore = parseInt(isHome ? m.score_exterieur : m.score_domicile) || 0
    return ourScore < theirScore
  }).length

  const draws = playedMatches.filter(m => {
    const isHome = m.is_home === 'True'
    const ourScore = parseInt(isHome ? m.score_domicile : m.score_exterieur) || 0
    const theirScore = parseInt(isHome ? m.score_exterieur : m.score_domicile) || 0
    return ourScore === theirScore
  }).length

  const winPercentage = playedMatches.length > 0
    ? Math.round((victories / playedMatches.length) * 100)
    : 0

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-card shadow-card hover:shadow-card-hover transition-all cursor-pointer p-5"
      data-testid="team-card"
    >
      {/* Team Header */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-2">
          <span className={cn('text-xs font-medium px-2 py-1 rounded border', getDivisionColor(team.gender))}>
            {team.division}
          </span>
          <h3 className="text-lg font-semibold text-gray-900" data-testid="team-name">
            {team.name}
          </h3>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {/* Victories */}
        <div className="text-center">
          <div className="text-2xl font-bold text-victory">{victories}</div>
          <div className="text-xs text-gray-500">V</div>
        </div>

        {/* Defeats */}
        <div className="text-center">
          <div className="text-2xl font-bold text-defeat">{defeats}</div>
          <div className="text-xs text-gray-500">D</div>
        </div>

        {/* Draws */}
        <div className="text-center">
          <div className="text-2xl font-bold text-draw">{draws}</div>
          <div className="text-xs text-gray-500">N</div>
        </div>

        {/* Win % */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{winPercentage}%</div>
          <div className="text-xs text-gray-500">Win</div>
        </div>
      </div>

      {/* Matches Played */}
      <div className="pt-3 border-t border-gray-200 text-sm text-gray-600 text-center">
        {playedMatches.length} match{playedMatches.length !== 1 ? 's' : ''} joué{playedMatches.length !== 1 ? 's' : ''}
      </div>

      {/* View Details Link */}
      <div className="mt-3 text-center">
        <span className="text-sm text-primary font-medium hover:underline">
          Voir le calendrier →
        </span>
      </div>
    </div>
  )
}
