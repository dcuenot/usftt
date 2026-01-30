import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { AnimatedNumber } from './AnimatedNumber'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'gradient' | 'featured'
  cardStyle?: 'default' | 'elevated' | 'glass'
  animate?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  cardStyle = 'elevated',
  animate = true,
}: StatsCardProps) {
  const variantClasses = {
    default: 'bg-white',
    primary: 'bg-primary-50',
    success: 'bg-victory-light',
    danger: 'bg-defeat-light',
    gradient: 'bg-gradient-card',
    featured: '',
  }

  const cardStyleClasses = {
    default: 'rounded-card shadow-card transition-shadow hover:shadow-card-hover',
    elevated: 'card-elevated',
    glass: 'card-glass',
  }

  const baseClass = variant === 'featured' ? 'card-featured' : cardStyleClasses[cardStyle]

  return (
    <div
      className={cn(
        'p-6 group',
        baseClass,
        variant !== 'featured' && variantClasses[variant]
      )}
      data-testid="stats-card"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </p>
        {icon && (
          <div className="text-primary-500 transition-transform group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-4xl font-bold text-gray-900 text-numeric">
          {animate && typeof value === 'number' ? (
            <AnimatedNumber value={value} duration={1200} />
          ) : (
            value
          )}
        </p>
      </div>

      {subtitle && (
        <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
      )}

      {trend && (
        <div className="flex items-center gap-2">
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
  )
}
