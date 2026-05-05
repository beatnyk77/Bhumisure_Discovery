import OpenAI from 'openai'
import { ExtractionResult } from '@/types/ingestion'
import { INDORE_LOCALITIES } from '@/constants/localities'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `
You are an expert real estate data extractor for BhumiSure, a platform in Indore, India.
Your task is to extract structured information from a property reel transcript or caption.

RULES:
1. Rent must be a number (monthly).
2. Locality must be one of the approved slugs or names from the provided list.
3. Identify if the property is 1BHK, 2BHK, 3BHK, RK, or Studio.
4. Note the furnishing status (Unfurnished, Semi-furnished, Fully-furnished).
5. Extract broker contact if available.
6. Check for "Anti-spam" criteria: Does it have a clear price and a clear location?

APPROVED LOCALITIES:
${INDORE_LOCALITIES.map(l => `- ${l.name} (Slug: ${l.slug})`).join('\n')}

OUTPUT FORMAT: JSON only.
`

export async function extractFieldsFromText(text: string, instagramHandle?: string | null): Promise<ExtractionResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Extract data from this text: "${text}"` }
    ],
    response_format: { type: 'json_object' }
  })

  const raw = JSON.parse(response.choices[0].message.content || '{}')

  // Map raw GPT output to our ExtractionResult type
  return {
    property_type: raw.property_type || null,
    rent_monthly: raw.rent_monthly || null,
    locality: raw.locality_slug || raw.locality || null,
    furnishing: raw.furnishing || null,
    floor: raw.floor || null,
    amenities: raw.amenities || [],
    preferred_tenant: raw.preferred_tenant || null,
    available_from: raw.available_from || null,
    broker_name: raw.broker_name || null,
    broker_phone: raw.broker_phone || null,
    confidence_score: raw.confidence_score || 0,
    field_confidence: raw.field_confidence || {
      property_type: 0,
      rent_monthly: 0,
      locality: 0,
      furnishing: 0,
      floor: 0,
      preferred_tenant: 0,
      broker_name: 0,
      broker_phone: 0,
    },
    transcript: text,
    instagram_handle: instagramHandle || null,
    has_price: !!raw.rent_monthly,
    has_location: !!(raw.locality_slug || raw.locality),
  }
}
