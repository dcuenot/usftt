import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load (reduce timeout to fail faster)
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Check title
    await expect(page).toHaveTitle(/USFTT/, { timeout: 5000 })

    // Check that we have an h1
    await expect(page.locator('h1')).toBeVisible({ timeout: 5000 })
  })

  test('should load classement page', async ({ page }) => {
    await page.goto('/classement')

    await page.waitForLoadState('networkidle', { timeout: 10000 })

    await expect(page).toHaveTitle(/USFTT/, { timeout: 5000 })
    await expect(page.locator('h1')).toContainText('Classement', { timeout: 5000 })
  })

  test('should load equipes page', async ({ page }) => {
    await page.goto('/equipes')

    await page.waitForLoadState('networkidle', { timeout: 10000 })

    await expect(page).toHaveTitle(/USFTT/, { timeout: 5000 })
    await expect(page.locator('h1')).toContainText('Résultats par équipes', { timeout: 5000 })
  })

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Click on Classement link
    await page.getByRole('link', { name: /Classement/i }).first().click()
    await expect(page).toHaveURL(/.*classement/, { timeout: 5000 })

    // Go back to home
    await page.getByRole('link', { name: /Accueil/i }).first().click()
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 })
  })

  test('should load CSV data and display player information', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Wait for dashboard stats to be visible (indicates CSV data loaded)
    const statsCards = page.locator('[data-testid="stats-card"]')
    await expect(statsCards.first()).toBeVisible({ timeout: 5000 })

    // Verify we have 4 dashboard stats cards
    await expect(statsCards).toHaveCount(4, { timeout: 5000 })

    // Verify stats cards contain numeric data (not just placeholders)
    const firstStatValue = statsCards.first().locator('.text-4xl')
    await expect(firstStatValue).toBeVisible({ timeout: 5000 })
    const statText = await firstStatValue.textContent()
    expect(statText).toMatch(/\d+/) // Should contain at least one digit

    // Verify player list/table is rendered with data
    // Check for player cards on mobile or table rows on desktop
    const hasPlayerCards = await page.locator('[data-testid="player-card"]').count()
    const hasTableRows = await page.locator('tbody tr').count()

    expect(hasPlayerCards + hasTableRows).toBeGreaterThan(0)

    // Verify CSV timestamp is displayed
    const lastUpdate = page.locator('[data-testid="last-update"]')
    await expect(lastUpdate).toBeVisible({ timeout: 5000 })
  })
})
