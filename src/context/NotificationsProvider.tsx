import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { logger } from '../services/logger'
import {
  fetchNotificationBadgeCount,
  fetchNotifications,
  markNotificationsAsSeen,
} from '../services/notificationService'
import {
  NotificationsContext,
  type NotificationDto,
  type NotificationsProviderProps,
} from './NotificationsContext'

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasLoadedLatest, setHasLoadedLatest] = useState(false)
  const [isLoadingBadge, setIsLoadingBadge] = useState(false)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)

  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const clear = useCallback(() => {
    setUnreadCount(0)
    setNotifications([])
    setNextCursor(null)
    setHasLoadedLatest(false)
    setIsLoadingBadge(false)
    setIsLoadingNotifications(false)
  }, [])

  const refreshBadgeCount = useCallback(async () => {
    if (!isAuthenticated || !user) {
      if (mountedRef.current) setUnreadCount(0)
      return
    }

    setIsLoadingBadge(true)
    try {
      const count = await fetchNotificationBadgeCount()
      if (!mountedRef.current) return
      setUnreadCount(count)
    } catch (error) {
      logger.error('Failed to refresh notification badge count', error)
    } finally {
      if (mountedRef.current) setIsLoadingBadge(false)
    }
  }, [isAuthenticated, user])

  const loadLatestAndMarkSeen = useCallback(
    async (limit = 5) => {
      if (!isAuthenticated || !user) return
      if (isLoadingNotifications) return

      // Only fetch when:
      // - we never loaded notifications this session, OR
      // - badge says there are new notifications.
      const shouldFetch = !hasLoadedLatest || unreadCount > 0
      if (!shouldFetch) return

      setIsLoadingNotifications(true)
      try {
        const payload = await fetchNotifications(null, limit)
        if (!mountedRef.current) return

        setNotifications(payload.notifications)
        setNextCursor(payload.nextCursor)
        setHasLoadedLatest(true)

        if (unreadCount > 0) {
          await markNotificationsAsSeen()
          if (!mountedRef.current) return
          setUnreadCount(0)
        }
      } catch (error) {
        logger.error('Failed to load notifications and mark seen', error)
      } finally {
        if (mountedRef.current) setIsLoadingNotifications(false)
      }
    },
    [
      isAuthenticated,
      user,
      isLoadingNotifications,
      hasLoadedLatest,
      unreadCount,
    ]
  )

  const loadMore = useCallback(
    async (limit = 5) => {
      if (!isAuthenticated || !user) return
      if (isLoadingNotifications) return
      if (!nextCursor) return

      setIsLoadingNotifications(true)
      try {
        const payload = await fetchNotifications(nextCursor, limit)
        if (!mountedRef.current) return

        setNotifications((prev) => [...prev, ...payload.notifications])
        setNextCursor(payload.nextCursor)
        setHasLoadedLatest(true)
      } catch (error) {
        logger.error('Failed to load more notifications', error)
      } finally {
        if (mountedRef.current) setIsLoadingNotifications(false)
      }
    },
    [isAuthenticated, user, isLoadingNotifications, nextCursor]
  )

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      clear()
      return
    }

    void refreshBadgeCount()
  }, [isAuthenticated, isLoading, user, clear, refreshBadgeCount])

  const value = useMemo(
    () => ({
      unreadCount,
      notifications,
      nextCursor,
      hasMore: nextCursor !== null,
      isLoadingBadge,
      isLoadingNotifications,
      refreshBadgeCount,
      loadLatestAndMarkSeen,
      loadMore,
      clear,
    }),
    [
      unreadCount,
      notifications,
      nextCursor,
      isLoadingBadge,
      isLoadingNotifications,
      refreshBadgeCount,
      loadLatestAndMarkSeen,
      loadMore,
      clear,
    ]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
