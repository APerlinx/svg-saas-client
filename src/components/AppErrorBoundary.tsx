import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-wizard-blue/10 to-wizard-orange/10">
          <div className="max-w-md w-full text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h1 className="text-6xl font-bold text-wizard-orange mb-4">⚠️</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-wizard-blue text-white font-semibold rounded-full hover:shadow-lg transition-all"
                onClick={() => this.setState({ hasError: false })}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
