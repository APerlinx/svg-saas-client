import type { Toast } from '../../context/ToastContext'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
  const accentColors = {
    success: 'bg-emerald-400/80',
    error: 'bg-red-400/80',
    info: 'bg-white/30',
  }

  const iconColors = {
    success: 'text-emerald-200',
    error: 'text-red-200',
    info: 'text-white/70',
  }

  const icons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
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
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }

  return (
    <div className="relative overflow-hidden bg-[rgb(17_17_17/72%)] backdrop-blur-xl border border-white/10 ring-1 ring-white/5 text-white/90 px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${accentColors[toast.type]}`}
      />

      <div className={`shrink-0 mt-0.5 ${iconColors[toast.type]}`}>
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-sm font-medium leading-5 text-white/85">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 -mr-1 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-lg p-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg
          className="w-4 h-4"
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
  )
}
