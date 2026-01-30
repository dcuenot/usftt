/**
 * Export utilities for CSV and Excel downloads
 */

/**
 * Convert data to CSV format
 */
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: Array<{ key: string; label: string }>
): string {
  if (data.length === 0) return ''

  // Create header row
  const headerRow = headers.map((h) => h.label).join(',')

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((h) => {
        const value = row[h.key]
        // Handle values that contain commas, quotes, or newlines
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  // Add BOM for proper Excel UTF-8 encoding
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string, extension: 'csv' = 'csv'): string {
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_')
  return `${prefix}_${timestamp}.${extension}`
}

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: Array<{ key: string; label: string }>,
  filename: string
): void {
  const csv = convertToCSV(data, headers)
  downloadCSV(csv, filename)
}
