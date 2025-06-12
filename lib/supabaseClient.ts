import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface QBToken {
  id: string
  company_id: string
  access_token: string
  refresh_token: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface Prospect {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  phone?: string
  industry?: string
  qb_company_id?: string
  connected_at: string
  last_sync?: string
  status: 'connected' | 'analyzing' | 'audit-complete' | 'closed'
  created_at: string
  updated_at: string
}
