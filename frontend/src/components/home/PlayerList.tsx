import { ColumnDef } from '@tanstack/react-table'
import { Competitor } from '@/types/competitor.types'
import { Table } from '@/components/ui/Table'
import { PlayerCard } from '@/components/ui/PlayerCard'
import { useIsMobile } from '@/hooks/useMediaQuery'

interface PlayerListProps {
  competitors: Competitor[]
  columns: ColumnDef<Competitor>[]
}

export function PlayerList({ competitors, columns }: PlayerListProps) {
  const isMobile = useIsMobile()

  // Show card grid on mobile
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-4" data-testid="player-list-mobile">
        {competitors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun joueur à afficher
          </div>
        ) : (
          competitors.map((competitor) => (
            <PlayerCard key={competitor.licence} competitor={competitor} />
          ))
        )}
      </div>
    )
  }

  // Show table on desktop
  return (
    <Table
      data={competitors}
      columns={columns}
      defaultSorting={[{ id: 'point', desc: true }]}
    />
  )
}
