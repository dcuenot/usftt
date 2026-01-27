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
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
