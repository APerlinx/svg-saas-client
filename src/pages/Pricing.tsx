import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlans, type Plan, type PlanType } from '../services/planService'
import { useAuth } from '../hooks/useAuth'

type LoadState = 'idle' | 'loading' | 'error'

const PLAN_ORDER: PlanType[] = ['FREE', 'PRO', 'ENTERPRISE']

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return 'Unlimited'
  return n.toLocaleString()
}

function buildFeatures(plan: Plan): string[] {
  const l = plan.limits
  const features: string[] = []

  features.push(`${formatNumber(l.creditsPerMonth)} credits / month`)
  features.push(`${formatNumber(l.generationsPerMonth)} generations / month`)

  if (l.apiAccess) {
    features.push(`API access — up to ${l.maxApiKeys} keys`)
  } else {
    features.push('Web app only')
  }

  features.push(`Rate limit: ${formatNumber(l.rateLimits.perMinute)} req/min`)

  const supportLabels: Record<string, string> = {
    community: 'Community support',
    email: 'Email support',
    priority: 'Priority support',
    dedicated: 'Dedicated support',
  }
  let support = supportLabels[l.supportLevel] ?? 'Support'
  if (l.supportChannel === 'slack') support += ' (Slack)'
  else if (l.supportChannel === 'email') support += ' (email)'
  features.push(support)

  if (l.overagePrice) {
    features.push(`Overage: $${l.overagePrice.toFixed(2)} / credit`)
  }

  return features
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-300 shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
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
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
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
    <div className="w-full max-w-7xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          One unified credit system for web app and API. Pick a plan, use your
          credits anywhere — no hidden fees.
        </p>
      </div>

      {/* Error State */}
      {loadState === 'error' && (
        <div className="text-center py-12 mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-6 py-4">
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
      <div className="mb-20">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {loadState === 'loading'
            ? PLAN_ORDER.map((key) => <PlanCardSkeleton key={key} />)
            : plans.map((plan) => {
                const isPro = plan.plan === 'PRO'
                const isEnterprise = plan.plan === 'ENTERPRISE'
                const isCurrentPlan = plan.plan === currentPlan
                const features = buildFeatures(plan)

                return (
                  <div
                    key={plan.plan}
                    className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
                      isPro
                        ? 'border-blue-500 scale-[1.03] shadow-xl'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        <div className="text-5xl font-bold text-gray-900">
                          {plan.price === 0 ? (
                            'Free'
                          ) : (
                            <>
                              ${plan.price}
                              <span className="text-lg font-medium text-gray-500">
                                /mo
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-3 mb-8">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          {feature === 'Web app only' ? (
                            <CrossIcon />
                          ) : (
                            <CheckIcon />
                          )}
                          <span
                            className={`text-sm ${feature === 'Web app only' ? 'text-gray-400' : 'text-gray-700'}`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {isEnterprise ? (
                      <a
                        href="mailto:sales@chatsvg.com?subject=Enterprise Plan Inquiry"
                        className="block w-full text-center py-3 px-6 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                      >
                        Contact Sales
                      </a>
                    ) : (
                      <button
                        disabled
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all opacity-50 cursor-not-allowed ${
                          isPro
                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                      </button>
                    )}

                    <div className="mt-3 text-center bg-green-50 border border-green-200 rounded-lg py-2 px-3">
                      <span className="text-xs font-semibold text-green-700">
                        Free during Beta
                      </span>
                    </div>
                  </div>
                )
              })}
        </div>
      </div>

      {/* Comparison Table */}
      {plans.length > 0 && (
        <div className="mb-20 overflow-x-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Compare Plans
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 pr-4 font-semibold text-gray-700 w-48">
                  Feature
                </th>
                {plans.map((p) => (
                  <th
                    key={p.plan}
                    className="text-center py-3 px-4 font-semibold text-gray-900"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 text-gray-600">Monthly price</td>
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
                <td className="py-3 pr-4 text-gray-600">Credits / month</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center font-medium text-gray-900"
                  >
                    {formatNumber(p.limits.creditsPerMonth)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 text-gray-600">Generations / month</td>
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
                <td className="py-3 pr-4 text-gray-600">API access</td>
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
                <td className="py-3 pr-4 text-gray-600">API keys</td>
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
                <td className="py-3 pr-4 text-gray-600">Rate limit</td>
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
                <td className="py-3 pr-4 text-gray-600">Support</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center capitalize text-gray-900"
                  >
                    {p.limits.supportLevel}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 pr-4 text-gray-600">Overage pricing</td>
                {plans.map((p) => (
                  <td
                    key={p.plan}
                    className="py-3 px-4 text-center text-gray-900"
                  >
                    {p.limits.overagePrice ? (
                      `$${p.limits.overagePrice.toFixed(2)}/credit`
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl p-10 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">Use Anywhere</div>
            <div className="text-sm text-gray-600">
              Credits work in the web app and via API — 1 credit = 1 SVG
              generation, your choice.
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">Monthly Refresh</div>
            <div className="text-sm text-gray-600">
              Credits refresh every month. Upgrade or downgrade anytime — no
              long-term commitments.
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">Scale Up</div>
            <div className="text-sm text-gray-600">
              Start free, upgrade when you need more. Paid plans include API
              access and higher limits.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Questions about pricing?</span>{' '}
            We're here to help!
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
