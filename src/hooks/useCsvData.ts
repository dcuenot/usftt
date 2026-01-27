import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useCsvData<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[useCsvData] Fetching:', url)
        setLoading(true)
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const csvText = await response.text()
        console.log('[useCsvData] CSV text length:', csvText.length, 'characters')

        Papa.parse<T>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Auto-convert numbers
          complete: (results) => {
            console.log('[useCsvData] Parsed rows:', results.data.length)
            console.log('[useCsvData] First row:', results.data[0])
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
  }, [url])

  return { data, loading, error }
}
