import { useMemo, useState } from 'react'
import { useTeamData } from '@/hooks/useTeamData'
import { LastUpdate } from '@/components/shared/LastUpdate'
import { TeamOverviewByLevel } from '@/components/equipes/TeamOverviewByLevel'
import { TeamDetailView } from '@/components/equipes/TeamDetailView'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

export function EquipesPage() {
  const { teams, loading, error, lastModified } = useTeamData()
  const [genderFilter, setGenderFilter] = useState<'all' | 'G' | 'F'>('all')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [selectedTour, setSelectedTour] = useState<string>('1')

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

  // Get selected team
  const selectedTeam = useMemo(() => {
    if (!selectedTeamId) return null
    return teams.find(team => team.id === selectedTeamId) || null
  }, [selectedTeamId, teams])

  // Handle back to overview
  const handleBack = () => {
    setSelectedTeamId(null)
    setSelectedTour('1') // Reset to first tour
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  // Show detail view if team is selected
  if (selectedTeam) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="mb-0">Résultats par équipes</h1>
          <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
        </div>

        {/* Team Detail View */}
        <TeamDetailView
          team={selectedTeam}
          tours={tours}
          selectedTour={selectedTour}
          onTourChange={setSelectedTour}
          onBack={handleBack}
        />
      </div>
    )
  }

  // Show overview (default)
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="mb-0">Résultats par équipes</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Gender Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setGenderFilter('all')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            genderFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setGenderFilter('G')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            genderFilter === 'G'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Masculines
        </button>
        <button
          onClick={() => setGenderFilter('F')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            genderFilter === 'F'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Féminines
        </button>
      </div>

      {/* Teams count */}
      <div className="text-sm text-gray-600">
        {filteredTeams.length} équipe{filteredTeams.length > 1 ? 's' : ''}
      </div>

      {/* Team Overview by Division Level */}
      <TeamOverviewByLevel
        teams={filteredTeams}
        onSelectTeam={setSelectedTeamId}
      />
    </div>
  )
}
