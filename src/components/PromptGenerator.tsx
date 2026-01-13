import { useState, type FormEvent, useRef, useEffect } from 'react'
import type { PromptFormData } from '../types/svg'
import { Pencil } from './icons/PencilIcon'
import { SVG_STYLES } from '../constants/svgStyles'
import { AI_MODELS } from '../constants/models'
import Dropdown from './ui/Dropdown'
import PrivacySwitch from './ui/PrivacySwitch'
import SvgResultModal from './modal/SvgResultModal'
import Modal from './modal/Modal'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { usePromptDraft } from './promptGenerator/usePromptDraft'
import { useSvgGeneration } from './promptGenerator/useSvgGeneration'

const SESSION_KEY = 'svg_prompt_draft'

export default function PromptGenerator() {
  const { user, updateUserCredits } = useAuth()

  const generation = useSvgGeneration({ updateUserCredits })

  const [formData, setFormData] = usePromptDraft<PromptFormData>(SESSION_KEY, {
    prompt: '',
    style: 'minimal',
    isPrivate: false,
    model: 'gpt-4o',
  })

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState<boolean>(false)
  const idempotencyKeyRef = useRef<string | null>(null)
  const resumeAttemptedRef = useRef(false)
  const { isGenerating, handleExistingJob } = generation

  useEffect(() => {
    idempotencyKeyRef.current = null
  }, [formData.prompt, formData.style, formData.model, formData.isPrivate])

  useEffect(() => {
    // If user logs out and back in, allow another resume attempt
    resumeAttemptedRef.current = false
  }, [user?.id])

  useEffect(() => {
    if (!user) return
    if (resumeAttemptedRef.current) return
    if (isGenerating) return

    const existingJobId = sessionStorage.getItem('active_svg_job_id')
    if (!existingJobId) return

    resumeAttemptedRef.current = true
    void handleExistingJob(existingJobId)
  }, [user, isGenerating, handleExistingJob])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)

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

    try {
      if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = crypto.randomUUID()
      }

      await generation.startGeneration({
        formData,
        idempotencyKey: idempotencyKeyRef.current,
      })
      idempotencyKeyRef.current = null
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
        setError('You do not have enough credits to generate an SVG.')
      } else {
        setError(
          'Unable to generate SVG. Please ensure your description uses valid characters and try again.'
        )
      }

      triggerShake()
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  useEffect(() => {
    /// TODO: check if i still need this ?!
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
    generation.closeModal()
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)]  border-rgba(255, 255, 255, 0.08) rounded-2xl sm:rounded-3xl shadow-xl p-4">
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
              className="w-full bg-transparent text-white placeholder-white rounded-xl p-3 sm:p-4 pr-4 sm:pr-6 pb-23 sm:pb-16 resize-none focus:outline-none text-sm sm:text-base"
            />

            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 gap-1.5 sm:gap-3 max-[420px]:flex-wrap max-[420px]:items-stretch max-[420px]:gap-2"
              ref={dropdownRef}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 z-50 flex-1 min-w-0 max-[420px]:w-full max-[420px]:flex-none">
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

              <button
                type="submit"
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-black bg-white/90 rounded-3xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                  shake ? 'animate-shake' : ''
                } max-[420px]:w-full max-[420px]:basis-full`}
                disabled={generation.isGenerating || !formData.prompt.trim()}
                aria-label={
                  generation.isGenerating ? 'Generating...' : 'Generate'
                }
              >
                <Pencil size="20" className="text-black" />
                <span className="hidden sm:inline max-[420px]:inline">
                  {generation.isGenerating ? 'Generating...' : 'Generate'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-3 px-2 animate-fadeIn">{error}</p>
      )}

      {/* SVG Result Modal */}
      <SvgResultModal
        key={generation.modalKey}
        isOpen={generation.isModalOpen}
        onClose={handleModalClose}
        svgCode={generation.generatedSvg}
        generationId={generation.generationId}
        prompt={formData.prompt}
        isGenerating={generation.isModalGenerating}
        progress={generation.progressState}
        error={generation.modalError}
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
