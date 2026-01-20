import { useNotifications } from '../hooks/useNotifications'

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString)
  const time = date.getTime()

  if (Number.isNaN(time)) return ''

  const diffMs = Date.now() - time
  if (diffMs < 0) return 'just now'

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function truncate(value: string, max = 60): string {
  const v = value.trim()
  if (v.length <= max) return v
  return `${v.slice(0, max - 1)}…`
}

export default function Notification() {
  const { notifications, isLoadingNotifications, hasMore, loadMore } =
    useNotifications()

  const isInitialLoading = isLoadingNotifications && notifications.length === 0

  return (
    <div
      className="absolute right-0 mt-2 w-72 max-h-96 backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-lg shadow-lg py-2 z-50 flex flex-col"
      role="menu"
      aria-label="Notifications"
    >
      <div className="px-4 py-3 border-b border-gray-200/50">
        <p className="text-sm font-medium text-gray-900">Notifications</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isInitialLoading ? (
          <div className="px-4 py-6">
            <p className="text-sm text-gray-500 text-center">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-6">
            <p className="text-sm text-gray-500 text-center">
              No notifications
            </p>
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((n) => (
              <div key={n.id} className="px-4 py-2 text-sm text-gray-700">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">
                    {n.title ?? 'Notification'}
                  </p>
                  <span className="text-[10px] text-gray-500 shrink-0 mt-0.5">
                    {formatTimeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>

                {(n.type === 'JOB_SUCCEEDED' || n.type === 'JOB_FAILED') &&
                  n.data?.prompt && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      “{truncate(n.data.prompt, 64)}”
                    </p>
                  )}

                {n.type === 'LOW_CREDITS' && n.data?.credits != null && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">
                      Credits: {n.data.credits}
                    </span>
                  </div>
                )}

                {(n.type === 'JOB_SUCCEEDED' || n.type === 'JOB_FAILED') && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {n.data?.style && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">
                        Style: {n.data.style}
                      </span>
                    )}
                    {n.data?.model && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-medium">
                        Model: {n.data.model}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="px-4 py-2 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={isLoadingNotifications}
                  className="w-full text-sm text-gray-700 hover:bg-gray-100/60 rounded-lg py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingNotifications ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
