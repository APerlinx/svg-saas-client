import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { attachAuthRefreshInterceptor } from './authRefreshInterceptor'
import { logger } from './logger'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})

attachCsrfInterceptor(api)
attachAuthRefreshInterceptor(api)

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

export type UserGeneration = {
  id: string
  svgUrl: string | null
  prompt: string
  style: string
  model: string
  privacy: boolean
  createdAt: string
}

export type GenerationHistoryResponse = {
  generations: UserGeneration[]
  nextCursor: string | null
}

export const USER_API = {
  generationHistory: '/user/generations',
} as const

export async function fetchGenerationHistory(params: {
  limit: number
  cursor?: string | null
}): Promise<GenerationHistoryResponse> {
  try {
    const response = await api.get<GenerationHistoryResponse>(
      USER_API.generationHistory,
      { params },
    )
    return response.data
  } catch (error) {
    logger.error('Error fetching generation history', error)
    normalizeError(error)
  }
}

export async function deleteGeneration(generationId: string): Promise<void> {
  try {
    await api.delete(
      `${USER_API.generationHistory}/${encodeURIComponent(generationId)}`,
    )
  } catch (error) {
    logger.error('Error deleting generation', error)
    normalizeError(error)
  }
}
