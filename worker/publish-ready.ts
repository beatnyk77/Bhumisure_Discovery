import { adminSupabase } from '../src/lib/supabase/admin'
import { publishListingFromJob } from '../src/lib/publish'
import { mapExtractionToPublishDefaults } from '../src/lib/publish-form'
import { ExtractionResult } from '../src/types/ingestion'
import { LOCALITY_BY_SLUG } from '../src/constants/localities'
import { PropertyType } from '../src/types/listing'

const MIN_RENT = 2000
const MAX_RENT = 200000

function normalizeAvailableFrom(value: string | null | undefined): string | null {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value
  return null
}

function normalizeTenantType(value: string | null | undefined) {
  if (!value) return 'Any' as const
  const lower = value.toLowerCase()
  if (lower.includes('family')) return 'Family' as const
  if (lower.includes('bachelor') || lower.includes('bachelors')) return 'Bachelor' as const
  if (lower.includes('girl')) return 'Girls' as const
  if (lower.includes('boy')) return 'Boys' as const
  return 'Any' as const
}

function normalizePropertyType(value: string | null | undefined): PropertyType | null {
  if (!value) return null
  const upper = value.toUpperCase().replace(/\s/g, '')
  const allowed: PropertyType[] = ['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room']
  return allowed.find((t) => upper.includes(t)) ?? null
}

async function main() {
  const { data: jobs } = await adminSupabase
    .from('ingestion_jobs')
    .select('id, reel_url, result')
    .eq('status', 'completed')
    .is('listing_id', null)

  let published = 0
  let skipped = 0

  for (const job of jobs ?? []) {
    const result = job.result as ExtractionResult | null
    if (!result) {
      skipped++
      continue
    }

    const defaults = mapExtractionToPublishDefaults(result, job.reel_url)
    const propertyType = normalizePropertyType(result.property_type)
    const locality = LOCALITY_BY_SLUG[defaults.locality_slug]

    if (!propertyType || !locality || !defaults.broker_phone) {
      console.log(`[Skip] ${job.id.slice(0, 8)} — missing type/locality/phone`)
      skipped++
      continue
    }

    if (defaults.rent_monthly < MIN_RENT || defaults.rent_monthly > MAX_RENT) {
      console.log(`[Skip] ${job.id.slice(0, 8)} — rent out of range: ${defaults.rent_monthly}`)
      skipped++
      continue
    }

    try {
      const listing = await publishListingFromJob({
        jobId: job.id,
        property_type: propertyType,
        rent_monthly: defaults.rent_monthly,
        locality_slug: defaults.locality_slug,
        broker_phone: defaults.broker_phone,
        broker_name: defaults.broker_name,
        furnishing: defaults.furnishing,
        floor: defaults.floor ?? null,
        preferred_tenant: normalizeTenantType(defaults.preferred_tenant),
        available_from: normalizeAvailableFrom(defaults.available_from),
        amenities: defaults.amenities,
        instagram_handle: defaults.instagram_handle,
      })
      published++
      console.log(`[Published] ${listing.id} — ${propertyType} ₹${defaults.rent_monthly} ${locality.name}`)
    } catch (err) {
      console.log(`[Fail] ${job.id.slice(0, 8)} — ${err instanceof Error ? err.message : 'unknown'}`)
      skipped++
    }
  }

  const { count } = await adminSupabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  console.log(`\nPublished ${published}, skipped ${skipped}. Active listings: ${count}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})