import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/chatSVG/i)
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
})
