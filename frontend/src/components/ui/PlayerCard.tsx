import { Competitor } from '@/types/competitor.types'
import { GenderIcon } from '@/components/shared/GenderIcon'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'

interface PlayerCardProps {
  competitor: Competitor
  onClick?: () => void
}

export function PlayerCard({ competitor, onClick }: PlayerCardProps) {
  return (
    <div
      className="bg-white rounded-card shadow-card p-4 hover:shadow-card-hover transition-shadow cursor-pointer"
      onClick={onClick}
      data-testid="player-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <GenderIcon gender={competitor.sexe} />
          <div>
            <h3 className="font-semibold text-gray-900" data-testid="player-name">
              {competitor.prenom} {competitor.nom}
            </h3>
            <p className="text-sm text-gray-500">{competitor.cat}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {competitor.licence}
        </span>
      </div>

      {/* Points */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-primary">
          {competitor.point} pts
        </p>
      </div>

      {/* Progressions */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Mensuelle</p>
          <ProgressionBadge value={competitor.prg_m} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Phase</p>
          <ProgressionBadge value={competitor.prg_p} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Annuelle</p>
          <ProgressionBadge value={competitor.prg_a} />
        </div>
      </div>

      {/* Match count */}
      <div className="pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {competitor.parties} match{competitor.parties !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
