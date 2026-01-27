import { useMemo } from 'react'
import { useCsvData } from './useCsvData'
import { Match, Team } from '@/types/team.types'
import { CSV_PATHS } from '@/constants/config'

export function useTeamData() {
  const { data: rawData, loading, error } = useCsvData<any>(CSV_PATHS.MATCHES)

  const teams: Team[] = useMemo(() => {
    // Group matches by team_id
    const teamMap = new Map<string, Match[]>()

    rawData.forEach((row) => {
      const match: Match = {
        team_id: row.team_id || '',
        team_name: row.team_name || '',
        division: row.division || '',
        tour: row.tour || '',
        date: row.date || '',
        equipe_domicile: row.equipe_domicile || '',
        equipe_exterieur: row.equipe_exterieur || '',
        score_domicile: row.score_domicile || '',
        score_exterieur: row.score_exterieur || '',
        is_home: row.is_home || 'True',
      }

      if (!teamMap.has(match.team_id)) {
        teamMap.set(match.team_id, [])
      }
      teamMap.get(match.team_id)!.push(match)
    })

    // Convert to Team array
    const teamsArray: Team[] = []

    teamMap.forEach((matches, teamId) => {
      if (matches.length === 0) return

      const firstMatch = matches[0]

      // Extract gender from team_id (last character: G or F)
      const gender = teamId.slice(-1) as 'G' | 'F'

      // Organize matches by tour
      const matchesByTour: Record<string, Match> = {}
      matches.forEach((match) => {
        matchesByTour[match.tour] = match
      })

      teamsArray.push({
        id: teamId,
        name: firstMatch.team_name,
        division: firstMatch.division,
        gender,
        matches: matchesByTour,
      })
    })

    // Sort teams by id (1G, 2G, 3G, 1F, 2F, etc.)
    teamsArray.sort((a, b) => {
      // Extract number from id
      const aNum = parseInt(a.id.slice(0, -1))
      const bNum = parseInt(b.id.slice(0, -1))

      // Sort by gender first (G before F), then by number
      if (a.gender !== b.gender) {
        return a.gender === 'G' ? -1 : 1
      }
      return aNum - bNum
    })

    return teamsArray
  }, [rawData])

  return { teams, loading, error }
}
