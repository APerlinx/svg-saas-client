import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import {
  submitSupportMessage,
  type SupportMessageType,
} from '../services/supportService'

type LocationState = {
  from?: string
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

const TYPES: Array<{ value: SupportMessageType; label: string; hint: string }> =
  [
    {
      value: 'contact',
      label: 'Contact',
      hint: 'Questions, billing, or general help',
    },
    {
      value: 'bug',
      label: 'Bug report',
      hint: "Tell us what's broken or confusing",
    },
    {
      value: 'idea',
      label: 'Suggestion',
      hint: 'Share a feature request or improvement',
    },
  ]

function defaultSubject(type: SupportMessageType) {
  if (type === 'bug') return 'Bug report'
  if (type === 'idea') return 'Feature suggestion'
  return 'Support request'
}

function coerceType(value: string | null): SupportMessageType {
  if (value === 'bug' || value === 'idea' || value === 'contact') return value
  return 'contact'
}

function getUserAgentString() {
  if (typeof navigator === 'undefined') return 'unknown'
  return navigator.userAgent || 'unknown'
}

export default function Contact() {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const state = (location.state || {}) as LocationState

  const selectedType = useMemo(() => {
    return coerceType(searchParams.get('type'))
  }, [searchParams])

  const [type, setType] = useState<SupportMessageType>(selectedType)
  const [subject, setSubject] = useState<string>(defaultSubject(selectedType))
  const [subjectTouched, setSubjectTouched] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setType(selectedType)
    if (!subjectTouched) {
      setSubject(defaultSubject(selectedType))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType])

  const contextUrl = useMemo(() => {
    if (state.from) {
      try {
        return new URL(state.from, window.location.origin).toString()
      } catch {
        return state.from
      }
    }
    return window.location.href
  }, [state.from])

  const title = useMemo(() => {
    if (type === 'bug') return 'Report a bug'
    if (type === 'idea') return 'Suggest an idea'
    return 'Contact'
  }, [type])

  const description = useMemo(() => {
    if (type === 'bug') {
      return 'Share what happened and what you expected. Screenshots help a lot.'
    }
    if (type === 'idea') {
      return 'Tell us what you want to see next and why it matters to you.'
    }
    return 'Reach out for help, questions, or anything else.'
  }, [type])

  const handleSelectType = (next: SupportMessageType) => {
    setType(next)
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)
      nextParams.set('type', next)
      return nextParams
    })

    if (!subjectTouched) {
      setSubject(defaultSubject(next))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (!trimmedSubject) {
      showToast('Please add a short subject.', 'error')
      return
    }

    if (trimmedSubject.length < 3) {
      showToast('Subject is too short.', 'error')
      return
    }

    if (!trimmedMessage) {
      showToast('Please add a message.', 'error')
      return
    }

    if (trimmedMessage.length < 10) {
      showToast(
        'Please add a bit more detail (at least 10 characters).',
        'error',
      )
      return
    }

    const effectiveEmail = isAuthenticated ? user?.email : email.trim()
    if (!effectiveEmail) {
      showToast('Please enter your email so we can reply.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      await submitSupportMessage({
        type,
        subject: trimmedSubject,
        message: trimmedMessage,
        email: isAuthenticated ? undefined : effectiveEmail,
        contextUrl,
        userAgent: getUserAgentString(),
      })

      showToast('Thanks — we received your message.', 'success')

      setMessage('')
      if (!subjectTouched) {
        setSubject(defaultSubject(type))
      }
      if (!isAuthenticated) {
        setEmail('')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send message'
      showToast(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 sm:py-14 px-4">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <div className="text-base font-bold text-gray-900">
              What can we help with?
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TYPES.map((t) => {
              const active = type === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleSelectType(t.value)}
                  className={cn(
                    'text-left rounded-xl border-2 px-4 py-3 transition-all',
                    active
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm',
                  )}
                >
                  <div className="text-sm font-bold text-gray-900">
                    {t.label}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{t.hint}</div>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-5">
            {!isAuthenticated ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
                <div className="mt-2 text-xs text-gray-500">
                  We'll use this to reply to you.
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Signed in as
                </div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  {user?.email || user?.name}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Subject
              </label>
              <input
                id="subject"
                value={subject}
                onChange={(e) => {
                  setSubjectTouched(true)
                  setSubject(e.target.value)
                }}
                placeholder="A short summary"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-gray-900"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === 'bug'
                    ? 'What happened? What did you expect? Steps to reproduce…'
                    : type === 'idea'
                      ? 'What should we build and why?'
                      : 'How can we help?'
                }
                rows={8}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Info box */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-xs text-blue-800">
                  <div className="font-semibold mb-1">Helpful tips:</div>
                  <div>
                    • We automatically include your page URL and browser info to
                    help us assist you faster.
                  </div>
                  <div className="mt-1">
                    • Please don't include passwords, API keys, or payment
                    details in your message.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-sm',
                  isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-md',
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Message
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
