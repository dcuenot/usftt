import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between all pages', async ({ page }) => {
    // Start at home
    await page.goto('/')
    await expect(page).toHaveTitle(/USFTT/)
    await expect(page.locator('h1')).toContainText('Liste des joueurs')

    // Navigate to Classement
    await page.getByRole('link', { name: /Classement/i }).click()
    await expect(page).toHaveURL(/.*classement/)
    await expect(page.locator('h1')).toContainText('Classement')

    // Navigate to Equipes
    await page.getByRole('link', { name: /Équipes/i }).click()
    await expect(page).toHaveURL(/.*equipes/)
    await expect(page.locator('h1')).toContainText('Résultats par équipes')

    // Navigate back to Home
    await page.getByRole('link', { name: /Accueil/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1')).toContainText('Liste des joueurs')
  })

  test('should display desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Desktop nav should be visible
    const desktopNav = page.locator('nav').first()
    await expect(desktopNav).toBeVisible()

    // Should contain all nav links
    await expect(desktopNav.getByRole('link', { name: /Accueil/i })).toBeVisible()
    await expect(desktopNav.getByRole('link', { name: /Classement/i })).toBeVisible()
    await expect(desktopNav.getByRole('link', { name: /Équipes/i })).toBeVisible()
  })

  test('should display mobile navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // Mobile bottom nav should be visible (fixed at bottom)
    const mobileNav = page.locator('nav.fixed')
    await expect(mobileNav).toBeVisible()

    // Should contain all nav links
    await expect(mobileNav.getByRole('link', { name: /Accueil/i })).toBeVisible()
    await expect(mobileNav.getByRole('link', { name: /Classement/i })).toBeVisible()
    await expect(mobileNav.getByRole('link', { name: /Équipes/i })).toBeVisible()
  })

  test('should highlight active page in navigation', async ({ page }) => {
    await page.goto('/')

    // Home link should be active (desktop has bg-primary, mobile has text-primary)
    const homeLink = page.getByRole('link', { name: /Accueil/i })
    await expect(homeLink).toHaveClass(/text-primary|font-semibold|bg-primary/)

    // Navigate to Classement
    await page.getByRole('link', { name: /Classement/i }).click()

    // Classement link should now be active (desktop has bg-primary, mobile has text-primary)
    const classementLink = page.getByRole('link', { name: /Classement/i })
    await expect(classementLink).toHaveClass(/text-primary|font-semibold|bg-primary/)
  })

  test('should maintain navigation state on page refresh', async ({ page }) => {
    // Navigate to Classement
    await page.goto('/classement')
    await expect(page.locator('h1')).toContainText('Classement')

    // Refresh page
    await page.reload()

    // Should still be on Classement page
    await expect(page).toHaveURL(/.*classement/)
    await expect(page.locator('h1')).toContainText('Classement')
  })

  test('should work with browser back/forward buttons', async ({ page }) => {
    // Start at home
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Liste des joueurs')

    // Navigate to Classement
    await page.getByRole('link', { name: /Classement/i }).click()
    await expect(page).toHaveURL(/.*classement/)

    // Navigate to Equipes
    await page.getByRole('link', { name: /Équipes/i }).click()
    await expect(page).toHaveURL(/.*equipes/)

    // Go back
    await page.goBack()
    await expect(page).toHaveURL(/.*classement/)
    await expect(page.locator('h1')).toContainText('Classement')

    // Go back again
    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1')).toContainText('Liste des joueurs')

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(/.*classement/)
    await expect(page.locator('h1')).toContainText('Classement')
  })
})
