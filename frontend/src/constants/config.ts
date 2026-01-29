// Use the correct base path for CSV files based on Vite's base configuration
// In production: /usftt/backend, In dev/test: /backend
const BASE_PATH = import.meta.env.BASE_URL === '/' ? '/backend' : '/usftt/backend'

export const CSV_PATHS = {
  LICENSES: `${BASE_PATH}/licenses_08940073.csv`,
  COMPETITORS: `${BASE_PATH}/competitors_08940073.csv`,
  MATCHES: `${BASE_PATH}/rencontres_08940073.csv`,
}

export const CLUB_NUMBER = '08940073'

export const ROUTES = {
  HOME: '/',
  CLASSEMENT: '/classement',
  EQUIPES: '/equipes',
  TESTS: '/tests',
}
