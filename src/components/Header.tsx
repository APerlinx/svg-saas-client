import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logotape.svg'
import getInitials from '../utils/getInitials'
import Bell from './icons/BellIcon'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
  }
  return (
    <header className="backdrop-blur-sm bg-white/50 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={logo} alt="Chat SVG Logo" className="w-full h-full" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">
              chatSVG
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <Link
                to="/gallery"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors inline-block"
              >
                Gallery
              </Link>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Coming Soon
              </span>
            </div>
            <Link
              to="/pricing"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
            >
              Pricing
            </Link>
            <div className="relative group">
              <Link
                to="/about"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors inline-block"
              >
                About
              </Link>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Coming Soon
              </span>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              {isAuthenticated && user ? (
                <>
                  {/* Notification Bell */}
                  <button
                    className="p-2 hover:bg-gray-100/60 rounded-lg transition-colors relative group"
                    aria-label="Notifications"
                  >
                    <Bell size="20" />
                    {/* Notification badge - uncomment when you have notifications */}
                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span> */}

                    {/* Coming Soon Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Coming Soon
                    </span>
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100/60 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-wizard-orange to-wizard-orange/90 flex items-center justify-center text-white text-sm font-medium">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-lg shadow-lg py-2">
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Coins Display - leaving space for icon user will add */}
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Coins
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Space for coin icon */}
                              <span className="text-lg font-bold text-wizard-orange">
                                {user.coins ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/pricing"
                            onClick={() => setIsDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/60 transition-colors"
                          >
                            Get More Coins
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100/60 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-1.5 text-sm font-medium text-white bg-linear-to-r from-wizard-orange to-wizard-orange/90 hover:from-wizard-orange/90 hover:to-wizard-orange rounded-lg transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
