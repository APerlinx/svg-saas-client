import type {
  GenerationProgressUpdate,
  QueueStats,
} from '../../services/svgService'

export type JobStatus = GenerationProgressUpdate['job']['status']

export interface ProgressState {
  status: JobStatus
  percent: number
  label: string
  subtext?: string
}

const PROGRESS_COPY: Record<
  JobStatus,
  {
    percent: number
    label: string
    subtext: (ctx: { queue?: QueueStats; duplicate?: boolean }) => string
  }
> = {
  QUEUED: {
    percent: 18,
    label: 'Queued for generation',
    subtext: ({ queue }) =>
      queue && queue.waiting > 0
        ? `~${queue.waiting} request${
            queue.waiting > 1 ? 's' : ''
          } ahead of you`
        : 'Securing a rendering slot... hold tight.',
  },
  RUNNING: {
    percent: 62,
    label: 'Illustrating vector shapes',
    subtext: () => 'Our model is sketching curves, gradients, and strokes.',
  },
  SUCCEEDED: {
    percent: 100,
    label: 'Applying finishing touches',
    subtext: ({ duplicate }) =>
      duplicate
        ? 'We found an identical SVG in your recent history.'
        : 'Optimizing paths and preparing your download options.',
  },
  FAILED: {
    percent: 100,
    label: 'Generation failed',
    subtext: () => 'Something went wrong. Please try again shortly.',
  },
}

export const DEFAULT_PROGRESS: ProgressState = {
  status: 'QUEUED',
  percent: 12,
  label: 'Preparing your request',
  subtext: 'Connecting to our rendering studio...',
}

export const buildProgressState = (
  status: JobStatus,
  queue?: QueueStats,
  duplicate?: boolean,
  progress?: number
): ProgressState => {
  const config = PROGRESS_COPY[status] ?? PROGRESS_COPY.QUEUED
  const normalizedProgress =
    typeof progress === 'number' && Number.isFinite(progress)
      ? Math.min(Math.max(Math.round(progress), 0), 100)
      : undefined

  const percent =
    status === 'SUCCEEDED' || status === 'FAILED'
      ? 100
      : normalizedProgress ?? config.percent

  return {
    status,
    percent,
    label: config.label,
    subtext: config.subtext({ queue, duplicate }),
  }
}
