import { getSupabaseBrowserClient } from './supabase/client'
import { SearchParams, SearchResult } from '@/types/search'

export async function searchListings(params: SearchParams): Promise<SearchResult> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.rpc('search_listings', {
    p_locality_slugs: params.locality || null,
    p_property_type: params.property_type || null,
    p_min_rent: params.min_rent || null,
    p_max_rent: params.max_rent || null,
    p_furnishing_types: params.furnishing || null,
    p_tenant_type: params.preferred_tenant || null,
    p_sort_by: params.sort || 'newest',
  })

  if (error) {
    console.error('[Search] Error fetching listings:', error)
    return { listings: [], total: 0, page: 1, per_page: 20, has_more: false }
  }

  const total = data?.[0]?.total_count || 0

  return {
    listings: data || [],
    total: Number(total),
    page: params.page || 1,
    per_page: 20,
    has_more: total > (params.page || 1) * 20,
  }
}
