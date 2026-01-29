interface ProgressionBadgeProps {
  value: number
}

export function ProgressionBadge({ value }: ProgressionBadgeProps) {
  const rounded = Math.round(value)

  const colorClass = rounded > 0
    ? 'text-victory'
    : rounded < 0
    ? 'text-defeat'
    : 'text-gray-600'

  return (
    <span className={`font-medium ${colorClass}`}>
      {rounded > 0 ? '+' : ''}{rounded}
    </span>
  )
}
