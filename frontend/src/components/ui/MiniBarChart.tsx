import { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface MiniBarChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  width?: number
  height?: number
  className?: string
  barGap?: number
  showValues?: boolean
}

export function MiniBarChart({
  data,
  width = 200,
  height = 60,
  className,
  barGap = 4,
  showValues = false,
}: MiniBarChartProps) {
  const { maxValue, barWidth } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 1)
    const totalGap = barGap * (data.length - 1)
    const availableWidth = width - totalGap
    const bWidth = availableWidth / data.length

    return { maxValue: max, barWidth: bWidth }
  }, [data, width, barGap])

  if (data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-gray-300', className)}
        style={{ width, height }}
        role="img"
        aria-label="No data available"
      >
        <span className="text-xs">No data</span>
      </div>
    )
  }

  const ariaLabel = `Bar chart with ${data.length} items: ${data
    .map((item) => `${item.label} ${item.value}`)
    .join(', ')}`

  return (
    <div
      className={cn('relative', className)}
      style={{ width, height }}
      role="img"
      aria-label={ariaLabel}
    >
      <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height
          const x = index * (barWidth + barGap)
          const y = height - barHeight
          const color = item.color || 'rgb(var(--color-primary-500, 13, 110, 253))'

          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="2"
                className="transition-all duration-300 hover:opacity-80"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </rect>

              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {item.value}
                </text>
              )}

              {/* Bar label */}
              <text
                x={x + barWidth / 2}
                y={height + 12}
                textAnchor="middle"
                className="text-xs fill-gray-500"
                fontSize="10"
              >
                {item.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
