import { useEffect, useState } from 'react'

export function RevokeConfirmModal({
  keyName,
  onConfirm,
  onClose,
}: {
  keyName: string
  onConfirm: () => void
  onClose: () => void
}) {
  const [revoking, setRevoking] = useState(false)

  const handleConfirm = async () => {
    setRevoking(true)
    onConfirm()
  }

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
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Revoke API key
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to revoke{' '}
              <span className="font-semibold text-gray-900">{keyName}</span>?
              Any applications using this key will lose access immediately.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={revoking}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {revoking ? 'Revoking…' : 'Revoke key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
