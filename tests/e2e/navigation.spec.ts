/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('can navigate between all public pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Docs
    await page.getByRole('link', { name: /docs/i }).first().click()
    await expect(page).toHaveURL('/docs')

    // Navigate to Pricing
    await page
      .getByRole('link', { name: /pricing|free beta/i })
      .first()
      .click()
    await expect(page).toHaveURL('/pricing')

    // Navigate to API
    await page.getByRole('link', { name: /^api$/i }).first().click()
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
    const privacyLinks = page.getByRole('link', { name: /privacy policy/i })
    await privacyLinks.first().click()
    await expect(page).toHaveURL('/privacy')

    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click Terms of Service
    const termsLinks = page.getByRole('link', { name: /terms of service/i })
    await termsLinks.first().click()
    await expect(page).toHaveURL('/terms')

    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click Contact
    const contactLinks = page.getByRole('link', { name: /contact/i })
    await contactLinks.first().click()
    await expect(page).toHaveURL('/contact')
  })

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')

    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText(/page not found/i)).toBeVisible()
    await expect(
      page.getByRole('link', { name: /back to home/i }),
    ).toBeVisible()
  })

  test('scroll to top on route change', async ({ page }) => {
    await page.goto('/app')

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(100)

    // Navigate to another page
    await page.getByRole('link', { name: /docs/i }).first().click()
    await page.waitForURL('/docs')

    // Should be scrolled to top (allow small buffer for smooth scroll)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(50)
  })

  test('user menu opens and closes', async ({ page }) => {
    // Sign in first
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('Password123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()

    // Click user name/avatar to open menu
    await page.getByText('TEST_USER').click()

    // Menu items should be visible
    await expect(page.getByRole('link', { name: /my history/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /api keys/i })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /get more credits/i }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

    // Click outside to close
    await page.click('header')
    await page.waitForTimeout(200)
    await expect(
      page.getByRole('link', { name: /my history/i }),
    ).not.toBeVisible()
  })

  test('notifications bell visible when authenticated', async ({ page }) => {
    // Sign in
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/^password$/i).fill('Password123!')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()

    // Look for notification bell button
    const notificationButton = page.locator(
      'button[aria-label*="Notification"]',
    )
    await expect(notificationButton).toBeVisible()
  })

  test.skip('mobile menu works on small screens', async ({ page }) => {
    // Skip: No mobile hamburger menu implemented yet
    // Header navigation is responsive but always visible
  })
})
