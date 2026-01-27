import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useCompetitorData } from '@/hooks/useCompetitorData'
import { Competitor } from '@/types/competitor.types'
import { Table } from '@/components/ui/Table'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'
import { GenderIcon } from '@/components/shared/GenderIcon'
import { Eye, EyeOff } from 'lucide-react'

export function ClassementPage() {
  const { competitors, loading, error } = useCompetitorData()
  const [genderFilter, setGenderFilter] = useState<'' | 'M' | 'F'>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [showInactive, setShowInactive] = useState(false)

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(competitors.map(c => c.cat).filter(Boolean))
    return Array.from(uniqueCategories).sort()
  }, [competitors])

  // Filter competitors
  const filteredCompetitors = useMemo(() => {
    return competitors.filter(c => {
      // Gender filter
      if (genderFilter && c.sexe !== genderFilter) return false

      // Category filter
      if (categoryFilter && c.cat !== categoryFilter) return false

      // Inactive filter (hide players with 0 matches by default)
      if (!showInactive && c.parties === 0) return false

      return true
    })
  }, [competitors, genderFilter, categoryFilter, showInactive])

  // Define table columns
  const columns = useMemo<ColumnDef<Competitor>[]>(
    () => [
      {
        accessorKey: 'sexe',
        header: '',
        cell: ({ row }) => <GenderIcon gender={row.original.sexe} />,
        enableSorting: false,
      },
      {
        id: 'nom',
        header: 'Nom',
        accessorFn: (row) => `${row.prenom} ${row.nom}`,
        cell: ({ row }) => (
          <span>{row.original.prenom} {row.original.nom}</span>
        ),
      },
      {
        accessorKey: 'cat',
        header: 'Cat',
      },
      {
        accessorKey: 'point',
        header: 'Points officiels',
        cell: ({ row }) => (
          <span className="font-medium">{Math.round(row.original.point)}</span>
        ),
      },
      {
        accessorKey: 'prg_m',
        header: 'Prog. Mensuelle',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_m} />
        ),
      },
      {
        accessorKey: 'prg_p',
        header: 'Prog. Phase',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_p} />
        ),
      },
      {
        accessorKey: 'prg_a',
        header: 'Prog. Annuelle',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_a} />
        ),
      },
      {
        accessorKey: 'parties',
        header: 'Nb matchs',
      },
    ],
    []
  )

  if (loading) {
    return (
      <div>
        <h1>Classement individuel</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Chargement des données...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Classement individuel</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Classement individuel</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Gender Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="genderFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Sexe:
          </label>
          <select
            id="genderFilter"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as '' | 'M' | 'F')}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Tous</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie:
          </label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Inactive */}
        <div className="flex items-end">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="border border-gray-300 rounded px-4 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center gap-2"
          >
            {showInactive ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Masquer inactifs</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Afficher inactifs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Player count */}
      <div className="mb-3 text-sm text-gray-600">
        {filteredCompetitors.length} joueur{filteredCompetitors.length > 1 ? 's' : ''}
        {!showInactive && ' (joueurs actifs uniquement)'}
      </div>

      {/* Table */}
      <Table
        data={filteredCompetitors}
        columns={columns}
        defaultSorting={[{ id: 'point', desc: true }]}
      />
    </div>
  )
}
