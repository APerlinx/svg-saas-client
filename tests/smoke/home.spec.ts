import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/chatSVG/i)
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
})

test('dashboard page loads', async ({ page }) => {
  await page.goto('/app')
  await expect(
    page.getByRole('heading', {
      name: /your ai-powered svg creator|generate/i,
    }),
  ).toBeVisible()
})
