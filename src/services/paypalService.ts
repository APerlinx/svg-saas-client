import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from './csrfInterceptor'
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

// ── Types ──────────────────────────────────────────────────────────────

export interface CreateSubscriptionResponse {
  subscriptionId: string
  status: string
  approveUrl: string | null
}

export interface PayPalStatus {
  plan: 'FREE' | 'SUPPORTER'
  credits: number
  paypal: {
    customerId: string | null
    subscriptionId: string | null
    status: string | null
    planId: string | null
    remote?: {
      id: string
      status: string
      plan_id: string
      subscriber?: {
        payer_id: string
        email_address: string
      }
      billing_info?: {
        next_billing_time: string
        last_payment?: {
          amount: { currency_code: string; value: string }
        }
      }
    }
  }
}

// ── Service Functions ──────────────────────────────────────────────────

export async function createSubscription(): Promise<CreateSubscriptionResponse> {
  try {
    const response = await api.post<CreateSubscriptionResponse>(
      '/paypal/create-subscription',
    )
    return response.data
  } catch (error) {
    logger.error('Error creating PayPal subscription', error)
    normalizeError(error)
  }
}

export async function cancelSubscription(): Promise<void> {
  try {
    await api.post('/paypal/subscription/cancel')
  } catch (error) {
    logger.error('Error cancelling PayPal subscription', error)
    normalizeError(error)
  }
}

export async function getPayPalStatus(): Promise<PayPalStatus> {
  try {
    const response = await api.get<PayPalStatus>('/paypal/status')
    return response.data
  } catch (error) {
    logger.error('Error fetching PayPal status', error)
    normalizeError(error)
  }
}
