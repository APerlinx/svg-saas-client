export default function Pricing() {
  const coinPacks = [
    {
      name: 'Starter',
      coins: '50',
      price: '$5',
      pricePerCoin: '$0.10',
      description: 'Perfect for trying out our SVG chat',
      features: [
        '50 SVG generations',
        'All styles available',
        'Never expires',
        'Basic support',
      ],
      popular: false,
    },
    {
      name: 'Creator',
      coins: '200',
      price: '$15',
      pricePerCoin: '$0.075',
      description: 'Best value for regular use',
      features: [
        '200 SVG generations',
        'All styles available',
        'Never expires',
        'Priority support',
        'Save 25%',
      ],
      popular: true,
    },
    {
      name: 'Professional',
      coins: '500',
      price: '$30',
      pricePerCoin: '$0.06',
      description: 'For power users and teams',
      features: [
        '500 SVG generations',
        'All styles available',
        'Never expires',
        'Priority support',
        'Save 40%',
      ],
      popular: false,
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, pay-as-you-go pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          No subscriptions. No monthly fees. Buy coins once, use them forever.
        </p>
      </div>

      {/* Free Tier Banner */}
      <div className="bg-linear-to-r from-wizard-blue/20 to-wizard-purple/20 backdrop-blur-sm rounded-3xl p-8 mb-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Start Free Forever
        </h3>
        <p className="text-gray-700 mb-4">
          Get{' '}
          <span className="font-bold text-wizard-orange">10 free coins</span>{' '}
          every month. No credit card required.
        </p>
        <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
          Create Free Account
        </button>
      </div>

      {/* Coin Packs */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Buy Coins
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {coinPacks.map((pack) => (
            <div
              key={pack.name}
              className={`relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all hover:shadow-xl ${
                pack.popular
                  ? 'ring-2 ring-wizard-orange scale-105'
                  : 'hover:scale-105'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wizard-orange text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
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
                  <div className="text-wizard-orange font-semibold text-lg mt-1">
                    {pack.coins} coins
                  </div>
                  <div className="text-gray-500 text-sm">
                    {pack.pricePerCoin} per coin
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{pack.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-wizard-orange shrink-0 mt-0.5"
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
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all ${
                  pack.popular
                    ? 'bg-linear-to-r from-wizard-orange to-amber-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Unlimited Pass */}
      <div className="bg-linear-to-br from-wizard-orange/10 via-wizard-gold/10 to-wizard-purple/10 backdrop-blur-sm rounded-3xl p-12 mb-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-wizard-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-wizard-purple/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="inline-block bg-wizard-orange text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            ⚡ UNLIMITED POWER
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Unlimited Pass
          </h2>
          <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Generate unlimited SVGs forever. One payment, lifetime access.
          </p>
          <div className="text-6xl font-bold text-gray-900 mb-2">$79</div>
          <div className="text-gray-600 mb-8">
            One-time payment • Lifetime access
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 text-left">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-wizard-orange shrink-0 mt-1"
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
              <div>
                <div className="font-semibold text-gray-900">
                  Unlimited generations
                </div>
                <div className="text-sm text-gray-600">No coin limits ever</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-wizard-orange shrink-0 mt-1"
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
              <div>
                <div className="font-semibold text-gray-900">All features</div>
                <div className="text-sm text-gray-600">
                  Priority support included
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-wizard-orange shrink-0 mt-1"
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
              <div>
                <div className="font-semibold text-gray-900">
                  Commercial license
                </div>
                <div className="text-sm text-gray-600">Use in any project</div>
              </div>
            </div>
          </div>

          <button className="bg-linear-to-r from-wizard-orange to-amber-500 text-white px-12 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all">
            Get Unlimited Access
          </button>
          <p className="text-sm text-gray-600 mt-4">
            🔥 Most popular for professionals and agencies
          </p>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="text-center bg-white/30 backdrop-blur-sm rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Why choose our pricing?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 text-gray-700">
          <div>
            <div className="text-4xl mb-3">🚫</div>
            <div className="font-semibold mb-2">No Subscriptions</div>
            <div className="text-sm text-gray-600">
              Pay once, own it forever. No recurring charges.
            </div>
          </div>
          <div>
            <div className="text-4xl mb-3">♾️</div>
            <div className="font-semibold mb-2">Coins Never Expire</div>
            <div className="text-sm text-gray-600">
              Use your coins anytime. No pressure, no waste.
            </div>
          </div>
          <div>
            <div className="text-4xl mb-3">💎</div>
            <div className="font-semibold mb-2">Fair & Transparent</div>
            <div className="text-sm text-gray-600">
              Clear pricing. No hidden fees. Pay for what you use.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
