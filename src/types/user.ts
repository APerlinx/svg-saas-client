export interface User {
  id: string
  name: string
  email: string
  coins?: number
}

export interface AuthResponse {
  user: User
  token?: string
  accessToken?: string
}
