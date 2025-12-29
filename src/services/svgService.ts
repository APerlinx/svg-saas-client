import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'
import { logger } from './logger'

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
}

interface GenerateSvgParams {
  prompt: string
  style: string
  privacy: boolean
  model: string
  idempotencyKey: string
}

interface GenerateSvgOptions {
  onStatusUpdate?: (update: GenerationProgressUpdate) => void
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

    const { job, duplicate, queue, credits } = response.data

    options?.onStatusUpdate?.({ job, duplicate, queue })

    if (duplicate && (job.status === 'SUCCEEDED' || job.status === 'FAILED')) {
      logger.debug('Returning completed duplicate job', { jobId: job.id })
      return response.data
    }

    // Poll for completion
    return await pollJobCompletion(
      job.id,
      { duplicate, queue, credits },
      options?.onStatusUpdate
    )
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

async function pollJobCompletion(
  jobId: string,
  metadata: { duplicate?: boolean; queue?: QueueStats; credits?: number },
  onStatusUpdate?: (update: GenerationProgressUpdate) => void
): Promise<GenerateSvgResponse> {
  const MAX_POLL_TIME = 60_000
  const startTime = Date.now()
  let pollDelay = 2_000
  const MAX_DELAY = 10_000
  let consecutiveErrors = 0
  const MAX_CONSECUTIVE_ERRORS = 3

  return new Promise<GenerateSvgResponse>((resolve, reject) => {
    const poll = async () => {
      // Timeout check
      if (Date.now() - startTime > MAX_POLL_TIME) {
        reject(new Error('SVG generation timed out after 60 seconds'))
        return
      }

      try {
        const pollResponse = await api.get<{ job: Job; credits?: number }>(
          `/svg/generation-jobs/${jobId}`
        )
        const { job, credits: latestCredits } = pollResponse.data

        if (latestCredits !== undefined) {
          metadata.credits = latestCredits
        }

        logger.debug('Polling job status', { status: job.status, jobId })
        onStatusUpdate?.({
          job,
          duplicate: metadata.duplicate,
          queue: metadata.queue,
        })

        if (job.status === 'SUCCEEDED') {
          resolve({ job, ...metadata })
        } else if (job.status === 'FAILED') {
          reject(new Error(job.errorMessage || 'SVG generation failed'))
        } else {
          // Still QUEUED/RUNNING → poll again with backoff
          consecutiveErrors = 0
          pollDelay = Math.min(pollDelay * 1.5, MAX_DELAY)
          setTimeout(poll, pollDelay)
        }
      } catch (pollError) {
        consecutiveErrors++

        // Fatal errors → stop immediately
        if (axios.isAxiosError(pollError)) {
          const status = pollError.response?.status
          if (status === 401 || status === 403 || status === 404) {
            reject(pollError)
            return
          }
        }

        // Transient errors → retry
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          reject(new Error('Polling failed after multiple network errors'))
        } else {
          logger.warn('Poll attempt failed, retrying...', {
            attempt: consecutiveErrors,
            jobId,
          })
          setTimeout(poll, Math.min(pollDelay * 0.5, 2_000))
        }
      }
    }

    poll()
  })
}
