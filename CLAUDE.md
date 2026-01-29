# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a table tennis club management web application for USFTT (US Fontenay TT) that displays player rankings, team results, and statistics. The application consists of a static HTML frontend with JavaScript and a Python backend that fetches data from the FFTT (French Table Tennis Federation) API.

## Architecture

### Frontend Structure (React Migration)
- **Framework**: React 19 with TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS v3.4 with extended design system (custom colors, typography, spacing)
- **Routing**: React Router v6
- **Table library**: TanStack Table v8 with responsive column priorities
- **Icons**: Lucide React
- **Testing**: Playwright E2E tests
- **Performance**: Code splitting with React.lazy, CSV caching (5-min TTL), ErrorBoundary
- **Pages**:
  - `/` (HomePage) - Dashboard with stats, player list with filtering and progression tracking
  - `/classement` (ClassementPage) - Individual ranking with responsive table/cards
  - `/equipes` (EquipesPage) - Team results with card-based overview and detail views
  - `/tests` (TestsPage) - Testing page
- **Mobile-first design**: Zero horizontal scrolling, card layouts on mobile, responsive tables on desktop
- **CSV data consumption**: Frontend loads CSV files via Papa Parse with Last-Modified timestamps

### Backend Structure (`backend/` directory)
- **Primary API client**: `fftt.py` - FFTTApiClient class for interacting with FFTT Smartping 2.0 API
- **Data processing scripts**:
  - `usftt_results.py` - Fetches player data, calculates progressions, generates CSV
  - `usftt_results_teams.py` - Fetches team data, match results, and team rankings
- **Testing**: `tests/` directory with pytest (33 tests covering division normalization, team ID extraction, and ranking API)
- **Data storage**: CSV files for players, licenses, competitors, and team results (`.gitignore`d as generated data)
- **Python dependencies** managed via Pipfile (requests, pandas, beautifulsoup4, openpyxl)
- **Dev dependencies**: pytest, pytest-cov for testing and coverage

### Data Flow
1. Backend Python scripts authenticate with FFTT API using environment variables
2. Scripts fetch player/team data and process it (calculate progressions, normalize divisions)
3. Data is saved to CSV files in the backend directory
4. React frontend loads CSV files via custom hooks (`useCsvData`) using Papa Parse
5. TanStack Table renders the data with sorting, filtering, and search capabilities

## Common Development Commands

### Python Backend
```bash
cd backend/
pipenv install          # Install dependencies
pipenv install --dev    # Install dev dependencies (pytest, pytest-cov)
pipenv shell            # Activate virtual environment
python fftt.py <endpoint> <params>  # Direct API testing
python usftt_results.py             # Generate player data CSV
python usftt_results_teams.py       # Generate team data CSV

# Testing
pipenv run pytest tests/ -v                    # Run all tests
pipenv run pytest tests/ -v --cov=.            # Run tests with coverage
pipenv run pytest tests/test_usftt_results_teams.py -v  # Run specific test file
```

### Environment Setup
Required environment variables for FFTT API access:
- `FFTT_APP_ID` - Application ID provided by FFTT
- `FFTT_PASSWORD` - Password for API authentication
- `FFTT_SERIE` - Optional series identifier

### React Frontend Development
```bash
# Development commands (requires Node.js 20+)
npm run dev          # Start dev server (http://localhost:5173/usftt/)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# E2E Testing (requires Node.js 20+)
npm run test:e2e     # Run all E2E tests
npm run test:e2e:ui  # Run tests in UI mode
npm run test:e2e:debug  # Run tests in debug mode

# Note: Use Node 20+ via nvm
nvm use 20
```

**Production site**: https://dcuenot.github.io/usftt/

**Project structure**:
- `src/components/` - React components organized by type:
  - `layout/` - Layout components (Layout, Navigation)
  - `ui/` - Reusable UI components (13 components: Skeleton, StatsCard, SearchInput, Tabs, etc.)
  - `shared/` - Shared components (LastUpdate, ProgressionBadge, GenderIcon)
  - `home/` - HomePage-specific components (DashboardHeader, PlayerList)
  - `classement/` - ClassementPage components (PlayerRankingCard)
  - `equipes/` - EquipesPage components (TeamCard, TeamStats, MatchResultList, etc.)
- `src/pages/` - Route pages (HomePage, ClassementPage, EquipesPage, TestsPage)
- `src/hooks/` - Custom hooks:
  - Data loading: `useCsvData`, `useCompetitorData`, `useTeamData`
  - Timestamps: `useCsvTimestamp`
  - Responsive: `useMediaQuery`, `useIsMobile`, `useIsTablet`, `useIsDesktop`
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions:
  - `timestamp.ts` - CSV timestamp formatting
  - `statistics.ts` - Dashboard stats calculation
  - `cn.ts` - Class name merging
  - `formatters.ts` - Data formatting
- `src/constants/` - App constants (CSV paths, routes)
- `e2e/` - Playwright E2E tests (7 test files covering all features)
- `public/` - Static assets (images, manifest)
- `archive/` - Original HTML files (for reference)

**Key files**:
- `vite.config.ts` - Build configuration (includes `/usftt/` base path for GitHub Pages)
- `tailwind.config.js` - Tailwind CSS custom theme
- `tsconfig.json` - TypeScript configuration

**Notes**:
- CSV data files must be generated by backend scripts first (ignored by git via `backend/.gitignore`)
- CSV files are generated data and should not be committed to version control
- Tailwind CSS v3.4 is used (TODO: upgrade to v4 when stable)
- GitHub Pages deployment via GitHub Actions (see `.github/workflows/deploy.yml`)
- **IMPORTANT**: Always consult the official FFTT API Smartping 2.0 documentation for endpoint parameters - do not assume or fabricate API parameters

### Git Workflow
**Commit Message Convention**: Use semantic commit messages with emoji prefixes

Format: `<emoji> <type>: <description>`

Common types and their emojis:
- ✨ `feat:` - New features
- 🐛 `fix:` - Bug fixes
- 📝 `docs:` - Documentation changes
- 💄 `style:` - UI/styling changes (CSS, Bootstrap)
- ♻️ `refactor:` - Code refactoring
- ✅ `test:` - Adding or updating tests
- 🔧 `chore:` - Maintenance tasks (dependencies, config, etc.)
- 🚀 `perf:` - Performance improvements
- 🔥 `remove:` - Removing code or files

Examples:
- `✨ feat: add team statistics dashboard`
- `🐛 fix: correct progression calculation for November`
- `📝 docs: update API integration instructions`
- `🔧 chore: add .vscode to gitignore`

## Key Technical Details

### FFTT API Integration
- Uses HMAC-SHA1 authentication with timestamp-based tokens
- Handles XML responses and converts to Python dictionaries
- Main endpoints: player details, team data, match results, club information, team rankings
- Club number: "08940073" (hardcoded for USFTT)

**Important API Endpoints**:
- `xml_result_equ.php` - Team rankings (classement)
  - Required parameters: `action="classement"`, `auto="1"`, `D1=<division_id>`, `cx_poule=<poule_id>`
  - Returns: `liste.classement[]` array with fields: `clt` (rank), `equipe` (team name), `pts` (points), `joue` (played), `vic` (wins), `nul` (draws), `def` (losses), `pf` (forfeits)
  - Note: Team names in API response do not include " - Phase X" suffix
- `xml_equipe.php` - Team list for a club
  - Parameter: `numclu=<club_number>`
  - Returns: `liste.equipe[]` with `liendivision` containing `cx_poule` and `D1` parameters
- `xml_rencontre_equ.php` - Match results for a poule
  - Parameter: `poule=<poule_id>`
  - Returns: `liste.tour[]` with match details

### Data Processing Features
- **Progression calculations**: Monthly and phase-based point changes
- **Match counting**: Filters out current month matches for accurate statistics
- **CSV merging**: Updates existing data files while preserving historical data
- **Division normalization**: Standardizes division names (N1, R1, D1, etc.)
- **Team ranking integration**: Fetches current standings from FFTT API with proper parameter extraction

### Backend Testing
**Test Framework**: pytest with pytest-cov for coverage reporting

**Test Files**:
- `tests/test_usftt_results_teams.py` - 33 tests covering:
  - `normalize_division()` - 16 tests for division name standardization (N1-N3, R1-R3, PR, PN, D1-D4)
  - `extract_team_id()` - 11 tests for team ID generation with gender markers (e.g., "1G", "3F")
  - `get_team_ranking()` - 6 tests for API ranking data parsing (single/multiple teams, errors, missing fields)

**Key Test Patterns**:
- Uses `unittest.mock.Mock` for API client mocking
- Tests actual API response structure from FFTT documentation
- Covers edge cases: missing fields, API errors, team not found, empty responses
- All tests validate graceful error handling with N/A fallbacks

**Running Tests in CI/CD**:
- Backend tests run automatically on all branches before frontend build
- Test job: `test-backend` in `.github/workflows/deploy.yml`
- Coverage reports uploaded to Codecov (if configured)

### Frontend Features

#### Design System
- **Extended Tailwind configuration**:
  - Color palette: Primary (50-800), Victory/Defeat/Draw variants, Neutral (50-800)
  - Typography scale: xs to 4xl with line heights
  - Custom spacing: 18, 88, 100, 120
  - Card shadows: shadow-card, shadow-card-hover, shadow-card-lg
  - Border radius: rounded-card (0.75rem)
- **CSS animations**: fadeIn, slideInFromRight, shimmer (skeleton loaders), spin
- **Global styles**: Typography (h1-h4), utility classes (.page-section, .card), focus indicators
- **Consistent spacing** using 4px base unit

#### Core Features
- **Dashboard (HomePage)**: 4 stats cards (total players, active players, matches, avg points)
- **Search and filtering**: Name search, category filter, gender filter
- **CSV timestamps**: Last-Modified display with relative time (e.g., "il y a 2h")
- **Responsive layouts**:
  - Zero horizontal scrolling on all screen sizes
  - Card layouts on mobile (<768px)
  - Tables on desktop (≥768px)
  - Responsive grid layouts (1→2→3 columns)
- **Column priority system**: High/medium/low priority columns for responsive tables
- **Sortable tables** with TanStack Table (French localization)
- **Progression highlighting**: Color-coded badges (green positive, red negative)
- **Mobile navigation**: Bottom tab bar with icons (<768px), top nav on desktop
- **TypeScript**: Full type safety for data models
- **Component library**: 13 reusable UI components with consistent design patterns

#### Performance Optimizations
- **Code splitting**: React.lazy for page components
- **CSV caching**: In-memory cache with 5-minute TTL
- **Error boundary**: Graceful error handling with user-friendly messages
- **Loading states**: Skeleton loaders matching content structure
- **Lighthouse scores target**: Performance >90, Accessibility >95

#### Testing
- **Playwright E2E tests**: 7 test suites covering:
  - Navigation (desktop/mobile)
  - Accessibility (WCAG 2.1 Level AA basics)
  - Responsive design (6 viewports)
  - Page-specific features (home, classement, equipes, timestamp)
- **Test execution**: Automated in CI/CD pipeline before deployment
- **Test coverage**: All critical user flows, responsive layouts, filtering, search