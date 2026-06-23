import { CITY_REGISTRY, CITIES_BY_SLUG } from './registry'
import { INDORE_LOCALITIES } from './indore-localities'
import type { CityDefinition, CityStatus, LocalityEntry } from './types'

export type { CityDefinition, CityStatus, LocalityEntry }
export { CITY_REGISTRY, CITIES_BY_SLUG, INDORE_LOCALITIES }

export function getCity(slug: string): CityDefinition | undefined {
  return CITIES_BY_SLUG[slug.toLowerCase()]
}

export function getLiveCities(): CityDefinition[] {
  return CITY_REGISTRY.filter((c) => c.status === 'live')
}

export function getComingSoonCities(): CityDefinition[] {
  return CITY_REGISTRY.filter((c) => c.status === 'coming_soon')
}

export function isCityLive(slug: string): boolean {
  return getCity(slug)?.status === 'live'
}

export function getCityLocalities(citySlug: string): LocalityEntry[] {
  return getCity(citySlug)?.localities ?? []
}

export function getLocalityInCity(citySlug: string, localitySlug: string): LocalityEntry | undefined {
  return getCityLocalities(citySlug).find((l) => l.slug === localitySlug)
}

export function getLocalityMapByCity(citySlug: string): Record<string, LocalityEntry> {
  return Object.fromEntries(getCityLocalities(citySlug).map((l) => [l.slug, l]))
}

/** @deprecated Use getCityLocalities('indore') — kept for AI extraction */
export const LOCALITY_BY_SLUG = Object.fromEntries(INDORE_LOCALITIES.map((l) => [l.slug, l]))