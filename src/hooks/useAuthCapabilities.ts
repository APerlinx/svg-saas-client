import { useContext } from 'react'
import { AuthCapabilitiesContext } from '../context/AuthCapabilitiesState'

export function useAuthCapabilities() {
  const context = useContext(AuthCapabilitiesContext)

  if (!context) {
    throw new Error(
      'useAuthCapabilities must be used within an AuthCapabilitiesProvider',
    )
  }

  return context
}
