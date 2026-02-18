import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlans, type Plan, type PlanType } from '../services/planService'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { cancelSubscription } from '../services/paypalService'
import PricingCheckIcon from '../components/icons/PricingCheckIcon'
import PricingCrossIcon from '../components/icons/PricingCrossIcon'
import PayPalSubscribeButton from '../components/PayPalSubscribeButton'

type LoadState = 'idle' | 'loading' | 'error'

const PLAN_ORDER: PlanType[] = ['FREE', 'SUPPORTER']

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return 'Unlimited'
  return n.toLocaleString()
}

function buildFeatures(plan: Plan): string[] {
  const l = plan.limits
  const features: string[] = []

  features.push(
    `${formatNumber(l.startingCredits)} initial credits on plan activation`,
  )
  features.push(
    `${formatNumber(l.creditRefillAmount)} credits refilled every ${l.creditRefillDays} days`,
  )
  features.push(
    `${formatNumber(l.generationsPerMonth)} generations per monthly usage window`,
  )

  if (l.apiAccess) {
    features.push(`API access — up to ${l.maxApiKeys} keys`)
  } else {
    features.push('Web app only')
  }

  features.push(
    `Rate limit: up to ${formatNumber(l.rateLimits.perMinute)} req/min`,
  )

  const supportLabels: Record<string, string> = {
    community: 'Community support',
    email: 'Email support',
    priority: 'Priority support',
  }
  let support = supportLabels[l.supportLevel] ?? 'Support'
  if (l.supportChannel === 'discord') support += ' (Discord)'
  else if (l.supportChannel === 'email') support += ' (email)'
  features.push(support)

  return features
}

function PlanCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 animate-pulse">
      <div className="text-center mb-6">
        <div className="h-7 bg-gray-200 rounded w-24 mx-auto mb-3" />
        <div className="h-12 bg-gray-200 rounded w-20 mx-auto mb-2" />
        <div className="h-4 bg-gray-100 rounded w-16 mx-auto mb-3" />
        <div className="h-4 bg-gray-100 rounded w-40 mx-auto" />
      </div>
      <div className="space-y-3 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            <div className="h-4 bg-gray-100 rounded flex-1" />
          </div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 rounded-xl" />
    </div>
  )
}

export default function Pricing() {
  const { user, isAuthenticated, checkAuth } = useAuth()
  const { showToast } = useToast()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
  const [cancellingSubscription, setCancellingSubscription] = useState(false)
  const requestIdRef = useRef(0)

  const currentPlan = user?.plan || 'FREE'

  useEffect(() => {
    const id = ++requestIdRef.current

    fetchPlans()
      .then((data) => {
        if (id !== requestIdRef.current) return
        const ordered = PLAN_ORDER.map((key) => data[key]).filter(Boolean)
        setPlans(ordered)
        setLoadState('idle')
      })
      .catch((err: Error) => {
        if (id !== requestIdRef.current) return
        setError(err.message)
        setLoadState('error')
      })
  }, [])

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 mb-4">
          Community-first pricing
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          Keep it sustainable, keep it useful.
        </h1>
        <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
          This project is built for developers. The Free plan stays generous.
          The Supporter plan is a simple “buy me a coffee” way to help cover AI
          costs and keep development moving.
        </p>
      </div>

      {/* Error State */}
      {loadState === 'error' && (
        <div className="py-8 mb-8">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg
              className="w-5 h-5 text-red-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-700">
              {error || 'Failed to load plans. Please try again later.'}
            </span>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="mb-14">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {loadState === 'loading'
            ? PLAN_ORDER.map((key) => <PlanCardSkeleton key={key} />)
            : plans.map((plan) => {
                const isSupporter = plan.plan === 'SUPPORTER'
                const isCurrentPlan = plan.plan === currentPlan
                const features = buildFeatures(plan)

                return (
                  <div
                    key={plan.plan}
                    className={`bg-white rounded-xl p-6 border transition-colors ${
                      isSupporter ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  >
                    {/* Plan header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-3">
                        <div className="text-4xl font-semibold text-gray-900 tracking-tight">
                          {plan.price === 0 ? (
                            'Free'
                          ) : (
                            <>
                              ${plan.price}
                              <span className="text-base font-normal text-gray-500">
                                /mo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 mb-7">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          {feature === 'Web app only' ? (
                            <PricingCrossIcon />
                          ) : (
                            <PricingCheckIcon />
                          )}
                          <span
                            className={`text-sm leading-relaxed ${feature === 'Web app only' ? 'text-gray-400' : 'text-gray-700'}`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {isSupporter && !isCurrentPlan && isAuthenticated ? (
                      // Show PayPal subscribe button for logged-in FREE users
                      <div className="mt-1">
                        <PayPalSubscribeButton
                          onSuccess={() => {
                            showToast(
                              'Subscription started! Your plan will upgrade shortly.',
                              'success',
                            )
                            // Refresh user data so the UI reflects the new plan
                            // The webhook finalizes the upgrade, but we poll briefly
                            setTimeout(() => void checkAuth(), 3000)
                          }}
                          onError={(message) => {
                            showToast(message, 'error')
                          }}
                        />
                      </div>
                    ) : isSupporter && isCurrentPlan ? (
                      // Already a supporter — show current plan + cancel option
                      <div>
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-900 text-white opacity-60 cursor-not-allowed"
                        >
                          Current plan
                        </button>
                        <button
                          disabled={cancellingSubscription}
                          onClick={async () => {
                            setCancellingSubscription(true)
                            try {
                              await cancelSubscription()
                              showToast(
                                'Subscription cancelled. You will keep your plan until the end of the billing period.',
                                'info',
                              )
                              await checkAuth()
                            } catch (err) {
                              showToast(
                                err instanceof Error
                                  ? err.message
                                  : 'Failed to cancel subscription',
                                'error',
                              )
                            } finally {
                              setCancellingSubscription(false)
                            }
                          }}
                          className="w-full mt-2 py-2 px-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors disabled:opacity-50"
                        >
                          {cancellingSubscription
                            ? 'Cancelling...'
                            : 'Cancel subscription'}
                        </button>
                      </div>
                    ) : !isAuthenticated && isSupporter ? (
                      // Guest viewing supporter plan — prompt sign in
                      <Link
                        to="/signin"
                        className="block w-full py-2.5 px-4 rounded-lg font-medium text-center bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                      >
                        Sign in to subscribe
                      </Link>
                    ) : (
                      // FREE plan card
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-100 text-gray-800 opacity-60 cursor-not-allowed"
                      >
                        {isCurrentPlan ? 'Current plan' : 'Default plan'}
                      </button>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      <span>
                        {isSupporter
                          ? 'Support helps cover model costs and keeps the roadmap moving.'
                          : 'Free during beta. No credit card required.'}
                      </span>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>

      {/* Comparison Table */}
      {plans.length > 0 && (
        <div className="mb-14 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-5">
            Quick comparison
          </h2>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700 w-48">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.plan}
                    className="text-center py-3 px-4 font-medium text-gray-900"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 text-gray-600">Monthly price</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {p.price === 0 ? 'Free' : `$${p.price}`}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">
                  Initial credit allocation
                </td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {formatNumber(p.limits.startingCredits)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">Recurring refill</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {formatNumber(p.limits.creditRefillAmount)} every{' '}
                    {p.limits.creditRefillDays} days
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">Generations / month</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {formatNumber(p.limits.generationsPerMonth)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">API access</td>
                {plans.map((p) => (
                  <td key={p.plan} className="py-3 px-4 text-center">
                    {p.limits.apiAccess ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">API keys</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {p.limits.maxApiKeys === 0 ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      p.limits.maxApiKeys
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">Rate limit</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center text-gray-900"
                  >
                    {formatNumber(p.limits.rateLimits.perMinute)}/min
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600">Support</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center capitalize text-gray-900"
                  >
                    {p.limits.supportLevel}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Philosophy */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Why this pricing model
        </h3>
        <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <li>
            <span className="font-medium text-gray-900">
              Generous free tier:
            </span>{' '}
            useful for learning, prototyping, and small projects.
          </li>
          <li>
            <span className="font-medium text-gray-900">Supporter tier:</span> a
            lightweight way to fund compute costs and steady improvements.
          </li>
          <li>
            <span className="font-medium text-gray-900">No growth hacks:</span>{' '}
            clear limits, simple language, and predictable usage.
          </li>
        </ul>

        <div className="mt-6 pt-5 border-t border-gray-200 text-sm">
          <p className="text-gray-700 mb-3">
            Questions or feedback about pricing?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-white transition-colors"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
