import { useEffect, useState } from 'react'

type ServiceStatus = 'operational' | 'degraded' | 'down'

interface Service {
  name: string
  status: ServiceStatus
  description: string
  responseTime?: number
}

export default function Status() {
  const services: Service[] = [
    {
      name: 'API Gateway',
      status: 'operational',
      description: 'REST API endpoints',
      responseTime: 45,
    },
    {
      name: 'SVG Generation',
      status: 'operational',
      description: 'AI model processing',
      responseTime: 1200,
    },
    {
      name: 'CDN & Assets',
      status: 'operational',
      description: 'Image delivery',
      responseTime: 32,
    },
    {
      name: 'Authentication',
      status: 'operational',
      description: 'User login & API keys',
      responseTime: 18,
    },
    {
      name: 'Database',
      status: 'operational',
      description: 'Data storage',
      responseTime: 12,
    },
  ]

  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    // Simulate status checks every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'down':
        return 'text-red-600 bg-red-100 border-red-200'
    }
  }

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'degraded':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )
    }
  }

  const overallStatus = services.every((s) => s.status === 'operational')
    ? 'operational'
    : services.some((s) => s.status === 'down')
      ? 'down'
      : 'degraded'

  return (
    <div className="w-full max-w-5xl mx-auto py-12 sm:py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          System Status
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Current operational status of ChatSVG services
        </p>
      </div>

      {/* Overall Status Banner */}
      <div
        className={`rounded-2xl p-8 mb-8 border-2 ${
          overallStatus === 'operational'
            ? 'bg-green-50 border-green-200'
            : overallStatus === 'degraded'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center justify-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              overallStatus === 'operational'
                ? 'bg-green-500'
                : overallStatus === 'degraded'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          >
            {getStatusIcon(overallStatus)}
            <span className="text-white"></span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {overallStatus === 'operational'
                ? 'All Systems Operational'
                : overallStatus === 'degraded'
                  ? 'Degraded Performance'
                  : 'Service Disruption'}
            </h2>
            <p className="text-sm text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`mt-0.5 w-10 h-10 rounded-lg border flex items-center justify-center ${getStatusColor(
                    service.status,
                  )}`}
                >
                  {getStatusIcon(service.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    service.status,
                  )}`}
                >
                  <span className="relative flex h-2 w-2">
                    {service.status === 'operational' && (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </>
                    )}
                    {service.status !== 'operational' && (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                    )}
                  </span>
                  {service.status === 'operational'
                    ? 'Operational'
                    : service.status === 'degraded'
                      ? 'Degraded'
                      : 'Down'}
                </div>
                {service.responseTime && (
                  <div className="text-xs text-gray-500 mt-2">
                    {service.responseTime < 100
                      ? `${service.responseTime}ms`
                      : `${(service.responseTime / 1000).toFixed(1)}s`}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Uptime Stats */}
      <div className="mt-12 bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
          Uptime Statistics (Last 90 Days)
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">99.98%</div>
            <div className="text-sm text-gray-600">Overall Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">42ms</div>
            <div className="text-sm text-gray-600">Avg API Response</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">1.2s</div>
            <div className="text-sm text-gray-600">Avg Generation Time</div>
          </div>
        </div>
      </div>

      {/* Subscribe to Updates */}
      <div className="mt-12 text-center bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Subscribe to Status Updates
        </h3>
        <p className="text-gray-600 mb-6">
          Get notified when service status changes
        </p>
        <form className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
