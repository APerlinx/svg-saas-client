/**
 * Playwright E2E Auth Setup Test
 *
 * This test logs in with a test user and saves the authenticated browser state.
 * The saved state can be reused in other Playwright tests to avoid logging in repeatedly.
 *
 * Steps:
 * 1. Go to the sign-in page
 * 2. Fill in test email and password
 * 3. Click the sign-in button and wait for navigation
 * 4. Save the browser storage state to 'tests/.auth-state.json'
 *
 * Usage:
 *   npx playwright test tests/auth.setup.spec.ts --project=chromium
 *
 * The saved state can be loaded in other tests via the 'storageState' option in Playwright config or test setup.
 */

import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e-user@example.com'
const TEST_PASSWORD = 'Password123!'

test('create authenticated storage state', async ({ page }) => {
  await page.goto('/signin')

  await page.getByLabel(/email/i).fill(TEST_EMAIL)
  await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()

  // 1️⃣ PROVE we are authenticated in the UI
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  // or: await expect(page.getByText('TEST_USER')).toBeVisible()

  // 2️⃣ OPTIONAL: log cookies so you can see what’s there
  const cookies = await page.context().cookies()
  console.log('COOKIES AFTER LOGIN:', cookies)

  // 3️⃣ Now save storage state
  await page.context().storageState({ path: 'tests/.auth-state.json' })
})
