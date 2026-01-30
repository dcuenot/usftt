import { useMemo, useState } from 'react'
import { useTeamData } from '@/hooks/useTeamData'
import { LastUpdate } from '@/components/shared/LastUpdate'
import { DenseTeamsView } from '@/components/equipes/DenseTeamsView'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { ExportButton } from '@/components/ui/ExportButton'
import { useToast } from '@/components/ui/Toast'
import { exportToCSV, generateFilename } from '@/utils/export'

export function EquipesPage() {
  const { teams, loading, error, lastModified } = useTeamData()
  const [genderFilter, setGenderFilter] = useState<'all' | 'G' | 'F'>('all')
  const { showToast } = useToast()

  // Filter teams by gender
  const filteredTeams = useMemo(() => {
    if (genderFilter === 'all') return teams
    return teams.filter((team) => team.gender === genderFilter)
  }, [teams, genderFilter])

  // Get all unique tour numbers (sorted)
  const tours = useMemo(() => {
    const tourSet = new Set<string>()
    teams.forEach((team) => {
      Object.keys(team.matches).forEach((tour) => {
        tourSet.add(tour)
      })
    })
    return Array.from(tourSet)
      .map((t) => parseInt(t))
      .sort((a, b) => a - b)
      .map((t) => t.toString())
  }, [teams])

  // Export handler
  const handleExport = () => {
    // Flatten team data for CSV export
    const exportData = filteredTeams.map((team) => ({
      equipe: team.name,
      division: team.division,
      phase: team.phase,
      genre: team.gender === 'G' ? 'Masculin' : 'Féminin',
      classement: team.ranking.rang,
      points: team.ranking.points,
      matches_joues: team.ranking.joues,
      victoires: team.ranking.victoires,
      nuls: team.ranking.nuls,
      defaites: team.ranking.defaites,
      forfaits: team.ranking.forfaits,
    }))

    const exportHeaders = [
      { key: 'equipe', label: 'Équipe' },
      { key: 'division', label: 'Division' },
      { key: 'phase', label: 'Phase' },
      { key: 'genre', label: 'Genre' },
      { key: 'classement', label: 'Classement' },
      { key: 'points', label: 'Points' },
      { key: 'matches_joues', label: 'Matchs joués' },
      { key: 'victoires', label: 'Victoires' },
      { key: 'nuls', label: 'Nuls' },
      { key: 'defaites', label: 'Défaites' },
      { key: 'forfaits', label: 'Forfaits' },
    ]

    const filename = generateFilename('equipes_usftt')
    exportToCSV(exportData, exportHeaders, filename)

    showToast(
      `${filteredTeams.length} équipe${filteredTeams.length > 1 ? 's' : ''} exportée${filteredTeams.length > 1 ? 's' : ''} dans ${filename}`,
      'success'
    )
  }

  if (loading) {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-0">Résultats par équipes</h1>
          <LastUpdate lastModified={null} loading={true} variant="relative" />
        </div>

        {/* Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Résultats par équipes</h1>
        <ErrorState
          title="Erreur de chargement"
          message="Impossible de charger les résultats des équipes. Veuillez réessayer."
          error={error}
          onRetry={() => window.location.reload()}
          variant="compact"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="mb-2">Résultats par équipes</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Gender Filter and Export */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm gap-1 md:gap-0">
          <button
            onClick={() => setGenderFilter('all')}
            className={`px-4 py-2.5 md:py-2 rounded-md font-medium text-sm transition-all min-h-[44px] md:min-h-0 ${
              genderFilter === 'all'
                ? 'bg-gray-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setGenderFilter('G')}
            className={`px-4 py-2.5 md:py-2 rounded-md font-medium text-sm transition-all min-h-[44px] md:min-h-0 ${
              genderFilter === 'G'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Masculines
          </button>
          <button
            onClick={() => setGenderFilter('F')}
            className={`px-4 py-2.5 md:py-2 rounded-md font-medium text-sm transition-all min-h-[44px] md:min-h-0 ${
              genderFilter === 'F'
                ? 'bg-violet-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Féminines
          </button>
        </div>

        <ExportButton
          onClick={handleExport}
          disabled={filteredTeams.length === 0}
          size="sm"
        />
      </div>

      {/* Dense Teams View */}
      <DenseTeamsView
        teams={filteredTeams}
        tours={tours}
      />
    </div>
  )
}
