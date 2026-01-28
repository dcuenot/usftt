import { Team } from '@/types/team.types'
import { TeamCard } from './TeamCard'
import { Accordion } from '@/components/ui/Accordion'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'

interface TeamOverviewByLevelProps {
  teams: Team[]
  onSelectTeam: (teamId: string) => void
}

// Helper to determine division level
function getDivisionLevel(division: string): 'Nationale' | 'Régionale' | 'Départementale' | 'Autre' {
  const div = division.toUpperCase()
  if (div.includes('N1') || div.includes('N2') || div.includes('N3') || div.includes('NAT')) {
    return 'Nationale'
  }
  if (div.includes('R1') || div.includes('R2') || div.includes('R3') || div.includes('REG') || div.includes('PN')) {
    return 'Régionale'
  }
  if (div.includes('D1') || div.includes('D2') || div.includes('D3') || div.includes('D4') || div.includes('DEP') || div.includes('PR')) {
    return 'Départementale'
  }
  return 'Autre'
}

export function TeamOverviewByLevel({ teams, onSelectTeam }: TeamOverviewByLevelProps) {
  if (teams.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-16 h-16" />}
        title="Aucune équipe à afficher"
        description="Aucune équipe ne correspond aux filtres sélectionnés."
      />
    )
  }

  // Group teams by division level
  const teamsByLevel = {
    Nationale: teams.filter(t => getDivisionLevel(t.division) === 'Nationale'),
    Régionale: teams.filter(t => getDivisionLevel(t.division) === 'Régionale'),
    Départementale: teams.filter(t => getDivisionLevel(t.division) === 'Départementale'),
    Autre: teams.filter(t => getDivisionLevel(t.division) === 'Autre'),
  }

  // Define level order and display info
  const levels = [
    { key: 'Nationale', label: 'Équipes Nationales', color: 'text-gray-700' },
    { key: 'Régionale', label: 'Équipes Régionales', color: 'text-gray-700' },
    { key: 'Départementale', label: 'Équipes Départementales', color: 'text-gray-700' },
    { key: 'Autre', label: 'Autres Équipes', color: 'text-gray-700' },
  ] as const

  return (
    <div className="space-y-4">
      {levels.map(({ key, label, color }) => {
        const levelTeams = teamsByLevel[key]

        if (levelTeams.length === 0) {
          return null
        }

        return (
          <Accordion
            key={key}
            title={
              <div className="flex items-center justify-between w-full">
                <span className={`text-lg font-semibold ${color}`}>
                  {label}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({levelTeams.length} équipe{levelTeams.length > 1 ? 's' : ''})
                </span>
              </div>
            }
            defaultOpen={true}
            className="bg-white rounded-card shadow-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {levelTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onSelect={() => onSelectTeam(team.id)}
                />
              ))}
            </div>
          </Accordion>
        )
      })}
    </div>
  )
}
