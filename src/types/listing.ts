// =====================
// Core Domain Types
// =====================

export type PropertyType = '1BHK' | '2BHK' | '3BHK' | 'PG' | 'Studio' | 'Room'
export type FurnishingType = 'Bare' | 'Semi' | 'Full'
export type TenantType = 'Family' | 'Bachelor' | 'Girls' | 'Boys' | 'Any'
export type ListingStatus = 'draft' | 'active' | 'expiring_soon' | 'expired' | 'rented' | 'archived'
export type ListingSource = 'operator_ingestion' | 'broker_native' | 'user_submitted'

export interface PriceHistoryEntry {
  amount: number
  changed_at: string
  changed_by: string | null
}

export interface Listing {
  id: string
  reel_url: string
  instagram_handle: string | null
  source: ListingSource
  property_type: PropertyType
  locality_id: string | null
  locality_slug: string
  rent_monthly: number
  furnishing: FurnishingType | null
  floor: number | null
  amenities: string[]
  preferred_tenant: TenantType
  available_from: string | null
  broker_id: string | null
  broker_name: string
  broker_phone: string
  broker_instagram: string | null
  thumbnail_url: string | null
  status: ListingStatus
  created_at: string
  expiry_date: string
  last_verified_at: string | null
  rented_at: string | null
  days_to_rent: number | null
  structural_hash: string | null
  listing_hash: string | null
  confidence_score: number | null
  price_history: PriceHistoryEntry[]
  view_count: number
  enquiry_count: number
}

export type ListingCardData = Pick<
  Listing,
  | 'id' | 'reel_url' | 'property_type' | 'locality_slug'
  | 'rent_monthly' | 'furnishing' | 'floor' | 'preferred_tenant'
  | 'broker_name' | 'broker_phone' | 'thumbnail_url'
  | 'status' | 'created_at' | 'expiry_date' | 'last_verified_at'
  | 'view_count' | 'enquiry_count'
>
