import { Team } from '@/types/team.types'
import { TeamCard } from './TeamCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

interface TeamOverviewViewProps {
  teams: Team[]
  onSelectTeam: (teamId: string) => void
}

export function TeamOverviewView({ teams, onSelectTeam }: TeamOverviewViewProps) {
  if (teams.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-16 h-16" />}
        title="Aucune équipe à afficher"
        description="Aucune équipe ne correspond aux filtres sélectionnés."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="team-overview">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onSelect={() => onSelectTeam(team.id)}
        />
      ))}
    </div>
  )
}
