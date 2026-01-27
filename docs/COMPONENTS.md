# Component Library Documentation

This document describes all reusable UI components in the USFTT application.

## Table of Contents
- [UI Components](#ui-components)
- [Shared Components](#shared-components)
- [Page-Specific Components](#page-specific-components)
- [Layout Components](#layout-components)

---

## UI Components

Located in `src/components/ui/`

### Skeleton

**Purpose**: Base skeleton loader with multiple variants for loading states.

**Props**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  className?: string
}
```

**Usage**:
```tsx
<Skeleton variant="text" width="100%" height="20px" />
<Skeleton variant="circular" width="40px" height="40px" />
<Skeleton variant="rectangular" width="100%" height="200px" />
```

**Responsive**: N/A (utility component)

---

### SkeletonTable

**Purpose**: Animated table skeleton for loading states matching table structure.

**Props**:
```typescript
interface SkeletonTableProps {
  rows?: number    // Default: 10
  columns?: number // Default: 5
}
```

**Usage**:
```tsx
<SkeletonTable rows={10} columns={9} />
```

**Responsive**: Adapts to container width

---

### SkeletonCard

**Purpose**: Animated card skeleton for loading states matching card structure.

**Props**: None

**Usage**:
```tsx
<SkeletonCard />
```

**Responsive**: Full width, adapts to container

**Data attribute**: `data-testid="skeleton-card"`

---

### StatsCard

**Purpose**: Dashboard statistics display card with icon, value, subtitle, and optional trend.

**Props**:
```typescript
interface StatsCardProps {
  title: string           // Card title (e.g., "Total joueurs")
  value: string | number  // Main value to display
  subtitle?: string       // Optional subtitle text
  icon: ReactNode         // Icon component (from lucide-react)
  trend?: {
    value: number         // Trend value (e.g., +5, -3)
    isPositive: boolean   // true for positive trend (green), false for negative (red)
  }
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}
```

**Usage**:
```tsx
<StatsCard
  title="Total joueurs"
  value={125}
  subtitle="Licenciés actifs"
  icon={<Users className="w-6 h-6" />}
  variant="primary"
/>
```

**Responsive**: Full width in grid

**Data attribute**: `data-testid="stats-card"`

---

### PlayerCard

**Purpose**: Mobile card layout for displaying player information on small screens.

**Props**:
```typescript
interface PlayerCardProps {
  player: Competitor  // Player data object
  rank?: number       // Optional rank number
  onSelect?: () => void  // Optional click handler
}
```

**Usage**:
```tsx
<PlayerCard
  player={competitor}
  rank={1}
  onSelect={() => handleSelectPlayer(competitor.id)}
/>
```

**Responsive**: Full width, optimized for mobile (<768px)

**Data attribute**: `data-testid="player-card"`

---

### SearchInput

**Purpose**: Search input with icon, clear button, and focus states.

**Props**:
```typescript
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}
```

**Usage**:
```tsx
<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Rechercher un joueur..."
  className="flex-1"
/>
```

**Responsive**: Flexible width

**Accessibility**: Labeled input with clear button

---

### FilterPanel

**Purpose**: Container for filter controls with responsive layout.

**Props**:
```typescript
interface FilterPanelProps {
  children: ReactNode
}
```

**Usage**:
```tsx
<FilterPanel>
  <SearchInput {...} />
  <select {...} />
</FilterPanel>
```

**Responsive**: Flex wrap, stacks vertically on mobile

**Data attribute**: `data-testid="filter-panel"`

---

### Tabs

**Purpose**: Tab navigation component with snap-scroll on mobile.

**Props**:
```typescript
interface Tab {
  id: string
  label: string
  badge?: string | number  // Optional badge content
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}
```

**Usage**:
```tsx
<Tabs
  tabs={[
    { id: '1', label: 'Tour 1' },
    { id: '2', label: 'Tour 2', badge: 5 }
  ]}
  activeTab={selectedTour}
  onChange={setSelectedTour}
/>
```

**Responsive**: Horizontal scroll on mobile, all tabs visible on desktop

**Data attribute**: `data-testid="tabs"`

---

### Accordion

**Purpose**: Expandable content section with smooth CSS transitions.

**Props**:
```typescript
interface AccordionProps {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}
```

**Usage**:
```tsx
<Accordion title="More details" defaultOpen={false}>
  <div>Hidden content here</div>
</Accordion>
```

**Responsive**: Full width

**Animation**: CSS height transition (300ms)

---

### EmptyState

**Purpose**: Display when no content or results are available.

**Props**:
```typescript
interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}
```

**Usage**:
```tsx
<EmptyState
  icon={<Users className="w-16 h-16" />}
  title="Aucune équipe à afficher"
  description="Aucune équipe ne correspond aux filtres sélectionnés."
/>
```

**Responsive**: Centered, full width

---

### LoadingBar

**Purpose**: Top progress bar for loading states and Suspense fallback.

**Props**:
```typescript
interface LoadingBarProps {
  loading?: boolean  // Default: true
}
```

**Usage**:
```tsx
<LoadingBar />  // Always visible
<LoadingBar loading={isLoading} />  // Conditional
```

**Responsive**: Fixed at top, full width

**Data attribute**: `data-testid="loading-bar"`

**Animation**: Indeterminate progress (1.5s)

---

### ResponsiveTable

**Purpose**: TanStack Table wrapper with column priority system for responsive behavior.

**Props**:
```typescript
interface ResponsiveColumnDef<T> extends ColumnDef<T> {
  priority?: 'high' | 'medium' | 'low'
  // high: Always visible
  // medium: Hidden on mobile (<768px)
  // low: Hidden on mobile and tablet (<1024px)
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: ResponsiveColumnDef<T>[]
  mobileCard?: (row: T) => ReactNode  // Optional mobile card component
}
```

**Usage**:
```tsx
<ResponsiveTable
  data={competitors}
  columns={[
    { accessorKey: 'name', header: 'Nom', priority: 'high' },
    { accessorKey: 'points', header: 'Points', priority: 'high' },
    { accessorKey: 'category', header: 'Catégorie', priority: 'medium' }
  ]}
  mobileCard={(row) => <PlayerCard player={row} />}
/>
```

**Responsive**:
- Desktop (≥1024px): All columns visible
- Tablet (768-1023px): Hide low-priority columns
- Mobile (<768px): Show mobileCard or hide medium/low columns

---

### TeamMatchCard

**Purpose**: Display team match information with color-coded result.

**Props**:
```typescript
interface TeamMatchCardProps {
  match: TeamMatch
  teamName: string
}
```

**Usage**:
```tsx
<TeamMatchCard match={matchData} teamName="USFTT 1" />
```

**Responsive**: Full width

**Colors**: Green border (victory), red border (defeat), gray border (draw)

---

## Shared Components

Located in `src/components/shared/`

### LastUpdate

**Purpose**: Display CSV file last modified timestamp with multiple variants.

**Props**:
```typescript
interface LastUpdateProps {
  lastModified: Date | null
  loading: boolean
  variant: 'full' | 'relative' | 'compact'
}
```

**Usage**:
```tsx
<LastUpdate
  lastModified={lastModified}
  loading={loading}
  variant="relative"
/>
```

**Variants**:
- `full`: "Dernière mise à jour: 15/01/2025 à 14:30"
- `relative`: "il y a 2h"
- `compact`: "15/01 14:30"

**Responsive**: Adapts to container

---

### ProgressionBadge

**Purpose**: Display progression value with color-coded styling.

**Props**:
```typescript
interface ProgressionBadgeProps {
  value: number  // Can be positive, negative, or zero
}
```

**Usage**:
```tsx
<ProgressionBadge value={25} />  // Green with +25
<ProgressionBadge value={-10} /> // Red with -10
<ProgressionBadge value={0} />   // Gray with 0
```

**Colors**:
- Positive: Green (victory color)
- Negative: Red (defeat color)
- Zero: Gray (draw color)

---

### GenderIcon

**Purpose**: Display gender icon (emoji or symbol).

**Props**:
```typescript
interface GenderIconProps {
  gender: 'G' | 'F'  // G = Garçon/Homme, F = Fille/Femme
  variant?: 'emoji' | 'text'
}
```

**Usage**:
```tsx
<GenderIcon gender="G" variant="emoji" />  // 👨
<GenderIcon gender="F" variant="text" />   // "Féminine"
```

---

## Page-Specific Components

### HomePage Components (`src/components/home/`)

#### DashboardHeader

**Purpose**: Dashboard with 4 statistics cards.

**Props**:
```typescript
interface DashboardHeaderProps {
  stats: DashboardStats
}

interface DashboardStats {
  totalPlayers: number
  activePlayers: number
  averagePoints: number
  totalMatches: number
  topProgression?: Competitor
  categoryBreakdown?: { category: string; count: number }[]
}
```

**Usage**:
```tsx
<DashboardHeader stats={dashboardStats} />
```

**Responsive**: 4 columns desktop, 2 tablet, 1 mobile

**Data attribute**: `data-testid="dashboard-header"`

---

#### PlayerList

**Purpose**: Responsive player display (table on desktop, cards on mobile).

**Props**:
```typescript
interface PlayerListProps {
  competitors: Competitor[]
  columns: ColumnDef<Competitor>[]
}
```

**Usage**:
```tsx
<PlayerList competitors={filteredCompetitors} columns={columns} />
```

**Responsive**: Auto-switches between table and cards at 768px breakpoint

---

### ClassementPage Components (`src/components/classement/`)

#### PlayerRankingCard

**Purpose**: Mobile card for player ranking with expandable details.

**Props**:
```typescript
interface PlayerRankingCardProps {
  player: Competitor
  rank: number
}
```

**Usage**:
```tsx
<PlayerRankingCard player={competitor} rank={1} />
```

**Features**:
- Large rank number
- Points display (3xl font, primary color)
- Expandable accordion for additional details
- Gender icon, category badge, progression badges

---

### EquipesPage Components (`src/components/equipes/`)

#### TeamCard

**Purpose**: Team summary card for overview grid.

**Props**:
```typescript
interface TeamCardProps {
  team: Team
  onSelect: () => void
}
```

**Usage**:
```tsx
<TeamCard team={teamData} onSelect={() => handleSelectTeam(team.id)} />
```

**Features**:
- Color-coded division badge (N1=yellow, R1=gray, D1=orange)
- Stats grid (V/D/N/Win%)
- Gender indicator
- "Voir le calendrier →" link

**Data attribute**: `data-testid="team-card"`

---

#### TeamStats

**Purpose**: Display team statistics in 4-card grid.

**Props**:
```typescript
interface TeamStatsProps {
  victories: number
  defeats: number
  draws: number
  totalMatches: number
}
```

**Usage**:
```tsx
<TeamStats victories={10} defeats={3} draws={2} totalMatches={15} />
```

**Responsive**: 2 columns mobile, 4 columns desktop

**Data attribute**: `data-testid="team-stats"`

---

#### MatchResultList

**Purpose**: Vertical list of match cards with results.

**Props**:
```typescript
interface MatchResultListProps {
  matches: TeamMatch[]
  tourNumber: string
}
```

**Usage**:
```tsx
<MatchResultList matches={tourMatches} tourNumber="1" />
```

**Features**:
- Color-coded borders (victory/defeat/draw)
- Score display
- Date with Calendar icon
- Location (Domicile/Extérieur) with MapPin icon
- Empty state for non-programmed matches

**Data attribute**: `data-testid="match-result-list"`

---

#### TeamOverviewView

**Purpose**: Responsive grid of team cards.

**Props**:
```typescript
interface TeamOverviewViewProps {
  teams: Team[]
  onSelectTeam: (teamId: string) => void
}
```

**Usage**:
```tsx
<TeamOverviewView teams={filteredTeams} onSelectTeam={handleSelectTeam} />
```

**Responsive**: 1 column mobile, 2 tablet, 3 desktop

**Data attribute**: `data-testid="team-overview"`

---

#### TeamDetailView

**Purpose**: Detailed team view with stats and match results.

**Props**:
```typescript
interface TeamDetailViewProps {
  team: Team
  tours: string[]
  selectedTour: string
  onTourChange: (tour: string) => void
  onBack: () => void
}
```

**Usage**:
```tsx
<TeamDetailView
  team={selectedTeam}
  tours={['1', '2', '3']}
  selectedTour={selectedTour}
  onTourChange={setSelectedTour}
  onBack={handleBack}
/>
```

**Features**:
- Back button with ArrowLeft icon
- Team header with division badge
- TeamStats component
- Tour tabs navigation
- MatchResultList for selected tour

**Data attribute**: `data-testid="team-detail-view"`

---

## Layout Components

Located in `src/components/layout/`

### Layout

**Purpose**: Main layout wrapper with responsive navigation.

**Features**:
- Desktop top navigation (≥768px)
- Mobile bottom navigation (<768px)
- Outlet for routed pages
- ErrorBoundary wrapper

---

### Navigation

**Purpose**: Responsive navigation component.

**Features**:
- Desktop: Horizontal top nav with text links
- Mobile: Bottom tab bar with icons
- Active page highlighting
- Accessible keyboard navigation

---

## Component Design Patterns

### Naming Conventions
- Component files use PascalCase: `TeamCard.tsx`
- Props interfaces: `[ComponentName]Props`
- Data attributes for testing: `data-testid="component-name"`

### Styling
- Tailwind utility classes
- CSS-only animations (no external libraries)
- Consistent spacing (4px base unit)
- Mobile-first responsive design

### Accessibility
- Semantic HTML elements
- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus indicators (ring-2 ring-primary)
- Proper heading hierarchy

### Testing
- Data attributes for E2E tests (`data-testid`)
- Responsive behavior tested across 6 viewports
- Accessibility checks (WCAG 2.1 Level AA basics)

---

## Best Practices

1. **Always use data-testid** for testable components
2. **Prefer CSS animations** over JavaScript animations
3. **Design mobile-first**, then enhance for larger screens
4. **Use consistent spacing** from Tailwind scale
5. **Follow color system**: Primary, Victory, Defeat, Draw, Neutral
6. **Ensure zero horizontal scrolling** on all screen sizes
7. **Provide loading states** with skeleton components
8. **Handle empty states** with EmptyState component
9. **Use semantic HTML** (button, nav, header, etc.)
10. **Add focus indicators** for keyboard navigation
