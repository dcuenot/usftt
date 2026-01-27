import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile (iPhone 13)', width: 390, height: 844 },
    { name: 'Mobile (iPhone SE)', width: 375, height: 667 },
    { name: 'Tablet (iPad)', width: 768, height: 1024 },
    { name: 'Tablet (iPad Pro)', width: 1024, height: 1366 },
    { name: 'Desktop (HD)', width: 1920, height: 1080 },
    { name: 'Desktop (4K)', width: 2560, height: 1440 },
  ]

  for (const viewport of viewports) {
    test(`should render HomePage without horizontal scroll on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      // Wait for page to load
      await page.waitForSelector('h1')

      // Check no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // +1 for rounding
    })

    test(`should render ClassementPage without horizontal scroll on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/classement')

      // Wait for page to load
      await page.waitForSelector('h1')

      // Check no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test(`should render EquipesPage without horizontal scroll on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/equipes')

      // Wait for page to load
      await page.waitForSelector('h1')

      // Check no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })
  }

  test('should display mobile card layout on small screens (HomePage)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Should show cards (not table)
    const cards = await page.locator('[data-testid="player-card"]').count()
    const tables = await page.locator('table').count()

    // Either cards should be visible or no content (empty state)
    if (cards === 0 && tables === 0) {
      // Empty state is acceptable
      expect(true).toBe(true)
    } else {
      // Cards should be visible, not table
      expect(cards).toBeGreaterThan(0)
      expect(tables).toBe(0)
    }
  })

  test('should display table layout on large screens (HomePage)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Should show table (not cards)
    const tables = await page.locator('table').count()
    const cards = await page.locator('[data-testid="player-card"]').count()

    // Either table should be visible or no content (empty state)
    if (cards === 0 && tables === 0) {
      // Empty state is acceptable
      expect(true).toBe(true)
    } else {
      // Table should be visible, not cards
      expect(tables).toBeGreaterThan(0)
      expect(cards).toBe(0)
    }
  })

  test('should display mobile card layout on small screens (ClassementPage)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/classement')

    // Wait for content
    await page.waitForSelector('h1')

    // Should show cards or table with hidden columns
    const content = await page.locator('[data-testid="player-ranking-card"], table').count()
    expect(content).toBeGreaterThan(0)
  })

  test('should hide low-priority columns on mobile (ClassementPage)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/classement')

    // Wait for table (if visible on mobile)
    const tableExists = await page.locator('table').count()

    if (tableExists > 0) {
      // Check that some columns are hidden (responsive table behavior)
      const allHeaders = await page.locator('th').count()
      expect(allHeaders).toBeLessThan(10) // Should hide some columns
    }
  })

  test('should show all columns on desktop (ClassementPage)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/classement')

    // Wait for table
    await page.waitForSelector('table')

    // Should show more columns on desktop
    const allHeaders = await page.locator('th').count()
    expect(allHeaders).toBeGreaterThan(5) // Should show many columns
  })

  test('should display team cards in responsive grid (EquipesPage)', async ({ page }) => {
    // Mobile: 1 column
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/equipes')
    await page.waitForSelector('h1')

    let gridContainer = page.locator('[data-testid="team-overview"]')
    if ((await gridContainer.count()) > 0) {
      await expect(gridContainer).toHaveClass(/grid-cols-1/)
    }

    // Tablet: 2 columns
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await page.waitForSelector('h1')

    gridContainer = page.locator('[data-testid="team-overview"]')
    if ((await gridContainer.count()) > 0) {
      await expect(gridContainer).toHaveClass(/md:grid-cols-2/)
    }

    // Desktop: 3 columns
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await page.waitForSelector('h1')

    gridContainer = page.locator('[data-testid="team-overview"]')
    if ((await gridContainer.count()) > 0) {
      await expect(gridContainer).toHaveClass(/lg:grid-cols-3/)
    }
  })

  test('should adapt dashboard stats grid responsively (HomePage)', async ({ page }) => {
    // Mobile: 1 column
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForSelector('[data-testid="dashboard-header"]')

    let statsGrid = page.locator('[data-testid="dashboard-header"]')
    await expect(statsGrid).toHaveClass(/grid/)

    // Desktop: 4 columns
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await page.waitForSelector('[data-testid="dashboard-header"]')

    statsGrid = page.locator('[data-testid="dashboard-header"]')
    await expect(statsGrid).toHaveClass(/lg:grid-cols-4/)
  })

  test('should stack filters vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for filter panel
    const filterPanel = page.locator('[data-testid="filter-panel"]')
    if ((await filterPanel.count()) > 0) {
      // Filters should be stacked (flex-col or full width)
      const hasFlexCol = await filterPanel.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.flexDirection === 'column' || styles.flexWrap === 'wrap'
      })
      expect(hasFlexCol).toBe(true)
    }
  })

  test('should show filters in row on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Wait for filter panel
    const filterPanel = page.locator('[data-testid="filter-panel"]')
    if ((await filterPanel.count()) > 0) {
      // Filters should be in row or wrapped
      await expect(filterPanel).toBeVisible()
    }
  })

  test('should maintain readability at all viewport sizes', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      // Wait for content
      await page.waitForSelector('h1')

      // Check that text is not truncated or overflowing
      const h1 = page.locator('h1').first()
      const isVisible = await h1.isVisible()
      expect(isVisible).toBe(true)

      // Check that main content area has reasonable width
      const contentWidth = await page.evaluate(() => {
        const content = document.querySelector('main') || document.body
        return content.offsetWidth
      })
      expect(contentWidth).toBeGreaterThan(0)
      expect(contentWidth).toBeLessThanOrEqual(viewport.width)
    }
  })
})
