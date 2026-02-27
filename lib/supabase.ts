import { createClient, SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient | null = null
let serviceClient: SupabaseClient | null = null

// Get public Supabase client (lazy initialization)
export function getSupabase() {
  if (!publicClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      throw new Error('Missing public Supabase environment variables')
    }
    
    publicClient = createClient(url, key)
  }
  return publicClient
}

// Get service role Supabase client (lazy initialization)
export function getServiceSupabase() {
  if (!serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Supabase URL exists:', !!url)
    console.log('Service role key exists:', !!key)
    
    if (!url) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    }
    
    if (!key) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
    }
    
    serviceClient = createClient(url, key)
  }
  return serviceClient
}

// Export a default client for backward compatibility
export const supabase = {
  from: (table: string) => getSupabase().from(table),
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