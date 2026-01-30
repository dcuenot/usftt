import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useCompetitorData } from '@/hooks/useCompetitorData'
import { Competitor } from '@/types/competitor.types'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'
import { LastUpdate } from '@/components/shared/LastUpdate'
import { DashboardHeader } from '@/components/home/DashboardHeader'
import { PlayerList } from '@/components/home/PlayerList'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { FilterPanel } from '@/components/ui/FilterPanel'
import { FilterChip } from '@/components/ui/FilterChip'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { SkeletonTable } from '@/components/ui/SkeletonTable'
import { calculateDashboardStats } from '@/utils/statistics'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function HomePage() {
  const { competitors, loading, error, lastModified } = useCompetitorData()
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const isMobile = useIsMobile()

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    return calculateDashboardStats(competitors)
  }, [competitors])

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set(competitors.map(c => c.cat).filter(Boolean))
    return Array.from(uniqueCategories).sort()
  }, [competitors])

  // Filter and search competitors
  const filteredCompetitors = useMemo(() => {
    return competitors.filter(c => {
      // Category filter
      if (categoryFilter && c.cat !== categoryFilter) return false

      // Search filter (name)
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const fullName = `${c.prenom} ${c.nom}`.toLowerCase()
        if (!fullName.includes(search)) return false
      }

      return true
    })
  }, [competitors, categoryFilter, searchTerm])

  // Define table columns
  const columns = useMemo<ColumnDef<Competitor>[]>(
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
        accessorKey: 'cat',
        header: 'Catégorie',
      },
      {
        accessorKey: 'point',
        header: 'Points',
        cell: ({ row }) => (
          <span className="font-medium">{Math.round(row.original.point)}</span>
        ),
      },
      {
        accessorKey: 'parties',
        header: 'Nb matchs',
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
    ],
    []
  )

  if (loading) {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-0">USFTT - Liste des joueurs</h1>
          <LastUpdate lastModified={null} loading={true} variant="relative" />
        </div>

        {/* Dashboard Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Table/Cards Skeleton */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <SkeletonTable rows={10} columns={9} />
        )}
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="mb-0">USFTT - Liste des joueurs</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Dashboard Stats */}
      <DashboardHeader stats={stats} />

      {/* Search & Filters */}
      <FilterPanel>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un joueur..."
          className="flex-1 min-w-[200px]"
        />

        <Select
          label="Catégorie"
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="flex-1 min-w-[200px]"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FilterPanel>

      {/* Active Filters */}
      {(categoryFilter || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {categoryFilter && (
            <FilterChip
              label="Catégorie"
              value={categoryFilter}
              onRemove={() => setCategoryFilter('')}
            />
          )}
          {searchTerm && (
            <FilterChip
              label="Recherche"
              value={searchTerm}
              onRemove={() => setSearchTerm('')}
            />
          )}
        </div>
      )}

      {/* Players count */}
      <div className="text-sm text-gray-600">
        {filteredCompetitors.length} joueur{filteredCompetitors.length > 1 ? 's' : ''}
        {categoryFilter && ` dans la catégorie ${categoryFilter}`}
        {searchTerm && ` correspondant à "${searchTerm}"`}
      </div>

      {/* Player List (responsive) */}
      <PlayerList competitors={filteredCompetitors} columns={columns} />
    </div>
  )
}
