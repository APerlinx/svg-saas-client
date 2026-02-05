export type AdminMetricsResponse = {
  ai: {
    totalJobs: number
    avgPromptTokens: number
    avgCompletionTokens: number
    totalTokens: number
    avgLatencyMs: number
    p95LatencyMs: number
    repairRate: string
    totalCostUSD: string
    avgCostPerJobUSD: string
  }
  jobs: {
    total: number
    succeeded: number
    failed: number
    queued: number
    running: number
    queueDepth: number
    successRate: string
    avgDurationMs: number
  }
  users: {
    activeUsers30d: number
    totalGenerations30d: number
    topGenerators: Array<{
      userId: string
      jobCount: number
    }>
  }
}

export type AdminRequestAccessResponse = {
  message: string
}

export type AdminLogoutResponse = {
  message: string
}
