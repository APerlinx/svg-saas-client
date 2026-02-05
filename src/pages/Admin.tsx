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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-white/60 text-sm">Checking authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-[#111111] rounded-2xl p-8 sm:p-10 max-w-md w-full border border-white/5">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Admin Access
          </h1>
          <p className="text-white/50 text-sm mb-8">
            Enter your email to receive a magic link
          </p>

          <form onSubmit={handleRequestAccess} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-medium py-2.5 px-6 rounded-lg transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Request Access'}
            </button>
          </form>

          {message && (
            <div className="mt-5 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-[#1a1a1a] hover:bg-[#222222] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all border border-white/10 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#1a1a1a] hover:bg-red-500/20 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all border border-white/10 hover:border-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
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
            <div className="bg-[#111111] rounded-xl p-5 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Job Statistics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">Succeeded</div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.jobs.succeeded.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">Failed</div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.jobs.failed.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">Queued</div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.jobs.queued.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">Running</div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.jobs.running.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="text-white/90">
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Total Jobs</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.jobs.total.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Queue Depth</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
                        {metrics.jobs.queueDepth.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2.5 px-3 text-sm">Success Rate</td>
                      <td className="py-2.5 px-3 text-right font-mono text-sm">
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
            <div className="bg-[#111111] rounded-xl p-5 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">
                User Activity (Last 30 Days)
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">Active Users</div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.users.activeUsers30d.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                  <div className="text-white/50 text-xs mb-1">
                    Total Generations
                  </div>
                  <div className="text-white text-2xl font-semibold">
                    {metrics.users.totalGenerations30d.toLocaleString()}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-medium text-white/70 mb-3">
                Top Generators
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2.5 px-3 text-white/50 font-medium text-sm">
                        Rank
                      </th>
                      <th className="text-left py-2.5 px-3 text-white/50 font-medium text-sm">
                        User ID
                      </th>
                      <th className="text-right py-2.5 px-3 text-white/50 font-medium text-sm">
                        Generations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white/90">
                    {metrics.users.topGenerators.map((user, idx) => (
                      <tr key={user.userId} className="border-b border-white/5">
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#1a1a1a] border border-white/10 font-medium text-xs">
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
