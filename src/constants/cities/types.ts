export type CityStatus = 'live' | 'coming_soon'

export interface LocalityEntry {
  slug: string
  name: string
  zone: string
  aliases: string[]
  lat: number
  lng: number
}

export interface CityDefinition {
  slug: string
  name: string
  state: string
  country: string
  status: CityStatus
  tagline: string
  accent: string
  accentMuted: string
  center: { lat: number; lng: number }
  featuredLocalitySlugs: string[]
  localities: LocalityEntry[]
}