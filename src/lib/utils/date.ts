export function daysAgo(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

export function formatListedAgo(dateString: string): string {
  const days = daysAgo(dateString)
  if (days === 0) return 'Listed today'
  if (days === 1) return 'Listed 1 day ago'
  return `Listed ${days} days ago`
}

export function formatVerifiedAgo(dateString: string | null): string | null {
  if (!dateString) return null
  const days = daysAgo(dateString)
  if (days > 30) return null
  if (days === 0) return 'Verified today'
  if (days === 1) return 'Verified 1 day ago'
  return `Verified ${days} days ago`
}