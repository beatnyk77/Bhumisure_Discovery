import { createSupabaseServerClient } from './supabase/server'
import { SearchParams, SearchResult } from '@/types/search'
import { ListingCardData } from '@/types/listing'

const DEFAULT_PER_PAGE = 20

export async function searchListings(params: SearchParams): Promise<SearchResult> {
  const supabase = createSupabaseServerClient()
  const page = Math.max(params.page || 1, 1)
  const perPage = Math.min(Math.max(params.per_page || DEFAULT_PER_PAGE, 1), 50)

  const { data, error } = await supabase.rpc('search_listings', {
    p_locality_slugs: params.locality || null,
    p_property_type: params.property_type || null,
    p_min_rent: params.min_rent || null,
    p_max_rent: params.max_rent || null,
    p_furnishing_types: params.furnishing || null,
    p_tenant_type: params.preferred_tenant || null,
    p_sort_by: params.sort || 'newest',
    p_page: page,
    p_per_page: perPage,
    p_city: params.city || null,
  })

  if (error) {
    console.error('[Search] Error fetching listings:', error)
    return { listings: [], total: 0, page, per_page: perPage, has_more: false }
  }

  const rows = data ?? []
  const total = rows[0]?.total_count || 0

  const listings: ListingCardData[] = rows.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    reel_url: row.reel_url as string,
    property_type: row.property_type as ListingCardData['property_type'],
    locality_slug: row.locality_slug as string,
    locality_name: row.locality_name as string,
    rent_monthly: row.rent_monthly as number,
    furnishing: row.furnishing as ListingCardData['furnishing'],
    floor: null,
    preferred_tenant: 'Any',
    broker_name: row.broker_name as string,
    broker_phone: row.broker_phone as string,
    thumbnail_url: row.thumbnail_url as string | null,
    status: 'active',
    created_at: row.created_at as string,
    expiry_date: '',
    last_verified_at: row.last_verified_at as string | null,
    view_count: 0,
    enquiry_count: 0,
    title: row.title as string,
  }))

  return {
    listings,
    total: Number(total),
    page,
    per_page: perPage,
    has_more: Number(total) > page * perPage,
  }
}