import { useState, useEffect } from 'react'
import Papa from 'papaparse'

// Simple in-memory cache for CSV data
interface CacheEntry<T> {
  data: T[]
  lastModified: Date | null
  timestamp: number
}

const csvCache = new Map<string, CacheEntry<any>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function useCsvData<T>(url: string, options?: { noCache?: boolean }) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastModified, setLastModified] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[useCsvData] Fetching:', url)
        setLoading(true)

        // Check cache first
        if (!options?.noCache) {
          const cached = csvCache.get(url)
          const now = Date.now()

          if (cached && now - cached.timestamp < CACHE_TTL) {
            console.log('[useCsvData] Using cached data for:', url)
            setData(cached.data)
            setLastModified(cached.lastModified)
            setLoading(false)
            return
          }
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        // Extract Last-Modified header
        const lastModifiedHeader = response.headers.get('Last-Modified')
        const lastModifiedDate = lastModifiedHeader ? new Date(lastModifiedHeader) : null
        setLastModified(lastModifiedDate)

        const csvText = await response.text()
        console.log('[useCsvData] CSV text length:', csvText.length, 'characters')

        Papa.parse<T>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Auto-convert numbers
          complete: (results) => {
            console.log('[useCsvData] Parsed rows:', results.data.length)
            console.log('[useCsvData] First row:', results.data[0])

            // Store in cache
            csvCache.set(url, {
              data: results.data,
              lastModified: lastModifiedDate,
              timestamp: Date.now(),
            })

            setData(results.data)
            setLoading(false)
          },
          error: (err: Error) => {
            console.error('[useCsvData] Parse error:', err)
            setError(err)
            setLoading(false)
          }
        })
      } catch (err) {
        console.error('[useCsvData] Fetch error:', err)
        setError(err as Error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options?.noCache])

  return { data, loading, error, lastModified }
}
