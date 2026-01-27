import { Team } from '@/types/team.types'
import { TeamStats } from './TeamStats'
import { MatchResultList } from './MatchResultList'
import { Tabs, Tab } from '@/components/ui/Tabs'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TeamDetailViewProps {
  team: Team
  tours: string[]
  selectedTour: string
  onTourChange: (tour: string) => void
  onBack: () => void
}

// Helper to get division color
function getDivisionColor(division: string): string {
  const div = division.toUpperCase()
  if (div.includes('N1') || div.includes('NAT')) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  if (div.includes('R1') || div.includes('REG')) return 'bg-gray-200 text-gray-800 border-gray-400'
  if (div.includes('D1') || div.includes('DEP')) return 'bg-orange-100 text-orange-800 border-orange-300'
  return 'bg-blue-100 text-blue-800 border-blue-300'
}

export function TeamDetailView({
  team,
  tours,
  selectedTour,
  onTourChange,
  onBack,
}: TeamDetailViewProps) {
  // Prepare tabs for tours
  const tourTabs: Tab[] = tours.map((tour) => ({
    id: tour,
    label: `Tour ${tour}`,
  }))

  // Get matches for the selected tour
  const selectedMatches = tours
    .filter(tour => tour === selectedTour)
    .map(tour => team.matches[tour])
    .filter(Boolean)

  return (
    <div className="space-y-6" data-testid="team-detail-view">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour aux équipes</span>
      </button>

      {/* Team Header */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
          <span className={cn('text-sm font-medium px-3 py-1 rounded border', getDivisionColor(team.division))}>
            {team.division}
          </span>
        </div>
        <p className="text-gray-600">
          {team.gender === 'G' ? '👨 Équipe masculine' : '👩 Équipe féminine'}
        </p>
      </div>

      {/* Team Stats */}
      <TeamStats team={team} />

      {/* Tour Tabs */}
      <div className="bg-white rounded-card shadow-card">
        <Tabs
          tabs={tourTabs}
          activeTab={selectedTour}
          onChange={onTourChange}
        />

        {/* Match Results for Selected Tour */}
        <div className="p-6">
          <MatchResultList matches={selectedMatches} tourNumbers={[selectedTour]} />
        </div>
      </div>
    </div>
  )
}
