import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error
  onRetry?: () => void
  onGoHome?: () => void
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}

export function ErrorState({
  title = 'Erreur de chargement',
  message = 'Une erreur est survenue lors du chargement des données.',
  error,
  onRetry,
  onGoHome,
  variant = 'default',
  className
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800',
          className
        )}
        role="alert"
      >
        <AlertCircle className="icon-base flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="text-xs text-red-700 mt-0.5">{message}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="icon-btn flex-shrink-0"
            aria-label="Réessayer"
          >
            <RefreshCw className="icon-sm" />
          </button>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'card-elevated p-6 text-center',
          className
        )}
        role="alert"
      >
        <AlertCircle className="icon-xl text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-center gap-2">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              <RefreshCw className="icon-sm inline-block mr-2" />
              Réessayer
            </button>
          )}
          {onGoHome && (
            <button onClick={onGoHome} className="btn-secondary">
              <Home className="icon-sm inline-block mr-2" />
              Accueil
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
      role="alert"
    >
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
        <div className="relative inline-block p-6 rounded-full bg-red-50">
          <AlertCircle className="icon-2xl text-red-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 mb-2 max-w-md">{message}</p>

      {error && process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left max-w-md w-full">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
            Détails techniques
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      <div className="mt-8 flex gap-3">
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            <RefreshCw className="icon-sm inline-block mr-2" />
            Réessayer
          </button>
        )}
        {onGoHome && (
          <button onClick={onGoHome} className="btn-ghost">
            <Home className="icon-sm inline-block mr-2" />
            Retour à l'accueil
          </button>
        )}
      </div>
    </div>
  )
}
