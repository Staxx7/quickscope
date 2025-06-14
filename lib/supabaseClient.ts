import { createClient } from '@supabase/supabase-js'
import { config } from '@/app/lib/config'

// Create public client with anon key
export const supabase = createClient(
  config.database.supabase.url,
  config.database.supabase.anonKey
)

// Export a function to get server-side client with service role key
export const getSupabaseServerClient = () => {
  return createClient(
    config.database.supabase.url,
    config.database.supabase.serviceRoleKey
  )
}
