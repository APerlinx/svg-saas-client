/* eslint-disable @typescript-eslint/no-unused-vars */
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
      page.getByRole('heading', { name: /User history/i }),
    ).toBeVisible()
    await expect(
      page.getByText(/Your personal gallery of AI-generated SVG icons/i),
    ).toBeVisible()
  })

  test.skip('user can filter generations by privacy setting', async ({
    page,
  }) => {
    // No filter buttons exist in the current UserHistory implementation
    // All user generations are shown in one view
  })

  test('user can view SVG details', async ({ page }) => {
    await page.goto('/history')

    // Click on first generation if it exists (uses aria-label)
    const firstGeneration = page.locator('[aria-label="Your SVG card"]').first()

    if (await firstGeneration.isVisible()) {
      // SVG should already be visible in the card
      await expect(firstGeneration.locator('img').first()).toBeVisible()
    }
  })

  test('user can download SVG from history', async ({ page }) => {
    await page.goto('/history')

    const firstCard = page.locator('[aria-label="Your SVG card"]').first()

    if (await firstCard.isVisible()) {
      // Hover to show quick actions button
      await firstCard.hover()

      // Click quick actions button (three dots)
      const quickActionsButton = firstCard.getByRole('button', {
        name: /Quick actions/i,
      })
      await quickActionsButton.click()

      // Click Download SVG from menu
      const downloadButton = page.getByRole('menuitem', {
        name: /Download SVG/i,
      })

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
      .locator('[aria-label="Your SVG card"]')
      .count()

    if (initialCount > 0) {
      const firstCard = page.locator('[aria-label="Your SVG card"]').first()

      // Hover to show quick actions
      await firstCard.hover()

      // Click quick actions button
      const quickActionsButton = firstCard.getByRole('button', {
        name: /Quick actions/i,
      })
      await quickActionsButton.click()

      // Click Delete SVG (first click arms it)
      const deleteButton = page.getByRole('menuitem', { name: /Delete SVG/i })
      await deleteButton.click()

      // Click again to confirm (button text changes to "Confirm")
      await page.getByRole('menuitem', { name: /Confirm/i }).click()

      // Wait for deletion to complete and card to be removed
      await page.waitForTimeout(2500)
      const newCount = await page
        .locator('[aria-label="Your SVG card"]')
        .count()
      expect(newCount).toBe(initialCount - 1)
    }
  })

  test('empty state shows when no generations exist', async ({ page }) => {
    await page.goto('/history')

    const emptyState = page.getByText('No SVGs to show yet')

    if (await emptyState.isVisible()) {
      await expect(
        page.getByText(
          /Generate your first SVG on the dashboard to see it here/i,
        ),
      ).toBeVisible()
    }
  })

  test('user can copy SVG code', async ({ page }) => {
    await page.goto('/history')

    const firstCard = page.locator('[aria-label="Your SVG card"]').first()

    if (await firstCard.isVisible()) {
      // Hover to show quick actions
      await firstCard.hover()

      // Click quick actions button
      const quickActionsButton = firstCard.getByRole('button', {
        name: /Quick actions/i,
      })
      await quickActionsButton.click()

      // Click Copy SVG from menu
      const copyButton = page.getByRole('menuitem', { name: /Copy SVG/i })
      await copyButton.click()

      // Should show "Copied" inline status in the menu item
      await expect(
        page.getByRole('menuitem', { name: /Copied/i }),
      ).toBeVisible()
    }
  })

  test.skip('pagination works when many generations exist', async ({
    page,
  }) => {
    // No pagination implemented - UserHistory loads all generations at once
    // using cursor-based pagination internally but displays all results
  })
})
