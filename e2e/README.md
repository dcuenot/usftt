# E2E Testing Guide

This directory contains end-to-end (E2E) tests for the USFTT table tennis club web application using Playwright.

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Testing Framework
- **Playwright**: v1.51+ (requires Node.js 18+)
- **Language**: TypeScript
- **Test Runner**: Playwright Test

### Test Coverage

7 test suites covering all major features:

1. **home.spec.ts** (13 tests) - HomePage dashboard, filtering, responsive behavior
2. **classement.spec.ts** (13 tests) - ClassementPage ranking, responsive tables/cards
3. **equipes.spec.ts** (14 tests) - EquipesPage team cards, detail views, navigation
4. **timestamp.spec.ts** (6 tests) - CSV timestamp display on all pages
5. **navigation.spec.ts** (6 tests) - Page navigation, active states, browser back/forward
6. **accessibility.spec.ts** (12 tests) - WCAG 2.1 Level AA basics, keyboard navigation
7. **responsive.spec.ts** (90+ tests) - Zero horizontal scroll across 6 viewports

**Total**: 150+ E2E tests

---

## Setup

### Prerequisites

- Node.js 20+ (required for Playwright)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Install system dependencies (Linux only)
npx playwright install-deps
```

### Configuration

Test configuration is in `playwright.config.ts`:

```typescript
{
  testDir: './e2e',
  baseURL: 'http://localhost:5173/usftt/',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
    { name: 'tablet', use: { ...devices['iPad Pro'] } }
  ]
}
```

---

## Running Tests

### All Tests

```bash
# Run all tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile
npm run test:e2e -- --project=tablet
```

### Specific Test Files

```bash
# Run single file
npm run test:e2e -- home.spec.ts

# Run multiple files
npm run test:e2e -- home.spec.ts classement.spec.ts
```

### Interactive UI Mode

```bash
# Launch Playwright UI (recommended for development)
npm run test:e2e:ui
```

Features:
- Visual test execution
- Time travel debugging
- Watch mode
- Detailed trace viewer

### Debug Mode

```bash
# Run in debug mode with Playwright Inspector
npm run test:e2e:debug

# Debug specific test
npm run test:e2e:debug -- home.spec.ts
```

### Parallel Execution

```bash
# Run with specific number of workers
npm run test:e2e -- --workers=4

# Run serially (no parallelization)
npm run test:e2e -- --workers=1
```

---

## Test Structure

### Test Organization

```
e2e/
├── fixtures.ts           # Shared test setup and utilities
├── home.spec.ts          # HomePage tests
├── classement.spec.ts    # ClassementPage tests
├── equipes.spec.ts       # EquipesPage tests
├── timestamp.spec.ts     # CSV timestamp tests
├── navigation.spec.ts    # Navigation tests
├── accessibility.spec.ts # Accessibility tests
└── responsive.spec.ts    # Responsive design tests
```

### Test File Template

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Navigate
    await page.goto('/')

    // Interact
    await page.getByRole('button', { name: 'Submit' }).click()

    // Assert
    await expect(page.locator('h1')).toContainText('Success')
  })
})
```

---

## Writing Tests

### Best Practices

#### 1. Use Semantic Locators

✅ **Recommended**:
```typescript
// By role (best)
await page.getByRole('button', { name: 'Submit' })
await page.getByRole('heading', { name: 'Dashboard' })

// By label
await page.getByLabel('Email')

// By placeholder
await page.getByPlaceholder('Search...')

// By test ID (when semantic locators don't work)
await page.locator('[data-testid="team-card"]')
```

❌ **Avoid**:
```typescript
// CSS classes (brittle)
await page.locator('.btn-primary')

// Position-based (fragile)
await page.locator('div > div:nth-child(3)')
```

#### 2. Wait for Elements

```typescript
// Wait for selector
await page.waitForSelector('[data-testid="team-card"]', { timeout: 10000 })

// Wait for load state
await page.waitForLoadState('networkidle')

// Wait for specific condition
await page.waitForFunction(() => window.myGlobalVar === 'ready')
```

#### 3. Assertions

```typescript
// Visibility
await expect(page.locator('h1')).toBeVisible()

// Text content
await expect(page.locator('h1')).toContainText('Dashboard')

// Count
const cards = await page.locator('[data-testid="team-card"]').count()
expect(cards).toBeGreaterThan(0)

// Class name
await expect(element).toHaveClass(/active/)

// URL
await expect(page).toHaveURL(/.*classement/)
```

#### 4. Page Objects (Optional)

For complex pages, consider using page objects:

```typescript
// pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async search(term: string) {
    await this.page.getByPlaceholder('Rechercher...').fill(term)
  }

  async selectCategory(category: string) {
    await this.page.locator('#categoryFilter').selectOption(category)
  }
}

// In test file
const homePage = new HomePage(page)
await homePage.goto()
await homePage.search('Martin')
```

---

## Test Patterns

### Responsive Testing

Test across multiple viewports:

```typescript
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
]

for (const viewport of viewports) {
  test(`should display correctly on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
}
```

### Testing Loading States

```typescript
test('should show skeleton loaders while loading', async ({ page }) => {
  // Intercept network to slow it down
  await page.route('**/backend/*.csv', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await route.continue()
  })

  await page.goto('/')

  // Check for skeleton loaders
  const skeletons = page.locator('[data-testid="skeleton-card"]')
  await expect(skeletons.first()).toBeVisible()
})
```

### Testing Filters

```typescript
test('should filter by category', async ({ page }) => {
  await page.goto('/')

  // Get initial count
  await page.waitForSelector('h1')
  const initialCount = await page.locator('[data-testid="player-card"]').count()

  // Apply filter
  await page.locator('#categoryFilter').selectOption({ index: 1 })

  // Wait for filtering
  await page.waitForTimeout(500)

  // Verify filter applied
  const filterText = page.locator('text=/dans la catégorie/i')
  await expect(filterText).toBeVisible()
})
```

---

## Debugging Tests

### Take Screenshots

```typescript
// Automatic on failure (configured in playwright.config.ts)

// Manual screenshot
await page.screenshot({ path: 'screenshot.png', fullPage: true })

// Screenshot element
await element.screenshot({ path: 'element.png' })
```

### Record Traces

```typescript
// Configured in playwright.config.ts to record on first retry

// View trace
npx playwright show-trace test-results/path-to-trace.zip
```

### Pause Execution

```typescript
test('debugging test', async ({ page }) => {
  await page.goto('/')

  // Pause test execution (opens Playwright Inspector)
  await page.pause()

  // Continue execution...
})
```

### Console Logs

```typescript
// Listen to console messages
page.on('console', msg => console.log('PAGE LOG:', msg.text()))

// Listen to page errors
page.on('pageerror', error => console.log('PAGE ERROR:', error))
```

---

## CI/CD Integration

Tests run automatically in GitHub Actions pipeline (`.github/workflows/deploy.yml`):

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

### Viewing CI Test Results

If tests fail in CI:
1. Go to GitHub Actions run
2. Download `playwright-report` artifact
3. Extract and open `index.html` in browser
4. View detailed test results, screenshots, and traces

---

## Test Data Considerations

### CSV Data Dependency

Tests depend on CSV files in `backend/` directory:
- `joueurs.csv` - Player data
- `equipes.csv` - Team data
- `resultats.csv` - Match results

**Important**: Ensure CSV files are present and up-to-date before running tests locally.

### Mocking CSV Data (Future Enhancement)

Consider mocking CSV responses for more reliable tests:

```typescript
// In fixtures.ts
export async function mockCsvData(page: Page) {
  await page.route('**/backend/*.csv', route => {
    route.fulfill({
      status: 200,
      contentType: 'text/csv',
      body: 'mock,csv,data\n1,2,3'
    })
  })
}
```

---

## Troubleshooting

### Common Issues

#### Tests Timeout

**Problem**: Tests waiting for elements that never appear

**Solutions**:
- Check if dev server is running (`npm run dev`)
- Verify CSV files exist in `backend/` directory
- Increase timeout: `await page.waitForSelector(..., { timeout: 30000 })`
- Check browser console for errors: `page.on('console', ...)`

#### No Horizontal Scroll Tests Failing

**Problem**: Page has horizontal scroll on some viewports

**Solutions**:
- Check for fixed-width elements
- Verify responsive classes (e.g., `md:grid-cols-2`)
- Test manually at failing viewport size
- Check for overflowing text or images

#### Flaky Tests

**Problem**: Tests pass sometimes, fail others

**Solutions**:
- Add explicit waits: `await page.waitForSelector(...)`
- Wait for network idle: `await page.waitForLoadState('networkidle')`
- Avoid hard-coded timeouts: `await page.waitForTimeout(500)`
- Check for race conditions

#### Browser Installation Issues

**Problem**: Playwright browsers not installing

**Solutions**:
```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps

# Check Node.js version (requires 18+)
node --version
```

---

## Performance Tips

### Parallel Execution

Run tests in parallel for faster execution:

```bash
# Run with max workers (default)
npm run test:e2e

# Run with specific workers
npm run test:e2e -- --workers=4
```

### Reuse Browser Context

Configure in `playwright.config.ts`:

```typescript
use: {
  // Share context between tests (faster, but less isolated)
  reuseExistingServer: true,
}
```

### Selective Test Execution

Run only changed tests:

```bash
# Run tests related to specific file
npm run test:e2e -- --grep "HomePage"

# Skip specific tests
npm run test:e2e -- --grep-invert "slow"
```

---

## Writing New Tests

### Checklist

Before submitting new tests:

- [ ] Test has descriptive name (`should do X when Y`)
- [ ] Uses semantic locators (roles, labels, test IDs)
- [ ] Includes proper assertions with `expect()`
- [ ] Handles loading states (waits for elements)
- [ ] Tests responsive behavior if applicable
- [ ] Tests both success and error cases
- [ ] No hard-coded waits (`waitForTimeout`)
- [ ] No console warnings or errors during test
- [ ] Test is deterministic (not flaky)
- [ ] Follows existing test patterns

### Test Naming Convention

```typescript
// Good
test('should display team cards without horizontal scroll', ...)
test('should filter players by category', ...)
test('should navigate to team detail view on card click', ...)

// Bad
test('test1', ...)
test('it works', ...)
test('check page', ...)
```

---

## Resources

- **Playwright Docs**: https://playwright.dev/docs/intro
- **Best Practices**: https://playwright.dev/docs/best-practices
- **API Reference**: https://playwright.dev/docs/api/class-page
- **Debugging Guide**: https://playwright.dev/docs/debug
- **CI/CD Guide**: https://playwright.dev/docs/ci

---

## Support

For questions or issues:
1. Check this README
2. Review Playwright docs
3. Check existing test examples in `e2e/` directory
4. Open issue in repository
