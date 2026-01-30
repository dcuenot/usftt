import { useMemo, useState } from 'react'
import { useCompetitorData } from '@/hooks/useCompetitorData'
import { Competitor } from '@/types/competitor.types'
import { ResponsiveTable, ResponsiveColumnDef } from '@/components/ui/ResponsiveTable'
import { ProgressionBadge } from '@/components/shared/ProgressionBadge'
import { GenderIcon } from '@/components/shared/GenderIcon'
import { LastUpdate } from '@/components/shared/LastUpdate'
import { FilterPanel } from '@/components/ui/FilterPanel'
import { Select } from '@/components/ui/Select'
import { FilterChip } from '@/components/ui/FilterChip'
import { PlayerRankingCard } from '@/components/classement/PlayerRankingCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { SkeletonTable } from '@/components/ui/SkeletonTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { Eye, EyeOff } from 'lucide-react'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function ClassementPage() {
  const { competitors, loading, error, lastModified } = useCompetitorData()
  const [genderFilter, setGenderFilter] = useState<'' | 'M' | 'F'>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [showInactive, setShowInactive] = useState(false)
  const isMobile = useIsMobile()

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

  // Define table columns with priorities
  const columns = useMemo<ResponsiveColumnDef<Competitor>[]>(
    () => [
      {
        accessorKey: 'sexe',
        header: '',
        cell: ({ row }) => <GenderIcon gender={row.original.sexe} />,
        enableSorting: false,
        priority: 'high', // Always visible
      },
      {
        id: 'nom',
        header: 'Nom',
        accessorFn: (row) => `${row.prenom} ${row.nom}`,
        cell: ({ row }) => (
          <span>{row.original.prenom} {row.original.nom}</span>
        ),
        priority: 'high', // Always visible
      },
      {
        accessorKey: 'cat',
        header: 'Cat',
        priority: 'medium', // Hidden on mobile
      },
      {
        accessorKey: 'point',
        header: 'Points officiels',
        cell: ({ row }) => (
          <span className="font-medium">{Math.round(row.original.point)}</span>
        ),
        priority: 'high', // Always visible
      },
      {
        accessorKey: 'prg_m',
        header: 'Prog. Mensuelle',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_m} />
        ),
        priority: 'high', // Always visible
      },
      {
        accessorKey: 'prg_p',
        header: 'Prog. Phase',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_p} />
        ),
        priority: 'low', // Hidden on mobile and tablet
      },
      {
        accessorKey: 'prg_a',
        header: 'Prog. Annuelle',
        cell: ({ row }) => (
          <ProgressionBadge value={row.original.prg_a} />
        ),
        priority: 'low', // Hidden on mobile and tablet
      },
      {
        accessorKey: 'parties',
        header: 'Nb matchs',
        priority: 'medium', // Hidden on mobile
      },
    ],
    []
  )

  if (loading) {
    return (
      <div>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="mb-0">Classement individuel</h1>
          <LastUpdate lastModified={null} loading={true} variant="relative" />
        </div>

        {/* Skeleton */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <SkeletonTable rows={10} columns={6} />
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>Classement individuel</h1>
        <ErrorState
          title="Erreur de chargement"
          message="Impossible de charger le classement. Veuillez réessayer."
          error={error}
          onRetry={() => window.location.reload()}
          variant="compact"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="mb-0">Classement individuel</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Filters */}
      <FilterPanel>
        {/* Gender Filter */}
        <Select
          label="Sexe"
          id="genderFilter"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value as '' | 'M' | 'F')}
          className="flex-1 min-w-[150px]"
        >
          <option value="">Tous</option>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
        </Select>

        {/* Category Filter */}
        <Select
          label="Catégorie"
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="flex-1 min-w-[150px]"
        >
          <option value="">Toutes</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        {/* Toggle Inactive */}
        <div className="flex items-end">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="border border-gray-300 rounded px-4 py-2 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
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
      </FilterPanel>

      {/* Active Filters */}
      {(genderFilter || categoryFilter) && (
        <div className="flex flex-wrap gap-2">
          {genderFilter && (
            <FilterChip
              label="Sexe"
              value={genderFilter === 'M' ? 'Masculin' : 'Féminin'}
              onRemove={() => setGenderFilter('')}
            />
          )}
          {categoryFilter && (
            <FilterChip
              label="Catégorie"
              value={categoryFilter}
              onRemove={() => setCategoryFilter('')}
            />
          )}
        </div>
      )}

      {/* Player count */}
      <div className="text-sm text-gray-600">
        {filteredCompetitors.length} joueur{filteredCompetitors.length > 1 ? 's' : ''}
        {!showInactive && ' (joueurs actifs uniquement)'}
      </div>

      {/* Responsive Table/Cards */}
      <ResponsiveTable
        data={filteredCompetitors}
        columns={columns}
        defaultSorting={[{ id: 'point', desc: true }]}
        mobileCard={(competitor) => (
          <PlayerRankingCard
            competitor={competitor}
            rank={filteredCompetitors.indexOf(competitor) + 1}
          />
        )}
      />
    </div>
  )
}
