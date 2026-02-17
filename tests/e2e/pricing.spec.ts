import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('displays all subscription plans', async ({ page }) => {
    await page.goto('/pricing')

    await expect(
      page.getByRole('heading', {
        name: /keep it sustainable, keep it useful/i,
      }),
    ).toBeVisible()

    // Check for 2 plans: FREE, SUPPORTER
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible()
    await expect(
      page.getByText('Supporter', { exact: true }).first(),
    ).toBeVisible()
  })

  test('shows correct pricing information', async ({ page }) => {
    await page.goto('/pricing')

    // Supporter plan shows monthly price
    await expect(page.getByText(/\/mo/).first()).toBeVisible()

    // Supporting-message copy visible
    await expect(page.getByText(/free during beta/i).first()).toBeVisible()
  })

  test('displays community-first pricing messaging', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/community-first pricing/i)).toBeVisible()
  })

  test('shows supporter call-to-action', async ({ page }) => {
    await page.goto('/pricing')

    const supporterButton = page.getByRole('button', {
      name: /become a supporter|current plan/i,
    })
    await expect(supporterButton.first()).toBeVisible()
  })

  test('displays pricing philosophy section', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/why this pricing model/i)).toBeVisible()
    await expect(page.getByText(/generous free tier/i)).toBeVisible()
    await expect(page.getByText(/supporter tier/i)).toBeVisible()
    await expect(page.getByText(/no growth hacks/i)).toBeVisible()
  })

  test('shows comparison table', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/quick comparison/i)).toBeVisible()
    await expect(page.getByText(/monthly price/i)).toBeVisible()
    await expect(page.getByText(/initial credit allocation/i)).toBeVisible()
    await expect(page.getByText(/api access/i).first()).toBeVisible()
  })

  test('plan buttons are disabled', async ({ page }) => {
    await page.goto('/pricing')

    // Plan buttons are currently disabled
    const upgradeButtons = page.getByRole('button', {
      name: /become a supporter|current plan|default plan/i,
    })
    const count = await upgradeButtons.count()

    for (let i = 0; i < count; i++) {
      await expect(upgradeButtons.nth(i)).toBeDisabled()
    }
  })

  test('displays contact support link', async ({ page }) => {
    await page.goto('/pricing')

    const contactLink = page.getByRole('link', { name: /contact support/i })
    await expect(contactLink).toBeVisible()
    await expect(contactLink).toHaveAttribute('href', '/contact')
  })

  test('shows plan features', async ({ page }) => {
    await page.goto('/pricing')

    // Check for common features mentioned
    await expect(
      page.getByText(/initial credits on plan activation/i).first(),
    ).toBeVisible()
    await expect(
      page.getByText(/generations per monthly usage window/i).first(),
    ).toBeVisible()
    await expect(page.getByText(/rate limit/i).first()).toBeVisible()
  })

  test('responsive layout works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pricing')

    // Should still show all plans (stacked vertically)
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible()
    await expect(
      page.getByText('Supporter', { exact: true }).first(),
    ).toBeVisible()
  })
})
