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
      <div className="min-h-screen bg-linear-to-br from-wizard-purple via-wizard-blue-dark to-wizard-purple-dark flex items-center justify-center p-4">
        <div className="text-white text-lg">Checking authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-wizard-purple via-wizard-blue-dark to-wizard-purple-dark flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 max-w-md w-full border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Admin Access
          </h1>
          <p className="text-white/70 text-sm mb-8 text-center">
            Enter your admin email to receive a magic link
          </p>

          <form onSubmit={handleRequestAccess} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/90 mb-2"
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-wizard-orange focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-wizard-orange hover:bg-wizard-orange-dark text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Request Access'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-100 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-100 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-wizard-purple via-wizard-blue-dark to-wizard-purple-dark p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-xl transition-all border border-white/20 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-xl transition-all shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-100">
            {error}
          </div>
        )}

        {metrics && (
          <div className="space-y-6">
            {/* AI Metrics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">
                        Metric
                      </th>
                      <th className="text-right py-3 px-4 text-white/80 font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Total Jobs</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.totalJobs.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Avg Prompt Tokens</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.avgPromptTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Avg Completion Tokens</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.avgCompletionTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Total Tokens</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.totalTokens.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Avg Latency</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.avgLatencyMs.toLocaleString()}ms
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">P95 Latency</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.p95LatencyMs.toLocaleString()}ms
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Repair Rate</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.ai.repairRate}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 bg-wizard-orange/10">
                      <td className="py-3 px-4 font-semibold">Total Cost</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-wizard-orange">
                        {metrics.ai.totalCostUSD}
                      </td>
                    </tr>
                    <tr className="bg-wizard-orange/10">
                      <td className="py-3 px-4 font-semibold">
                        Avg Cost Per Job
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-wizard-orange">
                        {metrics.ai.avgCostPerJobUSD}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Job Status */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span> Job Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-500/20 rounded-2xl p-4 border border-green-500/30">
                  <div className="text-green-100 text-sm mb-1">Succeeded</div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.jobs.succeeded.toLocaleString()}
                  </div>
                </div>
                <div className="bg-red-500/20 rounded-2xl p-4 border border-red-500/30">
                  <div className="text-red-100 text-sm mb-1">Failed</div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.jobs.failed.toLocaleString()}
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-2xl p-4 border border-yellow-500/30">
                  <div className="text-yellow-100 text-sm mb-1">Queued</div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.jobs.queued.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-500/20 rounded-2xl p-4 border border-blue-500/30">
                  <div className="text-blue-100 text-sm mb-1">Running</div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.jobs.running.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="text-white">
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Total Jobs</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.jobs.total.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Queue Depth</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {metrics.jobs.queueDepth.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-3 px-4">Success Rate</td>
                      <td className="py-3 px-4 text-right font-mono text-green-400">
                        {metrics.jobs.successRate}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Avg Duration</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {(metrics.jobs.avgDurationMs / 1000).toFixed(2)}s
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span> User Activity (Last 30
                Days)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-wizard-blue/20 rounded-2xl p-4 border border-wizard-blue/30">
                  <div className="text-white/80 text-sm mb-1">Active Users</div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.users.activeUsers30d.toLocaleString()}
                  </div>
                </div>
                <div className="bg-wizard-orange/20 rounded-2xl p-4 border border-wizard-orange/30">
                  <div className="text-white/80 text-sm mb-1">
                    Total Generations
                  </div>
                  <div className="text-white text-3xl font-bold">
                    {metrics.users.totalGenerations30d.toLocaleString()}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">
                Top Generators
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">
                        Rank
                      </th>
                      <th className="text-left py-3 px-4 text-white/80 font-semibold">
                        User ID
                      </th>
                      <th className="text-right py-3 px-4 text-white/80 font-semibold">
                        Generations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {metrics.users.topGenerators.map((user, idx) => (
                      <tr
                        key={user.userId}
                        className="border-b border-white/10"
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                              idx === 0
                                ? 'bg-yellow-500/30 text-yellow-200'
                                : idx === 1
                                  ? 'bg-gray-400/30 text-gray-200'
                                  : idx === 2
                                    ? 'bg-orange-600/30 text-orange-200'
                                    : 'bg-white/10'
                            }`}
                          >
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          {user.userId}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
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
