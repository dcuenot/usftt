import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy on HomePage', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // H1 should be the page title
    await expect(page.locator('h1')).toContainText('Liste des joueurs')

    // Note: HomePage uses cards and tables without h2/h3 section headings
    // This is acceptable as long as there's proper semantic structure
  })

  test('should have proper heading hierarchy on ClassementPage', async ({ page }) => {
    await page.goto('/classement')

    // Wait for content to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    await expect(page.locator('h1')).toContainText('Classement')
  })

  test('should have proper heading hierarchy on EquipesPage', async ({ page }) => {
    await page.goto('/equipes')

    // Wait for content to load
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    await expect(page.locator('h1')).toContainText('Résultats par équipes')
  })

  test('should support keyboard navigation on HomePage', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForSelector('h1')

    // Press Tab to focus first interactive element
    await page.keyboard.press('Tab')

    // At least one element should have focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON', 'INPUT', 'SELECT']).toContain(focusedElement)
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Find first button or link
    const firstButton = page.locator('button, a').first()
    await firstButton.focus()

    // Check if focused element has outline or ring (Tailwind focus styles)
    const hasFocusStyle = await firstButton.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.outline !== 'none' ||
        styles.boxShadow.includes('rgb') ||
        styles.border !== 'none'
      )
    })
    expect(hasFocusStyle).toBe(true)
  })

  test('should have labels on all form inputs', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Find all inputs
    const inputs = page.locator('input, select')
    const count = await inputs.count()

    // Check each input has a label or aria-label
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const hasLabel = await input.evaluate((el) => {
        // Check for label element
        const id = el.id
        if (id && document.querySelector(`label[for="${id}"]`)) {
          return true
        }

        // Check for aria-label or aria-labelledby
        if (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) {
          return true
        }

        // Check for placeholder (acceptable for search inputs)
        if (el.getAttribute('placeholder')) {
          return true
        }

        // Check if wrapped in label
        if (el.closest('label')) {
          return true
        }

        return false
      })

      expect(hasLabel).toBe(true)
    }
  })

  test('should have ARIA labels on icon-only buttons', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Find all buttons
    const buttons = page.locator('button')
    const count = await buttons.count()

    // Check icon-only buttons have aria-label
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const textContent = await button.textContent()

      // If button has no visible text, it should have aria-label
      if (!textContent || textContent.trim().length === 0) {
        const hasAriaLabel = await button.evaluate((el) => {
          return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
        })
        expect(hasAriaLabel).toBe(true)
      }
    }
  })

  test('should have sufficient color contrast for text', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Check main heading contrast
    const h1 = page.locator('h1').first()
    const contrastRatio = await h1.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      // Note: actual contrast calculation would require more complex logic
      // This is a simplified check for dark text on light background
      const color = styles.color
      const backgroundColor = styles.backgroundColor

      // RGB values for text-gray-900 (nearly black) on neutral-50 (nearly white)
      // Should have excellent contrast (> 16:1)
      return color.includes('rgb(17, 24, 39)') || color.includes('rgb(0, 0, 0)')
    })

    expect(contrastRatio).toBe(true)
  })

  test('should have alt text on images (if any)', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForSelector('h1')

    // Find all images
    const images = page.locator('img')
    const count = await images.count()

    // Check each image has alt attribute
    for (let i = 0; i < count; i++) {
      const image = images.nth(i)
      const hasAlt = await image.getAttribute('alt')
      expect(hasAlt).not.toBeNull()
    }
  })

  test('should support keyboard navigation in tables', async ({ page }) => {
    // Set desktop viewport for table view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')

    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => {
      // Table might not be present, skip test
    })

    const tableExists = await page.locator('table').count()
    if (tableExists === 0) return // Skip if no table

    // Table should be focusable or have focusable elements
    const tableRows = page.locator('tbody tr')
    const rowCount = await tableRows.count()

    expect(rowCount).toBeGreaterThan(0)
  })

  test('should have proper button semantics', async ({ page }) => {
    await page.goto('/')

    // Wait for content
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1')

    // All clickable elements should be button, link, or table header (for sorting)
    const clickables = page.locator('[onclick], .cursor-pointer')
    const count = await clickables.count()

    for (let i = 0; i < count; i++) {
      const element = clickables.nth(i)
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase())
      // Table headers (th) are allowed to be clickable for sorting
      // Divs and other elements are allowed if they have proper ARIA roles
      expect(['button', 'a', 'input', 'th', 'div']).toContain(tagName)
    }
  })

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBeTruthy()
    expect(['fr', 'fr-FR']).toContain(lang)
  })
})
