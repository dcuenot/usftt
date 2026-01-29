import { useState, useEffect } from 'react'

/**
 * Hook to detect media query matches
 * @param query - Media query string (e.g., '(max-width: 767px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Create listener
    const listener = () => setMatches(media.matches)

    // Add listener
    media.addEventListener('change', listener)

    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

/**
 * Convenience hook for mobile devices (< 768px)
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

/**
 * Convenience hook for tablet devices (768px - 1023px)
 */
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

/**
 * Convenience hook for desktop devices (>= 1024px)
 */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
