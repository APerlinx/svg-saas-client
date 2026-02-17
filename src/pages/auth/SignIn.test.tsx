import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import SignIn from './SignIn'
import { AuthApiError } from '../../services/authService'

const loginMock = vi.fn()
const forceDisableEmailAuthMock = vi.fn()
const showToastMock = vi.fn()

let capabilitiesState = {
  emailAuthEnabled: true,
  oauthProviders: ['google', 'github'] as Array<'google' | 'github'>,
}

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

vi.mock('../../hooks/useAuthCapabilities', () => ({
  useAuthCapabilities: () => ({
    capabilities: capabilitiesState,
    isLoading: false,
    error: null,
    forceDisableEmailAuth: forceDisableEmailAuthMock,
    refreshCapabilities: vi.fn(),
  }),
}))

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    showToast: showToastMock,
  }),
}))

describe('SignIn page', () => {
  beforeEach(() => {
    loginMock.mockReset()
    forceDisableEmailAuthMock.mockReset()
    showToastMock.mockReset()
    capabilitiesState = {
      emailAuthEnabled: true,
      oauthProviders: ['google', 'github'],
    }
  })

  it('calls login with form data when form is submitted', async () => {
    loginMock.mockResolvedValueOnce(undefined)

    const { container } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
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
        false,
      )
    })
  })

  it('shows an error when login fails with invalid credentials', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'))

    const { container } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
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
          p.textContent?.toLowerCase().includes('error'),
      )
      expect(hasError).toBe(true)
    })
  })

  it('renders OAuth-only mode when email auth is disabled', () => {
    capabilitiesState = {
      emailAuthEnabled: false,
      oauthProviders: ['google', 'github'],
    }

    const { getByRole } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    )

    expect(
      getByRole('button', { name: /continue with google/i }),
    ).toBeInTheDocument()
  })

  it('handles EMAIL_AUTH_DISABLED by switching to OAuth mode and showing friendly UI error', async () => {
    loginMock.mockRejectedValueOnce(
      new AuthApiError('Email disabled', {
        status: 403,
        errorCode: 'EMAIL_AUTH_DISABLED',
      }),
    )

    const { container, getAllByText } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>,
    )

    const form = container.querySelector('form') as HTMLFormElement
    const formUtils = within(form)

    await userEvent.type(
      formUtils.getByPlaceholderText('you@example.com'),
      'test@example.com',
    )
    await userEvent.type(
      formUtils.getByPlaceholderText('••••••••'),
      'wrongpass',
    )
    fireEvent.submit(form)

    await waitFor(() => {
      expect(forceDisableEmailAuthMock).toHaveBeenCalledTimes(1)
      expect(showToastMock).toHaveBeenCalledTimes(1)
      expect(
        getAllByText(/Continue with Google or GitHub to sign in\./i).length,
      ).toBeGreaterThan(0)
    })
  })
})
