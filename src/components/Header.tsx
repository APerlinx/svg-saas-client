import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import getInitials from '../utils/getInitials'
import Bell from './icons/BellIcon'
import GalleryIcon from './icons/GalleryIcon'
import PricingIcon from './icons/PricingIcon'
import { Logo } from './icons/Logo'
import Notification from './Notification'
import { useNotifications } from '../hooks/useNotifications'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { unreadCount, isLoadingBadge, loadLatestAndMarkSeen } =
    useNotifications()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isNotificationOpen) return
    void loadLatestAndMarkSeen()
  }, [isNotificationOpen, loadLatestAndMarkSeen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsDropdownOpen(false)
      }

      if (
        isNotificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setIsNotificationOpen(false)
      }
    }

    if (isDropdownOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, isNotificationOpen])

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
  }
  return (
    <header className="backdrop-blur-sm bg-white/50 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 gap-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 group cursor-pointer shrink-0"
          >
            <div className="flex items-center justify-center ">
              <Logo
                size="24"
                className="text-gray-900 group-hover:scale-105 transition-transform"
              />
            </div>

            <span className="font-semibold text-base sm:text-lg tracking-tight text-gray-900 ">
              chatSVG
            </span>
            <span className="hidden lg:inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
              Beta
            </span>
          </Link>

          {/* Navigation + Auth Section */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Navigation - Always Visible */}
            <nav className="flex items-center gap-0.5">
              <div className="relative group">
                <Link
                  to="/gallery"
                  className="flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
                  title="Gallery"
                >
                  <GalleryIcon size="20" className="text-current shrink-0" />
                  <span className="hidden md:inline">Gallery</span>
                </Link>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Coming Soon
                </span>
              </div>
              <Link
                to="/pricing"
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
                title="Pricing"
              >
                <PricingIcon size="20" className="text-current shrink-0" />
                <span className="hidden md:inline">Buy now</span>
              </Link>
            </nav>

            {/* Auth Section with Divider */}
            <div className="flex items-center gap-1 pl-2 sm:pl-3 border-l-2 border-gray-200 ml-1">
              {isAuthenticated && user ? (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1 px-1.5 md:px-2 py-1 hover:bg-gray-100/60 rounded-lg transition-colors"
                      aria-label="User menu"
                    >
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-linear-to-r from-wizard-orange to-wizard-orange/90 flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                parent.textContent = getInitials(user.name)
                              }
                            }}
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 max-w-20 truncate">
                        {user.name}
                      </span>
                      <svg
                        className={`w-3 h-3 text-gray-500 transition-transform hidden md:block ${
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
                      <div className="absolute right-0 mt-2 w-64 backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Credits Display */}
                        <div className="px-4 py-3 border-b border-gray-200/50">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Credits
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-wizard-orange">
                                {user.credits ?? 0}
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
                            Get More Credits
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

                  {/* Notification Bell */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      className="p-1 md:p-1.5 mt-1.5 hover:bg-gray-100/60 rounded-lg transition-colors relative group"
                      aria-label={
                        unreadCount > 0
                          ? `Notifications (${unreadCount} new)`
                          : 'Notifications'
                      }
                      onClick={() => setIsNotificationOpen((v) => !v)}
                    >
                      <span className="relative inline-flex">
                        <Bell
                          size="20"
                          className={`text-gray-700 inline-block  ${
                            !isLoadingBadge && unreadCount > 0
                              ? 'animate-bell-wiggle'
                              : ''
                          }`}
                        />

                        {!isLoadingBadge && unreadCount > 0 && (
                          <span
                            className="absolute top-0.5 right-[3px] h-1.5 w-1.5 rounded-full bg-red-600"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </button>

                    {isNotificationOpen && <Notification />}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-2 border-2 border-wizard-orange/50 sm:px-3 py-1  text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-2xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden md:inline-block px-3 py-1 border-2 border-wizard-orange/50 text-xs sm:text-sm font-medium text-white bg-linear-to-r from-wizard-orange to-wizard-orange/90 hover:from-wizard-orange/90 hover:to-wizard-orange rounded-2xl transition-all shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
