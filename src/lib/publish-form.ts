import { ExtractionResult } from '@/types/ingestion'
import { FurnishingType, PropertyType, TenantType } from '@/types/listing'

function normalizeFurnishing(value: string | null | undefined): FurnishingType | null {
  if (!value) return null
  const lower = value.toLowerCase()
  if (lower.includes('full')) return 'Full'
  if (lower.includes('semi')) return 'Semi'
  if (lower.includes('bare') || lower.includes('unfurn')) return 'Bare'
  return null
}

function normalizePropertyType(value: string): PropertyType | null {
  const upper = value.toUpperCase().replace(/\s/g, '')
  const allowed: PropertyType[] = ['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room']
  return allowed.find((t) => upper.includes(t)) ?? null
}

export function mapExtractionToPublishDefaults(result: ExtractionResult, reelUrl: string) {
  return {
    property_type: normalizePropertyType(result.property_type || '') || ('1BHK' as PropertyType),
    rent_monthly: result.rent_monthly ?? 0,
    locality_slug: result.locality || 'vijay_nagar',
    broker_phone: result.broker_phone || '',
    broker_name: result.broker_name || 'Broker',
    furnishing: normalizeFurnishing(result.furnishing),
    floor: result.floor,
    preferred_tenant: (result.preferred_tenant as TenantType) || 'Any',
    available_from: result.available_from,
    amenities: result.amenities,
    instagram_handle: result.instagram_handle,
    reel_url: reelUrl,
  }
}