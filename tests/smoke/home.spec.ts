import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/chatSVG/i)

  // Check main heading
  await expect(
    page.getByRole('heading', { name: /AI-Powered SVG/i }),
  ).toBeVisible()

  // Check main CTA buttons
  await expect(page.getByRole('link', { name: /Open Web App/i })).toBeVisible()
  await expect(
    page.getByRole('link', { name: /API Documentation/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Plans & Credits/i }),
  ).toBeVisible()
})

test('dashboard page loads', async ({ page }) => {
  await page.goto('/app')
  await expect(
    page.getByRole('heading', {
      name: /your ai-powered svg creator|generate/i,
    }),
  ).toBeVisible()
})
