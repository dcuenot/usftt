import { useMemo, useState } from 'react'
import { useTeamData } from '@/hooks/useTeamData'
import { MatchResultCell } from '@/components/shared/MatchResultCell'

export function EquipesPage() {
  const { teams, loading, error } = useTeamData()
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
        <h1>Résultats par équipes</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Chargement des données...</div>
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
    <div>
      <h1>Résultats par équipes</h1>

      {/* Gender Filter Buttons */}
      <div className="mb-4 flex gap-2">
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
      <div className="mb-3 text-sm text-gray-600">
        {filteredTeams.length} équipe{filteredTeams.length > 1 ? 's' : ''}
      </div>

      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-r border-gray-300 sticky left-0 bg-gray-100 z-10">
                Équipe
              </th>
              {tours.map((tour) => (
                <th
                  key={tour}
                  className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b border-gray-300 min-w-[200px]"
                >
                  Tour {tour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => (
              <tr
                key={team.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 border-r border-gray-300 sticky left-0 bg-white z-10">
                  <div className="font-medium text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.division}</div>
                </td>
                {tours.map((tour) => (
                  <td
                    key={tour}
                    className="px-2 py-2 text-center border-gray-200"
                  >
                    <MatchResultCell match={team.matches[tour]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune équipe à afficher
        </div>
      )}
    </div>
  )
}
