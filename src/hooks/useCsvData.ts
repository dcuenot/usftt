import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useCsvData<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        const csvText = await response.text()

        Papa.parse<T>(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Auto-convert numbers
          complete: (results) => {
            setData(results.data)
            setLoading(false)
          },
          error: (err: Error) => {
            setError(err)
            setLoading(false)
          }
        })
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
