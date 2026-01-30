import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  format?: (n: number) => string
  decimals?: number
}

/**
 * AnimatedNumber component with smooth count-up animation
 *
 * Features:
 * - Smooth easeOutExpo easing for natural deceleration
 * - 60fps animation using requestAnimationFrame
 * - Customizable duration and formatting
 * - Automatic cleanup on unmount
 *
 * @example
 * <AnimatedNumber value={1234} duration={1000} />
 * <AnimatedNumber value={42.5} decimals={1} format={(n) => `${n}%`} />
 */
export function AnimatedNumber({
  value,
  duration = 1000,
  className = '',
  format = (n) => n.toString(),
  decimals = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function: easeOutExpo
      // Starts fast, decelerates smoothly
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      // Calculate current value based on easing
      const currentValue = eased * value

      // Round to specified decimals
      const roundedValue = decimals > 0
        ? Math.round(currentValue * Math.pow(10, decimals)) / Math.pow(10, decimals)
        : Math.floor(currentValue)

      setDisplayValue(roundedValue)

      // Continue animation if not complete
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animationFrame = requestAnimationFrame(animate)

    // Cleanup on unmount or value change
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration, decimals])

  return <span className={className}>{format(displayValue)}</span>
}
