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
          <span className="font-semibold text-wizard-orange">
            {credits ?? 0}
          </span>{' '}
          {credits === 1 ? 'credit' : 'credits'} left. Top up to keep
          generating.
        </div>
        <Link
          to="/pricing"
          className="flex text-sm font-semibold text-black self-end"
        >
          Get more credits
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-sm font-semibold text-gray-900">
        Want to generate more?
      </div>
      <div className="text-xs sm:text-sm text-gray-700">
        Buy credits once and use them anytime — no subscription.
      </div>
      <Link
        to="/pricing"
        className="flex text-sm font-semibold text-black self-end"
      >
        Buy credits
      </Link>
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
    [location.pathname]
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
    <div className="fixed top-12 sm:top-14 left-0 right-0 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-4 lg:px-6 ">
          <div className="py-2 animate-slideDown">
            <div className="relative rounded-2xl border  border-gray-400/50 bg-wizard-gold/30 px-4 sm:px-5 py-3">
              {/* Close button - top right */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100/70 transition"
                aria-label="Dismiss reminder"
              >
                <CloseIcon className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="pl-3">
                <BannerContent variant={variant} credits={credits} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
