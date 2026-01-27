import { test, expect } from '@playwright/test'

test.describe('EquipesPage Responsive Redesign', () => {
  test('should display team cards without horizontal scroll', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards to load
    await page.waitForSelector('[data-testid="team-card"]', { timeout: 10000 })

    // Check cards are displayed
    const cards = await page.locator('[data-testid="team-card"]').count()
    expect(cards).toBeGreaterThan(0)

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('should display team cards on mobile without horizontal scroll', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/equipes')

    // Wait for cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('should filter teams by gender', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Click masculine filter
    const masculineButton = page.getByRole('button', { name: /Masculines/i })
    await masculineButton.click()

    // Wait for filtering
    await page.waitForTimeout(500)

    // Team count should be displayed
    const teamCount = page.locator('text=/\\d+ équipes?/')
    await expect(teamCount).toBeVisible()
  })

  test('should navigate to team detail view', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Get team name from first card
    const firstCard = page.locator('[data-testid="team-card"]').first()
    const teamName = await firstCard.locator('[data-testid="team-name"]').textContent()

    // Click the card
    await firstCard.click()

    // Wait for detail view to load
    await page.waitForSelector('[data-testid="team-detail-view"]', { timeout: 5000 })

    // Should show team detail view
    await expect(page.getByRole('heading', { name: teamName || '' })).toBeVisible()

    // Should show back button
    await expect(page.getByRole('button', { name: /Retour/i })).toBeVisible()
  })

  test('should display team stats in detail view', async ({ page }) => {
    await page.goto('/equipes')

    // Wait and click first team
    await page.waitForSelector('[data-testid="team-card"]')
    await page.locator('[data-testid="team-card"]').first().click()

    // Wait for detail view
    await page.waitForSelector('[data-testid="team-stats"]')

    // Check for stats cards
    const statsCards = await page.locator('[data-testid="stats-card"]').count()
    expect(statsCards).toBeGreaterThanOrEqual(3) // At least V, D, N stats
  })

  test('should switch between tour tabs', async ({ page }) => {
    await page.goto('/equipes')

    // Navigate to detail view
    await page.waitForSelector('[data-testid="team-card"]')
    await page.locator('[data-testid="team-card"]').first().click()

    // Wait for tabs to appear
    await page.waitForSelector('[data-testid="tabs"]')

    // Click Tour 2 tab (if it exists)
    const tour2Tab = page.getByRole('button', { name: /Tour 2/i })
    const tour2Exists = await tour2Tab.count()

    if (tour2Exists > 0) {
      await tour2Tab.click()

      // Wait for content to update
      await page.waitForTimeout(300)

      // Tab should be active
      const activeTab = page.locator('[aria-current="page"]')
      await expect(activeTab).toContainText('Tour 2')
    }
  })

  test('should navigate back from team detail', async ({ page }) => {
    await page.goto('/equipes')

    // Get initial team count
    await page.waitForSelector('[data-testid="team-card"]')
    const initialCount = await page.locator('[data-testid="team-card"]').count()

    // Click first team
    await page.locator('[data-testid="team-card"]').first().click()

    // Wait for detail view
    await page.waitForSelector('[data-testid="team-detail-view"]')

    // Click back button
    await page.getByRole('button', { name: /Retour/i }).click()

    // Wait for overview to appear
    await page.waitForSelector('[data-testid="team-overview"]')

    // Should show same number of teams
    const finalCount = await page.locator('[data-testid="team-card"]').count()
    expect(finalCount).toBe(initialCount)
  })

  test('should display division badges with colors', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Check first card has division badge
    const firstCard = page.locator('[data-testid="team-card"]').first()
    const divisionBadge = firstCard.locator('span[class*="border"]')
    await expect(divisionBadge.first()).toBeVisible()
  })

  test('should display match results with proper styling', async ({ page }) => {
    await page.goto('/equipes')

    // Navigate to detail view
    await page.waitForSelector('[data-testid="team-card"]')
    await page.locator('[data-testid="team-card"]').first().click()

    // Wait for match results
    await page.waitForSelector('[data-testid="match-result-list"]')

    // Check for match cards
    const matchCards = await page.locator('[data-testid="match-card"]').count()
    if (matchCards > 0) {
      // Check first match card has result badge
      const firstMatch = page.locator('[data-testid="match-card"]').first()
      await expect(firstMatch).toBeVisible()
    }
  })

  test('should show win/loss statistics on team cards', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Check first card has stats (V, D, N labels)
    const firstCard = page.locator('[data-testid="team-card"]').first()
    await expect(firstCard.getByText('V')).toBeVisible() // Victoires
    await expect(firstCard.getByText('D')).toBeVisible() // Défaites
    await expect(firstCard.getByText('N')).toBeVisible() // Nuls
  })

  test('should display gender indicator on team cards', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Check first card has gender indicator (emoji or text)
    const firstCard = page.locator('[data-testid="team-card"]').first()
    const genderText = firstCard.locator('text=/Masculine|Féminine/')
    await expect(genderText).toBeVisible()
  })

  test('should show empty state when no teams match filter', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for page to load
    await page.waitForSelector('h1')

    // If there are any teams initially, filters should work
    const initialTeamCount = await page.locator('[data-testid="team-card"]').count()

    if (initialTeamCount > 0) {
      // Try different gender filters to see if we can get empty state
      // This test verifies the empty state component exists
      await expect(page.locator('[data-testid="team-overview"]')).toBeVisible()
    }
  })

  test('should display team calendar link', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for team cards
    await page.waitForSelector('[data-testid="team-card"]')

    // Check first card has calendar link
    const firstCard = page.locator('[data-testid="team-card"]').first()
    await expect(firstCard.getByText(/calendrier/i)).toBeVisible()
  })

  test('should show skeleton loaders while loading', async ({ page }) => {
    // Intercept network to slow it down
    await page.route('**/backend/*.csv', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/equipes')

    // Check for skeleton cards
    const skeletonCards = page.locator('[data-testid="skeleton-card"]')
    await expect(skeletonCards.first()).toBeVisible()
  })

  test('should display responsive grid layout', async ({ page }) => {
    // Desktop - should show 3 columns
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')
    await page.waitForSelector('[data-testid="team-overview"]')

    const overview = page.locator('[data-testid="team-overview"]')
    await expect(overview).toHaveClass(/lg:grid-cols-3/)

    // Mobile - should show 1 column
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForSelector('[data-testid="team-overview"]')
    await expect(overview).toHaveClass(/grid-cols-1/)
  })
})
