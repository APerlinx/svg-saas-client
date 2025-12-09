import axios, { AxiosError } from 'axios'
import { attachCsrfInterceptor } from '../services/csrfInterceptor'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})
attachCsrfInterceptor(api)

interface ApiError {
  message: string
}

interface GenerateSvgResponse {
  svgCode: string
}

function normalizeError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiError>
    const msg =
      err.response?.data?.message ||
      err.response?.statusText ||
      'Unexpected server error'
    throw new Error(msg)
  }
  throw error as Error
}

export async function generateSvg({
  prompt,
  style,
  privacy,
  model,
}: {
  prompt: string
  style: string
  privacy: boolean
  model: string
}): Promise<GenerateSvgResponse> {
  try {
    console.log(
      'Generating SVG with prompt:',
      prompt,
      'style:',
      style,
      'privacy:',
      privacy,
      'model:',
      model
    )
    const response = await api.post<GenerateSvgResponse>('/svg/generate-svg', {
      prompt,
      style,
      privacy,
      model,
    })
    console.log('SVG generated successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error generating SVG:', error)
    normalizeError(error)
  }
}
