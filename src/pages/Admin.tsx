import { useEffect, useState } from 'react'
import {
  requestAdminAccess,
  fetchAdminMetrics,
  logoutAdmin,
} from '../services/adminService'
import type { AdminMetricsResponse } from '../types/admin'

export default function Admin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState<AdminMetricsResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  async function checkAuthentication() {
    try {
      setIsCheckingAuth(true)
      const data = await fetchAdminMetrics()
      setMetrics(data)
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await requestAdminAccess(email)
      setMessage(response.message)
      setEmail('')
    } catch {
      setError('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin()
      setIsAuthenticated(false)
      setMetrics(null)
      setMessage('Logged out successfully')
    } catch {
      setError('Failed to logout')
    }
  }

  async function handleRefresh() {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchAdminMetrics()
      setMetrics(data)
    } catch {
      setError('Failed to refresh metrics')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-gray-500 text-sm">Checking authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium text-blue-700">
              Admin Area
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600 text-sm mb-8">
            Enter your email to receive a secure magic link
          </p>

          <form onSubmit={handleRequestAccess} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? 'Sending...' : 'Request Access'}
            </button>
          </form>

          {message && (
            <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3">
              <svg
                className="w-3.5 h-3.5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-blue-700">
                Admin Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              System Metrics
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-all border border-gray-300 disabled:opacity-50 shadow-sm"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium py-2 px-4 rounded-lg transition-all border border-gray-300 hover:border-red-300 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {metrics && (
          <div className="space-y-5">
            {/* AI Metrics */}
            <div className="bg-[#111111] rounded-xl p-5 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">
                AI Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2.5 px-3 text-white/50 font-medium text-sm">
                        Metric
                      </th>
                      <th className="text-right py-2.5 px-3 text-white/50 font-medium text-sm">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white/90">
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Total Jobs</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.totalJobs.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Avg Prompt Tokens</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.avgPromptTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">
                        Avg Completion Tokens
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.avgCompletionTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Total Tokens</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.totalTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Avg Latency</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.avgLatencyMs.toLocaleString()}ms
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">P95 Latency</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.p95LatencyMs.toLocaleString()}ms
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Repair Rate</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.ai.repairRate}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm font-medium">
                        Total Cost
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm font-medium">
                        {metrics.ai.totalCostUSD}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-sm font-medium">
                        Avg Cost Per Job
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm font-medium">
                        {metrics.ai.avgCostPerJobUSD}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Job Status */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Job Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="text-green-600 text-xs font-medium mb-1">
                    Succeeded
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.jobs.succeeded.toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="text-red-600 text-xs font-medium mb-1">
                    Failed
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.jobs.failed.toLocaleString()}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="text-yellow-600 text-xs font-medium mb-1">
                    Queued
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.jobs.queued.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-blue-600 text-xs font-medium mb-1">
                    Running
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.jobs.running.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="text-gray-900">
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-sm">Total Jobs</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.jobs.total.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-sm">Queue Depth</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.jobs.queueDepth.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 px-3 text-sm">Success Rate</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm text-green-600 font-medium">
                        {metrics.jobs.successRate}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-sm">Avg Duration</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {(metrics.jobs.avgDurationMs / 1000).toFixed(2)}s
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                User Activity (Last 30 Days)
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-purple-600 text-xs font-medium mb-1">
                    Active Users
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.users.activeUsers30d.toLocaleString()}
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <div className="text-indigo-600 text-xs font-medium mb-1">
                    Total Generations
                  </div>
                  <div className="text-gray-900 text-2xl font-semibold">
                    {metrics.users.totalGenerations30d.toLocaleString()}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Top Generators
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 text-gray-600 font-medium text-sm">
                        Rank
                      </th>
                      <th className="text-left py-2.5 px-3 text-gray-600 font-medium text-sm">
                        User ID
                      </th>
                      <th className="text-right py-2.5 px-3 text-gray-600 font-medium text-sm">
                        Generations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {metrics.users.topGenerators.map((user, idx) => (
                      <tr
                        key={user.userId}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 border border-gray-300 font-medium text-xs">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-sm">
                          {user.userId}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-sm font-medium">
                          {user.jobCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
