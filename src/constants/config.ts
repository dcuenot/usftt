const BASE_PATH = import.meta.env.PROD ? '/usftt/backend' : '/backend'

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
