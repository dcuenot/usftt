import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: 'default' | 'primary' | 'success' | 'danger'
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  const variantClasses = {
    default: 'bg-white border-gray-200',
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-victory-light border-victory',
    danger: 'bg-defeat-light border-defeat',
  }

  return (
    <div
      className={cn(
        'rounded-card shadow-card p-6 border transition-shadow hover:shadow-card-hover',
        variantClasses[variant]
      )}
      data-testid="stats-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.value > 0 ? (
                <TrendingUp className="w-4 h-4 text-victory" />
              ) : trend.value < 0 ? (
                <TrendingDown className="w-4 h-4 text-defeat" />
              ) : null}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.value > 0 && 'text-victory',
                  trend.value < 0 && 'text-defeat',
                  trend.value === 0 && 'text-gray-600'
                )}
              >
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
