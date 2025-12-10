import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SignIn from './SignIn'

const loginMock = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

describe('SignIn page', () => {
  beforeEach(() => {
    loginMock.mockReset()
  })

  it('calls login with form data when form is submitted', async () => {
    loginMock.mockResolvedValueOnce(undefined)

    const { container } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )

    const form = container.querySelector('form') as HTMLFormElement
    const formUtils = within(form)

    const emailInput = formUtils.getAllByPlaceholderText('you@example.com')[0]
    const passwordInput = formUtils.getAllByPlaceholderText('••••••••')[0]

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'supersecret')

    const submitButton = formUtils.getByRole('button')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        'test@example.com',
        'supersecret',
        false
      )
    })
  })

  it('shows an error when login fails with invalid credentials', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'))

    const { container } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    )

    const form = container.querySelector('form') as HTMLFormElement
    const formUtils = within(form)

    const emailInput = formUtils.getAllByPlaceholderText('you@example.com')[0]
    const passwordInput = formUtils.getAllByPlaceholderText('••••••••')[0]

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpass')

    fireEvent.submit(form)

    await waitFor(() => {
      const errorParagraphs = form.querySelectorAll('p')
      const hasError = Array.from(errorParagraphs).some(
        (p) =>
          p.textContent?.toLowerCase().includes('incorrect') ||
          p.textContent?.toLowerCase().includes('failed') ||
          p.textContent?.toLowerCase().includes('error')
      )
      expect(hasError).toBe(true)
    })
  })
})
