import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  fetchGenerationHistory,
  type UserGeneration,
} from '../services/userService'
import SvgQuickActionsMenu from '../components/ui/SvgQuickActionsMenu'

type LoadState = 'idle' | 'loading' | 'error'

export default function UserHistory() {
  const { user } = useAuth()
  const userId = user?.id

  const [items, setItems] = useState<UserGeneration[]>([])
  const [state, setState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const title = useMemo(() => {
    return userId ? 'User history' : 'User history'
  }, [userId])

  useEffect(() => {
    const requestId = ++requestIdRef.current

    const run = async () => {
      if (!userId) {
        setItems([])
        setState('idle')
        setErrorMessage(null)
        return
      }

      setState('loading')
      setErrorMessage(null)

      try {
        const all: UserGeneration[] = []
        let cursor: string | null = null

        for (;;) {
          const data = await fetchGenerationHistory({ limit: 50, cursor })
          all.push(...data.generations)
          if (!data.nextCursor) break
          cursor = data.nextCursor
        }

        if (requestId !== requestIdRef.current) return
        setItems(all)
        setState('idle')
      } catch (e) {
        if (requestId !== requestIdRef.current) return
        setState('error')
        setErrorMessage(
          e instanceof Error ? e.message : 'Failed to load history',
        )
      }
    }

    void run()
  }, [userId])

  const isLoading = state === 'loading'

  const formatCreatedAt = (value: string) => {
    const date = new Date(value)
    if (!Number.isFinite(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date)
  }

  const shortenPrompt = (prompt: string, maxLen = 70) => {
    const trimmed = prompt.trim().replace(/\s+/g, ' ')
    if (trimmed.length <= maxLen) return trimmed
    return `${trimmed.slice(0, maxLen - 1)}…`
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto py-10 sm:py-14 px-4">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your personal gallery of AI-generated SVG icons. View, download, and
          manage all your creations.
        </p>
      </div>

      {!userId ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            Sign in to view your history
          </div>
          <div className="text-gray-600 max-w-md mx-auto">
            Your generated SVGs will show up here once you’re signed in.
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {errorMessage}
        </div>
      ) : null}

      <div>
        {isLoading ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                aria-label="Loading your SVG preview"
              >
                <div className="aspect-square flex items-center justify-center p-6">
                  <div className="h-full w-full rounded-xl bg-linear-to-br from-gray-100 to-gray-200 animate-pulse" />
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {items.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => {
                  window.dispatchEvent(
                    new CustomEvent('svgqa:hover', {
                      detail: { generationId: item.id },
                    }),
                  )
                }}
                onFocus={() => {
                  window.dispatchEvent(
                    new CustomEvent('svgqa:hover', {
                      detail: { generationId: item.id },
                    }),
                  )
                }}
                className="relative z-0 hover:z-30 focus-within:z-30 group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 hover:-translate-y-1 hover:scale-[1.02]"
                aria-label="Your SVG card"
              >
                <SvgQuickActionsMenu
                  generationId={item.id}
                  svgUrl={item.svgUrl}
                  variant="private"
                  onDeleted={(generationId) => {
                    setItems((prev) =>
                      prev.filter((it) => it.id !== generationId),
                    )
                  }}
                />

                <div className="relative aspect-square flex items-center justify-center p-6 rounded-t-2xl overflow-hidden">
                  {item.svgUrl ? (
                    <img
                      src={item.svgUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No preview</div>
                  )}
                </div>

                <div className="p-4 border-t border-gray-100 rounded-b-2xl overflow-hidden">
                  <div
                    className="text-sm font-bold text-gray-900 truncate mb-3"
                    title={item.prompt}
                  >
                    {shortenPrompt(item.prompt, 60)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-700 font-medium">
                        {formatCreatedAt(item.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Style</span>
                      <span
                        className="text-gray-700 font-medium truncate ml-2"
                        title={item.style}
                      >
                        {item.style}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Model</span>
                      <span
                        className="text-gray-700 font-medium truncate ml-2"
                        title={item.model}
                      >
                        {item.model}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && userId && items.length === 0 && !errorMessage ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-2">
              No SVGs to show yet
            </div>
            <div className="text-gray-600 max-w-md mx-auto">
              Generate your first SVG on the dashboard to see it here.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
