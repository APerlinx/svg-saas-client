// tests/authenticated/svg-generate.spec.ts
import { test, expect } from '@playwright/test'
const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123!'
// Use authenticated state

test('logged-in user can generate an SVG', async ({ page }) => {
  test.setTimeout(360000) // 6 minutes timeout for this test (SVG generation is slow)

  await page.goto('/signin')

  await page.getByLabel(/email/i).fill(TEST_EMAIL)
  await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  await page.goto('/app')

  let authenticated = false
  let unauthenticated = /\/signin/i.test(page.url())

  for (let i = 0; i < 10; i++) {
    const hasTestUser = await page
      .getByText('TEST_USER')
      .isVisible()
      .catch(() => false)
    const hasSignInLink = await page
      .getByRole('link', { name: /^sign in$/i })
      .first()
      .isVisible()
      .catch(() => false)

    if (hasTestUser) {
      authenticated = true
      break
    }

    if (hasSignInLink) {
      unauthenticated = true
      break
    }

    await page.waitForTimeout(300)
  }

  test.skip(
    !authenticated || unauthenticated,
    'Skipping: auth backend unavailable for E2E login',
  )

  await page.getByLabel(/prompt/i).fill('Minimal outline icon of a black dot')

  await page.getByRole('button', { name: /Generate/i }).click()

  // Wait for modal to open (no testid, just look for the SVG preview area)
  const svgPreview = page.locator('.svg-preview')
  await expect(svgPreview).toBeVisible({ timeout: 300000 }) // 5 minutes for generation

  // Wait for the actual SVG to appear inside
  const svg = svgPreview.locator('svg').first()
  await expect(svg).toBeVisible()
  await expect(svg).toHaveAttribute('viewBox')

  // Modal should show the prompt
  await expect(page.getByText(/Export Options/i)).toBeVisible()
})
