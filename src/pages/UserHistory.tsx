import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  fetchGenerationHistory,
  type UserGeneration,
} from '../services/userService'
import SvgQuickActionsMenu from '../components/ui/SvgQuickActionsMenu'

type LoadState = 'idle' | 'loading' | 'error'

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

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
    <div className="w-full max-w-none mx-auto py-10 sm:py-14 px-4">
      <div className="rounded-3xl bg-linear-to-r from-wizard-blue/15 to-wizard-gold/10 backdrop-blur-sm border border-gray-200/50 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-700 mt-2 max-w-2xl">
          Your personal gallery of generated SVGs.
        </p>
      </div>

      {!userId ? (
        <div className="mt-6 rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
          <div className="text-lg sm:text-xl font-semibold text-gray-900">
            Sign in to view your history
          </div>
          <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Your generated SVGs will show up here once you’re signed in.
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden"
                aria-label="Loading your SVG preview"
              >
                <div className="aspect-square bg-white/45 flex items-center justify-center">
                  <div className="h-full w-full bg-gray-100 animate-pulse" />
                </div>
                <div className="p-4">
                  <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="h-3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              'grid gap-4',
              'grid-cols-[repeat(auto-fill,minmax(220px,1fr))]',
            )}
          >
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
                className="relative z-0 hover:z-30 focus-within:z-30 group rounded-2xl border border-gray-200/70 bg-white/60 overflow-hidden transition-all"
                aria-label="Your SVG card"
              >
                <div className="relative aspect-square bg-white/45 flex items-center justify-center">
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

                  {item.svgUrl ? (
                    <img
                      src={item.svgUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-5"
                    />
                  ) : (
                    <div className="text-sm text-gray-500">No preview</div>
                  )}
                </div>

                <div className="p-4">
                  <div
                    className="text-sm font-semibold text-gray-900 truncate"
                    title={item.prompt}
                  >
                    {shortenPrompt(item.prompt)}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div className="text-gray-500">Created</div>
                    <div className="text-gray-700 font-medium text-right">
                      {formatCreatedAt(item.createdAt)}
                    </div>
                    <div className="text-gray-500">Style</div>
                    <div
                      className="text-gray-700 font-medium text-right truncate"
                      title={item.style}
                    >
                      {item.style}
                    </div>
                    <div className="text-gray-500">Model</div>
                    <div
                      className="text-gray-700 font-medium text-right truncate"
                      title={item.model}
                    >
                      {item.model}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && userId && items.length === 0 && !errorMessage ? (
          <div className="mt-6 rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
            <div className="text-lg sm:text-xl font-semibold text-gray-900">
              No SVGs to show yet
            </div>
            <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Generate your first SVG on the dashboard.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
