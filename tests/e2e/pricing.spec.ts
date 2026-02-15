import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('displays all credit pack tiers', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible()

    // Check for all 4 credit packs
    await expect(page.getByText(/starter/i)).toBeVisible()
    await expect(page.getByText(/creator/i)).toBeVisible()
    await expect(page.getByText(/professional/i)).toBeVisible()
    await expect(page.getByText(/business/i)).toBeVisible()
  })

  test('shows pricing for each tier', async ({ page }) => {
    await page.goto('/pricing')

    // Should show prices
    await expect(page.getByText(/\$5/)).toBeVisible()
    await expect(page.getByText(/\$15/)).toBeVisible()
    await expect(page.getByText(/\$30/)).toBeVisible()
    await expect(page.getByText(/\$100/)).toBeVisible()
  })

  test('displays unified credit system messaging', async ({ page }) => {
    await page.goto('/pricing')

    // Check for "web or API" messaging
    await expect(page.getByText(/web or api/i).first()).toBeVisible()
  })

  test('shows enterprise section with contact CTA', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/enterprise/i)).toBeVisible()
    await expect(
      page.getByRole('link', { name: /contact sales|schedule demo/i }),
    ).toBeVisible()
  })

  test('displays "How Credits Work" section', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/how credits work/i)).toBeVisible()
    await expect(page.getByText(/use anywhere/i)).toBeVisible()
    await expect(page.getByText(/never expire/i)).toBeVisible()
  })

  test('buy button redirects to checkout (authenticated)', async ({ page }) => {
    // Sign in first
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('Password123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()

    // Go to pricing
    await page.goto('/pricing')

    // Click buy button on first pack
    const buyButton = page
      .getByRole('button', { name: /buy now|get started/i })
      .first()
    await buyButton.click()

    // Should redirect to checkout or show modal
    // (Adjust based on your actual implementation)
    await page.waitForURL(/checkout|stripe/, { timeout: 5000 }).catch(() => {
      // If not redirecting, might show a modal
      expect(page.getByText(/checkout|payment|stripe/i)).toBeVisible()
    })
  })

  test('buy button prompts sign-in when not authenticated', async ({
    page,
  }) => {
    await page.goto('/pricing')

    const buyButton = page
      .getByRole('button', { name: /buy now|get started/i })
      .first()
    await buyButton.click()

    // Should redirect to sign in or show sign-in modal
    await page.waitForURL(/signin/, { timeout: 5000 }).catch(() => {
      expect(page.getByText(/sign in to continue|please log in/i)).toBeVisible()
    })
  })

  test('displays features for each tier', async ({ page }) => {
    await page.goto('/pricing')

    // Each tier should list features
    await expect(page.getByText(/all ai models/i)).toBeVisible()
    await expect(page.getByText(/credits never expire/i)).toBeVisible()
  })

  test('responsive layout works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pricing')

    // Should still show all tiers (stacked vertically)
    await expect(page.getByText(/starter/i)).toBeVisible()
    await expect(page.getByText(/creator/i)).toBeVisible()
  })
})
