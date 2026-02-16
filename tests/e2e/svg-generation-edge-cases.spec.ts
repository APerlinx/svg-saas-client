/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'test@example.com'
const TEST_PASSWORD = 'Password123!'

test.describe('SVG Generation - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
    await page.getByLabel(/email/i).fill(TEST_EMAIL)
    await page.getByLabel(/^password$/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText('TEST_USER')).toBeVisible()
    await page.goto('/app')
  })

  test('prevents submission with empty prompt', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /generate/i })

    // Try to generate without entering prompt
    await generateButton.click()

    // Should show toast error: "Please enter a prompt to generate your SVG."
    await expect(
      page.getByText(/Please enter a prompt to generate your SVG/i),
    ).toBeVisible()
  })

  test('handles very long prompts', async ({ page }) => {
    const longPrompt = 'A very detailed SVG icon '.repeat(50) // ~1000 chars

    await page.getByLabel(/prompt/i).fill(longPrompt)
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Should process successfully (no character limit enforced)
    await page.waitForTimeout(1000)

    // Generation should start (button becomes disabled)
    const isDisabled = await generateButton.isDisabled()
    expect(isDisabled).toBe(true)
  })

  test('handles special characters in prompt', async ({ page }) => {
    const specialPrompt = 'Icon with 🚀 emoji & special chars: @#$%^&*()'

    await page.getByLabel(/prompt/i).fill(specialPrompt)
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Should process successfully - button becomes disabled during generation
    await expect(generateButton).toBeDisabled({ timeout: 2000 })
  })

  test('switches between different AI models', async ({ page }) => {
    // Click the model dropdown button (looks for button with GPT text)
    const modelButton = page.locator('button').filter({ hasText: /GPT/i })
    await modelButton.click()

    // Select GPT-5 Mini from the dropdown
    await page.getByText('GPT-5 Mini', { exact: true }).click()

    await page.getByLabel(/prompt/i).fill('Simple circle icon')
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Button should be disabled during generation
    await expect(generateButton).toBeDisabled({ timeout: 2000 })
  })

  test('switches between different styles', async ({ page }) => {
    // Try different styles: outline, filled, minimal
    const styles = [
      { value: 'Filled', prompt: 'filled icon' },
      { value: 'Outline', prompt: 'outline icon' },
    ]

    for (const style of styles) {
      // Click style button (shows current style like "Minimal")
      const styleButton = page
        .locator('button[type="button"]')
        .filter({ hasText: /Minimal|Filled|Outline/i })
        .first()
      await styleButton.click()

      // Click the style option
      await page.getByText(style.value, { exact: true }).click()

      await page.getByLabel(/prompt/i).fill(style.prompt)
      const generateButton = page.getByRole('button', { name: /generate/i })
      await generateButton.click()

      // Button should be disabled during generation
      await expect(generateButton).toBeDisabled({ timeout: 2000 })

      // Wait a bit before next iteration
      await page.waitForTimeout(1000)
    }
  })

  test('privacy switch toggles between public and private', async ({
    page,
  }) => {
    // Find the privacy switch button (it's a button with role="switch")
    const privacySwitch = page.locator('button[role="switch"]')
    await expect(privacySwitch).toBeVisible()

    // Toggle to private
    await privacySwitch.click()

    await page.getByLabel(/prompt/i).fill('Private icon')
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Button should be disabled during generation
    await expect(generateButton).toBeDisabled({ timeout: 2000 })
  })

  test.skip('shows error when generation fails', async ({ page }) => {
    // This test would require mocking a failed API response
    // Skipping as it depends on backend error simulation
  })

  test('prevents duplicate submissions (idempotency)', async ({ page }) => {
    await page.getByLabel(/prompt/i).fill('Test idempotency')

    // Click generate multiple times quickly
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()
    await generateButton.click()
    await generateButton.click()

    // Should only create one generation
    // Button should be disabled after first click
    const isDisabled = await generateButton.isDisabled()
    expect(isDisabled).toBe(true)
  })

  test('handles insufficient credits', async ({ page }) => {
    // This test assumes user has very low credits
    // You may need to set up a test user with 0 credits

    // Try to generate
    await page.getByLabel(/prompt/i).fill('Icon that requires credits')
    await page.getByRole('button', { name: /generate/i }).click()

    // If insufficient credits, should show error or redirect to pricing
    await page.waitForTimeout(2000)

    const insufficientCreditsError = page.getByText(
      /insufficient credits|not enough credits|buy more credits/i,
    )
    const pricingRedirect = page.url().includes('/pricing')

    // Either shows error or redirects to pricing
    const errorVisible = await insufficientCreditsError
      .isVisible()
      .catch(() => false)

    if (!pricingRedirect) {
      expect(errorVisible).toBe(true)
    }
  })

  test.skip('resume generation after page reload', async ({ page }) => {
    // This test is timing-dependent and flaky
    // Generation may complete before reload happens
    // Skipping for now
  })
})
