import { createHash } from 'crypto'
import { adminSupabase } from '../supabase/admin'
import { ExtractionResult, DedupResult } from '@/types/ingestion'
import { APP_CONFIG } from '@/constants/config'

function generateHash(input: string): string {
  return createHash('md5').update(input.toLowerCase().trim()).digest('hex')
}

export async function checkDuplicates(
  result: ExtractionResult,
  reelUrl: string
): Promise<DedupResult> {
  // 1. Exact URL match (Already checked in API route, but good to double check)
  const { data: urlMatch } = await adminSupabase
    .from('listings')
    .select('id')
    .eq('reel_url', reelUrl)
    .single()

  if (urlMatch) {
    return {
      exact_url_match: true,
      strict_hash_match: false,
      loose_hash_match: false,
      existing_listing_id: urlMatch.id,
      scenario: 'exact_duplicate',
    }
  }

  // 2. Prepare Hash Inputs
  const locality = result.locality || 'unknown'
  const bhk = result.property_type || 'unknown'
  const broker = result.broker_phone || result.instagram_handle || 'anonymous'
  
  // Rent bucket: round to nearest config value (e.g. 1000)
  const rent = result.rent_monthly || 0
  const rentBucket = Math.round(rent / APP_CONFIG.RENT_BUCKET_ROUNDING) * APP_CONFIG.RENT_BUCKET_ROUNDING

  const structuralInput = `${locality}|${bhk}|${broker}`
  const listingInput = `${structuralInput}|${rentBucket}`

  const structuralHash = generateHash(structuralInput)
  const listingHash = generateHash(listingInput)

  // 3. Check for Listing Hash match (Exact same property and price)
  const { data: strictMatch } = await adminSupabase
    .from('listings')
    .select('id')
    .eq('listing_hash', listingHash)
    .eq('status', 'active')
    .single()

  if (strictMatch) {
    return {
      exact_url_match: false,
      strict_hash_match: true,
      loose_hash_match: true,
      existing_listing_id: strictMatch.id,
      scenario: 'exact_duplicate',
    }
  }

  // 4. Check for Structural Hash match (Same property, maybe different price or repost)
  const { data: looseMatch } = await adminSupabase
    .from('listings')
    .select('id')
    .eq('structural_hash', structuralHash)
    .eq('status', 'active')
    .single()

  if (looseMatch) {
    return {
      exact_url_match: false,
      strict_hash_match: false,
      loose_hash_match: true,
      existing_listing_id: looseMatch.id,
      scenario: 'repriced_repost',
    }
  }

  return {
    exact_url_match: false,
    strict_hash_match: false,
    loose_hash_match: false,
    existing_listing_id: null,
    scenario: 'clear',
  }
}

export function computeHashes(result: ExtractionResult) {
  const locality = result.locality || 'unknown'
  const bhk = result.property_type || 'unknown'
  const broker = result.broker_phone || result.instagram_handle || 'anonymous'
  const rent = result.rent_monthly || 0
  const rentBucket = Math.round(rent / APP_CONFIG.RENT_BUCKET_ROUNDING) * APP_CONFIG.RENT_BUCKET_ROUNDING

  const structuralInput = `${locality}|${bhk}|${broker}`
  const listingInput = `${structuralInput}|${rentBucket}`

  return {
    structural_hash: generateHash(structuralInput),
    listing_hash: generateHash(listingInput)
  }
}
