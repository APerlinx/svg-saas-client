export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  credits?: number
  plan?: 'FREE' | 'SUPPORTER'
}

// Interface for registration response
export interface RegisterResponse {
  user: User
}

export interface AuthResponse {
  user: User
}
