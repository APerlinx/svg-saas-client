import logo from '../assets/logo.svg'

export default function Header() {
  return (
    <header className="backdrop-blur-sm bg-white/50 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={logo} alt="SVG Wiz Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">
              SVG Wiz
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <a
              href="#"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              Gallery
            </a>
            <a
              href="/pricing"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              About
            </a>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="px-4 py-1.5 text-sm font-medium text-white bg-linear-to-r from-wizard-orange to-wizard-orange/90 hover:from-wizard-orange/90 hover:to-wizard-orange rounded-lg transition-all shadow-sm">
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
