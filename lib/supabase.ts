import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client for public operations (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client for service role operations (server-side only)
export const getServiceSupabase = () => {
  if (!supabaseServiceRoleKey) {
    throw new Error('Service role key not configured')
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

// Types for our database tables
export interface Rep {
  id: string
  ig_handle: string
  full_name: string
  phone: string
  university?: string
  promo_plan?: string
  prev_experience?: string
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
  approved_at?: string
  ghl_contact_id?: string
}

export interface Sale {
  id: string
  rep_ig_handle: string
  sale_type: 'shirt' | 'ticket'
  quantity: number
  amount?: number
  source?: string
  external_order_id?: string
  recorded_at: string
}

export interface LeaderboardEntry {
  ig_handle: string
  full_name: string
  shirts_sold: number
  tickets_sold: number
  total_points: number
  total_commission: number
  total_units: number
}

export interface Config {
  key: string
  value: any
}