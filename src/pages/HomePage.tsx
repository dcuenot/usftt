import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { usePlayerData } from '@/hooks/usePlayerData'
import { Player } from '@/types/player.types'
import { Table } from '@/components/ui/Table'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'

export function HomePage() {
  const { players, loading, error } = usePlayerData()
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(players.map(p => p.categ).filter(Boolean))
    return Array.from(uniqueCategories).sort()
  }, [players])

  // Filter players by category
  const filteredPlayers = useMemo(() => {
    if (!categoryFilter) return players
    return players.filter(p => p.categ === categoryFilter)
  }, [players, categoryFilter])

  // Define table columns
  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      {
        accessorKey: 'licence',
        header: 'Licence',
      },
      {
        accessorKey: 'prenom',
        header: 'Prénom',
      },
      {
        accessorKey: 'nom',
        header: 'Nom',
      },
      {
        accessorKey: 'categ',
        header: 'Catégorie',
      },
      {
        accessorKey: 'point',
        header: 'Points',
        cell: ({ row }) => (
          <span className="font-medium">{row.original.point}</span>
        ),
      },
      {
        accessorKey: 'aclglob',
        header: 'Aclglob',
      },
      {
        accessorKey: 'apoint',
        header: 'Apoint',
      },
      {
        accessorKey: 'valcla',
        header: 'Valcla',
      },
      {
        accessorKey: 'valinit',
        header: 'Valinit',
      },
      {
        accessorKey: 'progressionMensuelle',
        header: 'Progression Mensuelle',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.progressionMensuelle} />
        ),
      },
      {
        accessorKey: 'progressionPhase',
        header: 'Progression Phase',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.progressionPhase} />
        ),
      },
    ],
    []
  )

  if (loading) {
    return (
      <div>
        <h1>USFTT - Liste des joueurs</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Chargement des données...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>USFTT - Liste des joueurs</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>USFTT - Liste des joueurs</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par catégorie:
        </label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Players count */}
      <div className="mb-3 text-sm text-gray-600">
        {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''}
        {categoryFilter && ` dans la catégorie ${categoryFilter}`}
      </div>

      {/* Table */}
      <Table
        data={filteredPlayers}
        columns={columns}
        defaultSorting={[{ id: 'point', desc: true }]}
      />
    </div>
  )
}
