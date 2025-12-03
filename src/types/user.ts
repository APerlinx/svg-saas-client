export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
  coins?: number
}

// Interface for registration response
export interface RegisterResponse {
  id: string
  name: string
  email: string
  token: string
  coins?: number
}

export interface AuthResponse {
  user: User
  token?: string
}
