import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from './csrfInterceptor'
import { logger } from './logger'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

attachCsrfInterceptor(api)

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

export interface ApiKey {
  id: string
  name: string
  description?: string
  keyPrefix: string
  environment: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
  usageCount: number
  customRateLimit: number | null
  ipWhitelist: string[]
  scopes: string[]
}

export interface CreateApiKeyParams {
  name: string
  description?: string
  environment?: 'test' | 'production'
  ipWhitelist?: string[]
  expiresAt?: string
}

export interface CreateApiKeyResponse {
  id: string
  name: string
  keyPrefix: string
  key: string
  createdAt: string
  warning: string
}

export interface ApiKeyStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalCreditsUsed: number
  successRate: number
}

export interface UsageSummary {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalCreditsUsed: number
  averageLatencyMs: number
  successRate: number
}

// ── Endpoints ──────────────────────────────────────────────────────────

const API_KEYS_API = {
  keys: '/keys',
  keyById: (id: string) => `/keys/${encodeURIComponent(id)}`,
  keyStats: (id: string) => `/keys/${encodeURIComponent(id)}/stats`,
  usageSummary: '/keys/usage/summary',
} as const

// ── Service Functions ──────────────────────────────────────────────────

export async function fetchApiKeys(): Promise<ApiKey[]> {
  try {
    const response = await api.get<{ keys: ApiKey[] }>(API_KEYS_API.keys)
    return response.data.keys
  } catch (error) {
    logger.error('Error fetching API keys', error)
    normalizeError(error)
  }
}

export async function createApiKey(
  params: CreateApiKeyParams,
): Promise<CreateApiKeyResponse> {
  try {
    const response = await api.post<CreateApiKeyResponse>(
      API_KEYS_API.keys,
      params,
    )
    return response.data
  } catch (error) {
    logger.error('Error creating API key', error)
    normalizeError(error)
  }
}

export async function revokeApiKey(id: string): Promise<void> {
  try {
    await api.delete(API_KEYS_API.keyById(id))
  } catch (error) {
    logger.error('Error revoking API key', error)
    normalizeError(error)
  }
}

export async function fetchApiKeyStats(id: string): Promise<ApiKeyStats> {
  try {
    const response = await api.get<{ stats: ApiKeyStats }>(
      API_KEYS_API.keyStats(id),
    )
    return response.data.stats
  } catch (error) {
    logger.error('Error fetching API key stats', error)
    normalizeError(error)
  }
}

export async function fetchUsageSummary(params?: {
  startDate?: string
  endDate?: string
}): Promise<UsageSummary> {
  try {
    const response = await api.get<{ summary: UsageSummary }>(
      API_KEYS_API.usageSummary,
      { params },
    )
    return response.data.summary
  } catch (error) {
    logger.error('Error fetching usage summary', error)
    normalizeError(error)
  }
}
