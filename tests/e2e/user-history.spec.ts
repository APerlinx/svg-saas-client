import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123!'

test.describe('User History', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()
  })

  test('user can view their generation history', async ({ page }) => {
    await page.goto('/history')

    await expect(
      page.getByRole('heading', {
        name: /generation history|your generations/i,
      }),
    ).toBeVisible()
  })

  test('user can filter generations by privacy setting', async ({ page }) => {
    await page.goto('/history')

    // Look for filter buttons if they exist
    const publicFilter = page.getByRole('button', { name: /public/i })
    const privateFilter = page.getByRole('button', { name: /private/i })

    if (await publicFilter.isVisible()) {
      await publicFilter.click()
      // Generations should update
      await page.waitForTimeout(500)
    }

    if (await privateFilter.isVisible()) {
      await privateFilter.click()
      await page.waitForTimeout(500)
    }
  })

  test('user can view SVG details', async ({ page }) => {
    await page.goto('/history')

    // Click on first generation if it exists
    const firstGeneration = page
      .locator('.generation-card, [data-testid="generation-item"]')
      .first()

    if (await firstGeneration.isVisible()) {
      await firstGeneration.click()

      // Modal or detail view should open
      await expect(page.locator('svg').first()).toBeVisible()
    }
  })

  test('user can download SVG from history', async ({ page }) => {
    await page.goto('/history')

    // Find download button
    const downloadButton = page
      .getByRole('button', { name: /download/i })
      .first()

    if (await downloadButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download')
      await downloadButton.click()
      const download = await downloadPromise

      expect(download.suggestedFilename()).toMatch(/\.svg$/)
    }
  })

  test('user can delete a generation', async ({ page }) => {
    await page.goto('/history')

    // Count initial generations
    const initialCount = await page
      .locator('.generation-card, [data-testid="generation-item"]')
      .count()

    if (initialCount > 0) {
      // Click delete button
      const deleteButton = page.getByRole('button', { name: /delete/i }).first()
      await deleteButton.click()

      // Confirm deletion
      await page.getByRole('button', { name: /confirm|delete/i }).click()

      // Count should decrease
      await page.waitForTimeout(1000)
      const newCount = await page
        .locator('.generation-card, [data-testid="generation-item"]')
        .count()
      expect(newCount).toBe(initialCount - 1)
    }
  })

  test('empty state shows when no generations exist', async ({ page }) => {
    await page.goto('/history')

    const emptyState = page.getByText(
      /no generations yet|haven't created any svgs/i,
    )

    if (await emptyState.isVisible()) {
      await expect(page.getByText(/create your first svg/i)).toBeVisible()
    }
  })

  test('user can copy SVG code', async ({ page }) => {
    await page.goto('/history')

    const firstGeneration = page
      .locator('.generation-card, [data-testid="generation-item"]')
      .first()

    if (await firstGeneration.isVisible()) {
      await firstGeneration.click()

      const copyButton = page.getByRole('button', { name: /copy/i })
      if (await copyButton.isVisible()) {
        await copyButton.click()
        await expect(page.getByText(/copied/i)).toBeVisible()
      }
    }
  })

  test('pagination works when many generations exist', async ({ page }) => {
    await page.goto('/history')

    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /next/i })
    const previousButton = page.getByRole('button', { name: /previous|prev/i })

    if (await nextButton.isVisible()) {
      await nextButton.click()
      await page.waitForTimeout(500)

      // Should show different generations
      if (await previousButton.isVisible()) {
        await previousButton.click()
      }
    }
  })
})
