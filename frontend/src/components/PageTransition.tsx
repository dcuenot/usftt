import { useEffect, useRef, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Trigger animation by resetting the animation
    if (containerRef.current) {
      containerRef.current.style.animation = 'none'
      // Force reflow
      void containerRef.current.offsetHeight
      containerRef.current.style.animation = ''
    }
  }, [location.pathname])

  return (
    <div
      ref={containerRef}
      className={cn('animate-fadeIn', className)}
      style={{ animationDuration: '300ms' }}
    >
      {children}
    </div>
  )
}
