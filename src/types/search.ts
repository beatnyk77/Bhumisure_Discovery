import type { PropertyType, FurnishingType, TenantType } from './listing'

export interface SearchParams {
  q?: string
  locality?: string[]
  property_type?: PropertyType
  min_rent?: number
  max_rent?: number
  furnishing?: FurnishingType[]
  preferred_tenant?: TenantType
  available_from?: string
  sort?: 'newest' | 'rent_asc' | 'rent_desc' | 'verified_recent'
  page?: number
  per_page?: number
}

export interface SearchResult {
  listings: import('./listing').ListingCardData[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}
