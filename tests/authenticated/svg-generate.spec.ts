// tests/authenticated/svg-generate.spec.ts
import { test, expect } from '@playwright/test'
const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123!'
// Use authenticated state

test('logged-in user can generate an SVG', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel(/email/i).fill(TEST_EMAIL)
  await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByText('TEST_USER')).toBeVisible()

  await page
    .getByLabel(/prompt/i)
    .fill('Minimal outline icon of a pencil drawing a line')

  await page.getByRole('button', { name: /Generate/i }).click()

  const modal = page.getByTestId('svg-result-modal')
  await expect(modal).toBeVisible()

  const svgPreview = modal.locator('.svg-preview')
  await expect(svgPreview).toBeVisible({ timeout: 30000 }) // 30s timeout for generation

  const svg = svgPreview.locator('svg').first()
  await expect(svg).toBeVisible()
  await expect(svg).toHaveAttribute('viewBox')

  await expect(modal).toContainText('pencil drawing a line')
})
