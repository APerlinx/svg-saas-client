import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e-user@example.com'
const TEST_PASSWORD = 'Password123!'

test('shows error on invalid credentials', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel(/email/i).fill('wrong@example.com')
  await page.getByLabel(/^password$/i).fill('wrong-pass')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(
    page.getByText(/Email or password is incorrect. Please try again./i)
  ).toBeVisible()
})

test('logs in with valid credentials', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel(/email/i).fill(TEST_EMAIL)
  await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByText('TEST_USER')).toBeVisible()
})
