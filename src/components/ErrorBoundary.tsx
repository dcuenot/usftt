import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-card shadow-card-lg p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-defeat/10 p-4 rounded-full">
                <AlertTriangle className="w-12 h-12 text-defeat" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Oups ! Une erreur est survenue
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-4">
              Une erreur inattendue s'est produite. Veuillez réessayer ou recharger la page.
            </p>

            {/* Error details (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-neutral-100 rounded p-4 mb-4 overflow-auto max-h-40">
                <p className="text-xs font-mono text-defeat break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary text-white px-4 py-2 rounded font-medium hover:bg-primary-600 transition-colors"
              >
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
