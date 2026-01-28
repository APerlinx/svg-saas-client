import MoonEmptyStateIcon from '../icons/MoonEmptyStateIcon'

export type RecentHistoryItem = {
  id: string
  svgUrl?: string | null
  prompt?: string
  createdAt?: string
}

type Props = {
  items: RecentHistoryItem[] | null
}

export default function RecentHistorySection({ items }: Props) {
  const hasItems = Boolean(items && items.length > 0)

  return (
    <section>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Recent stuff
          </h2>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
          <button
            type="button"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            disabled={!hasItems}
          >
            View all
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200/60 bg-white/60 p-8 sm:p-10 text-center shadow-sm">
        <div className="mx-auto flex items-center justify-center">
          <MoonEmptyStateIcon className="h-36 w-36 sm:h-44 sm:w-44" />
        </div>
        <div className="text-lg sm:text-xl font-semibold text-gray-900">
          No SVGs to show yet
        </div>
        <div className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
          Your generated SVGs will appear here.
        </div>
      </div>
    </section>
  )
}
