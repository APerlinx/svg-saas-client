import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test('displays all subscription plans', async ({ page }) => {
    await page.goto('/pricing')

    await expect(
      page.getByRole('heading', { name: /simple, transparent pricing/i }),
    ).toBeVisible()

    // Check for 3 plans: FREE, PRO, ENTERPRISE
    await expect(page.getByText('Free', { exact: true })).toBeVisible()
    await expect(page.getByText('Pro', { exact: true })).toBeVisible()
    await expect(page.getByText('Enterprise', { exact: true })).toBeVisible()
  })

  test('shows correct pricing information', async ({ page }) => {
    await page.goto('/pricing')

    // Pro plan shows monthly price
    await expect(page.getByText(/\/mo/)).toBeVisible()

    // Free during Beta badge visible
    await expect(page.getByText(/free during beta/i).first()).toBeVisible()
  })

  test('displays unified credit system messaging', async ({ page }) => {
    await page.goto('/pricing')

    await expect(
      page.getByText(/one unified credit system for web app and api/i),
    ).toBeVisible()
  })

  test('shows enterprise contact sales link', async ({ page }) => {
    await page.goto('/pricing')

    const contactSalesLink = page.getByRole('link', {
      name: /contact sales/i,
    })
    await expect(contactSalesLink).toBeVisible()
    await expect(contactSalesLink).toHaveAttribute(
      'href',
      /mailto:sales@chatsvg\.com/,
    )
  })

  test('displays "How It Works" section', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/how it works/i)).toBeVisible()
    await expect(page.getByText(/use anywhere/i)).toBeVisible()
    await expect(page.getByText(/monthly refresh/i)).toBeVisible()
    await expect(page.getByText(/scale up/i)).toBeVisible()
  })

  test('shows comparison table', async ({ page }) => {
    await page.goto('/pricing')

    await expect(page.getByText(/compare plans/i)).toBeVisible()
    await expect(page.getByText(/monthly price/i)).toBeVisible()
    await expect(page.getByText(/credits \/ month/i)).toBeVisible()
    await expect(page.getByText(/api access/i)).toBeVisible()
  })

  test('upgrade buttons are disabled during beta', async ({ page }) => {
    await page.goto('/pricing')

    // All upgrade/current plan buttons should be disabled
    const upgradeButtons = page.getByRole('button', {
      name: /upgrade|current plan/i,
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
    await expect(page.getByText(/credits \/ month/i).first()).toBeVisible()
    await expect(page.getByText(/generations \/ month/i).first()).toBeVisible()
    await expect(page.getByText(/rate limit/i).first()).toBeVisible()
  })

  test('responsive layout works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/pricing')

    // Should still show all plans (stacked vertically)
    await expect(page.getByText('Free', { exact: true })).toBeVisible()
    await expect(page.getByText('Pro', { exact: true })).toBeVisible()
    await expect(page.getByText('Enterprise', { exact: true })).toBeVisible()
  })
})
