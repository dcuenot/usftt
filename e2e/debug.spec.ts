import { test, expect } from '@playwright/test'

test('Debug - Check page content', async ({ page }) => {
  await page.goto('/')

  // Wait a bit for any async loading
  await page.waitForTimeout(3000)

  // Get the page title
  const title = await page.title()
  console.log('Page title:', title)

  // Get the page content
  const content = await page.content()
  console.log('Page HTML length:', content.length)
  console.log('Page HTML (first 2000 chars):', content.substring(0, 2000))

  // Check if there are any error messages
  const errorElements = await page.locator('.bg-red-50, [role="alert"]').count()
  console.log('Error elements found:', errorElements)

  if (errorElements > 0) {
    const errorText = await page.locator('.bg-red-50, [role="alert"]').first().textContent()
    console.log('Error text:', errorText)
  }

  // Check what h1 elements exist
  const h1Count = await page.locator('h1').count()
  console.log('H1 elements found:', h1Count)

  if (h1Count > 0) {
    for (let i = 0; i < h1Count; i++) {
      const h1Text = await page.locator('h1').nth(i).textContent()
      console.log(`H1 #${i}:`, h1Text)
    }
  }

  // Check if loading indicators are present
  const loadingIndicators = await page.locator('[role="status"], .animate-pulse').count()
  console.log('Loading indicators:', loadingIndicators)

  // Take a screenshot for manual inspection
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true })

  // This test always passes, it's just for debugging
  expect(true).toBe(true)
})
