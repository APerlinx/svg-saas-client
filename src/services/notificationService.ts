import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { logger } from './logger'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Include cookies in requests
})

attachCsrfInterceptor(api)

interface ApiError {
  message?: string
  error?: string
}

// Helper to normalize and throw errors
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

type NotificationBase = {
  id: string
  title: string | null
  message: string
  createdAt: string
  readAt: string | null
}

type JobNotificationData = {
  jobId?: string | null
  generationId: string | null
  prompt: string | null
  style: string | null
  model: string | null
}

type JobSucceededNotif = NotificationBase & {
  type: 'JOB_SUCCEEDED'
  data: JobNotificationData | null
}

type JobFailedNotif = NotificationBase & {
  type: 'JOB_FAILED'
  data: JobNotificationData | null
}

type OutOfCreditsNotif = NotificationBase & {
  type: 'LOW_CREDITS'
  data: { credits: number } | null
}

type NotificationDto = JobSucceededNotif | JobFailedNotif | OutOfCreditsNotif

interface NotificationPayload {
  notifications: NotificationDto[]
  nextCursor: string | null
}

export async function fetchNotifications(
  cursor: string | null,
  limit: number
): Promise<NotificationPayload> {
  try {
    const response = await api.get<NotificationPayload>(
      '/notification/latest',
      {
        params: { cursor, limit },
      }
    )
    return response.data
  } catch (error) {
    logger.error('Error fetching notifications', error)
    normalizeError(error)
  }
}

export async function markNotificationsAsSeen(): Promise<void> {
  try {
    await api.post<{ ok: true }>('/notification/seen')
  } catch (error) {
    logger.error('Error marking notifications as seen', error)
    normalizeError(error)
  }
}

export async function fetchNotificationBadgeCount(): Promise<number> {
  try {
    const response = await api.get<{ unreadCount: number }>(
      '/notification/badge'
    )
    return response.data.unreadCount
  } catch (error) {
    logger.error('Error fetching notification badge count', error)
    normalizeError(error)
  }
}
