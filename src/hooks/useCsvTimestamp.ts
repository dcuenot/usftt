import { useState, useEffect } from 'react'
import { getCsvLastModified } from '@/utils/timestamp'

/**
 * Hook to fetch and track the last modified timestamp of a CSV file
 */
export function useCsvTimestamp(url: string) {
  const [lastModified, setLastModified] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimestamp = async () => {
      setLoading(true)
      const timestamp = await getCsvLastModified(url)
      setLastModified(timestamp)
      setLoading(false)
    }

    fetchTimestamp()
  }, [url])

  return { lastModified, loading }
}
