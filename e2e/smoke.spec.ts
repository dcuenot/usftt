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
})
