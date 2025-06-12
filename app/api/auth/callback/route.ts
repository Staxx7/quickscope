import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    console.log('OAuth Callback received:', { code: !!code, state, realmId })

    if (!code || !realmId) {
      console.error('Missing code or realmId')
      return NextResponse.json(
        { error: 'Missing authorization code or realm ID' },
        { status: 400 }
      )
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.QB_REDIRECT_URI!
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', tokenResponse.status, errorText)
      throw new Error(`Token exchange failed: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Token exchange successful, expires in:', tokenData.expires_in)

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)

    // Store tokens in database
    const { data, error } = await supabase
      .from('qbo_tokens')
      .upsert({
        company_id: realmId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Database error storing tokens:', error)
      throw new Error('Failed to store tokens')
    }

    console.log('Tokens stored successfully for company:', realmId)

    // Also create/update prospect record
    await supabase
      .from('prospects')
      .upsert({
        qb_company_id: realmId,
        company_name: 'Connected Company', // We'll update this when we fetch company info
        status: 'connected',
        connected_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    // Redirect to success page
    const successUrl = new URL('/success', request.url)
    successUrl.searchParams.set('connected', 'true')
    successUrl.searchParams.set('company', realmId)

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('Error in auth callback:', error)
    
    // Redirect to error page
    const errorUrl = new URL('/connect', request.url)
    errorUrl.searchParams.set('error', 'connection_failed')
    
    return NextResponse.redirect(errorUrl)
  }
}
