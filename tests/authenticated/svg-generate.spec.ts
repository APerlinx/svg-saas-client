// tests/authenticated/svg-generate.spec.ts
import { test, expect } from '@playwright/test'
const TEST_EMAIL = 'e2e-user@example.com'
const TEST_PASSWORD = 'Password123!'
// Use authenticated state

test('logged-in user can generate an SVG', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel(/email/i).fill(TEST_EMAIL)
  await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  // Sanity: confirm logged-in user
  await expect(page.getByText('TEST_USER')).toBeVisible()

  // Fill the generator form (adjust selectors to your real inputs)
  await page
    .getByLabel(/prompt/i)
    .fill('Minimal outline icon of a pencil drawing a line')

  await page.getByRole('button', { name: /Generate/i }).click()

  // 1) Wait for the modal to appear
  const modal = page.getByTestId('svg-result-modal')
  await expect(modal).toBeVisible()

  // 2) Find the SVG only inside this modal
  const svg = modal.locator('svg').first()
  await expect(svg).toBeVisible()
  await expect(svg).toHaveAttribute('viewBox', '0 0 256 256')

  // (Optional) also assert the prompt is displayed somewhere in the modal
  await expect(modal).toContainText('pencil drawing a line')
})
