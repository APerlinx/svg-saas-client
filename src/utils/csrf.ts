/**
 * Get CSRF token from cookie
 * The token is stored in a non-httpOnly cookie so JS can read it
 */
export const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';').map((c) => c.trim().split('='))
  const map = Object.fromEntries(cookies)
  return map['csrf-token'] || null
}

/**
 * Wrapper for fetch that automatically includes CSRF token
 * Use this instead of native fetch for all API calls
 */
export const fetchWithCsrf = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const csrfToken = getCsrfToken()

  const method = options.method?.toUpperCase() || 'GET'
  const needsCsrf = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // JSON convenience: auto-add content type
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  // Add CSRF for unsafe methods
  if (needsCsrf && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })
}
