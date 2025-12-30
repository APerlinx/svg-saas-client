import type { InternalAxiosRequestConfig, AxiosInstance } from 'axios'
import { getStoredCsrfToken } from '../utils/csrf'
import { bootstrapCsrf } from './csrfService'

let csrfBootstrapPromise: Promise<void> | null = null

function bootstrapCsrfOnce() {
  if (!csrfBootstrapPromise) {
    csrfBootstrapPromise = bootstrapCsrf().catch((err) => {
      csrfBootstrapPromise = null
      throw err
    })
  }
  return csrfBootstrapPromise
}

export function attachCsrfInterceptor(api: AxiosInstance) {
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const method = (config.method || 'get').toUpperCase()
    const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (needsCsrf) {
      if (!getStoredCsrfToken()) await bootstrapCsrfOnce()
      const token = getStoredCsrfToken()
      if (token) config.headers.set('X-CSRF-Token', token)
    }

    return config
  })
}
