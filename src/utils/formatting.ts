export function round(value: number | string): number {
  const num = parseFloat(value as string)
  if (isNaN(num)) return 0
  if (Number.isInteger(num)) return num
  return Math.round(num * 10) / 10
}

export function formatProgression(value: number): string {
  const num = parseFloat(value as any)
  if (isNaN(num)) return ''
  return Math.round(num).toString()
}

export function formatDate(dateString: string): string {
  // Handle DD/MM/YYYY format from CSV
  if (dateString && dateString.includes('/')) {
    const [day, month, year] = dateString.split('/')
    const date = new Date(`${year}-${month}-${day}`)

    if (isNaN(date.getTime())) {
      return dateString // Return original if parsing fails
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  // Fallback for other formats
  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return dateString // Return original if parsing fails
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
