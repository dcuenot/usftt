# USFTT Backend

Python backend for fetching and processing data from the FFTT (French Table Tennis Federation) Smartping 2.0 API.

## Setup

### Requirements
- Python 3.9+
- pipenv

### Installation

```bash
# Install dependencies
pipenv install

# Install dev dependencies (for testing)
pipenv install --dev

# Activate virtual environment
pipenv shell
```

### Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
FFTT_APP_ID=your_app_id_here
FFTT_PASSWORD=your_password_here
FFTT_SERIE=your_serie_here  # Optional
```

## Usage

### Data Generation Scripts

```bash
# Generate player data CSV
python usftt_results.py

# Generate team data and rankings CSV
python usftt_results_teams.py
```

### Direct API Testing

```bash
# Test any FFTT API endpoint
python fftt.py <endpoint> <params> [--json]

# Examples:
python fftt.py club_detail club=08940073 --json
python fftt.py classement_poule poule=1142701 division=199109 --json
python fftt.py joueur_detail licence=1234567 --json
```

## Testing

### Running Tests

```bash
# Run all tests
pipenv run pytest tests/ -v

# Run with coverage
pipenv run pytest tests/ -v --cov=. --cov-report=term --cov-report=xml

# Run specific test file
pipenv run pytest tests/test_usftt_results_teams.py -v
```

### Test Coverage

**Current Test Suite**: 33 tests in `tests/test_usftt_results_teams.py`

- **normalize_division()** - 16 tests
  - Federal divisions (N1, N2, N3)
  - Regional divisions (R1, R2, R3)
  - Pre-Regional (PR), Pre-National (PN)
  - Departmental divisions (D1, D2, D3, D4)
  - Edge cases (empty strings, whitespace, unknown divisions)

- **extract_team_id()** - 11 tests
  - Team number extraction from names
  - Gender marker assignment (G for masculine, F for feminine/Dames)
  - Multi-digit team numbers
  - Edge cases (no number, multiple numbers, empty names)

- **get_team_ranking()** - 6 tests
  - Single and multiple teams in response
  - Team not found handling
  - API error handling
  - Missing fields handling
  - Empty response handling

## Architecture

### Core Components

#### `fftt.py`
Main API client with HMAC-SHA1 authentication. Key methods:
- `initialisation()` - API initialization
- `club_detail(numero_club)` - Club information
- `list_joueurs_club(numero_club)` - Club players
- `joueur_detail(licence)` - Player details
- `parties_joueur(licence)` - Player matches
- `equipes_club(numero_club)` - Club teams
- `rencontre_equipes(poule)` - Match results
- `classement_poule(poule, division)` - Team rankings

#### `usftt_results.py`
Generates player data CSV with:
- Current rankings and points
- Monthly and phase progressions
- Match statistics (official, total)
- License information

#### `usftt_results_teams.py`
Generates team data CSV with:
- Team information and divisions
- Match results (home/away, scores)
- Current team rankings in their poule
- Normalized division names

### Key Functions

#### Division Normalization
```python
normalize_division("FED_Nationale 1")  # Returns "N1"
normalize_division("L08_R2 Poule B")    # Returns "R2"
normalize_division("D1 Masculine")      # Returns "D1"
```

#### Team ID Extraction
```python
extract_team_id("US FONTENAY TT 3 - Phase 1", "R1 Dames")  # Returns "3F"
extract_team_id("US FONTENAY TT 2", "D1 Masculine")        # Returns "2G"
```

#### Team Ranking Retrieval
```python
ranking = get_team_ranking(client, poule_id, division_id, team_name)
# Returns: {'rang': '2', 'points': '19', 'joues': '7', 'victoires': '6', ...}
```

## FFTT API Integration

### Authentication
- Uses HMAC-SHA1 with MD5 password hash
- Timestamp-based tokens (format: `YYYYMMDDHHMMSSmmm`)
- Series identifier (15 alphanumeric characters)

### Important Endpoints

#### Team Rankings: `xml_result_equ.php`
**Required Parameters**:
- `action="classement"` - Specifies ranking request
- `auto="1"` - Auto mode
- `D1=<division_id>` - Division ID (extracted from `liendivision`)
- `cx_poule=<poule_id>` - Poule/pool ID

**Response Structure**: `liste.classement[]`
- `clt` - Rank/position
- `equipe` - Team name (without " - Phase X" suffix)
- `pts` - Points
- `joue` - Matches played
- `vic` - Wins
- `nul` - Draws
- `def` - Losses
- `pf` - Forfeits

**Important Notes**:
- Team names in API responses do NOT include the " - Phase X" suffix
- Both `cx_poule` and `D1` parameters are found in the `liendivision` URL
- Always consult official FFTT API documentation for parameter requirements

#### Team List: `xml_equipe.php`
**Parameters**: `numclu=<club_number>`

**Response**: `liste.equipe[]` containing:
- `libequipe` - Team name
- `libepr` - Competition name
- `libdivision` - Division name
- `liendivision` - URL with `cx_poule` and `D1` parameters

#### Match Results: `xml_rencontre_equ.php`
**Parameters**: `poule=<poule_id>`

**Response**: `liste.tour[]` with match details

## Data Flow

1. **Fetch teams**: `equipes_club()` retrieves all teams for USFTT (club 08940073)
2. **Filter**: Keep only "FED_Championnat de France" teams
3. **Extract IDs**: Parse `cx_poule` and `D1` from `liendivision` URL
4. **Get rankings**: Call `classement_poule(poule, division)` for each team
5. **Get matches**: Call `rencontre_equipes(poule)` for match results
6. **Process**: Normalize divisions, extract team IDs, match team names
7. **Export**: Write to CSV with all data combined

## Generated Files

All CSV files are excluded from version control (`.gitignore`):
- `rencontres_08940073.csv` - Team matches and rankings
- `competitors_08940073.csv` - Competitor data
- `licenses_08940073.csv` - License information
- `players_*.csv` - Player data with timestamps

## CI/CD Integration

Backend tests run automatically in GitHub Actions:
- Job: `test-backend` in `.github/workflows/deploy.yml`
- Runs on: All branches (push and pull requests)
- Python version: 3.9
- Coverage: Reports uploaded to Codecov (optional)

## Troubleshooting

### API Errors (400 Bad Request)
- Verify environment variables are set correctly
- Check that parameters match FFTT API documentation
- Ensure `action="classement"` is included for ranking requests
- Both `cx_poule` and `D1` parameters are required for `classement_poule()`

### Team Not Found in Rankings
- API returns team names without " - Phase X" suffix
- Strip suffix before comparing: `team_name.split(' - Phase')[0]`

### Test Failures
- Ensure mock responses match actual API structure
- API response structure: `liste.classement[]` (not `resultat.liste.equipe`)
- Field names: `clt`, `equipe`, `joue`, `vic`, `nul`, `def`, `pf`

## References

- FFTT API Smartping 2.0 Documentation (official PDF)
- Club: US Fontenay TT (08940073)
- Production: https://dcuenot.github.io/usftt/
