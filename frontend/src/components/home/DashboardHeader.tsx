import { StatsCard } from '@/components/ui/StatsCard'
import { Sparkline } from '@/components/ui/Sparkline'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { MiniBarChart } from '@/components/ui/MiniBarChart'
import { DashboardStats } from '@/utils/statistics'
import { Users, TrendingUp, Trophy, Swords } from 'lucide-react'

interface DashboardHeaderProps {
  stats: DashboardStats
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  // Calculate active player percentage
  const activePercentage = stats.totalPlayers > 0
    ? (stats.activePlayers / stats.totalPlayers) * 100
    : 0

  // Sample data for trends (in real app, this would come from historical data)
  const playerTrend = [
    Math.max(0, stats.totalPlayers - 5),
    Math.max(0, stats.totalPlayers - 3),
    Math.max(0, stats.totalPlayers - 2),
    Math.max(0, stats.totalPlayers - 1),
    stats.totalPlayers
  ]

  const matchTrend = [
    Math.round(stats.totalMatches * 0.7),
    Math.round(stats.totalMatches * 0.8),
    Math.round(stats.totalMatches * 0.9),
    Math.round(stats.totalMatches * 0.95),
    stats.totalMatches
  ]

  // Prepare category data for bar chart (top 5 categories)
  const topCategories = stats.categoryBreakdown
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({
      label: item.category,
      value: item.count,
      color: 'rgb(13, 110, 253)' // primary color
    }))

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      data-testid="dashboard-header"
    >
      {/* Total Players */}
      <StatsCard
        title="Total joueurs"
        value={stats.totalPlayers}
        subtitle="Licenciés"
        icon={<Users className="w-8 h-8" />}
        variant="gradient"
        cardStyle="elevated"
        chart={
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Évolution</span>
            <Sparkline
              data={playerTrend}
              width={120}
              height={32}
              color="rgb(13, 110, 253)"
              showArea={true}
              fillColor="rgb(13, 110, 253)"
            />
          </div>
        }
      />

      {/* Active Players */}
      <StatsCard
        title="Joueurs actifs"
        value={stats.activePlayers}
        subtitle="Avec matchs joués"
        icon={<TrendingUp className="w-8 h-8" />}
        variant="primary"
        cardStyle="elevated"
        chart={
          <div className="flex items-center justify-center">
            <ProgressRing
              value={activePercentage}
              size={80}
              strokeWidth={6}
              color="rgb(13, 110, 253)"
              showLabel={false}
            />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(activePercentage)}%
              </p>
              <p className="text-xs text-gray-500">Taux d'activité</p>
            </div>
          </div>
        }
      />

      {/* Total Matches */}
      <StatsCard
        title="Matchs joués"
        value={stats.totalMatches}
        subtitle="Cette saison"
        icon={<Swords className="w-8 h-8" />}
        variant="success"
        cardStyle="elevated"
        chart={
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Progression</span>
            <Sparkline
              data={matchTrend}
              width={120}
              height={32}
              color="rgb(16, 185, 129)"
              showArea={true}
              fillColor="rgb(16, 185, 129)"
            />
          </div>
        }
      />

      {/* Average Points with Category Distribution */}
      <StatsCard
        title="Moyenne de points"
        value={stats.averagePoints}
        subtitle="Joueurs actifs"
        icon={<Trophy className="w-8 h-8" />}
        variant="gradient"
        cardStyle="elevated"
        chart={
          topCategories.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-2">Top catégories</p>
              <MiniBarChart
                data={topCategories}
                width={200}
                height={50}
                showValues={false}
              />
            </div>
          ) : null
        }
      />
    </div>
  )
}
