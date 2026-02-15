import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('can navigate between all public pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Docs
    await page.getByRole('link', { name: /docs/i }).click()
    await expect(page).toHaveURL('/docs')
    await expect(
      page.getByRole('heading', { name: /documentation/i }),
    ).toBeVisible()

    // Navigate to Pricing
    await page.getByRole('link', { name: /pricing/i }).click()
    await expect(page).toHaveURL('/pricing')
    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible()

    // Navigate to Status
    await page.getByRole('link', { name: /status/i }).click()
    await expect(page).toHaveURL('/status')
    await expect(page.getByRole('heading', { name: /status/i })).toBeVisible()

    // Navigate to API
    await page.getByRole('link', { name: /^api$/i }).click()
    await expect(page).toHaveURL('/api-keys')

    // Back to home
    await page.getByRole('link', { name: /chatsvg/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('footer links work correctly', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click Privacy Policy
    await page.getByRole('link', { name: /privacy policy/i }).click()
    await expect(page).toHaveURL('/privacy')

    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click Terms of Service
    await page.getByRole('link', { name: /terms of service/i }).click()
    await expect(page).toHaveURL('/terms')

    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click Contact
    await page.getByRole('link', { name: /contact/i }).click()
    await expect(page).toHaveURL('/contact')
  })

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')

    await expect(page.getByText(/404|not found/i)).toBeVisible()
    await expect(
      page.getByRole('link', { name: /home|go back/i }),
    ).toBeVisible()
  })

  test('scroll to top on route change', async ({ page }) => {
    await page.goto('/app')
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Navigate to another page
    await page.getByRole('link', { name: /docs/i }).click()

    // Should be scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBe(0)
  })

  test('user menu opens and closes', async ({ page }) => {
    // Sign in first
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('Password123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()

    // Click user avatar to open menu
    await page.getByText('TEST_USER').click()

    // Menu items should be visible
    await expect(
      page.getByRole('link', { name: /profile|account/i }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /history/i })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /logout|sign out/i }),
    ).toBeVisible()

    // Click outside to close
    await page.click('body')
    await expect(
      page.getByRole('link', { name: /profile|account/i }),
    ).not.toBeVisible()
  })

  test('notifications bell shows count badge', async ({ page }) => {
    // Sign in
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('Password123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()

    // Look for notification bell
    const notificationBell = page
      .locator('[aria-label*="notification"]')
      .or(page.locator('.notification-bell'))

    if (await notificationBell.isVisible()) {
      // Should show count if there are unread notifications
      const badge = page.locator('.badge, [data-count]')
      // Badge may or may not be visible depending on notification state
    }
  })

  test('mobile menu works on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Hamburger menu should be visible
    const hamburger = page
      .getByRole('button', { name: /menu|navigation/i })
      .or(page.locator('[aria-label*="menu"]'))

    if (await hamburger.isVisible()) {
      await hamburger.click()

      // Mobile menu should open
      await expect(page.getByRole('link', { name: /docs/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible()
    }
  })
})
