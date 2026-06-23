import { ExtractionResult } from '@/types/ingestion'
import { INDORE_LOCALITIES } from '@/constants/cities'
import { getOpenRouterClient, getOpenRouterModel, parseJsonFromModelResponse } from './openrouter'

const SYSTEM_PROMPT = `
You are an expert real estate data extractor for BhumiSure, a platform in Indore, India.
Your task is to extract structured information from a property reel transcript or caption.

RULES:
1. Rent must be a number (monthly, in INR).
2. locality_slug must be one of the approved slugs from the list below.
3. property_type must be one of: 1BHK, 2BHK, 3BHK, PG, Studio, Room.
4. furnishing must be one of: Bare, Semi, Full (or null if unknown).
5. Extract broker contact if available (Indian phone numbers).
6. Set has_price true only if rent_monthly is present.
7. Set has_location true only if locality_slug is present.

APPROVED LOCALITIES:
${INDORE_LOCALITIES.map((l) => `- ${l.name} (Slug: ${l.slug})`).join('\n')}

Respond with JSON only. No markdown. Example shape:
{
  "property_type": "1BHK",
  "rent_monthly": 12000,
  "locality_slug": "vijay_nagar",
  "furnishing": "Semi",
  "floor": null,
  "amenities": ["Parking"],
  "preferred_tenant": "Any",
  "available_from": null,
  "broker_name": "Ramesh",
  "broker_phone": "+919826012345",
  "confidence_score": 85,
  "field_confidence": {
    "property_type": 90,
    "rent_monthly": 95,
    "locality": 92,
    "furnishing": 80,
    "floor": 0,
    "preferred_tenant": 70,
    "broker_name": 85,
    "broker_phone": 90
  },
  "has_price": true,
  "has_location": true
}
`

export async function extractFieldsFromText(
  text: string,
  instagramHandle?: string | null
): Promise<ExtractionResult> {
  const client = getOpenRouterClient()
  const model = getOpenRouterModel()

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Extract listing data from this reel text:\n\n${text}` },
    ],
    temperature: 0.1,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('OpenRouter returned an empty extraction response')
  }

  const raw = parseJsonFromModelResponse(content)

  return {
    property_type: (raw.property_type as string) || null,
    rent_monthly: typeof raw.rent_monthly === 'number' ? raw.rent_monthly : null,
    locality: (raw.locality_slug as string) || (raw.locality as string) || null,
    furnishing: (raw.furnishing as string) || null,
    floor: typeof raw.floor === 'number' ? raw.floor : null,
    amenities: Array.isArray(raw.amenities) ? (raw.amenities as string[]) : [],
    preferred_tenant: (raw.preferred_tenant as string) || null,
    available_from: (raw.available_from as string) || null,
    broker_name: (raw.broker_name as string) || null,
    broker_phone: (raw.broker_phone as string) || null,
    confidence_score: typeof raw.confidence_score === 'number' ? raw.confidence_score : 0,
    field_confidence: (raw.field_confidence as ExtractionResult['field_confidence']) || {
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
    has_price: raw.has_price === true || !!raw.rent_monthly,
    has_location: raw.has_location === true || !!(raw.locality_slug || raw.locality),
  }
}