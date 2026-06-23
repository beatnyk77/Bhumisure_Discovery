import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get('From') as string // whatsapp:+91...
    const body = formData.get('Body') as string // User message

    if (!from || !body) {
      return new NextResponse('Invalid Request', { status: 400 })
    }

    const cleanPhone = from.replace('whatsapp:', '')

    // Check for "YES" or "RENEW" to extend listing
    if (body.toUpperCase().trim() === 'YES' || body.toUpperCase().trim() === 'RENEW') {
      console.log(`[WhatsApp Webhook] Renewal request from ${cleanPhone}`)

      // 1. Find the listing for this broker that is expiring soon
      const { data: broker } = await adminSupabase
        .from('brokers')
        .select('id')
        .eq('whatsapp_number', cleanPhone)
        .single()

      if (broker) {
        // Extend the most recently active/expiring listing
        const { data: listing } = await adminSupabase
          .from('listings')
          .select('id')
          .eq('broker_id', broker.id)
          .eq('status', 'active')
          .order('created_at', { ascending: true })
          .limit(1)
          .single()

        if (listing) {
          await adminSupabase
            .from('listings')
            .update({ 
              created_at: new Date().toISOString(), // Reset the clock
              updated_at: new Date().toISOString()
            })
            .eq('id', listing.id)

          console.log(`[WhatsApp Webhook] Renewed listing ${listing.id}`)
          // Here we would trigger a confirmation WhatsApp back via Twilio
        }
      }
    }

    return new NextResponse('OK', { status: 200 })

  } catch (error: unknown) {
    console.error('[WhatsApp Webhook] Failed:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
