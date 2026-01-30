import { useState, useMemo, ReactNode } from 'react'
import { Team } from '@/types/team.types'
import { cn } from '@/utils/cn'
import { ChevronUp, ChevronDown, ChevronsUpDown, Home, Plane } from 'lucide-react'

interface DenseTeamTableProps {
  teams: Team[]
  tours: string[]
}

type SortField = 'name' | 'division' | 'rang' | 'points'
type SortDirection = 'asc' | 'desc' | null

// Helper to get division color based on gender
function getDivisionColor(gender: string): string {
  if (gender === 'G') {
    return 'bg-blue-100 text-blue-800 border-blue-300'
  } else {
    return 'bg-violet-100 text-violet-800 border-violet-300'
  }
}

// Helper to get match result icon and color
function getMatchResult(team: Team, tour: string): { icon: string | ReactNode; color: string; score: string } {
  const match = team.matches[tour]

  // If no match data or both scores are empty, match not played yet
  if (!match || (!match.score_domicile && !match.score_exterieur)) {
    // Match not yet played - show home/away indicator
    const isHome = match?.is_home === 'True'
    return {
      icon: isHome ? <Home className="w-4 h-4" /> : <Plane className="w-4 h-4" />,
      color: 'text-gray-400',
      score: ''
    }
  }

  // If at least one score exists, match was played (treat empty as 0 for forfeits)
  const isHome = match.is_home === 'True'
  const ourScore = parseInt(isHome ? (match.score_domicile || '0') : (match.score_exterieur || '0')) || 0
  const theirScore = parseInt(isHome ? (match.score_exterieur || '0') : (match.score_domicile || '0')) || 0

  if (ourScore > theirScore) {
    return { icon: '✓', color: 'text-victory', score: `${ourScore}-${theirScore}` }
  } else if (ourScore < theirScore) {
    return { icon: '✗', color: 'text-defeat', score: `${ourScore}-${theirScore}` }
  } else {
    return { icon: '=', color: 'text-draw', score: `${ourScore}-${theirScore}` }
  }
}

// Helper to get opponent name (returns full and short versions)
function getOpponentName(team: Team, tour: string): { full: string; short: string } {
  const match = team.matches[tour]
  if (!match) return { full: '-', short: '-' }

  const isHome = match.is_home === 'True'
  let opponent = isHome ? match.equipe_exterieur : match.equipe_domicile

  if (!opponent || opponent.trim() === '') return { full: '-', short: '-' }

  // Remove " - Phase X" suffix if present for the full name
  const fullName = opponent.replace(/\s*-\s*Phase\s*\d+/i, '')

  // Truncate to 11 characters with ellipsis if needed
  const shortName = fullName.length > 13 ? `${fullName.substring(0, 13)}..` : fullName

  return {
    full: fullName,
    short: shortName
  }
}

export function DenseTeamTable({ teams, tours }: DenseTeamTableProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction: asc -> desc -> null -> asc
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
      } else {
        setSortDirection('asc')
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Sort teams
  const sortedTeams = useMemo(() => {
    if (!sortDirection) return teams

    return [...teams].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortField === 'name') {
        aValue = a.name
        bValue = b.name
      } else if (sortField === 'division') {
        aValue = a.division
        bValue = b.division
      } else {
        aValue = a.ranking[sortField]
        bValue = b.ranking[sortField]
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }
    })
  }, [teams, sortField, sortDirection])

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-400" />
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="w-3 h-3 ml-1 text-primary" />
    }
    return <ChevronDown className="w-3 h-3 ml-1 text-primary" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-card shadow-card">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {/* Team Name */}
            <th
              className="sticky left-0 z-10 bg-gray-50 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center whitespace-nowrap">
                Équipe
                {renderSortIcon('name')}
              </div>
            </th>

            {/* Classement */}
            <th
              className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('rang')}
            >
              <div className="flex items-center justify-center whitespace-nowrap">
                Clt
                {renderSortIcon('rang')}
              </div>
            </th>

            {/* Points */}
            <th
              className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('points')}
            >
              <div className="flex items-center justify-center whitespace-nowrap">
                Pts
                {renderSortIcon('points')}
              </div>
            </th>

            {/* Tour Results */}
            {tours.map((tour) => (
              <th
                key={tour}
                className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                J{tour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedTeams.map((team) => (
            <tr
              key={team.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Team Name */}
              <td className="sticky left-0 z-10 bg-white px-3 py-3 whitespace-nowrap group-hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded border', getDivisionColor(team.gender))}>
                    {team.division}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {team.name}
                  </span>
                </div>
              </td>

              {/* Classement */}
              <td className="px-3 py-3 text-center">
                <span className={cn(
                  'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold',
                  team.ranking.rang === 1 ? 'bg-yellow-100 text-yellow-800' :
                  team.ranking.rang === 2 ? 'bg-gray-200 text-gray-700' :
                  team.ranking.rang === 3 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                )}>
                  {team.ranking.rang}
                </span>
              </td>

              {/* Points */}
              <td className="px-3 py-3 text-center text-sm font-semibold text-gray-900">
                {team.ranking.points}
              </td>

              {/* Tour Results */}
              {tours.map((tour) => {
                const result = getMatchResult(team, tour)
                const opponent = getOpponentName(team, tour)

                return (
                  <td key={tour} className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1">
                        <span className={cn('text-lg font-bold', result.color)}>
                          {result.icon}
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          {result.score}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]" title={opponent.full}>
                        {opponent.short !== '-' ? `${opponent.short}` : '-'}
                      </div>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
