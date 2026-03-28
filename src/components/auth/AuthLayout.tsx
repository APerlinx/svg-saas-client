import { Link } from 'react-router-dom'
import { Logo } from '../icons/Logo'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    text: 'AI-powered SVG generation',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    text: 'Export to SVG, PNG, and more',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: 'Full generation history',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    text: 'REST API access',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    text: 'Public gallery & community',
  },
]

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8 py-12 min-h-screen">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <Logo size="36" />
            <span className="text-lg font-semibold text-gray-900 group-hover:text-[#CE5E2F] transition-colors">
              ChatSVG
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">{subtitle}</p>

          {children}
        </div>
      </div>

      {/* Right: Marketing panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center bg-gray-950 px-16 py-12 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-0.5 w-8 bg-[#CE5E2F]" />
            <span className="text-sm text-gray-400">No credit card required</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Create SVGs{' '}
            <span className="text-[#CE5E2F]">instantly</span>
          </h2>

          <p className="text-gray-400 text-base mb-12 leading-relaxed">
            Describe what you need and get production-ready SVGs in seconds.
            No design skills required.
          </p>

          <div className="space-y-5">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#CE5E2F]/10 flex items-center justify-center text-[#CE5E2F]">
                  {feature.icon}
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
