import { useState, type FormEvent } from 'react'
import type { SvgStyle, PromptFormData } from '../types/svg'

const styleOptions: { value: SvgStyle; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
  { value: 'flat', label: 'Flat Design' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'line-art', label: 'Line Art' },
  { value: '3d', label: '3D Style' },
]

export default function PromptGenerator() {
  const [formData, setFormData] = useState<PromptFormData>({
    prompt: '',
    style: 'minimal',
  })

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    // TODO: Connect to backend
    console.log('Generating SVG with:', formData)

    // Backend integration will go here
    // const response = await axios.post('/api/generate', formData)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label
              htmlFor="prompt"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              Describe Your SVG
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter your prompt here... (e.g., 'A minimalist mountain landscape at sunset')"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label
              htmlFor="style"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose Style
            </label>
            <select
              id="style"
              value={formData.style}
              onChange={(e) =>
                setFormData({ ...formData, style: e.target.value as SvgStyle })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            >
              {styleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button type="submit" className="py-4 px-6 border">
            Generate SVG
          </button>
        </form>
      </div>
    </div>
  )
}
