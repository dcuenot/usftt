import { useMemo } from 'react'
import { useCsvData } from './useCsvData'
import { Match, Team, TeamRanking } from '@/types/team.types'
import { CSV_PATHS } from '@/constants/config'

// Helper to normalize team names
function normalizeTeamName(name: string): string {
  // Extract team number from name (e.g., "FONTENAY USTT 1 - Phase 1" -> "1")
  const numberMatch = name.match(/(\d+)/)
  const teamNumber = numberMatch ? numberMatch[1] : ''

  // Return simplified name
  return teamNumber ? `Equipe ${teamNumber}` : 'Equipe'
}

// Helper to extract phase from team name
function extractPhase(name: string): string {
  const match = name.match(/Phase (\d+)/)
  return match ? match[1] : '1'
}

export function useTeamData() {
  const { data: rawData, loading, error, lastModified } = useCsvData<any>(CSV_PATHS.MATCHES)

  const teams: Team[] = useMemo(() => {
    // Group matches by team_id + phase (composite key)
    const teamMap = new Map<string, Match[]>()

    rawData.forEach((row) => {
      const match: Match = {
        team_id: String(row.team_id ?? ''),
        team_name: String(row.team_name ?? ''),
        division: String(row.division ?? ''),
        tour: String(row.tour ?? ''),
        date: String(row.date ?? ''),
        equipe_domicile: String(row.equipe_domicile ?? ''),
        equipe_exterieur: String(row.equipe_exterieur ?? ''),
        score_domicile: String(row.score_domicile ?? ''),
        score_exterieur: String(row.score_exterieur ?? ''),
        is_home: (String(row.is_home ?? 'True') === 'True' ? 'True' : 'False') as 'True' | 'False',
      }

      // Create composite key: team_id + phase (e.g., "1G-Phase1", "1G-Phase2")
      const phase = extractPhase(match.team_name)
      const compositeKey = `${match.team_id}-Phase${phase}`

      if (!teamMap.has(compositeKey)) {
        teamMap.set(compositeKey, [])
      }
      teamMap.get(compositeKey)!.push(match)
    })

    // Convert to Team array
    const teamsArray: Team[] = []

    teamMap.forEach((matches, compositeKey) => {
      if (matches.length === 0) return

      const firstMatch = matches[0]
      const phase = extractPhase(firstMatch.team_name)

      // Find matching row (team_id + phase combination)
      const firstRow = rawData.find((row: any) =>
        String(row.team_id) === firstMatch.team_id &&
        extractPhase(String(row.team_name)) === phase
      )

      // Extract gender from team_id (last character: G or F)
      const gender = firstMatch.team_id.slice(-1) as 'G' | 'F'

      // Extract ranking data from first row
      const ranking: TeamRanking = {
        rang: parseInt(String(firstRow?.rang ?? '0')),
        points: parseInt(String(firstRow?.points ?? '0')),
        joues: parseInt(String(firstRow?.joues ?? '0')),
        victoires: parseInt(String(firstRow?.victoires ?? '0')),
        nuls: parseInt(String(firstRow?.nuls ?? '0')),
        defaites: parseInt(String(firstRow?.defaites ?? '0')),
        forfaits: parseInt(String(firstRow?.forfaits ?? '0')),
      }

      // Organize matches by tour
      const matchesByTour: Record<string, Match> = {}
      matches.forEach((match) => {
        matchesByTour[match.tour] = match
      })

      teamsArray.push({
        id: compositeKey, // Use composite key as unique ID (e.g., "1G-Phase1", "1G-Phase2")
        name: normalizeTeamName(firstMatch.team_name),
        division: firstMatch.division,
        gender,
        phase,
        ranking,
        matches: matchesByTour,
      })
    })

    // Sort teams by number, gender, and phase
    teamsArray.sort((a, b) => {
      // Extract number from composite id (e.g., "1G-Phase1" -> 1)
      const aMatch = a.id.match(/^(\d+)/)
      const bMatch = b.id.match(/^(\d+)/)
      const aNum = aMatch ? parseInt(aMatch[1]) : 0
      const bNum = bMatch ? parseInt(bMatch[1]) : 0

      // Sort by number first
      if (aNum !== bNum) {
        return aNum - bNum
      }

      // Then by gender (G before F)
      if (a.gender !== b.gender) {
        return a.gender === 'G' ? -1 : 1
      }

      // Finally by phase (Phase 1 before Phase 2)
      return parseInt(a.phase) - parseInt(b.phase)
    })

    return teamsArray
  }, [rawData])

  return { teams, loading, error, lastModified }
}
