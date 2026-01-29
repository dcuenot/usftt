import { test as base, expect } from '@playwright/test'

/**
 * Extended Playwright test fixtures with shared setup for USFTT tests
 */
export const test = base.extend<{
  /**
   * Mock CSV data responses for testing without real backend data
   */
  mockCsvData: void
}>({
  mockCsvData: async ({ page }, use) => {
    // Intercept CSV requests and provide mock data
    // This can be customized per test as needed
    await page.route('**/backend/*.csv', async (route) => {
      const url = route.request().url()

      // Default mock responses
      if (url.includes('competitors.csv')) {
        const mockCompetitorsCsv = `licence,prenom,nom,cat,sexe,point,parties,prg_m,prg_p,prg_a
123456,Jean,Martin,Senior,M,1000,15,50,-20,100
234567,Marie,Dubois,Senior,F,950,12,30,10,80
345678,Pierre,Durand,Veteran,M,800,8,-10,5,20`
        await route.fulfill({ body: mockCompetitorsCsv, contentType: 'text/csv' })
      } else if (url.includes('players.csv')) {
        const mockPlayersCsv = `licence,nom,prenom,categorie,points,progression_mensuelle,progression_phase,progression_annuelle,matchs_joues
123456,Martin,Jean,Senior,1000,50,-20,100,15`
        await route.fulfill({ body: mockPlayersCsv, contentType: 'text/csv' })
      } else if (url.includes('teams.csv')) {
        const mockTeamsCsv = `id,nom,division,genre
1,Equipe 1,R1,M`
        await route.fulfill({ body: mockTeamsCsv, contentType: 'text/csv' })
      } else {
        // Let other requests pass through
        await route.continue()
      }
    })

    await use()
  },
})

export { expect }
