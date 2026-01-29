/* eslint-disable @typescript-eslint/no-explicit-any */ // REMOVE AND FIND FIX BEFORE FINAL TEST
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SignUp from './SignUp'

// --- Mocks ---

const registerMock = vi.hoisted(() => vi.fn())

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    register: registerMock,
  }),
}))

// Keep layout simple
vi.mock('../../components/auth/AuthLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

// Mock Input so label works with getByLabelText
vi.mock('../../components/ui/Input', () => ({
  default: (props: any) => (
    <div>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <input
        id={props.id}
        aria-label={props.label}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
      />
    </div>
  ),
}))

// Simple Button mock – only cares about type/disabled/children
vi.mock('../../components/ui/Button', () => ({
  default: (props: any) => (
    <button type={props.type} disabled={props.disabled} onClick={props.onClick}>
      {props.children}
    </button>
  ),
}))

vi.mock('../../components/auth/SocialAuth', () => ({
  default: () => <div>SocialAuth</div>,
}))

vi.mock('../../components/auth/AuthDivider', () => ({
  default: () => <div>AuthDivider</div>,
}))

// Mock useNavigate
const mockNavigate = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// --- Tests ---

describe('SignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields and submit button', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')[0]).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /Create Account/i })[0],
    ).toBeInTheDocument()
  })

  it('disables submit button if form is invalid', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    const submit = screen.getAllByRole('button', { name: /Create Account/i })[0]
    expect(submit).toBeDisabled()
  })

  it('shows password strength and requirements', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    const passwordInputs = screen.getAllByLabelText(/Password/i)
    const passwordInput = passwordInputs[0] // main password field

    fireEvent.change(passwordInput, { target: { value: 'short' } })
    expect(screen.getByText(/Too short/i)).toBeInTheDocument()

    fireEvent.change(passwordInput, { target: { value: 'Longerpass1!' } })
    expect(screen.getByText(/Strong/i)).toBeInTheDocument()
    expect(screen.getAllByText(/At least 8 characters/i)[0]).toBeInTheDocument()
  })

  it('shows password match indicator', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    const passwordInputs = screen.getAllByLabelText(/Password/i)
    const passwordInput = passwordInputs[0]
    const confirmInput = passwordInputs[1]

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    fireEvent.change(confirmInput, { target: { value: 'Password123!' } })
    expect(screen.getAllByText(/Passwords match/i)[0]).toBeInTheDocument()

    fireEvent.change(confirmInput, { target: { value: 'Different' } })
    expect(screen.getAllByText(/Passwords don't match/i)[0]).toBeInTheDocument()
  })

  it('enables submit button when form is valid', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getAllByLabelText(/Full Name/i)[0], {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getAllByLabelText(/Email/i)[0], {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/^Password$/i)[0], {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], {
      target: { value: 'Password123!' },
    })
    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(
      screen.getAllByRole('button', { name: /Create Account/i })[0],
    ).not.toBeDisabled()
  })

  it('calls register and navigates on successful submit', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    render(<SignUp />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getAllByLabelText(/Full Name/i)[0], {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getAllByLabelText(/Email/i)[0], {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/^Password$/i)[0], {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], {
      target: { value: 'Password123!' },
    })
    const termsCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement
    fireEvent.change(termsCheckbox, { target: { checked: true } })
    expect(termsCheckbox.checked).toBe(true)
    expect(screen.getAllByText(/Passwords match/i)[0]).toBeInTheDocument()

    const submitButton = screen.getAllByRole('button', {
      name: /Create Account/i,
    })[0]
    expect(submitButton).not.toBeDisabled()

    const form = screen.getAllByLabelText(/Full Name/i)[0].closest('form')
    expect(form).toBeTruthy()
    fireEvent.submit(form as HTMLFormElement)

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'Password123!',
        true,
      )
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('shows error message if register fails', async () => {
    registerMock.mockRejectedValueOnce('backend error')

    render(<SignUp />, { wrapper: MemoryRouter })

    fireEvent.change(screen.getAllByLabelText(/Full Name/i)[0], {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getAllByLabelText(/Email/i)[0], {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getAllByLabelText(/^Password$/i)[0], {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getAllByLabelText(/Confirm Password/i)[0], {
      target: { value: 'Password123!' },
    })
    const termsCheckbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement
    fireEvent.change(termsCheckbox, { target: { checked: true } })
    expect(termsCheckbox.checked).toBe(true)
    expect(screen.getAllByText(/Passwords match/i)[0]).toBeInTheDocument()

    const submitButton = screen.getAllByRole('button', {
      name: /Create Account/i,
    })[0]
    expect(submitButton).not.toBeDisabled()

    const form = screen.getAllByLabelText(/Full Name/i)[0].closest('form')
    expect(form).toBeTruthy()
    fireEvent.submit(form as HTMLFormElement)

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to create account\. Please try again\./i),
      ).toBeInTheDocument()
    })
  })

  it('toggles password visibility', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    const passwordInputs = screen.getAllByLabelText(/Password/i)
    const passwordInput = passwordInputs[0]
    const toggleButtons = screen.getAllByRole('button')
    const toggleBtn = toggleButtons[0] // first toggle button in DOM

    expect(passwordInput).toHaveAttribute('type', 'password')
    fireEvent.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')
    fireEvent.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('toggles confirm password visibility', () => {
    render(<SignUp />, { wrapper: MemoryRouter })

    const passwordInputs = screen.getAllByLabelText(/Password/i)
    const confirmInput = passwordInputs[1]
    const toggleButtons = screen.getAllByRole('button')
    const confirmToggleBtn = toggleButtons[1] // second toggle button

    expect(confirmInput).toHaveAttribute('type', 'password')
    fireEvent.click(confirmToggleBtn)
    expect(confirmInput).toHaveAttribute('type', 'text')
    fireEvent.click(confirmToggleBtn)
    expect(confirmInput).toHaveAttribute('type', 'password')
  })
})
