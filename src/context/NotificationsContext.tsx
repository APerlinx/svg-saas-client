import { createContext } from 'react'
import type { ReactNode } from 'react'

export type NotificationBase = {
  id: string
  title: string | null
  message: string
  createdAt: string
  readAt: string | null
}

export type JobNotificationData = {
  jobId?: string | null
  generationId: string | null
  prompt: string | null
  style: string | null
  model: string | null
}

export type JobSucceededNotif = NotificationBase & {
  type: 'JOB_SUCCEEDED'
  data: JobNotificationData | null
}

export type JobFailedNotif = NotificationBase & {
  type: 'JOB_FAILED'
  data: JobNotificationData | null
}

export type OutOfCreditsNotif = NotificationBase & {
  type: 'LOW_CREDITS'
  data: { credits: number } | null
}

export type NotificationDto =
  | JobSucceededNotif
  | JobFailedNotif
  | OutOfCreditsNotif

export type NotificationsState = {
  unreadCount: number
  notifications: NotificationDto[]
  nextCursor: string | null
  hasMore: boolean
  isLoadingBadge: boolean
  isLoadingNotifications: boolean
  refreshBadgeCount: () => Promise<void>
  loadLatestAndMarkSeen: (limit?: number) => Promise<void>
  loadMore: (limit?: number) => Promise<void>
  clear: () => void
}

export const NotificationsContext = createContext<NotificationsState | null>(
  null
)

export interface NotificationsProviderProps {
  children: ReactNode
}
