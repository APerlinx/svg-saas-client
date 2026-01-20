import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { logger } from './logger'
import { connectSocket, waitForSocketConnected } from '../lib/socket'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})
attachCsrfInterceptor(api)

interface ApiError {
  message?: string
  error?: string
}

export interface Job {
  id: string
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED'
  prompt: string
  style: string
  model: string
  privacy: boolean
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
  errorCode: string | null
  errorMessage: string | null
  generationId: string | null
  generation?: {
    id: string
    prompt: string
    style: string
    model: string
    privacy: boolean
    svg: string
    createdAt: string
  } | null
}
interface GenerateSvgResponse {
  job: Job
  duplicate?: boolean
  queue?: QueueStats
  credits?: number
}

export interface QueueStats {
  waiting: number
  delayed: number
  active: number
}

export interface GenerationProgressUpdate {
  job: Job
  duplicate?: boolean
  queue?: QueueStats
  progress?: number
}

interface GenerateSvgParams {
  prompt: string
  style: string
  privacy: boolean
  model: string
  idempotencyKey: string
}

type GenerationJobUpdatePayload = {
  jobId: string
  status: Job['status']
  progress?: number
  generationId?: string | null
  errorCode?: string | null
  errorMessage?: string | null
}

interface GenerateSvgOptions {
  onStatusUpdate?: (update: GenerationProgressUpdate) => void
  timeoutMs?: number
}

interface DownloadSvgResponse {
  downloadUrl?: string
}

function isGenerationJobUpdatePayload(
  value: unknown
): value is GenerationJobUpdatePayload {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.jobId === 'string' &&
    (v.status === 'QUEUED' ||
      v.status === 'RUNNING' ||
      v.status === 'SUCCEEDED' ||
      v.status === 'FAILED')
  )
}

function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new Error(msg)
  }
  throw error as Error
}

export async function generateSvg(
  { prompt, style, privacy, model, idempotencyKey }: GenerateSvgParams,
  options?: GenerateSvgOptions
): Promise<GenerateSvgResponse> {
  try {
    const response = await api.post<GenerateSvgResponse>(
      '/svg/generate-svg',
      { prompt, style, privacy, model },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
      }
    )

    const socket = connectSocket()
    await waitForSocketConnected(socket)
    const { job, duplicate, queue } = response.data
    const jobId = job.id

    sessionStorage.setItem('active_svg_job_id', jobId)

    options?.onStatusUpdate?.({ job, duplicate, queue })

    if (duplicate && (job.status === 'SUCCEEDED' || job.status === 'FAILED')) {
      return response.data
    }

    if (job.status === 'SUCCEEDED' || job.status === 'FAILED') {
      return response.data
    }

    return await new Promise<GenerateSvgResponse>((resolve, reject) => {
      const timeoutMs = options?.timeoutMs ?? 120_000
      let settled = false

      const cleanup = () => {
        socket.off('generation-job:update', onUpdate)
        clearTimeout(timer)
      }

      const finish = (fn: () => void) => {
        if (settled) return
        settled = true
        cleanup()
        fn()
      }

      const timer = setTimeout(() => {
        finish(() => reject(new Error(`Timed out waiting for job ${jobId}`)))
      }, timeoutMs)

      const onUpdate = async (payload: unknown) => {
        if (!isGenerationJobUpdatePayload(payload)) return
        if (payload.jobId !== jobId) return

        const progress =
          typeof payload.progress === 'number' ? payload.progress : undefined

        const updatedJob: Job = {
          ...job,
          status: payload.status,
          generationId: payload.generationId ?? job.generationId,
          errorCode: payload.errorCode ?? job.errorCode,
          errorMessage: payload.errorMessage ?? job.errorMessage,
        }

        options?.onStatusUpdate?.({
          job: updatedJob,
          duplicate,
          queue,
          progress,
        })

        const isTerminal =
          payload.status === 'SUCCEEDED' || payload.status === 'FAILED'

        if (!isTerminal) return

        try {
          const finalRes = await api.get<GenerateSvgResponse>(
            `/svg/generation-jobs/${jobId}`
          )
          finish(() => resolve(finalRes.data))
        } catch (e) {
          finish(() => reject(e))
        }
      }
      socket.on('generation-job:update', onUpdate)
    })
  } catch (error) {
    logger.error('Error generating SVG', error)

    if (axios.isAxiosError(error) && error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after']
      if (retryAfter) {
        const baseMessage = error.response.data?.error || 'Rate limit exceeded'
        throw new Error(`${baseMessage}. Retry after ${retryAfter} seconds.`)
      }
    }

    normalizeError(error)
  }
}

export async function getExistingJob(
  jobId: string
): Promise<GenerateSvgResponse> {
  try {
    const response = await api.get<GenerateSvgResponse>(
      `/svg/generation-jobs/${jobId}`
    )

    if (!response.data.job) throw new Error('Job not found')

    const { job } = response.data

    if (job.status === 'SUCCEEDED' || job.status === 'FAILED') {
      return response.data
    }

    const socket = connectSocket()
    await waitForSocketConnected(socket)

    return await new Promise<GenerateSvgResponse>((resolve, reject) => {
      const socketTimeoutMs = 120_000
      const pollingIntervalMs = 5_000
      const pollingTimeoutMs = 120_000

      let settled = false
      let stopPolling: (() => void) | null = null
      let pollingDeadlineTimer: number | null = null

      const cleanup = () => {
        socket.off('generation-job:update', onUpdate)
        clearTimeout(socketTimer)

        if (stopPolling) {
          stopPolling()
          stopPolling = null
        }

        if (pollingDeadlineTimer !== null) {
          clearTimeout(pollingDeadlineTimer)
          pollingDeadlineTimer = null
        }
      }

      const finish = (fn: () => void) => {
        if (settled) return
        settled = true
        cleanup()
        fn()
      }

      const pollingFallback = () => {
        logger.warn(
          `Socket update timeout for job ${jobId}, falling back to polling`
        )

        const interval = setInterval(async () => {
          try {
            const polledRes = await api.get<GenerateSvgResponse>(
              `/svg/generation-jobs/${jobId}`
            )

            const polledJob = polledRes.data.job
            const isTerminal =
              polledJob.status === 'SUCCEEDED' || polledJob.status === 'FAILED'

            if (isTerminal) {
              finish(() => resolve(polledRes.data))
            }
          } catch (e) {
            logger.error('Error polling for job status', e)
          }
        }, pollingIntervalMs)

        return () => clearInterval(interval)
      }

      const startPollingFallbackIfNeeded = () => {
        if (settled) return
        if (stopPolling) return

        socket.off('generation-job:update', onUpdate)

        stopPolling = pollingFallback()

        pollingDeadlineTimer = window.setTimeout(() => {
          finish(() =>
            reject(
              new Error(
                `Timed out waiting for job ${jobId} (socket + polling fallback)`
              )
            )
          )
        }, pollingTimeoutMs)
      }

      const onUpdate = async (payload: unknown) => {
        if (!isGenerationJobUpdatePayload(payload)) return
        if (payload.jobId !== jobId) return

        const isTerminal =
          payload.status === 'SUCCEEDED' || payload.status === 'FAILED'
        if (!isTerminal) return

        try {
          const finalRes = await api.get<GenerateSvgResponse>(
            `/svg/generation-jobs/${jobId}`
          )
          finish(() => resolve(finalRes.data))
        } catch (e) {
          finish(() => reject(e))
        }
      }

      const socketTimer = window.setTimeout(() => {
        startPollingFallbackIfNeeded()
      }, socketTimeoutMs)

      socket.on('generation-job:update', onUpdate)
    })
  } catch (error) {
    normalizeError(error)
  }
}

export async function downloadSvg(
  generationId: string
): Promise<DownloadSvgResponse> {
  try {
    const response = await api.get<DownloadSvgResponse>(
      `/svg/${generationId}/download`
    )
    return response.data
  } catch (error) {
    normalizeError(error)
  }
}
