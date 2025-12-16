import * as Sentry from '@sentry/react'

const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

interface LogContext {
  [key: string]: unknown
}

/**
 * Logger service for development and production error tracking
 *
 * In development: logs to console
 * In production: sends errors to Sentry for monitoring
 */
export const logger = {
  /**
   * Log error messages
   * In prod: sends to Sentry
   * In dev: logs to console.error
   */
  error: (message: string, error?: unknown, context?: LogContext) => {
    if (isProd) {
      Sentry.captureException(error || new Error(message), {
        extra: { ...context, customMessage: message },
      })
    } else {
      console.error(`[ERROR] ${message}`, error, context)
    }
  },

  /**
   * Log warning messages
   * In prod: sends to Sentry as warning level
   * In dev: logs to console.warn
   */
  warn: (message: string, context?: LogContext) => {
    if (isProd) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
      })
    } else {
      console.warn(`[WARN] ${message}`, context)
    }
  },

  /**
   * Log info messages (dev only)
   * Does not log in production
   */
  info: (message: string, context?: LogContext) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, context)
    }
  },

  /**
   * Log debug messages (dev only)
   * Does not log in production
   */
  debug: (message: string, context?: LogContext) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, context)
    }
  },
}

/**
 * Initialize Sentry error tracking
 * Call this once at app startup
 */
export function initSentry() {
  if (!isProd) {
    logger.info('Sentry disabled in development')
    return
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    console.warn('VITE_SENTRY_DSN not set - Sentry tracking disabled')
    return
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions

    // Session replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Environment and release info
    environment: import.meta.env.MODE,

    // Filter out non-error events in production
    beforeSend(event, hint) {
      // Don't send if it's a network error that user can't control
      const error = hint.originalException
      if (error instanceof Error && error.message.includes('NetworkError')) {
        return null
      }
      return event
    },
  })

  logger.info('Sentry initialized successfully')
}
