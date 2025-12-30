import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios'
import { getCsrfToken } from '../utils/csrf'

export function attachCsrfInterceptor(api: AxiosInstance) {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const method = (config.method || 'get').toUpperCase()
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (needsCsrf) {
      const token = getCsrfToken()
      if (token) config.headers.set('X-CSRF-Token', token)
    }

    return config
  })
}
