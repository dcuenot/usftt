import { Competitor } from '@/types/competitor.types'
import { GenderIcon } from '@/components/shared/GenderIcon'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'
import { Accordion } from '@/components/ui/Accordion'

interface PlayerRankingCardProps {
  competitor: Competitor
  rank?: number
}

export function PlayerRankingCard({ competitor, rank }: PlayerRankingCardProps) {
  return (
    <div
      className="card-elevated"
      data-testid="player-ranking-card"
    >
      {/* Main Card Content */}
      <div className="p-4">
        {/* Header Row with Rank and Gender */}
        <div className="flex items-start justify-between mb-3">
          {rank && (
            <div className="text-2xl font-bold text-gray-400">
              #{rank}
            </div>
          )}
          <GenderIcon gender={competitor.sexe} />
        </div>

        {/* Player Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1" data-testid="player-name">
          {competitor.prenom} {competitor.nom}
        </h3>

        {/* Category Badge */}
        <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded mb-3">
          {competitor.cat}
        </span>

        {/* Points - Prominent Display */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Points officiels</div>
          <div className="text-3xl font-bold text-primary">
            {Math.round(competitor.point)}
          </div>
        </div>

        {/* Main Progression */}
        <div className="flex items-center justify-between py-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Prog. Mensuelle</span>
          <ProgressionBadge value={competitor.prg_m} />
        </div>

        {/* Match Count */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Matchs joués</span>
          <span className="text-sm font-medium text-gray-900">{competitor.parties}</span>
        </div>
      </div>

      {/* Expandable Details */}
      <Accordion
        trigger={
          <div className="px-4 py-2 text-sm text-primary font-medium">
            Voir plus de détails
          </div>
        }
        content={
          <div className="px-4 space-y-3" data-testid="card-details">
            {/* Additional Progressions */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prog. Phase</span>
              <ProgressionBadge value={competitor.prg_p} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Prog. Annuelle</span>
              <ProgressionBadge value={competitor.prg_a} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Licence</span>
              <span className="text-sm font-mono text-gray-900">{competitor.licence}</span>
            </div>
          </div>
        }
      />
    </div>
  )
}
