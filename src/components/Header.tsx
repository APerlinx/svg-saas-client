import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import getInitials from '../utils/getInitials'
import Bell from './icons/BellIcon'
import GalleryIcon from './icons/GalleryIcon'
import PricingIcon from './icons/PricingIcon'
import LampIcon from './icons/LampIcon'
import BugIcon from './icons/BugIcon'
import SuggestionIcon from './icons/SuggestionIcon'
import DocsIcon from './icons/DocsIcon'
import PillSnakeBorder from './icons/PillSnakeBorder'
import { Logo } from './icons/Logo'
import Notification from './Notification'
import { useNotifications } from '../hooks/useNotifications'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { unreadCount, isLoadingBadge, loadLatestAndMarkSeen } =
    useNotifications()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isIdeaMenuOpen, setIsIdeaMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const ideaMenuRef = useRef<HTMLDivElement>(null)

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

      if (
        isIdeaMenuOpen &&
        ideaMenuRef.current &&
        !ideaMenuRef.current.contains(target)
      ) {
        setIsIdeaMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsDropdownOpen(false)
      setIsNotificationOpen(false)
      setIsIdeaMenuOpen(false)
    }

    if (isDropdownOpen || isNotificationOpen || isIdeaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDropdownOpen, isNotificationOpen, isIdeaMenuOpen])

  const handleLogout = async () => {
    await logout()
    setIsDropdownOpen(false)
  }

  const handleToggleIdeaMenu = () => {
    setIsIdeaMenuOpen((open) => !open)
    setIsDropdownOpen(false)
    setIsNotificationOpen(false)
  }

  const handleSelectIdeaAction = (type: 'idea' | 'bug') => {
    const from = `${location.pathname}${location.search}`
    setIsIdeaMenuOpen(false)
    navigate(`/contact?type=${type}`, { state: { from } })
  }

  const handleToggleNotifications = () => {
    setIsNotificationOpen((open) => !open)
    setIsDropdownOpen(false)
    setIsIdeaMenuOpen(false)
  }

  const handleToggleUserMenu = () => {
    setIsDropdownOpen((open) => !open)
    setIsNotificationOpen(false)
    setIsIdeaMenuOpen(false)
  }
  return (
    <header className="backdrop-blur-sm bg-white/50 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 gap-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-0.5 group cursor-pointer shrink-0"
          >
            <div className="flex items-center justify-center ">
              <Logo
                size="28"
                className="text-gray-900 group-hover:scale-105 transition-transform"
              />
            </div>

            <span className="font-semibold text-base sm:text-lg tracking-tight text-gray-900 ">
              ChatSVG
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
              Beta
            </span>
          </Link>

          {/* Navigation + Auth Section */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Navigation - Always Visible */}
            <nav className="flex items-center gap-0.5">
              <Link
                to="/pricing"
                className="pill-snake-border bg-wizard-orange/10 flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors "
                title="Pricing"
              >
                <PillSnakeBorder className="pill-snake-border__svg" />
                <PricingIcon
                  size="20"
                  className="pill-snake-border__content text-white shrink-0"
                />
                <span className="pill-snake-border__content hidden md:inline">
                  Free Beta
                </span>
              </Link>
              <Link
                to="/gallery"
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
                title="Gallery"
              >
                <GalleryIcon size="20" className="text-current shrink-0" />
                <span className="hidden md:inline">Gallery</span>
              </Link>

              <Link
                to="/docs"
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors"
                title="Docs"
              >
                <DocsIcon size="20" className="text-current shrink-0" />
                <span className="hidden md:inline">Docs</span>
              </Link>
            </nav>

            {/* Auth Section with Divider */}
            <div className="flex items-center gap-1 pl-2 sm:pl-3 border-l-2 border-gray-200 ml-1">
              {/* Idea Menu */}
              <div className="relative" ref={ideaMenuRef}>
                <button
                  type="button"
                  onClick={handleToggleIdeaMenu}
                  className="p-1 md:p-1.5 hover:bg-gray-100/60 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wizard-orange/40"
                  aria-label="Ideas"
                  aria-haspopup="menu"
                  aria-expanded={isIdeaMenuOpen}
                >
                  <SuggestionIcon size="20" className="text-gray-700" />
                </button>

                {isIdeaMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-lg shadow-lg py-2 z-50"
                    role="menu"
                    aria-label="Ideas menu"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectIdeaAction('idea')}
                      className="w-full px-3 py-2 flex items-start gap-3 text-left hover:bg-gray-100/60 transition-colors"
                    >
                      <span className="mt-0.5 h-9 w-9 rounded-lg bg-gray-100/60 border border-gray-200/40 flex items-center justify-center shrink-0">
                        <LampIcon size="18" className="text-gray-900" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-gray-900">
                          Submit an idea
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          Share a feature request or improvement
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectIdeaAction('bug')}
                      className="w-full px-3 py-2 flex items-start gap-3 text-left hover:bg-gray-100/60 transition-colors"
                    >
                      <span className="mt-0.5 h-9 w-9 rounded-lg bg-gray-100/60 border border-gray-200/40 flex items-center justify-center shrink-0">
                        <BugIcon size="18" className="text-gray-900" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-gray-900">
                          Report a bug
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          Tell us what's broken or confusing
                        </span>
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={handleToggleUserMenu}
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
                      onClick={handleToggleNotifications}
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
