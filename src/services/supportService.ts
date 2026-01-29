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

export type SupportMessageType = 'contact' | 'bug' | 'idea'

export type SubmitSupportMessagePayload = {
  type: SupportMessageType
  subject: string
  message: string
  email?: string
  contextUrl: string
  userAgent: string
}

export type SubmitSupportMessageResponse = {
  ok: true
}

export const SUPPORT_API = {
  submitMessage: '/support/contact',
} as const

export async function submitSupportMessage(
  payload: SubmitSupportMessagePayload,
): Promise<SubmitSupportMessageResponse> {
  try {
    const response = await api.post<SubmitSupportMessageResponse>(
      SUPPORT_API.submitMessage,
      payload,
    )
    return response.data
  } catch (error) {
    logger.error('Error submitting support message', error)
    normalizeError(error)
  }
}
