import { useMemo } from 'react'
import { cn } from '@/utils/cn'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
  color?: string
  fillColor?: string
  showArea?: boolean
}

export function Sparkline({
  data,
  width = 100,
  height = 32,
  className,
  color = 'currentColor',
  fillColor,
  showArea = false,
}: SparklineProps) {
  const points = useMemo(() => {
    if (data.length === 0) return ''

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const xStep = width / (data.length - 1 || 1)
    const yScale = height / range

    return data
      .map((value, index) => {
        const x = index * xStep
        const y = height - (value - min) * yScale
        return `${x},${y}`
      })
      .join(' ')
  }, [data, width, height])

  const pathD = useMemo(() => {
    if (!points) return ''
    return `M ${points}`
  }, [points])

  const areaD = useMemo(() => {
    if (!points || !showArea) return ''
    const lastX = width
    return `M 0,${height} L ${points} L ${lastX},${height} Z`
  }, [points, showArea, width, height])

  if (data.length === 0) {
    return (
      <div
        className={cn('text-gray-300', className)}
        style={{ width, height }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="No data available"
        >
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        </svg>
      </div>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const ariaLabel = `Trend chart showing values from ${min} to ${max}`

  return (
    <div className={className} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
      >
        {showArea && fillColor && areaD && (
          <path d={areaD} fill={fillColor} opacity="0.2" />
        )}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
