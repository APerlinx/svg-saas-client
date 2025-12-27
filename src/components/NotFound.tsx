import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <h1 className="text-8xl font-bold text-wizard-blue mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-wizard-blue text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
