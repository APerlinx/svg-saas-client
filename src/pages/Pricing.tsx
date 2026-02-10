export default function Pricing() {
  const creditPacks = [
    {
      name: 'Starter',
      credits: '50',
      price: '$5',
      pricePerCredit: '$0.10',
      description: 'Perfect for trying out our SVG',
      features: [
        '50 SVG generations',
        'All styles available',
        'Credits never expire',
        'Basic support',
      ],
      popular: false,
    },
    {
      name: 'Creator',
      credits: '200',
      price: '$15',
      pricePerCredit: '$0.075',
      description: 'Best value for regular use',
      features: [
        '200 SVG generations',
        'All styles available',
        'Credits never expire',
        'Priority support',
        'Save 25%',
      ],
      popular: true,
    },
    {
      name: 'Professional',
      credits: '500',
      price: '$30',
      pricePerCredit: '$0.06',
      description: 'For power users and teams',
      features: [
        '500 SVG generations',
        'All styles available',
        'Credits never expire',
        'Priority support',
        'Save 40%',
      ],
      popular: false,
    },
  ]

  const apiPlans = [
    {
      name: 'Developer',
      price: '$29',
      period: '/month',
      description: 'For side projects and small apps',
      features: [
        '1,000 API requests/month',
        'All generation styles',
        'CDN-hosted assets',
        'API key management',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Startup',
      price: '$99',
      period: '/month',
      description: 'Perfect for growing businesses',
      features: [
        '5,000 API requests/month',
        'All generation styles',
        'CDN-hosted assets',
        'Multiple API keys',
        'Priority support',
        'Usage analytics',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale operations',
      features: [
        'Unlimited API requests',
        'Dedicated infrastructure',
        'Custom SLA',
        'Team management',
        'Dedicated support',
        'Custom integrations',
      ],
      popular: false,
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4">
      {/* Beta Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-12 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <h3 className="text-2xl font-bold text-white">
            🎉 Beta Version - Everything is FREE!
          </h3>
        </div>
        <p className="text-white/90 text-lg max-w-3xl mx-auto">
          We're in beta! Enjoy unlimited SVG generations completely free while
          we perfect the platform. API service coming soon. Paid plans will be
          introduced after beta ends.
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Future Pricing Plans
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take a look at our planned pricing structure. During beta, all
          features are completely free!
        </p>
      </div>

      {/* Web App Credits */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            💎 Web App Credits
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pay-as-you-go credits for the ChatSVG web app. Buy once, use
            forever—no subscriptions needed.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {creditPacks.map((pack) => (
            <div
              key={pack.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
                pack.popular
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pack.name}
                </h3>
                <div className="mb-2">
                  <div className="text-5xl font-bold text-gray-900">
                    {pack.price}
                  </div>
                  <div className="text-blue-600 font-semibold text-lg mt-1">
                    {pack.credits} credits
                  </div>
                  <div className="text-gray-500 text-sm">
                    {pack.pricePerCredit} per credit
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{pack.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
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
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all opacity-50 cursor-not-allowed ${
                  pack.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                Buy Now
              </button>
              <div className="mt-3 text-center bg-green-50 border border-green-200 rounded-lg py-2 px-3">
                <span className="text-xs font-semibold text-green-700">
                  🎉 Free during Beta
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Subscriptions */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full px-4 py-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            🚀 API Subscriptions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Integrate ChatSVG into your applications with our REST API. Perfect
            for developers and businesses.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {apiPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all ${
                plan.popular
                  ? 'border-purple-500 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Best for Startups
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <div className="text-5xl font-bold text-gray-900">
                    {plan.price}
                    {plan.period && (
                      <span className="text-xl text-gray-600">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-purple-600 shrink-0 mt-0.5"
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
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all opacity-50 cursor-not-allowed ${
                  plan.name === 'Enterprise'
                    ? 'bg-gray-900 text-white'
                    : plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Subscribe'}
              </button>
              <div className="mt-3 text-center bg-purple-50 border border-purple-200 rounded-lg py-2 px-3">
                <span className="text-xs font-semibold text-purple-700">
                  ⏳ Available Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ / Info Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-10 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Pricing Philosophy
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">
              Pay for What You Use
            </div>
            <div className="text-sm text-gray-600">
              Credits for the web app never expire. API subscriptions scale with
              your needs.
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">No Hidden Fees</div>
            <div className="text-sm text-gray-600">
              Transparent pricing with no surprise charges. What you see is what
              you pay.
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="font-bold text-gray-900 mb-2">Flexible Options</div>
            <div className="text-sm text-gray-600">
              Choose between pay-as-you-go credits or monthly API subscriptions
              based on your needs.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-300 text-center">
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Questions about pricing?</span>{' '}
            We're here to help!
          </p>
          <a
            href="mailto:support@chatsvg.com"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
