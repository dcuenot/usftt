import { useState, useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface RangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  label?: string
  className?: string
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  className,
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value)
    const newValue: [number, number] = [
      Math.min(newMin, localValue[1] - step),
      localValue[1],
    ]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value)
    const newValue: [number, number] = [
      localValue[0],
      Math.max(newMax, localValue[0] + step),
    ]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100
  }

  const minPercent = getPercentage(localValue[0])
  const maxPercent = getPercentage(localValue[1])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className="relative pt-1 pb-6">
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {/* Active range */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />
        </div>

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:border-primary',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-moz-range-thumb]:pointer-events-auto',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-primary',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:shadow-md',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2'
          )}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          aria-label={`Minimum ${label || 'value'}`}
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className={cn(
            'absolute w-full h-2 appearance-none bg-transparent pointer-events-none',
            '[&::-webkit-slider-thumb]:pointer-events-auto',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-white',
            '[&::-webkit-slider-thumb]:border-2',
            '[&::-webkit-slider-thumb]:border-primary',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-moz-range-thumb]:pointer-events-auto',
            '[&::-moz-range-thumb]:appearance-none',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-white',
            '[&::-moz-range-thumb]:border-2',
            '[&::-moz-range-thumb]:border-primary',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:shadow-md',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2'
          )}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          aria-label={`Maximum ${label || 'value'}`}
        />

        {/* Value labels */}
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-8">
          <span className="font-medium">{localValue[0]}</span>
          <span className="font-medium">{localValue[1]}</span>
        </div>
      </div>
    </div>
  )
}
