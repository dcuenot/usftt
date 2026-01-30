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
import { RangeSlider } from '@/components/ui/RangeSlider'
import { FilterPresets, FilterPreset, presetIcons } from '@/components/home/FilterPresets'
import { FilterSummary, ActiveFilter } from '@/components/home/FilterSummary'
import { ExportButton } from '@/components/ui/ExportButton'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { SkeletonTable } from '@/components/ui/SkeletonTable'
import { ErrorState } from '@/components/ui/ErrorState'
import { Accordion } from '@/components/ui/Accordion'
import { useToast } from '@/components/ui/Toast'
import { calculateDashboardStats } from '@/utils/statistics'
import { exportToCSV, generateFilename } from '@/utils/export'
import { useIsMobile } from '@/hooks/useMediaQuery'

export function HomePage() {
  const { competitors, loading, error, lastModified } = useCompetitorData()
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const isMobile = useIsMobile()
  const { showToast } = useToast()

  // Point range filter
  const pointRange = useMemo(() => {
    if (competitors.length === 0) return [0, 3000] as [number, number]
    const points = competitors.map(c => c.point)
    return [Math.floor(Math.min(...points) / 100) * 100, Math.ceil(Math.max(...points) / 100) * 100] as [number, number]
  }, [competitors])

  const [pointFilter, setPointFilter] = useState<[number, number]>(pointRange)

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

      // Point range filter
      if (c.point < pointFilter[0] || c.point > pointFilter[1]) return false

      // Search filter (name)
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const fullName = `${c.prenom} ${c.nom}`.toLowerCase()
        if (!fullName.includes(search)) return false
      }

      return true
    })
  }, [competitors, categoryFilter, searchTerm, pointFilter])

  // Filter presets
  const filterPresets: FilterPreset[] = useMemo(() => [
    {
      id: 'top10',
      label: 'Top 10',
      icon: <presetIcons.Trophy className="w-5 h-5" />,
      description: 'Les 10 meilleurs joueurs',
      apply: () => {
        const sorted = [...competitors].sort((a, b) => b.point - a.point)
        if (sorted.length > 0) {
          setPointFilter([sorted[9]?.point || 0, sorted[0].point])
        }
        setCategoryFilter('')
        setSearchTerm('')
      },
    },
    {
      id: 'mostActive',
      label: 'Plus actifs',
      icon: <presetIcons.TrendingUp className="w-5 h-5" />,
      description: 'Joueurs avec le plus de matchs',
      apply: () => {
        const sorted = [...competitors].sort((a, b) => b.parties - a.parties)
        if (sorted.length > 0) {
          const threshold = sorted[Math.floor(sorted.length * 0.2)]?.parties || 5
          const minPoints = Math.min(...competitors.filter(c => c.parties >= threshold).map(c => c.point))
          setPointFilter([minPoints, pointRange[1]])
        }
        setCategoryFilter('')
        setSearchTerm('')
      },
    },
    {
      id: 'bestProgress',
      label: 'Meilleure prog.',
      icon: <presetIcons.Sparkles className="w-5 h-5" />,
      description: 'Meilleure progression mensuelle',
      apply: () => {
        const sorted = [...competitors].sort((a, b) => b.prg_m - a.prg_m)
        if (sorted.length > 0) {
          const threshold = sorted[Math.floor(sorted.length * 0.2)]?.prg_m || 10
          const minPoints = Math.min(...competitors.filter(c => c.prg_m >= threshold).map(c => c.point))
          setPointFilter([minPoints, pointRange[1]])
        }
        setCategoryFilter('')
        setSearchTerm('')
      },
    },
    {
      id: 'all',
      label: 'Tous',
      icon: <presetIcons.Users className="w-5 h-5" />,
      description: 'Réinitialiser tous les filtres',
      apply: () => {
        setCategoryFilter('')
        setSearchTerm('')
        setPointFilter(pointRange)
      },
    },
  ], [competitors, pointRange])

  // Active filters for summary
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = []

    if (categoryFilter) {
      filters.push({
        key: 'category',
        label: 'Catégorie',
        value: categoryFilter,
        onRemove: () => setCategoryFilter(''),
      })
    }

    if (searchTerm) {
      filters.push({
        key: 'search',
        label: 'Recherche',
        value: searchTerm,
        onRemove: () => setSearchTerm(''),
      })
    }

    const isPointRangeFiltered = pointFilter[0] !== pointRange[0] || pointFilter[1] !== pointRange[1]
    if (isPointRangeFiltered) {
      filters.push({
        key: 'points',
        label: 'Points',
        value: `${pointFilter[0]} - ${pointFilter[1]}`,
        onRemove: () => setPointFilter(pointRange),
      })
    }

    return filters
  }, [categoryFilter, searchTerm, pointFilter, pointRange])

  const clearAllFilters = () => {
    setCategoryFilter('')
    setSearchTerm('')
    setPointFilter(pointRange)
  }

  // Export to CSV
  const handleExport = () => {
    const exportHeaders = [
      { key: 'licence', label: 'Licence' },
      { key: 'sexe', label: 'Sexe' },
      { key: 'prenom', label: 'Prénom' },
      { key: 'nom', label: 'Nom' },
      { key: 'cat', label: 'Catégorie' },
      { key: 'point', label: 'Points' },
      { key: 'parties', label: 'Nb matchs' },
      { key: 'prg_m', label: 'Prog. Mensuelle' },
      { key: 'prg_p', label: 'Prog. Phase' },
      { key: 'prg_a', label: 'Prog. Annuelle' },
    ]

    const filename = generateFilename('joueurs_usftt')
    exportToCSV(filteredCompetitors, exportHeaders, filename)

    showToast({
      title: 'Export réussi',
      message: `${filteredCompetitors.length} joueur${filteredCompetitors.length > 1 ? 's' : ''} exporté${filteredCompetitors.length > 1 ? 's' : ''} dans ${filename}`,
      variant: 'success',
    })
  }

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
        <ErrorState
          title="Erreur de chargement"
          message="Impossible de charger la liste des joueurs. Veuillez réessayer."
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
        <h1 className="mb-0">USFTT - Liste des joueurs</h1>
        <LastUpdate lastModified={lastModified} loading={loading} variant="relative" />
      </div>

      {/* Dashboard Stats */}
      <DashboardHeader stats={stats} />

      {/* Filter Presets */}
      <FilterPresets presets={filterPresets} />

      {/* Search & Filters */}
      <Accordion
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filtres avancés
            </span>
            {activeFilters.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({activeFilters.length} actif{activeFilters.length > 1 ? 's' : ''})
              </span>
            )}
          </div>
        }
        defaultOpen={false}
        className="mb-6"
      >
        <div className="space-y-4">
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

          {/* Point Range Filter */}
          <RangeSlider
            min={pointRange[0]}
            max={pointRange[1]}
            value={pointFilter}
            onChange={setPointFilter}
            step={50}
            label="Plage de points"
          />
        </div>
      </Accordion>

      {/* Active Filters Summary */}
      <FilterSummary
        filters={activeFilters}
        onClearAll={clearAllFilters}
      />

      {/* Players count and export */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredCompetitors.length} joueur{filteredCompetitors.length > 1 ? 's' : ''}
          {categoryFilter && ` dans la catégorie ${categoryFilter}`}
          {searchTerm && ` correspondant à "${searchTerm}"`}
        </div>

        <ExportButton
          onClick={handleExport}
          disabled={filteredCompetitors.length === 0}
          size="sm"
        />
      </div>

      {/* Player List (responsive) */}
      <PlayerList competitors={filteredCompetitors} columns={columns} />
    </div>
  )
}
