import { useState, type FormEvent, useRef, useEffect } from 'react'
import type { PromptFormData } from '../types/svg'
import { Pencil } from './icons/PencilIcon'
import { SVG_STYLES } from '../constants/svgStyles'
import { AI_MODELS } from '../constants/models'
import Dropdown from './ui/Dropdown'
import PrivacySwitch from './ui/PrivacySwitch'
import SvgResultModal from './modal/SvgResultModal'
import Modal from './modal/Modal'
import { generateSvg } from '../services/svgService'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const SESSION_KEY = 'svg_prompt_draft'

export default function PromptGenerator() {
  const { user } = useAuth()

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
      model: 'gpt-5-mini',
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

  // Save to sessionStorage whenever formData changes
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(formData))
  }, [formData])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setError(null)

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

    setIsGenerating(true)

    try {
      const result = await generateSvg({
        prompt: formData.prompt,
        style: formData.style,
        privacy: formData.isPrivate,
        model: formData.model,
      })
      setGeneratedSvg(result.svgCode)
      setIsModalOpen(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        'Unable to generate SVG. Please ensure your description uses valid characters and try again.'
      )
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[linear-gradient(180deg,rgb(0_0_0/4%)_0%,rgb(0_0_0/20%)_100%)] backdrop-blur-xl border-rgba(255, 255, 255, 0.08) rounded-3xl shadow-xl p-4">
        <form onSubmit={handleSubmit} className="p-1.5">
          <div className="relative bg-[rgb(17_17_17/55%)] rounded-3xl">
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Choose a style and describe what you want to generate..."
              rows={5}
              required
              className="w-full bg-transparent text-white placeholder-white rounded-xl p-4 pr-6 pb-16 resize-none focus:outline-none "
            />

            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3"
              ref={dropdownRef}
            >
              {/* Left Controls */}
              <div className="flex items-center gap-2 flex-wrap">
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

              {/* Right Controls */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white/90 rounded-3xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    shake ? 'animate-shake' : ''
                  }`}
                  disabled={isGenerating || !formData.prompt.trim()}
                >
                  <Pencil size="20" className="text-black" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
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
        onClose={() => setIsModalOpen(false)}
        svgCode={generatedSvg}
        prompt={formData.prompt}
      />

      {/* Auth Required Modal */}
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="text-center py-8">
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
