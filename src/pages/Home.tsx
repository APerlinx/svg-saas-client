import { Link } from 'react-router-dom'
import AmbientWaves from '../assets/Dashboard-background/AmbientWaves'
import { Logo } from '../components/icons/Logo'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AmbientWaves />

      <main className="grow flex items-center justify-center px-4">
        <div className="w-full max-w-4xl mx-auto text-center">
          {/* Logo + Name */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Logo size="48" className="text-gray-900" />
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              ChatSVG
            </span>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              Beta
            </span>
          </div>

          {/* Hero */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            AI-Powered SVG
            <br />
            <span className="bg-linear-to-r from-wizard-orange to-wizard-orange/70 bg-clip-text text-transparent">
              Generation API
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Generate production-ready SVGs with a single API call. Integrate
            into your apps, automate your workflows, or create directly in the
            web app.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              className="px-8 py-3 bg-linear-to-r from-wizard-orange to-wizard-orange/90 text-white rounded-xl font-semibold hover:from-wizard-orange/90 hover:to-wizard-orange transition-all shadow-md text-base"
            >
              Open Web App
            </Link>
            <Link
              to="/docs"
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md text-base"
            >
              API Documentation
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-white/60 transition-colors text-base"
            >
              Plans & Credits
            </Link>
          </div>

          {/* Quick highlights */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-5 text-left">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                REST API
              </div>
              <div className="text-sm text-gray-600">
                Simple POST to generate. Poll for results. Use your API key —
                that's it.
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-5 text-left">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                Web App
              </div>
              <div className="text-sm text-gray-600">
                Describe what you want, pick a style, and download SVG or PNG
                instantly.
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm p-5 text-left">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                MCP Server
              </div>
              <div className="text-sm text-gray-600">
                Coming soon — generate SVGs from Claude Desktop, Cursor, and
                more.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
