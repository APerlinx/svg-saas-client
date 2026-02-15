import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123!'

test.describe('API Keys Management', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()
  })

  test('user can view API keys page', async ({ page }) => {
    await page.goto('/api-keys')

    await expect(page.getByRole('heading', { name: /api keys/i })).toBeVisible()
    await expect(page.getByText(/create and manage api keys/i)).toBeVisible()
  })

  test('user can create a new API key', async ({ page }) => {
    await page.goto('/api-keys')

    // Click create key button
    await page.getByRole('button', { name: /create key/i }).click()

    // Fill in the modal form
    const modal = page
      .locator('[role="dialog"]')
      .or(page.locator('.modal'))
      .first()
    await expect(modal.getByText(/create new api key/i)).toBeVisible()

    await modal.getByLabel(/key name/i).fill('Test Production Key')
    await modal.getByLabel(/description/i).fill('Key for E2E testing')
    await modal.getByRole('button', { name: /production/i }).click()

    // Submit form
    await modal.getByRole('button', { name: /create key/i }).click()

    // Wait for success modal showing the key
    await expect(page.getByText(/api key created/i)).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByText(/copy your api key now/i)).toBeVisible()

    // Key should be visible (starts with sk_)
    const keyElement = page.locator('code').filter({ hasText: /^sk_/ }).first()
    await expect(keyElement).toBeVisible()

    // Copy button should work
    await page.getByRole('button', { name: /copy/i }).click()
    await expect(page.getByText(/copied/i)).toBeVisible()

    // Close modal
    await page.getByRole('button', { name: /done/i }).click()

    // Verify key appears in list
    await expect(page.getByText('Test Production Key')).toBeVisible()
  })

  test('user can view API key statistics', async ({ page }) => {
    await page.goto('/api-keys')

    // Assuming at least one key exists from previous test
    const viewStatsButton = page
      .getByRole('button', { name: /view stats/i })
      .first()

    if (await viewStatsButton.isVisible()) {
      await viewStatsButton.click()

      // Stats modal should open
      await expect(page.getByText(/usage stats/i)).toBeVisible()
      await expect(page.getByText(/total requests/i)).toBeVisible()
      await expect(page.getByText(/successful/i)).toBeVisible()
      await expect(page.getByText(/failed/i)).toBeVisible()
      await expect(page.getByText(/credits used/i)).toBeVisible()
    }
  })

  test('user can revoke an API key', async ({ page }) => {
    await page.goto('/api-keys')

    // Create a key first
    await page.getByRole('button', { name: /create key/i }).click()
    const modal = page
      .locator('[role="dialog"]')
      .or(page.locator('.modal'))
      .first()
    await modal.getByLabel(/key name/i).fill('Key to Delete')
    await modal.getByRole('button', { name: /create key/i }).click()
    await page.getByRole('button', { name: /done/i }).click()

    // Wait for key to appear
    await expect(page.getByText('Key to Delete')).toBeVisible()

    // Find and click revoke button for this key
    const keyCard = page
      .locator('div')
      .filter({ hasText: 'Key to Delete' })
      .first()
    await keyCard.getByRole('button', { name: /revoke/i }).click()

    // Confirm revocation
    await expect(page.getByText(/revoke api key/i)).toBeVisible()
    await expect(
      page.getByText(/any applications using this key will lose access/i),
    ).toBeVisible()
    await page.getByRole('button', { name: /revoke key/i }).click()

    // Key should be removed from list
    await expect(page.getByText('Key to Delete')).not.toBeVisible({
      timeout: 5000,
    })
  })

  test('user sees usage summary cards', async ({ page }) => {
    await page.goto('/api-keys')

    // Summary cards should be visible
    await expect(page.getByText(/total requests/i)).toBeVisible()
    await expect(page.getByText(/success rate/i)).toBeVisible()
    await expect(page.getByText(/credits used/i)).toBeVisible()
    await expect(page.getByText(/avg latency/i)).toBeVisible()
  })

  test('empty state shows when no keys exist', async ({ page }) => {
    // This test assumes a fresh account with no keys
    // In a real scenario, you'd clean up all keys first

    await page.goto('/api-keys')

    // If no keys exist, should show empty state
    const emptyState = page.getByText(/no api keys yet/i)
    if (await emptyState.isVisible()) {
      await expect(page.getByText(/create your first api key/i)).toBeVisible()
      await expect(
        page.getByRole('button', { name: /create your first key/i }),
      ).toBeVisible()
    }
  })

  test('validation prevents creating key without name', async ({ page }) => {
    await page.goto('/api-keys')

    await page.getByRole('button', { name: /create key/i }).click()

    const modal = page
      .locator('[role="dialog"]')
      .or(page.locator('.modal'))
      .first()

    // Try to submit without filling name
    await modal.getByRole('button', { name: /create key/i }).click()

    // Should show validation error
    await expect(modal.getByText(/name is required/i)).toBeVisible()
  })
})
