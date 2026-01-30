import { cn } from '@/utils/cn'

interface TableTennisIconProps {
  className?: string
  size?: 'sm' | 'base' | 'lg' | 'xl'
}

export function TableTennisIcon({ className, size = 'base' }: TableTennisIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paddle blade */}
      <ellipse
        cx="12"
        cy="10"
        rx="6"
        ry="7"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Paddle handle */}
      <rect
        x="10.5"
        y="16"
        width="3"
        height="6"
        rx="1.5"
        fill="currentColor"
      />

      {/* Detail line on blade */}
      <path
        d="M 12 5 Q 9 10, 12 15 Q 15 10, 12 5"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}

export function TableTennisTableIcon({ className, size = 'base' }: TableTennisIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  return (
    <svg
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Table surface */}
      <rect
        x="2"
        y="10"
        width="20"
        height="4"
        rx="0.5"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Net */}
      <rect
        x="11.5"
        y="8"
        width="1"
        height="6"
        fill="currentColor"
        opacity="0.6"
      />

      {/* Left leg */}
      <rect
        x="5"
        y="14"
        width="1"
        height="6"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Right leg */}
      <rect
        x="18"
        y="14"
        width="1"
        height="6"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Center line */}
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="14"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  )
}
