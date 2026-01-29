import { test, expect } from '@playwright/test'

test.describe('HomePage Dashboard', () => {
  test('should display dashboard stats cards', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="dashboard-header"]', { timeout: 10000 })

    // Check all stats cards are visible
    const statsCards = await page.locator('[data-testid="stats-card"]').count()
    expect(statsCards).toBe(4)

    // Check for expected stats labels by checking text content of dashboard
    const dashboardText = await page.locator('[data-testid="dashboard-header"]').textContent()
    expect(dashboardText).toContain('Total joueurs')
    expect(dashboardText).toContain('Joueurs actifs')
    expect(dashboardText).toContain('Matchs joués')
    expect(dashboardText).toContain('Moyenne de points')
  })

  test('should display player cards on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for cards to load
    await page.waitForSelector('[data-testid="player-card"]', { timeout: 10000 })

    // Check that cards are displayed (not table)
    const cards = await page.locator('[data-testid="player-card"]').count()
    expect(cards).toBeGreaterThan(0)

    // Verify table is not displayed
    const table = await page.locator('table').count()
    expect(table).toBe(0)
  })

  test('should display table on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 })

    // Verify table is displayed
    await expect(page.locator('table')).toBeVisible()

    // Verify cards are not displayed
    const cards = await page.locator('[data-testid="player-card"]').count()
    expect(cards).toBe(0)
  })

  test('should filter players by search', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Get initial player count
    const initialCount = await page.locator('[data-testid="player-card"], table tbody tr').count()
    expect(initialCount).toBeGreaterThan(0)

    // Enter search term
    const searchInput = page.getByPlaceholder(/Rechercher/i)
    await searchInput.fill('Martin')

    // Wait for filtering
    await page.waitForTimeout(500)

    // Check that player count updated
    const searchResults = await page.getByText(/correspondant à "Martin"/i)
    await expect(searchResults).toBeVisible()
  })

  test('should filter players by category', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Select a category
    const categoryFilter = page.locator('#categoryFilter')
    await categoryFilter.selectOption({ index: 1 }) // Select first non-empty option

    // Wait for filtering
    await page.waitForTimeout(500)

    // Check that category filter is applied
    const categoryText = await page.getByText(/dans la catégorie/i)
    await expect(categoryText).toBeVisible()
  })

  test('should clear search with X button', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Enter search term
    const searchInput = page.getByPlaceholder(/Rechercher/i)
    await searchInput.fill('Test')

    // Click clear button
    const clearButton = searchInput.locator('..').getByRole('button')
    await clearButton.click()

    // Verify search is cleared
    await expect(searchInput).toHaveValue('')
  })

  test('should combine search and category filters', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Apply both filters
    const searchInput = page.getByPlaceholder(/Rechercher/i)
    await searchInput.fill('Dupont')

    const categoryFilter = page.locator('#categoryFilter')
    await categoryFilter.selectOption({ index: 1 })

    // Wait for filtering
    await page.waitForTimeout(500)

    // Check that both filters are mentioned
    const filterText = await page.locator('text=/joueurs? dans la catégorie.*correspondant/i')
    await expect(filterText).toBeVisible()
  })

  test('should show skeleton loaders while loading', async ({ page }) => {
    // Intercept network to slow it down
    await page.route('**/backend/*.csv', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/')

    // Check for skeleton cards (dashboard stats)
    const skeletonCards = page.locator('[data-testid="skeleton-card"]')
    await expect(skeletonCards.first()).toBeVisible()
  })

  test('should display player count correctly', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

    // Check player count is displayed
    const playerCount = page.locator('text=/\\d+ joueurs?/')
    await expect(playerCount).toBeVisible()

    // Count should be a positive number
    const countText = await playerCount.textContent()
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0')
    expect(count).toBeGreaterThan(0)
  })

  test('should have search input in filter panel', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('[data-testid="filter-panel"]')

    // Check filter panel contains search input
    const filterPanel = page.locator('[data-testid="filter-panel"]')
    const searchInput = filterPanel.getByPlaceholder(/Rechercher/i)
    await expect(searchInput).toBeVisible()
  })

  test('should not show horizontal scroll on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for page to load
    await page.waitForSelector('h1')

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

    // Each card should have an icon (svg element)
    const icon = firstCard.locator('svg')
    await expect(icon).toBeVisible()
  })
})
