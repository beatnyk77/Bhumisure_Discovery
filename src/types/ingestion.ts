export type IngestionStatus =
  | 'pending'
  | 'processing'
  | 'partial_success'
  | 'failed'
  | 'completed'

export interface IngestionJob {
  id: string
  reel_url: string
  status: IngestionStatus
  progress: number
  step_label: string | null
  result: (ExtractionResult & { dedup_info?: DedupResult; reel_url?: string }) | null
  error_log: string | null
  retry_count: number
  created_at: string
  updated_at: string
  completed_at: string | null
  listing_id: string | null
  source_type?: string | null
  manual_transcript?: string | null
}

export interface FieldConfidence {
  property_type: number
  rent_monthly: number
  locality: number
  furnishing: number
  floor: number
  preferred_tenant: number
  broker_name: number
  broker_phone: number
}

export interface ExtractionResult {
  property_type: string | null
  rent_monthly: number | null
  locality: string | null
  furnishing: string | null
  floor: number | null
  amenities: string[]
  preferred_tenant: string | null
  available_from: string | null
  broker_name: string | null
  broker_phone: string | null
  confidence_score: number
  field_confidence: FieldConfidence
  transcript: string
  instagram_handle: string | null
  // Anti-spam flags
  has_price: boolean
  has_location: boolean
}

export interface DedupResult {
  exact_url_match: boolean
  strict_hash_match: boolean
  loose_hash_match: boolean
  existing_listing_id: string | null
  scenario: 'clear' | 'exact_duplicate' | 'repriced_repost' | 'possible_duplicate'
}
