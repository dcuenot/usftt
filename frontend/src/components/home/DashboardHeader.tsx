import { StatsCard } from '@/components/ui/StatsCard'
import { DashboardStats } from '@/utils/statistics'
import { Users, TrendingUp, Trophy, Swords } from 'lucide-react'

interface DashboardHeaderProps {
  stats: DashboardStats
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
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
      />

      {/* Active Players */}
      <StatsCard
        title="Joueurs actifs"
        value={stats.activePlayers}
        subtitle="Avec matchs joués"
        icon={<TrendingUp className="w-8 h-8" />}
        variant="primary"
        cardStyle="elevated"
      />

      {/* Total Matches */}
      <StatsCard
        title="Matchs joués"
        value={stats.totalMatches}
        subtitle="Cette saison"
        icon={<Swords className="w-8 h-8" />}
        variant="success"
        cardStyle="elevated"
      />

      {/* Average Points */}
      <StatsCard
        title="Moyenne de points"
        value={stats.averagePoints}
        subtitle="Joueurs actifs"
        icon={<Trophy className="w-8 h-8" />}
        variant="gradient"
        cardStyle="elevated"
      />
    </div>
  )
}
