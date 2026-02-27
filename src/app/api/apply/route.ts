import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_IP = 3
const requestCounts = new Map<string, { count: number; resetTime: number }>()

async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured')
    return false
  }
  
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secretKey,
      response: token,
    }),
  })
  const data = await response.json()
  return data.success
}

function getRateLimitStatus(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const ipData = requestCounts.get(ip)
  
  if (!ipData || now > ipData.resetTime) {
    requestCounts.set(ip, { count: 0, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP }
  }
  
  if (ipData.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0 }
  }
  
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - ipData.count }
}

function incrementRateLimit(ip: string) {
  const ipData = requestCounts.get(ip)!
  ipData.count++
  requestCounts.set(ip, ipData)
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    const { allowed, remaining } = getRateLimitStatus(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { fullName, phone, igHandle, university, promoPlan, prevExperience, turnstileToken } = body
    
    // Validate required fields
    if (!fullName || !phone || !igHandle || !promoPlan || !turnstileToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Verify Turnstile token
    const isValid = await verifyTurnstile(turnstileToken)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      )
    }
    
    // Increment rate limit after verification
    incrementRateLimit(ip)
    
    // Clean Instagram handle
    const cleanedHandle = igHandle.replace('@', '').toLowerCase()
    
    // Get Supabase client with service role
    const supabase = getServiceSupabase()
    
    // Check for duplicate
    const { data: existingRep } = await supabase
      .from('reps')
      .select('id')
      .eq('ig_handle', cleanedHandle)
      .single()
    
    if (existingRep) {
      return NextResponse.json(
        { 
          error: 'duplicate',
          message: "Looks like you've already applied! Check your texts for your dashboard link." 
        },
        { status: 200 }
      )
    }
    
    // Insert new rep
    const { error: insertError } = await supabase
      .from('reps')
      .insert({
        ig_handle: cleanedHandle,
        full_name: fullName,
        phone,
        university: university || null,
        promo_plan: promoPlan,
        prev_experience: prevExperience,
        status: 'pending'
      })
    
    if (insertError) {
      console.error('Supabase error:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      )
    }
    
    // Forward to n8n webhook
    try {
      await fetch(process.env.N8N_APPLICATION_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ig_handle: cleanedHandle,
          full_name: fullName,
          phone,
          university: university || '',
          promo_plan: promoPlan,
          prev_experience: prevExperience,
          applied_at: new Date().toISOString(),
        }),
      })
    } catch (webhookError) {
      console.error('n8n webhook error:', webhookError)
      // Don't fail the request if webhook fails
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Application received! You'll get a text within 12 hours with your rep dashboard link."
    })
    
  } catch (error) {
    console.error('Application error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}