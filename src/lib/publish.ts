import { adminSupabase } from '@/lib/supabase/admin'
import { computeHashes } from '@/lib/ai/dedup'
import { ExtractionResult } from '@/types/ingestion'
import { FurnishingType, PropertyType, TenantType } from '@/types/listing'
import { LOCALITY_BY_SLUG } from '@/constants/cities'
import { normalizeIndianPhone } from '@/lib/utils/phone'

export interface PublishListingInput {
  jobId: string
  property_type: PropertyType
  rent_monthly: number
  locality_slug: string
  broker_phone: string
  broker_name?: string
  furnishing?: FurnishingType | null
  floor?: number | null
  preferred_tenant?: TenantType
  available_from?: string | null
  amenities?: string[]
  instagram_handle?: string | null
}

export async function publishListingFromJob(input: PublishListingInput) {
  const { data: job, error: jobError } = await adminSupabase
    .from('ingestion_jobs')
    .select('*')
    .eq('id', input.jobId)
    .single()

  if (jobError || !job) {
    throw new Error('Ingestion job not found')
  }

  if (job.status !== 'completed') {
    throw new Error('Job must be completed before publishing')
  }

  const locality = LOCALITY_BY_SLUG[input.locality_slug]
  if (!locality) {
    throw new Error('Invalid locality slug')
  }

  const { data: localityRow } = await adminSupabase
    .from('localities')
    .select('id')
    .eq('slug', input.locality_slug)
    .single()

  if (!localityRow) {
    throw new Error('Locality not found in database')
  }

  const extraction: ExtractionResult = {
    property_type: input.property_type,
    rent_monthly: input.rent_monthly,
    locality: input.locality_slug,
    furnishing: input.furnishing ?? null,
    floor: input.floor ?? null,
    amenities: input.amenities ?? [],
    preferred_tenant: input.preferred_tenant ?? 'Any',
    available_from: input.available_from ?? null,
    broker_name: input.broker_name ?? 'Broker',
    broker_phone: input.broker_phone,
    confidence_score: (job.result as ExtractionResult)?.confidence_score ?? 0,
    field_confidence: (job.result as ExtractionResult)?.field_confidence ?? {
      property_type: 0,
      rent_monthly: 0,
      locality: 0,
      furnishing: 0,
      floor: 0,
      preferred_tenant: 0,
      broker_name: 0,
      broker_phone: 0,
    },
    transcript: (job.result as ExtractionResult)?.transcript ?? '',
    instagram_handle: input.instagram_handle ?? null,
    has_price: true,
    has_location: true,
  }

  const hashes = computeHashes(extraction)
  const title = `${input.property_type} in ${locality.name}`
  const phone = normalizeIndianPhone(input.broker_phone)

  const { data: listing, error: insertError } = await adminSupabase
    .from('listings')
    .insert({
      reel_url: job.reel_url,
      instagram_handle: input.instagram_handle,
      source: 'operator_ingestion',
      property_type: input.property_type,
      locality_id: localityRow.id,
      locality_slug: input.locality_slug,
      rent_monthly: input.rent_monthly,
      furnishing: input.furnishing,
      floor: input.floor,
      amenities: input.amenities ?? [],
      preferred_tenant: input.preferred_tenant ?? 'Any',
      available_from: input.available_from,
      broker_name: input.broker_name ?? 'Broker',
      broker_phone: phone,
      broker_instagram: input.instagram_handle,
      status: 'active',
      title,
      structural_hash: hashes.structural_hash,
      listing_hash: hashes.listing_hash,
      confidence_score: extraction.confidence_score,
      last_verified_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertError || !listing) {
    throw new Error(insertError?.message || 'Failed to create listing')
  }

  await adminSupabase.from('listing_events').insert({
    listing_id: listing.id,
    event_type: 'published',
    payload: { job_id: input.jobId, source: job.source_type },
  })

  await adminSupabase
    .from('ingestion_jobs')
    .update({ listing_id: listing.id })
    .eq('id', input.jobId)

  return listing
}