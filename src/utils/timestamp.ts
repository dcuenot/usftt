/**
 * Fetch the last modified timestamp for a CSV file
 * Tries HEAD request first for efficiency, falls back to GET if needed
 */
export async function getCsvLastModified(url: string): Promise<Date | null> {
  try {
    // Try HEAD request first (more efficient)
    const response = await fetch(url, { method: 'HEAD' })
    const lastModified = response.headers.get('Last-Modified')

    if (lastModified) {
      return new Date(lastModified)
    }

    // Fallback: If HEAD doesn't work, use GET and check headers
    const fullResponse = await fetch(url)
    const fallbackLastModified = fullResponse.headers.get('Last-Modified')

    return fallbackLastModified ? new Date(fallbackLastModified) : null
  } catch (error) {
    console.error('Failed to fetch CSV timestamp:', error)
    return null
  }
}

/**
 * Format timestamp for display in French format
 * @example "Dernière mise à jour: 27/01/2026 à 14:30"
 */
export function formatLastUpdate(date: Date): string {
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  const timeStr = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  return `Dernière mise à jour: ${dateStr} à ${timeStr}`
}

/**
 * Get relative time string in French (e.g., "il y a 2 heures")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "à l'instant"
  if (diffMins < 60) return `il y a ${diffMins} min`
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays < 7) return `il y a ${diffDays}j`

  return formatLastUpdate(date)
}
