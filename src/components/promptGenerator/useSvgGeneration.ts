import { useRef, useState } from 'react'
import {
  generateSvg,
  type GenerationProgressUpdate,
} from '../../services/svgService'
import {
  buildProgressState,
  DEFAULT_PROGRESS,
  type ProgressState,
} from './progress'
import type { PromptFormData } from '../../types/svg'

interface UseSvgGenerationOptions {
  updateUserCredits: (credits: number) => void
}

interface StartGenerationArgs {
  formData: PromptFormData
  idempotencyKey: string
}

export function useSvgGeneration({
  updateUserCredits,
}: UseSvgGenerationOptions) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatedSvg, setGeneratedSvg] = useState('')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressState, setProgressState] =
    useState<ProgressState>(DEFAULT_PROGRESS)
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalKey, setModalKey] = useState<string>('svg-result')

  const generationAttemptRef = useRef<string | null>(null)
  const activeJobIdRef = useRef<string | null>(null)

  const handleProgressUpdate = (
    update: GenerationProgressUpdate,
    attemptId: string
  ) => {
    if (generationAttemptRef.current !== attemptId) return

    if (!activeJobIdRef.current) {
      activeJobIdRef.current = update.job.id
    }

    if (activeJobIdRef.current !== update.job.id) return

    setProgressState(
      buildProgressState(
        update.job.status,
        update.queue,
        update.duplicate,
        update.progress
      )
    )
  }

  const startGeneration = async ({
    formData,
    idempotencyKey,
  }: StartGenerationArgs) => {
    const attemptId = crypto.randomUUID()
    setModalKey(attemptId)
    generationAttemptRef.current = attemptId
    activeJobIdRef.current = null

    setGeneratedSvg('')
    setGenerationId(null)
    setProgressState(DEFAULT_PROGRESS)
    setModalError(null)
    setIsModalOpen(true)
    setIsGenerating(true)

    try {
      const result = await generateSvg(
        {
          prompt: formData.prompt,
          style: formData.style,
          privacy: formData.isPrivate,
          model: formData.model,
          idempotencyKey,
        },
        {
          onStatusUpdate: (update) => handleProgressUpdate(update, attemptId),
        }
      )

      if (generationAttemptRef.current !== attemptId) return

      if (!result.job.generation?.svg) {
        throw new Error('Generation completed but no SVG was returned.')
      }

      setProgressState(
        buildProgressState(result.job.status, result.queue, result.duplicate)
      )
      setGeneratedSvg(result.job.generation.svg)
      setGenerationId(result.job.generation.id)
      if (result.credits !== undefined) {
        updateUserCredits(result.credits)
      }

      setIsModalOpen(true)
    } catch (err) {
      if (generationAttemptRef.current !== attemptId) return

      let errorMessage =
        'Unable to generate SVG. Please ensure your description uses valid characters and try again.'

      if (err && typeof err === 'object' && 'message' in err) {
        const message = (err as Error).message
        if (message?.trim()) {
          errorMessage = message
        }
      }

      setModalError(errorMessage)
      setProgressState({
        status: 'FAILED',
        percent: 100,
        label: 'Generation failed',
        subtext: errorMessage,
      })

      throw new Error(errorMessage)
    } finally {
      if (generationAttemptRef.current === attemptId) {
        setIsGenerating(false)
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalError(null)
  }

  const isModalGenerating =
    !modalError && (!generatedSvg || isGenerating) && isModalOpen

  return {
    isModalOpen,
    setIsModalOpen,
    closeModal,
    isGenerating,
    isModalGenerating,
    generatedSvg,
    generationId,
    progressState,
    modalError,
    modalKey,
    startGeneration,
  }
}
