import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()

  let errorMessage: string
  let errorStatus: number | undefined

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage =
      error.statusText || error.data?.message || 'An error occurred'
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'An unexpected error occurred'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          {errorStatus && (
            <h1 className="text-6xl font-bold text-wizard-orange mb-4">
              {errorStatus}
            </h1>
          )}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
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
