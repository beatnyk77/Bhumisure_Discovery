import { adminSupabase } from '@/lib/supabase/admin'

function localityCity(localities: unknown): string | null {
  if (!localities || typeof localities !== 'object') return null
  if (Array.isArray(localities)) {
    const first = localities[0] as { city?: string } | undefined
    return first?.city ?? null
  }
  return (localities as { city?: string }).city ?? null
}

export async function getActiveListingCountsByCity(): Promise<Record<string, number>> {
  const { data, error } = await adminSupabase
    .from('listings')
    .select('locality_slug, localities!inner(city)')
    .eq('status', 'active')

  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    const city = localityCity(row.localities)
    if (!city) continue
    counts[city] = (counts[city] ?? 0) + 1
  }
  return counts
}

export async function getActiveListingCountsByLocality(citySlug?: string): Promise<Record<string, number>> {
  let query = adminSupabase
    .from('listings')
    .select('locality_slug, localities!inner(city)')
    .eq('status', 'active')

  if (citySlug) {
    query = query.eq('localities.city', citySlug)
  }

  const { data, error } = await query

  if (error) throw error

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    if (!row.locality_slug) continue
    counts[row.locality_slug] = (counts[row.locality_slug] ?? 0) + 1
  }
  return counts
}