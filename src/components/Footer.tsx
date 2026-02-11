import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-sm bg-white/50 border-t border-gray-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <div className="text-gray-600 text-xs font-medium">
              © {currentYear} chatSVG. All rights reserved.
            </div>
            <div className="text-gray-400 text-xs">Handcrafted with ❤️</div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/privacy"
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors inline-block"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors inline-block"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-lg transition-colors inline-block"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
