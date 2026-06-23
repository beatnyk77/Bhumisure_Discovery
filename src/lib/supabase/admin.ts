import { createClient, SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

// Service role client — bypasses all RLS. NEVER expose to the browser.
export const adminSupabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!adminClient) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
          '[BhumiSure] SUPABASE_SERVICE_ROLE_KEY is not set. ' +
            'This client must only be used server-side (cron, webhook, admin routes).'
        )
      }
      adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    }
    return Reflect.get(adminClient, prop)
  },
})
