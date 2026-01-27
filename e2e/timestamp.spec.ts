import { test, expect } from '@playwright/test'

test.describe('CSV Timestamp Display', () => {
  test('should display last update timestamp on HomePage', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Check if timestamp is visible (either full or relative format)
    const timestampLocator = page.getByTestId('last-update')
    await expect(timestampLocator).toBeVisible({ timeout: 10000 })

    // Check that it contains expected text patterns
    const timestampText = await timestampLocator.textContent()
    expect(timestampText).toMatch(/Mise à jour|Dernière mise à jour|MAJ/)
  })

  test('should display last update timestamp on ClassementPage', async ({ page }) => {
    await page.goto('/classement')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Check if timestamp is visible
    const timestampLocator = page.getByTestId('last-update')
    await expect(timestampLocator).toBeVisible({ timeout: 10000 })

    const timestampText = await timestampLocator.textContent()
    expect(timestampText).toMatch(/Mise à jour|Dernière mise à jour|MAJ/)
  })

  test('should display last update timestamp on EquipesPage', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Check if timestamp is visible
    const timestampLocator = page.getByTestId('last-update')
    await expect(timestampLocator).toBeVisible({ timeout: 10000 })

    const timestampText = await timestampLocator.textContent()
    expect(timestampText).toMatch(/Mise à jour|Dernière mise à jour|MAJ/)
  })

  test('should show skeleton loader while fetching timestamp', async ({ page }) => {
    // Intercept network requests to slow them down
    await page.route('**/backend/*.csv', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/')

    // Should show skeleton initially
    const skeletonLocator = page.getByTestId('timestamp-skeleton')
    await expect(skeletonLocator).toBeVisible()
  })

  test('should have clock icon with timestamp', async ({ page }) => {
    await page.goto('/')

    // Wait for timestamp to load
    await page.waitForSelector('[data-testid="last-update"]')

    // Check for clock icon (lucide-react Clock component)
    const clockIcon = page.locator('[data-testid="last-update"] svg')
    await expect(clockIcon).toBeVisible()
  })

  test('should display timestamp in page header', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Check that timestamp and title are in the same flex container
    const header = page.locator('h1').locator('..')
    const timestamp = header.locator('[data-testid="last-update"]')

    await expect(timestamp).toBeVisible()
  })
})
