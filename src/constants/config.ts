export const APP_CONFIG = {
  LISTING_TTL_DAYS: 45,
  EXPIRY_WARNING_DAYS: 7,
  ARCHIVE_AFTER_EXPIRED_DAYS: 30,
  RENT_BUCKET_ROUNDING: 1000,     // round to nearest ₹1,000 for dedup
  MAX_INGESTION_RETRIES: 3,
  INGESTION_TIMEOUT_MS: 90_000,   // 90s target
  JUST_LISTED_DAYS: 3,
  PILOT_CITY: 'indore',
  MVP_LISTING_TARGET: 200,
} as const

export const WHATSAPP_TEMPLATES = {
  EXPIRY_NUDGE: 'Your listing for {{address}} expires in 7 days. Reply YES to keep it active.',
  RENEWAL_CONFIRM: '✅ Your listing for {{address}} has been renewed for 30 days.',
  RENTED_CONFIRM: '🎉 Listing closed. It took {{days}} days and {{enquiries}} enquiries. Post a new one? {{link}}',
} as const
