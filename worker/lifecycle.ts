import { adminSupabase } from '../src/lib/supabase/admin'
import { APP_CONFIG } from '../src/constants/config'

async function checkExpiries() {
  console.log('[Lifecycle] Checking for expired listings...')

  const now = new Date()

  const { data: expired, error: expError } = await adminSupabase
    .from('listings')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('expiry_date', now.toISOString().slice(0, 10))
    .select('id')

  if (expError) console.error('[Lifecycle] Error expiring listings:', expError)
  else if (expired?.length) console.log(`[Lifecycle] Expired ${expired.length} listings.`)

  const warningDate = new Date()
  warningDate.setDate(warningDate.getDate() + APP_CONFIG.EXPIRY_WARNING_DAYS)

  const { data: needsNudge, error: nudgeError } = await adminSupabase
    .from('listings')
    .select('id, broker_phone, locality_slug')
    .eq('status', 'active')
    .lte('expiry_date', warningDate.toISOString().slice(0, 10))
    .gt('expiry_date', now.toISOString().slice(0, 10))

  if (nudgeError) {
    console.error('[Lifecycle] Error fetching nudge candidates:', nudgeError)
  } else {
    for (const listing of needsNudge ?? []) {
      console.log(`[Lifecycle] NUDGE REQUIRED: Listing ${listing.id} (${listing.locality_slug}) → ${listing.broker_phone}`)
    }
  }
}

async function main() {
  console.log('[Lifecycle] Worker started.')
  await checkExpiries()
  console.log('[Lifecycle] Done.')
  process.exit(0)
}

main()