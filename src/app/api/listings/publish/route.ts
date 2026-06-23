import { NextRequest, NextResponse } from 'next/server'
import { publishListingFromJob, PublishListingInput } from '@/lib/publish'
import { FurnishingType, PropertyType, TenantType } from '@/types/listing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const input: PublishListingInput = {
      jobId: body.jobId,
      property_type: body.property_type as PropertyType,
      rent_monthly: Number(body.rent_monthly),
      locality_slug: body.locality_slug,
      broker_phone: body.broker_phone,
      broker_name: body.broker_name,
      furnishing: body.furnishing as FurnishingType | null,
      floor: body.floor != null ? Number(body.floor) : null,
      preferred_tenant: (body.preferred_tenant as TenantType) || 'Any',
      available_from: body.available_from,
      amenities: body.amenities,
      instagram_handle: body.instagram_handle,
    }

    if (!input.jobId || !input.property_type || !input.rent_monthly || !input.locality_slug || !input.broker_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const listing = await publishListingFromJob(input)
    return NextResponse.json({ listingId: listing.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Publish failed'
    console.error('[API Publish]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}