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
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="rounded-3xl bg-linear-to-r from-wizard-blue/15 to-wizard-gold/10 backdrop-blur-sm border border-gray-200/50 p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-gray-700 mt-2 max-w-2xl">{description}</p>
        <p className="text-xs text-gray-500 mt-3">
          We include helpful context (page URL + browser) to speed things up.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-gray-200/60 bg-white/60 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200/50 bg-white/40">
          <div className="text-sm font-semibold text-gray-900">Topic</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TYPES.map((t) => {
              const active = type === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleSelectType(t.value)}
                  className={cn(
                    'text-left rounded-2xl border px-4 py-3 transition-colors',
                    active
                      ? 'border-wizard-orange/40 bg-wizard-orange/10'
                      : 'border-gray-200/60 bg-white/40 hover:bg-white/60',
                  )}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {t.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t.hint}</div>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4">
            {!isAuthenticated ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Your email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wizard-orange/30"
                />
                <div className="mt-1.5 text-xs text-gray-500">
                  We’ll use this to reply.
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200/60 bg-white/50 px-4 py-3">
                <div className="text-xs text-gray-500">Signed in as</div>
                <div className="text-sm font-semibold text-gray-900 mt-0.5">
                  {user?.email || user?.name}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-gray-900"
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
                className="mt-2 w-full rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wizard-orange/30"
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
                rows={7}
                className="mt-2 w-full rounded-2xl border border-gray-200/70 bg-white/70 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wizard-orange/30 resize-none"
              />
              <div className="mt-1.5 text-xs text-gray-500">
                Please don’t include passwords, API keys, or payment details.
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-5 py-2.5 rounded-2xl text-sm font-semibold transition-colors',
                  isSubmitting
                    ? 'bg-white/40 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800',
                )}
              >
                {isSubmitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
