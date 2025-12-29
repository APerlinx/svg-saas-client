import { useState, type FormEvent, useRef, useEffect } from 'react'
import type { PromptFormData } from '../types/svg'
import { Pencil } from './icons/PencilIcon'
import { SVG_STYLES } from '../constants/svgStyles'
import { AI_MODELS } from '../constants/models'
import Dropdown from './ui/Dropdown'
import PrivacySwitch from './ui/PrivacySwitch'
import SvgResultModal from './modal/SvgResultModal'
import Modal from './modal/Modal'
import {
  generateSvg,
  type GenerationProgressUpdate,
  type QueueStats,
} from '../services/svgService'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const SESSION_KEY = 'svg_prompt_draft'

type JobStatus = GenerationProgressUpdate['job']['status']

interface ProgressState {
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

const DEFAULT_PROGRESS: ProgressState = {
  status: 'QUEUED',
  percent: 12,
  label: 'Preparing your request',
  subtext: 'Connecting to our rendering studio...',
}

const buildProgressState = (
  status: JobStatus,
  queue?: QueueStats,
  duplicate?: boolean
): ProgressState => {
  const config = PROGRESS_COPY[status] ?? PROGRESS_COPY.QUEUED
  return {
    status,
    percent: config.percent,
    label: config.label,
    subtext: config.subtext({ queue, duplicate }),
  }
}

export default function PromptGenerator() {
  const { user, updateUserCredits } = useAuth()

  // Load from sessionStorage on mount
  const [formData, setFormData] = useState<PromptFormData>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Invalid JSON, use defaults
      }
    }
    return {
      prompt: '',
      style: 'minimal',
      isPrivate: false,
      model: 'gpt-4o',
    }
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [generatedSvg, setGeneratedSvg] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState<boolean>(false)
  const [progressState, setProgressState] =
    useState<ProgressState>(DEFAULT_PROGRESS)
  const [modalError, setModalError] = useState<string | null>(null)
  const idempotencyKeyRef = useRef<string | null>(null)

  // Save to sessionStorage whenever formData changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    idempotencyKeyRef.current = null
  }, [formData.prompt, formData.style, formData.model, formData.isPrivate])

  const handleProgressUpdate = (update: GenerationProgressUpdate) => {
    setProgressState(
      buildProgressState(update.job.status, update.queue, update.duplicate)
    )
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)
    setModalError(null)

    // Close any open dropdowns
    setOpenDropdown(null)

    // Check if user is authenticated
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    // Validation
    if (!formData.prompt.trim()) {
      setError('Please enter a prompt to generate your SVG')
      triggerShake()
      return
    }

    if (formData.prompt.trim().length < 10) {
      setError(
        'Please provide a more detailed description (at least 10 characters)'
      )
      triggerShake()
      return
    }

    setGeneratedSvg('')
    setProgressState(DEFAULT_PROGRESS)
    setIsModalOpen(true)
    setIsGenerating(true)

    try {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID()
      }

      const result = await generateSvg(
        {
          prompt: formData.prompt,
          style: formData.style,
          privacy: formData.isPrivate,
          model: formData.model,
          idempotencyKey: idempotencyKeyRef.current,
        },
        {
          onStatusUpdate: handleProgressUpdate,
        }
      )

      if (!result.job.generation?.svg) {
        throw new Error('Generation completed but no SVG was returned.')
      }

      setProgressState(
        buildProgressState(result.job.status, result.queue, result.duplicate)
      )
      setGeneratedSvg(result.job.generation.svg)
      idempotencyKeyRef.current = null

      // Update credits immediately if backend returns updated count
      if (result.credits !== undefined) {
        updateUserCredits(result.credits)
      }

      setIsModalOpen(true)
    } catch (err) {
      let errorMessage =
        'Unable to generate SVG. Please ensure your description uses valid characters and try again.'

      if (err && typeof err === 'object' && 'message' in err) {
        const message = (err as Error).message
        if (message?.trim()) {
          errorMessage = message
        }
      }

      if (
        errorMessage.toLowerCase().includes('credit') ||
        errorMessage.toLowerCase().includes('insufficient')
      ) {
        setError(errorMessage)
      } else {
        setError(
          'Unable to generate SVG. Please ensure your description uses valid characters and try again.'
        )
      }

      setModalError(errorMessage)
      setProgressState({
        status: 'FAILED',
        percent: 100,
        label: 'Generation failed',
        subtext: errorMessage,
      })
      triggerShake()
    } finally {
      setIsGenerating(false)
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedStyleLabel =
    SVG_STYLES.find((opt) => opt.value === formData.style)?.label || 'Style'
  const selectedModel = AI_MODELS.find((opt) => opt.value === formData.model)
  const selectedModelLabel = selectedModel?.label || 'Model'
  const selectedModelIcon = selectedModel?.icon

  const handleDropdownChange = (field: keyof PromptFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
    setOpenDropdown(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setModalError(null)
    if (!isGenerating) {
      idempotencyKeyRef.current = null
    }
  }

  const isModalGenerating =
    !modalError && (!generatedSvg || isGenerating) && isModalOpen

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)]  border-rgba(255, 255, 255, 0.08) rounded-2xl sm:rounded-3xl shadow-xl p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="p-1 sm:p-1.5">
          <div className="relative bg-[rgb(17_17_17/55%)] rounded-2xl sm:rounded-3xl">
            <label htmlFor="prompt" className="sr-only">
              Prompt
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Choose a style and describe what you want to generate..."
              rows={5}
              className="w-full bg-transparent text-white placeholder-white rounded-xl p-3 sm:p-4 pr-4 sm:pr-6 pb-32 sm:pb-16 resize-none focus:outline-none text-sm sm:text-base"
            />

            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 gap-1.5 sm:gap-3"
              ref={dropdownRef}
            >
              {/* Controls - Stay in one row, shrink on mobile */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <label htmlFor="style" className="sr-only">
                  Style
                </label>
                <Dropdown
                  name="style"
                  label={selectedStyleLabel}
                  options={SVG_STYLES}
                  field="style"
                  isOpen={openDropdown === 'style'}
                  selectedValue={formData.style}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'style' ? null : 'style')
                  }
                  onChange={handleDropdownChange}
                />
                <label htmlFor="model" className="sr-only">
                  Model
                </label>
                <Dropdown
                  name="model"
                  label={selectedModelLabel}
                  options={AI_MODELS}
                  field="model"
                  isOpen={openDropdown === 'model'}
                  selectedValue={formData.model}
                  selectedIcon={selectedModelIcon}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === 'model' ? null : 'model')
                  }
                  onChange={handleDropdownChange}
                />

                <PrivacySwitch
                  isPrivate={formData.isPrivate}
                  onChange={(checked) =>
                    setFormData({ ...formData, isPrivate: checked })
                  }
                />
              </div>

              {/* Generate Button - Icon only on mobile, text on desktop */}
              <button
                type="submit"
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-black bg-white/90 rounded-3xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                  shake ? 'animate-shake' : ''
                }`}
                disabled={isGenerating || !formData.prompt.trim()}
                aria-label={isGenerating ? 'Generating...' : 'Generate'}
              >
                <Pencil size="20" className="text-black" />
                <span className="hidden sm:inline">
                  {isGenerating ? 'Generating...' : 'Generate'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error message outside both boxes */}
      {error && (
        <p className="text-red-400 text-sm mt-3 px-2 animate-fadeIn">
          ⚠️ {error}
        </p>
      )}

      {/* SVG Result Modal */}
      <SvgResultModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        svgCode={generatedSvg}
        prompt={formData.prompt}
        isGenerating={isModalGenerating}
        progress={progressState}
        error={modalError}
      />

      {/* Auth Required Modal */}
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="text-center py-8" data-testid="signin-required-modal">
          <div className="w-16 h-16 mx-auto mb-6 bg-wizard-orange/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-wizard-orange"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">
            Sign In Required
          </h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            To generate custom SVGs, you need to be signed in. Create a free
            account to get started!
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="px-6 py-3 bg-wizard-orange text-white font-semibold rounded-lg hover:bg-wizard-orange/90 transition-all shadow-lg"
            >
              Create Account
            </Link>
            <Link
              to="/signin"
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}
