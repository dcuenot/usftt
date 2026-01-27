import { Team } from '@/types/team.types'
import { StatsCard } from '@/components/ui/StatsCard'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TeamStatsProps {
  team: Team
}

export function TeamStats({ team }: TeamStatsProps) {
  // Calculate stats from matches
  const matches = Object.values(team.matches)
  const playedMatches = matches.filter(m => m.adversaire && m.score_us !== undefined)

  const victories = playedMatches.filter(m => (m.score_us || 0) > (m.score_adv || 0)).length
  const defeats = playedMatches.filter(m => (m.score_us || 0) < (m.score_adv || 0)).length
  const draws = playedMatches.filter(m => (m.score_us || 0) === (m.score_adv || 0)).length

  const winPercentage = playedMatches.length > 0
    ? Math.round((victories / playedMatches.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="team-stats">
      {/* Victories */}
      <StatsCard
        title="Victoires"
        value={victories}
        subtitle={`${winPercentage}% de réussite`}
        icon={<TrendingUp className="w-6 h-6" />}
        variant="success"
      />

      {/* Defeats */}
      <StatsCard
        title="Défaites"
        value={defeats}
        icon={<TrendingDown className="w-6 h-6" />}
        variant="danger"
      />

      {/* Draws */}
      <StatsCard
        title="Nuls"
        value={draws}
        icon={<Minus className="w-6 h-6" />}
        variant="default"
      />

      {/* Total Matches */}
      <StatsCard
        title="Matchs joués"
        value={playedMatches.length}
        subtitle="Cette saison"
        icon={<Trophy className="w-6 h-6" />}
        variant="primary"
      />
    </div>
  )
}
