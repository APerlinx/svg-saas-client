import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { Link } from 'react-router-dom'
import {
  fetchApiKeys,
  revokeApiKey,
  fetchUsageSummary,
  type ApiKey,
  type CreateApiKeyResponse,
  type UsageSummary,
} from '../services/apiKeyService'
import {
  CreateKeyModal,
  RevealKeyModal,
  KeyStatsPopover,
  RevokeConfirmModal,
  SummaryCard,
} from '../components/apiKeys'

type LoadState = 'idle' | 'loading' | 'error'

export default function ApiKeys() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const userId = user?.id

  const [keys, setKeys] = useState<ApiKey[]>([])
  const [state, setState] = useState<LoadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [summary, setSummary] = useState<UsageSummary | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(
    null,
  )
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null)
  const [statsKeyId, setStatsKeyId] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const loadKeys = async (requestId: number) => {
    setState('loading')
    setErrorMessage(null)
    try {
      const [keysData, summaryData] = await Promise.all([
        fetchApiKeys(),
        fetchUsageSummary(),
      ])
      if (requestId !== requestIdRef.current) return
      setKeys(keysData)
      setSummary(summaryData)
      setState('idle')
    } catch (e) {
      if (requestId !== requestIdRef.current) return
      setState('error')
      setErrorMessage(
        e instanceof Error ? e.message : 'Failed to load API keys',
      )
    }
  }

  useEffect(() => {
    if (!userId) return
    const requestId = ++requestIdRef.current
    void loadKeys(requestId)
  }, [userId])

  const handleCreated = (result: CreateApiKeyResponse) => {
    setShowCreateModal(false)
    setCreatedKey(result)
    showToast('API key created successfully', 'success')
    const requestId = ++requestIdRef.current
    void loadKeys(requestId)
  }

  const handleRevoke = async () => {
    if (!revokeTarget) return
    try {
      await revokeApiKey(revokeTarget.id)
      showToast('API key revoked', 'success')
      setRevokeTarget(null)
      const requestId = ++requestIdRef.current
      void loadKeys(requestId)
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : 'Failed to revoke key',
        'error',
      )
      setRevokeTarget(null)
    }
  }

  const isLoading = state === 'loading'

  const formatDate = (value: string | null) => {
    if (!value) return '—'
    const date = new Date(value)
    if (!Number.isFinite(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date)
  }

  // ── Not authenticated ──────────────────────────────────────────────

  if (!userId) {
    return (
      <div className="w-full max-w-7xl mx-auto py-10 sm:py-14 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            API Keys
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your API keys to integrate ChatSVG into your applications.
          </p>
        </div>

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
            Sign in to manage API keys
          </div>
          <div className="text-gray-600 max-w-md mx-auto mb-6">
            Create and manage API keys to access the ChatSVG API
            programmatically.
          </div>
          <Link
            to="/signin"
            className="inline-block px-6 py-2.5 rounded-lg bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-sm font-medium text-white shadow-sm hover:from-wizard-orange/90 hover:to-wizard-orange transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // ── Authenticated ──────────────────────────────────────────────────

  return (
    <div className="w-full max-w-7xl mx-auto py-10 sm:py-14 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          API Keys
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create and manage API keys to integrate ChatSVG into your
          applications.
        </p>
      </div>

      {/* Usage Summary Cards */}
      {summary ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <SummaryCard
            label="Total requests"
            value={summary.totalRequests.toLocaleString()}
          />
          <SummaryCard
            label="Success rate"
            value={`${summary.successRate.toFixed(1)}%`}
          />
          <SummaryCard
            label="Credits used"
            value={summary.totalCreditsUsed.toLocaleString()}
          />
          <SummaryCard
            label="Avg latency"
            value={`${summary.averageLatencyMs}ms`}
          />
        </div>
      ) : null}

      {/* Error */}
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {errorMessage}
        </div>
      ) : null}

      {/* Actions bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Your keys</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-linear-to-r from-wizard-orange to-wizard-orange/90 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-wizard-orange/90 hover:to-wizard-orange transition-all"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create key
        </button>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5"
            >
              <div className="flex items-center gap-4">
                <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
                <div className="ml-auto h-4 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="mt-3 flex gap-4">
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Keys list */}
      {!isLoading && keys.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Key prefix
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Environment
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Scopes
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Usage
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Last used
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Created
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-gray-900">
                      {key.name}
                    </div>
                    {key.description ? (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {key.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <code className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {key.keyPrefix}
                    </code>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                        key.environment === 'production'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}
                    >
                      {key.environment}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {key.scopes.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-gray-600">
                    {key.usageCount.toLocaleString()}{' '}
                    {key.usageCount === 1 ? 'request' : 'requests'}
                  </td>
                  <td className="px-4 py-3 align-top text-gray-600">
                    {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
                  </td>
                  <td className="px-4 py-3 align-top text-gray-600">
                    {formatDate(key.createdAt)}
                    {key.expiresAt ? (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Expires {formatDate(key.expiresAt)}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-start gap-2">
                      <button
                        onClick={() => setStatsKeyId(key.id)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        View stats
                      </button>
                      <button
                        onClick={() => setRevokeTarget(key)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Empty state */}
      {!isLoading && userId && keys.length === 0 && !errorMessage ? (
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">
            No API keys yet
          </div>
          <div className="text-gray-600 max-w-md mx-auto mb-6">
            Create your first API key to start integrating ChatSVG into your
            applications.
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-sm font-medium text-white shadow-sm hover:from-wizard-orange/90 hover:to-wizard-orange transition-all"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create your first key
          </button>
        </div>
      ) : null}

      {/* Modals */}
      {showCreateModal ? (
        <CreateKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      ) : null}

      {createdKey ? (
        <RevealKeyModal
          result={createdKey}
          onClose={() => setCreatedKey(null)}
        />
      ) : null}

      {revokeTarget ? (
        <RevokeConfirmModal
          keyName={revokeTarget.name}
          onConfirm={handleRevoke}
          onClose={() => setRevokeTarget(null)}
        />
      ) : null}

      {statsKeyId ? (
        <KeyStatsPopover
          keyId={statsKeyId}
          onClose={() => setStatsKeyId(null)}
        />
      ) : null}
    </div>
  )
}
