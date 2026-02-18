import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import CloseIcon from './icons/CloseIcon'

type Variant = 'guest' | 'low'

function BannerContent({
  variant,
  credits,
}: {
  variant: Variant
  credits?: number
}) {
  if (variant === 'low') {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="text-sm font-semibold text-gray-900">
          Low on credits
        </div>
        <div className="text-xs sm:text-sm text-gray-700">
          You have{' '}
          <span className="inline-flex items-center rounded-full bg-wizard-orange/10 px-2 py-0.5 text-xs font-semibold text-wizard-orange">
            {credits ?? 0} {credits === 1 ? 'credit' : 'credits'}
          </span>{' '}
          left. Top up to keep generating.
        </div>
        <Link
          to="/pricing"
          className="inline-flex items-center justify-center self-start sm:self-end rounded-xl bg-gray-900 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Get more credits
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-lg font-bold text-gray-900">
        🎉 Free During Beta - No Credit Card Required
      </div>
      <div className="text-sm text-gray-700">
        Create unlimited SVGs completely free while we perfect the platform.
        Sign up in seconds with email or Google OAuth.
      </div>
      <div className="flex gap-2 mt-1">
        <Link
          to="/signup"
          className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 transition-colors shadow-sm"
        >
          Get Started Free
        </Link>
        <Link
          to="/signin"
          className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default function CreditReminderBanner() {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('creditReminderDismissed') === '1'
    } catch {
      return false
    }
  })
  const [isVisible, setIsVisible] = useState(false)

  const isDashboard = useMemo(
    () => location.pathname === '/',
    [location.pathname],
  )

  const credits = user?.credits ?? 0
  const shouldShowLowCredits = isAuthenticated && !!user && credits <= 3
  const shouldShowGuest = !isAuthenticated

  const shouldShow = isDashboard && (shouldShowLowCredits || shouldShowGuest)

  useEffect(() => {
    if (!shouldShow || isDismissed) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [shouldShow, isDismissed])

  if (!shouldShow || isDismissed || !isVisible) return null

  const variant: Variant = shouldShowLowCredits ? 'low' : 'guest'

  const handleDismiss = () => {
    sessionStorage.setItem('creditReminderDismissed', '1')
    setIsDismissed(true)
  }

  return (
    <div className="absolute top-12 sm:top-14 left-0 right-0 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-4 lg:px-6 ">
          <div className="py-2 animate-slideDown">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 bg-linear-to-r from-wizard-blue/10 to-wizard-gold/10 backdrop-blur-sm px-4 sm:px-5 py-3 shadow-sm ring-1 ring-white/30">
              <div className="absolute inset-y-0 left-0 w-1 bg-wizard-orange/50" />
              {/* Close button - top right */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-colors"
                aria-label="Dismiss reminder"
              >
                <CloseIcon className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="pl-4 pr-10">
                <BannerContent variant={variant} credits={credits} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
