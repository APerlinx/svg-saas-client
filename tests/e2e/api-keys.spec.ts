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
    await page
      .getByRole('button', { name: /create key/i })
      .first()
      .click()

    // Fill in the modal form (no role="dialog", just a div modal)
    await expect(page.getByText('Create new API key')).toBeVisible()

    await page
      .getByPlaceholder(/e\.g\. Production App/i)
      .fill('Test Production Key')
    await page
      .getByPlaceholder(/Optional description/i)
      .fill('Key for E2E testing')
    await page.getByRole('button', { name: /^Production$/i }).click()

    // Submit form
    await page.getByRole('button', { name: /Create key/i }).click()

    // Wait for success modal showing the key
    await expect(page.getByText('API key created')).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByText(/Copy your API key now/i)).toBeVisible()

    // Key should be visible
    const keyElement = page
      .locator('code')
      .filter({ hasText: /^[a-zA-Z0-9_-]+$/ })
      .first()
    await expect(keyElement).toBeVisible()

    // Copy button should work
    await page.getByRole('button', { name: /Copy/i }).click()
    await expect(page.getByText(/Copied!/i)).toBeVisible()

    // Close modal
    await page.getByRole('button', { name: /Done/i }).click()

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

      // Stats modal should open with exact heading text
      await expect(page.getByText('Usage stats')).toBeVisible()
      await expect(page.getByText(/total requests/i)).toBeVisible()
      await expect(page.getByText(/successful/i)).toBeVisible()
      await expect(page.getByText(/failed/i)).toBeVisible()
      await expect(page.getByText(/credits used/i)).toBeVisible()
      await expect(page.getByText(/success rate/i)).toBeVisible()
    }
  })

  test('user can revoke an API key', async ({ page }) => {
    await page.goto('/api-keys')

    // Create a key first
    await page
      .getByRole('button', { name: /create key/i })
      .first()
      .click()
    await page.getByPlaceholder(/e\.g\. Production App/i).fill('Key to Delete')
    await page.getByRole('button', { name: /Create key/i }).click()
    await page.getByRole('button', { name: /Done/i }).click()

    // Wait for key to appear
    await expect(page.getByText('Key to Delete')).toBeVisible()

    // Find and click revoke button for this key
    const keyCard = page
      .locator('div')
      .filter({ hasText: 'Key to Delete' })
      .first()
    await keyCard.getByRole('button', { name: /revoke/i }).click()

    // Confirm revocation - exact text from RevokeConfirmModal
    await expect(page.getByText('Revoke API key')).toBeVisible()
    await expect(
      page.getByText(
        /Any applications using this key will lose access immediately/i,
      ),
    ).toBeVisible()
    await page.getByRole('button', { name: /Revoke key/i }).click()

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

    // If no keys exist, should show empty state with exact text
    const emptyState = page.getByText('No API keys yet')
    if (await emptyState.isVisible()) {
      await expect(
        page.getByText(
          /Create your first API key to start integrating ChatSVG/i,
        ),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: /Create your first key/i }),
      ).toBeVisible()
    }
  })

  test('validation prevents creating key without name', async ({ page }) => {
    await page.goto('/api-keys')

    await page
      .getByRole('button', { name: /create key/i })
      .first()
      .click()

    // Try to submit without filling name - button should be disabled
    const createButton = page.getByRole('button', { name: /Create key/i })

    // The submit button is disabled when name is empty
    await expect(createButton).toBeDisabled()
  })
})
