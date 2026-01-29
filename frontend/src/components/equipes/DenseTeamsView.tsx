import { useMemo } from 'react'
import { Team } from '@/types/team.types'
import { DenseTeamTable } from './DenseTeamTable'
import { CompactTeamCard } from './CompactTeamCard'
import { Accordion } from '@/components/ui/Accordion'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface DenseTeamsViewProps {
  teams: Team[]
  tours: string[]
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

export function DenseTeamsView({ teams, tours }: DenseTeamsViewProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Group teams by phase and division level
  const teamsByPhaseAndLevel = useMemo(() => {
    const grouped: Record<string, Record<string, Team[]>> = {}

    teams.forEach((team) => {
      const phase = team.phase
      const level = getDivisionLevel(team.division)

      if (!grouped[phase]) {
        grouped[phase] = {
          Nationale: [],
          Régionale: [],
          Départementale: [],
          Autre: [],
        }
      }

      grouped[phase][level].push(team)
    })

    return grouped
  }, [teams])

  // Get sorted phases (Phase 2 before Phase 1, etc.)
  const phases = useMemo(() => {
    return Object.keys(teamsByPhaseAndLevel).sort((a, b) => parseInt(b) - parseInt(a))
  }, [teamsByPhaseAndLevel])

  // Define level order and display info
  const levels = [
    { key: 'Nationale', label: 'Nationale', color: 'text-gray-700' },
    { key: 'Régionale', label: 'Régionale', color: 'text-gray-700' },
    { key: 'Départementale', label: 'Départementale', color: 'text-gray-700' },
    { key: 'Autre', label: 'Autre', color: 'text-gray-700' },
  ] as const

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
    <div className="space-y-6" data-testid="dense-teams-view">
      {phases.map((phase) => {
        const phaseTeams = teamsByPhaseAndLevel[phase]
        const totalPhaseTeams = Object.values(phaseTeams).reduce((sum, arr) => sum + arr.length, 0)

        return (
          <div key={phase} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Phase {phase}</h2>
              <span className="text-sm text-gray-500">
                ({totalPhaseTeams} équipe{totalPhaseTeams > 1 ? 's' : ''})
              </span>
            </div>

            {/* Division Levels within Phase */}
            <div className="space-y-4">
              {levels.map(({ key, label, color }) => {
                const levelTeams = phaseTeams[key]

                if (!levelTeams || levelTeams.length === 0) {
                  return null
                }

                return (
                  <Accordion
                    key={`${phase}-${key}`}
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
                    <div className="pt-4">
                      {/* Desktop: Table View */}
                      {isDesktop ? (
                        <DenseTeamTable
                          teams={levelTeams}
                          tours={tours}
                        />
                      ) : (
                        /* Mobile: Compact Card View */
                        <div className="space-y-3">
                          {levelTeams.map((team) => (
                            <CompactTeamCard
                              key={team.id}
                              team={team}
                              tours={tours}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Accordion>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
