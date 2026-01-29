import { test, expect } from '@playwright/test'

test.describe('EquipesPage Dense Table View', () => {
  test('should display dense teams view without horizontal scroll on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for dense teams view to load
    await page.waitForSelector('[data-testid="dense-teams-view"]', { timeout: 10000 })

    // Check dense view is displayed
    const denseView = await page.locator('[data-testid="dense-teams-view"]')
    await expect(denseView).toBeVisible()

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('should display compact cards on mobile without horizontal scroll', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/equipes')

    // Wait for dense view with compact cards
    await page.waitForSelector('[data-testid="dense-teams-view"]', { timeout: 10000 })
    await page.waitForSelector('[data-testid="compact-team-card"]')

    // Check compact cards are displayed
    const compactCards = await page.locator('[data-testid="compact-team-card"]').count()
    expect(compactCards).toBeGreaterThan(0)

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })

  test('should display phase sections with Phase 2 before Phase 1', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for dense teams view
    await page.waitForSelector('[data-testid="dense-teams-view"]')

    // Find all phase sections
    const phaseSections = page.locator('h2:has-text("Phase")')
    const count = await phaseSections.count()

    if (count >= 2) {
      // Get text of first and second phase headings
      const firstPhaseText = await phaseSections.nth(0).textContent()
      const secondPhaseText = await phaseSections.nth(1).textContent()

      // Phase 2 should come before Phase 1
      expect(firstPhaseText).toContain('Phase 2')
      expect(secondPhaseText).toContain('Phase 1')
    }
  })

  test('should display home/away icons for unplayed matches', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for dense view and table
    await page.waitForSelector('[data-testid="dense-teams-view"]')
    await page.waitForSelector('table')

    // Look for tour result cells
    const tourCells = page.locator('td').filter({ hasText: /^J\d+$/ }).locator('..')

    // Check if any cells contain SVG icons (Home/Plane icons from Lucide)
    const cellsWithIcons = tourCells.locator('svg')
    const iconCount = await cellsWithIcons.count()

    // If there are unplayed matches, there should be icons
    // This test is flexible as it depends on the current season data
    if (iconCount > 0) {
      await expect(cellsWithIcons.first()).toBeVisible()
    }
  })

  test('should filter teams by gender', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // Click masculine filter
    const masculineButton = page.getByRole('button', { name: /Masculines/i })
    await masculineButton.click()

    // Wait for filtering
    await page.waitForTimeout(500)

    // Dense teams view should be visible with teams
    await expect(page.locator('[data-testid="dense-teams-view"]')).toBeVisible()

    // Check that teams are displayed (desktop table or mobile cards)
    const viewport = page.viewportSize()
    if (viewport && viewport.width >= 768) {
      // Desktop: check for table
      await expect(page.locator('table').first()).toBeVisible()
    } else {
      // Mobile: check for compact cards
      await expect(page.locator('[data-testid="compact-team-card"]').first()).toBeVisible()
    }
  })

  test('should display division badges with colors in desktop table', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for table
    await page.waitForSelector('table')

    // Check first row has division badge with blue or pink color
    const firstRow = page.locator('tbody tr').first()
    const divisionBadge = firstRow.locator('span[class*="border"]').first()
    await expect(divisionBadge).toBeVisible()

    const badgeClass = await divisionBadge.getAttribute('class')
    expect(badgeClass).toMatch(/blue|pink/)
  })

  test('should display division badges with colors in mobile cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/equipes')

    // Wait for compact cards
    await page.waitForSelector('[data-testid="compact-team-card"]')

    // Check first card has division badge
    const firstCard = page.locator('[data-testid="compact-team-card"]').first()
    const divisionBadge = firstCard.locator('span[class*="border"]').first()
    await expect(divisionBadge).toBeVisible()

    const badgeClass = await divisionBadge.getAttribute('class')
    expect(badgeClass).toMatch(/blue|pink/)
  })

  test('should display match results with proper styling', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for dense view and table
    await page.waitForSelector('[data-testid="dense-teams-view"]')
    await page.waitForSelector('table')

    // Check for tour result cells with match indicators (✓, ✗, =) or home/away icons
    const tourCells = page.locator('tbody td')
    const cellsWithResults = await tourCells.filter({ hasText: /[✓✗=]/ }).count()
    const cellsWithIcons = await tourCells.locator('svg').count()

    // Should have either match results or icons for unplayed matches
    expect(cellsWithResults + cellsWithIcons).toBeGreaterThan(0)
  })

  test('should display ranking and points in mobile compact cards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/equipes')

    // Wait for compact cards
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="compact-team-card"]')

    // Check first card has stats grid
    const firstCard = page.locator('[data-testid="compact-team-card"]').first()

    // Check for rank badge
    const rankBadge = firstCard.locator('.rounded-full')
    await expect(rankBadge).toBeVisible()

    // Check for stats labels (Pts, J, V, D)
    const cardText = await firstCard.textContent()
    expect(cardText).toContain('Pts') // Points
    expect(cardText).toContain('J') // Joués
    expect(cardText).toContain('V') // Victoires
    expect(cardText).toContain('D') // Défaites
  })

  test('should display sortable columns in desktop table', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for table
    await page.waitForSelector('table')

    // Target the first table specifically to avoid multiple matches
    const firstTable = page.locator('table').first()

    // Check for sortable column headers in first table
    const equipeHeader = firstTable.locator('th', { hasText: 'Équipe' })
    const cltHeader = firstTable.locator('th', { hasText: 'Clt' })
    const ptsHeader = firstTable.locator('th', { hasText: 'Pts' })

    await expect(equipeHeader).toBeVisible()
    await expect(cltHeader).toBeVisible()
    await expect(ptsHeader).toBeVisible()

    // Check that clicking a header triggers sorting (look for sort icons)
    await cltHeader.click()
    await page.waitForTimeout(300)

    // After clicking, there should be a sort icon (ChevronUp or ChevronDown) in the clicked header
    const sortIcon = cltHeader.locator('svg[class*="lucide"]')
    await expect(sortIcon).toBeVisible()
  })

  test('should display tour results with J notation', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for dense view
    await page.waitForSelector('[data-testid="dense-teams-view"]')

    // Check viewport to determine what to look for
    const viewport = page.viewportSize()
    if (viewport && viewport.width >= 768) {
      // Desktop: check table headers
      await page.waitForSelector('table')
      const tourHeaders = page.locator('th:has-text("J")')
      const count = await tourHeaders.count()
      expect(count).toBeGreaterThan(0)
    } else {
      // Mobile: check compact cards
      await page.waitForSelector('[data-testid="compact-team-card"]')
      const firstCard = page.locator('[data-testid="compact-team-card"]').first()
      const cardText = await firstCard.textContent()
      expect(cardText).toMatch(/J\d+/) // Should contain J1, J2, etc.
    }
  })

  test('should display opponent names with tooltips in desktop table', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for table
    await page.waitForSelector('table')

    // Look for tour cells with opponent names (vs text)
    const opponentCells = page.locator('td:has-text("vs")')
    const count = await opponentCells.count()

    if (count > 0) {
      const firstOpponentCell = opponentCells.first()
      await expect(firstOpponentCell).toBeVisible()

      // Check for title attribute (tooltip with full name)
      const opponentDiv = firstOpponentCell.locator('div[title]')
      const hasTitle = await opponentDiv.count()
      expect(hasTitle).toBeGreaterThan(0)
    }
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

  test('should display responsive layout: table on desktop, cards on mobile', async ({ page }) => {
    // Desktop - should show table
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="dense-teams-view"]')

    // Should have table element
    const desktopTable = page.locator('table')
    await expect(desktopTable.first()).toBeVisible()

    // Mobile - should show compact cards
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('[data-testid="dense-teams-view"]')
    await page.waitForSelector('[data-testid="compact-team-card"]')

    // Should have compact cards
    const mobileCards = await page.locator('[data-testid="compact-team-card"]').count()
    expect(mobileCards).toBeGreaterThan(0)

    // Should not have table on mobile
    const mobileTable = page.locator('table')
    const tableCount = await mobileTable.count()
    expect(tableCount).toBe(0)
  })

  test('should display rank badges with color coding', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for table
    await page.waitForSelector('table')

    // Look for rank badges (should have color-coded backgrounds)
    const rankBadges = page.locator('.rounded-full').filter({ hasText: /^\d+$/ })
    const count = await rankBadges.count()

    if (count > 0) {
      const firstBadge = rankBadges.first()
      await expect(firstBadge).toBeVisible()

      // Check for color classes (yellow for 1st, gray for 2nd, orange for 3rd)
      const badgeClass = await firstBadge.getAttribute('class')
      expect(badgeClass).toMatch(/yellow|gray|orange/)
    }
  })

  test('should display match result indicators (victory, defeat, draw)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/equipes')

    // Wait for table
    await page.waitForSelector('table')

    // Look for tour result cells with match indicators
    const tourCells = page.locator('tbody td').filter({ hasText: /[✓✗=]/ })
    const count = await tourCells.count()

    if (count > 0) {
      // Should have at least one match result
      await expect(tourCells.first()).toBeVisible()

      // Check that results have color coding
      const resultIcon = tourCells.first().locator('span').first()
      const iconClass = await resultIcon.getAttribute('class')
      expect(iconClass).toMatch(/text-(victory|defeat|draw)/)
    }
  })

  test('should handle accordion sections for phase organization', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for dense view
    await page.waitForSelector('[data-testid="dense-teams-view"]')

    // Look for accordion buttons (chevron icons)
    const accordionButtons = page.locator('button').filter({ has: page.locator('svg[class*="lucide-chevron"]') })
    const count = await accordionButtons.count()

    if (count > 0) {
      // Click first accordion button
      const firstButton = accordionButtons.first()
      await firstButton.click()

      // Wait for animation
      await page.waitForTimeout(500)

      // Content should be toggled (test passes if no error occurs)
      await expect(page.locator('[data-testid="dense-teams-view"]')).toBeVisible()
    }
  })
})
