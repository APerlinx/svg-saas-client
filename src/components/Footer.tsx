export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-sm">
            © {currentYear} SVG Wiz. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
