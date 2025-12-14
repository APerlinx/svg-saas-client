import { test, expect } from '@playwright/test'

test('unauthenticated user cannot generate SVG', async ({ page }) => {
  await page.goto('/')

  const generateButton = page.getByRole('button', { name: /^Generate$/i })

  // Initially disabled because prompt is empty
  await expect(generateButton).toBeDisabled()

  // Fill the prompt so the button becomes enabled
  await page
    .getByLabel(/prompt/i)
    .fill('Minimal SVG icon of a pencil drawing a line')

  await expect(generateButton).toBeEnabled()
  await generateButton.click()

  // Now the "Sign In Required" modal should appear
  const modal = page.getByTestId('signin-required-modal')

  await expect(modal).toBeVisible()
  await expect(modal).toContainText(/sign in required/i)
  await expect(modal).toContainText(
    /to generate custom svgs, you need to be signed in/i
  )

  await expect(
    modal.getByRole('link', { name: /create account/i })
  ).toBeVisible()
  await expect(modal.getByRole('link', { name: /^sign in$/i })).toBeVisible()
})
