import { Competitor } from '@/types/competitor.types'

export interface DashboardStats {
  totalPlayers: number
  activePlayers: number
  averagePoints: number
  topProgression: Competitor | null
  totalMatches: number
  categoryBreakdown: { category: string; count: number }[]
  genderBreakdown: { gender: 'M' | 'F'; count: number }[]
}

/**
 * Calculate dashboard statistics from competitor data
 */
export function calculateDashboardStats(competitors: Competitor[]): DashboardStats {
  // Filter active players (with at least 1 match)
  const activePlayers = competitors.filter(c => c.parties > 0)

  // Calculate total matches
  const totalMatches = competitors.reduce((sum, c) => sum + c.parties, 0)

  // Calculate average points for active players
  const averagePoints = activePlayers.length > 0
    ? activePlayers.reduce((sum, c) => sum + c.point, 0) / activePlayers.length
    : 0

  // Find player with highest annual progression
  const topProgression = competitors.length > 0
    ? [...competitors].sort((a, b) => b.prg_a - a.prg_a)[0]
    : null

  // Category breakdown
  const categoryMap = new Map<string, number>()
  competitors.forEach(c => {
    if (c.cat) {
      const count = categoryMap.get(c.cat) || 0
      categoryMap.set(c.cat, count + 1)
    }
  })
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  // Gender breakdown
  const genderMap = new Map<'M' | 'F', number>()
  competitors.forEach(c => {
    const count = genderMap.get(c.sexe) || 0
    genderMap.set(c.sexe, count + 1)
  })
  const genderBreakdown = Array.from(genderMap.entries())
    .map(([gender, count]) => ({ gender, count }))

  return {
    totalPlayers: competitors.length,
    activePlayers: activePlayers.length,
    averagePoints: Math.round(averagePoints),
    topProgression,
    totalMatches,
    categoryBreakdown,
    genderBreakdown,
  }
}
