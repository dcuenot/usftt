interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'primary' | 'minimal'
}

export function EmptyState({ icon, title, description, action, variant = 'default' }: EmptyStateProps) {
  const containerClasses = {
    default: 'card-elevated',
    primary: 'bg-gradient-primary text-white',
    minimal: 'bg-transparent'
  }

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center animate-fadeIn ${containerClasses[variant]}`}
      data-testid="empty-state"
    >
      {icon && (
        <div className={`mb-6 ${variant === 'primary' ? 'text-white/80' : 'text-gray-300'} transform transition-transform hover:scale-110`}>
          <div className="inline-block p-4 rounded-full bg-gray-50/50">
            {icon}
          </div>
        </div>
      )}
      <h3 className={`text-xl font-semibold mb-3 ${variant === 'primary' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      {description && (
        <p className={`text-sm mb-8 max-w-md leading-relaxed ${variant === 'primary' ? 'text-white/90' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
