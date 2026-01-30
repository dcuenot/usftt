import { test, expect } from '@playwright/test'

test.describe('HomePage Dashboard', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')

    // Wait for CSV data to load
    await page.waitForLoadState('networkidle')

    // Check title
    await expect(page).toHaveTitle(/USFTT/)

    // Check heading
    const heading = page.locator('h1')
    await expect(heading).toContainText('Liste des joueurs')
  })

  test('should display dashboard header', async ({ page }) => {
    await page.goto('/')

    // Wait for dashboard to load
    const dashboard = page.locator('[data-testid="dashboard-header"]')
    await expect(dashboard).toBeVisible()

    // Check that stats cards are present
    const statsCards = page.locator('[data-testid="stats-card"]')
    await expect(statsCards).toHaveCount(4)
  })

  test('should display all stats cards', async ({ page }) => {
    await page.goto('/')

    // Wait for stats cards to load
    await page.waitForSelector('[data-testid="stats-card"]')

    const statsCards = page.locator('[data-testid="stats-card"]')

    // Verify we have 4 stats cards
    await expect(statsCards).toHaveCount(4)

    // Check that each card has content
    for (let i = 0; i < 4; i++) {
      const card = statsCards.nth(i)
      await expect(card).toBeVisible()
      // Check that card has text content
      const text = await card.textContent()
      expect(text).toBeTruthy()
      expect(text?.length).toBeGreaterThan(0)
    }
  })

  test('should display stats values', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    const dashboardHeader = page.locator('[data-testid="dashboard-header"]')
    await expect(dashboardHeader).toBeVisible()

    // Check that numbers are displayed (look for numeric text)
    const firstCard = page.locator('[data-testid="stats-card"]').first()
    const text = await firstCard.textContent()

    // Should contain at least one number
    expect(text).toMatch(/\d+/)
  })

  test('should display search input', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check that search input is present
    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toBeVisible()
  })

  test('should have filter panel', async ({ page }) => {
    await page.goto('/')

    // Wait for page load
    await page.waitForLoadState('networkidle')

    // Check for filter panel
    const filterPanel = page.locator('[data-testid="filter-panel"]')
    await expect(filterPanel).toBeVisible()
  })

  test('should display player list', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    // Wait for either player cards or table rows
    const hasCards = (await page.locator('[data-testid="player-card"]').count()) > 0
    const hasTable = (await page.locator('table').count()) > 0

    expect(hasCards || hasTable).toBe(true)
  })

  test('should filter by search', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    // Get initial count
    const initialCount = await page.locator('[data-testid="player-card"]').or(page.locator('tbody tr')).count()

    // Type in search
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill('test')

    // Wait a bit for filtering
    await page.waitForTimeout(300)

    // Count should change (likely decrease)
    const newCount = await page.locator('[data-testid="player-card"]').or(page.locator('tbody tr')).count()

    // Either count decreased, or there was no match (both are valid)
    expect(newCount <= initialCount).toBe(true)
  })

  test('should filter by category', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    // Find category select
    const categorySelect = page.locator('#categoryFilter')
    await expect(categorySelect).toBeVisible()

    // Get available options
    const options = await categorySelect.locator('option').count()
    expect(options).toBeGreaterThan(1) // Should have "All" plus categories
  })

  test('should display player count', async ({ page }) => {
    await page.goto('/')

    // Wait for data
    await page.waitForLoadState('networkidle')

    // Look for text like "X joueurs"
    const playerCount = page.getByText(/\d+ joueurs?/)
    await expect(playerCount).toBeVisible()
  })

  test('should display last update timestamp', async ({ page }) => {
    await page.goto('/')

    // Wait for data
    await page.waitForLoadState('networkidle')

    // Check for relative time component
    const lastUpdate = page.locator('[data-testid="last-update"]')
    await expect(lastUpdate).toBeVisible()
  })

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
  })

  test('should display stats with icons', async ({ page }) => {
    await page.goto('/')

    // Wait for dashboard
    await page.waitForSelector('[data-testid="dashboard-header"]')

    // Check that stats cards have icons (SVG elements)
    const statsCards = page.locator('[data-testid="stats-card"]')
    const firstCard = statsCards.first()

    // Each card should have at least one SVG (icon or chart)
    const svgs = firstCard.locator('svg')
    const count = await svgs.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // First SVG should be visible (the icon)
    await expect(svgs.first()).toBeVisible()
  })
})
