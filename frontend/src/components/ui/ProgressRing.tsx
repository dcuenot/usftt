import { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  label?: string
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  color = 'rgb(var(--color-primary-500, 13, 110, 253))',
  backgroundColor = 'rgb(229, 231, 235)',
  showLabel = true,
  label,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const offset = useMemo(() => {
    const progress = Math.min(Math.max(value, 0), 100)
    return circumference - (progress / 100) * circumference
  }, [value, circumference])

  const ariaLabel = label
    ? `${label}: ${Math.round(value)} percent`
    : `Progress: ${Math.round(value)} percent`

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="img"
      aria-label={ariaLabel}
    >
      <svg width={size} height={size} className="transform -rotate-90" aria-hidden="true">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(value)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  )
}
