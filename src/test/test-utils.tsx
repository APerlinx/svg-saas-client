import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { AuthCapabilitiesProvider } from '../context/AuthCapabilitiesContext'

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AuthCapabilitiesProvider>{ui}</AuthCapabilitiesProvider>
      </AuthProvider>
    </BrowserRouter>,
  )
}
