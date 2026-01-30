import { useMemo, useState } from 'react'
import { useTeamData } from '@/hooks/useTeamData'
import { LastUpdate } from '@/components/shared/LastUpdate'
import { DenseTeamsView } from '@/components/equipes/DenseTeamsView'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

export function EquipesPage() {
  const { teams, loading, error, lastModified } = useTeamData()
  const [genderFilter, setGenderFilter] = useState<'all' | 'G' | 'F'>('all')

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="mb-2">Résultats par équipes</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Gender Filter Buttons */}
      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
        <button
          onClick={() => setGenderFilter('all')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 ${
            genderFilter === 'all'
              ? 'bg-gray-500 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setGenderFilter('G')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 ${
            genderFilter === 'G'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          Masculines
        </button>
        <button
          onClick={() => setGenderFilter('F')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-150 ${
            genderFilter === 'F'
              ? 'bg-violet-500 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          Féminines
        </button>
      </div>

      {/* Dense Teams View */}
      <DenseTeamsView
        teams={filteredTeams}
        tours={tours}
      />
    </div>
  )
}
