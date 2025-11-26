export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE'
  credits: number
  createdAt: string
  updatedAt: string
}
