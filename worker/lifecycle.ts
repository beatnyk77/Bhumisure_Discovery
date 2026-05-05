import { adminSupabase } from '../src/lib/supabase/admin'
import { APP_CONFIG } from '../src/constants/config'

async function checkExpiries() {
  console.log('[Lifecycle] Checking for expired listings...')

  const now = new Date()
  const expiryThreshold = new Date(now.getTime() - APP_CONFIG.LISTING_TTL_DAYS * 24 * 60 * 60 * 1000)
  const warningThreshold = new Date(now.getTime() - (APP_CONFIG.LISTING_TTL_DAYS - APP_CONFIG.EXPIRY_WARNING_DAYS) * 24 * 60 * 60 * 1000)

  // 1. Mark listings as expired
  const { data: expired, error: expError } = await adminSupabase
    .from('listings')
    .update({ status: 'expired', updated_at: now.toISOString() })
    .eq('status', 'active')
    .lt('created_at', expiryThreshold.toISOString())
    .select('id')

  if (expError) console.error('[Lifecycle] Error expiring listings:', expError)
  else if (expired?.length) console.log(`[Lifecycle] Expired ${expired.length} listings.`)

  // 2. Identify listings needing warning nudges
  // In a real app, we'd check a 'last_nudged_at' column to avoid double-nudging
  const { data: needsNudge, error: nudgeError } = await adminSupabase
    .from('listings')
    .select('id, title, broker_id, brokers(whatsapp_number)')
    .eq('status', 'active')
    .lt('created_at', warningThreshold.toISOString())
    .gt('created_at', expiryThreshold.toISOString())

  if (nudgeError) {
    console.error('[Lifecycle] Error fetching nudge candidates:', nudgeError)
  } else {
    for (const listing of (needsNudge || [])) {
      console.log(`[Lifecycle] NUDGE REQUIRED: Listing ${listing.id} for broker ${listing.broker_id}`)
      // Here we would call Twilio WhatsApp API
    }
  }
}

async function main() {
  console.log('[Lifecycle] Worker started.')
  // Run once and exit (usually triggered by a cron job)
  await checkExpiries()
  console.log('[Lifecycle] Done.')
  process.exit(0)
}

main()
