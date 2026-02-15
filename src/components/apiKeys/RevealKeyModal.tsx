import { useState } from 'react'
import type { CreateApiKeyResponse } from '../../services/apiKeyService'

export function RevealKeyModal({
  result,
  onClose,
}: {
  result: CreateApiKeyResponse
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(result.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">API key created</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span className="font-semibold">Important:</span> Copy your API key
            now. You won't be able to see it again.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-sm text-gray-900">{result.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="flex gap-2">
              <code className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-900 break-all select-all">
                {result.key}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-lg bg-linear-to-r from-wizard-orange to-wizard-orange/90 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-wizard-orange/90 hover:to-wizard-orange transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
