import { useEffect, useState } from 'react'
import {
  fetchApiKeyStats,
  type ApiKeyStats,
} from '../../services/apiKeyService'
import { StatRow } from './StatRow'

export function KeyStatsPopover({
  keyId,
  onClose,
}: {
  keyId: string
  onClose: () => void
}) {
  const [stats, setStats] = useState<ApiKeyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const data = await fetchApiKeyStats(keyId)
        if (cancelled) return
        setStats(data)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load stats')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [keyId])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Usage stats</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-5 rounded bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : stats ? (
            <div className="space-y-3">
              <StatRow label="Total requests" value={stats.totalRequests} />
              <StatRow
                label="Successful"
                value={stats.successfulRequests}
                color="text-green-600"
              />
              <StatRow
                label="Failed"
                value={stats.failedRequests}
                color="text-red-600"
              />
              <StatRow label="Credits used" value={stats.totalCreditsUsed} />
              <StatRow
                label="Success rate"
                value={`${stats.successRate.toFixed(1)}%`}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
