import axios, { AxiosError } from 'axios'
import { logger } from './logger'

// Public endpoint — no CSRF needed
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})

interface ApiError {
  message?: string
  error?: string
}

function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new Error(msg)
  }
  throw error as Error
}

// ── Types ──────────────────────────────────────────────────────────────

export type PlanType = 'FREE' | 'SUPPORTER'

export interface PlanLimits {
  startingCredits: number
  creditRefillAmount: number
  creditRefillDays: number
  generationsPerMonth: number
  apiAccess: boolean
  maxApiKeys: number
  rateLimits: {
    perMinute: number
    perHour: number
    perDay: number
  }
  supportLevel: 'community' | 'email' | 'priority'
  supportChannel?: 'email' | 'discord'
}

export interface Plan {
  plan: PlanType
  name: string
  description: string
  price: number
  limits: PlanLimits
}

export type PlansResponse = Record<PlanType, Plan>

// ── Service Functions ──────────────────────────────────────────────────

export async function fetchPlans(): Promise<PlansResponse> {
  try {
    const response = await api.get<{ plans: PlansResponse }>('/plans')
    return response.data.plans
  } catch (error) {
    logger.error('Error fetching plans', error)
    normalizeError(error)
  }
}
