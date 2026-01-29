import MoonEmptyStateIcon from '../icons/MoonEmptyStateIcon'
import { Link } from 'react-router-dom'
import SvgQuickActionsMenu from '../ui/SvgQuickActionsMenu'

export type RecentHistoryItem = {
  id: string
  svgUrl?: string | null
  prompt?: string
  createdAt?: string
}

type Props = {
  items: RecentHistoryItem[] | null
  onDeleted?: (generationId: string) => void
}

export default function RecentHistorySection({ items, onDeleted }: Props) {
  const hasItems = Boolean(items && items.length > 0)
  const canNavigate = items !== null

  return (
    <section>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Recent stuff
          </h2>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
          {canNavigate ? (
            <Link
              to="/history"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              View all
            </Link>
          ) : (
            <span className="text-sm font-semibold text-gray-400 cursor-not-allowed">
              View all
            </span>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
        {hasItems ? (
          <div className="mx-auto max-w-4xl">
            <div className="text-sm font-semibold text-gray-700">
              Your recent SVGs
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {items!.map((item) => (
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
                  className="relative group aspect-square rounded-2xl border border-gray-200/70 bg-white/60"
                  aria-label="Your SVG preview"
                >
                  <SvgQuickActionsMenu
                    generationId={item.id}
                    svgUrl={item.svgUrl}
                    variant="private"
                    onDeleted={onDeleted}
                  />
                  <div className="h-full w-full bg-white/45 flex items-center justify-center">
                    {item.svgUrl ? (
                      <img
                        src={item.svgUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-3"
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center">
              <MoonEmptyStateIcon className="h-36 w-36 sm:h-44 sm:w-44" />
            </div>
            <div className="text-lg sm:text-xl font-semibold text-gray-900">
              No SVGs to show yet
            </div>
            <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Your generated SVGs will appear here.
            </div>
          </>
        )}
      </div>
    </section>
  )
}
