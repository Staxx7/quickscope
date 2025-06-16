import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? 'https://quickscope.info/api/auth/quickbooks/callback'
      : 'http://localhost:3005/api/auth/quickbooks/callback'
    
    if (!clientId) {
      return NextResponse.json({ 
        error: 'QuickBooks configuration missing' 
      }, { status: 500 })
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(7)
    
    // QuickBooks OAuth 2.0 authorization URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.append('client_id', clientId)
    authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting')
    authUrl.searchParams.append('redirect_uri', redirectUri)
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('state', state)
    
    // Store state in cookie for verification
    const response = NextResponse.json({ 
      url: authUrl.toString(),
      state 
    })
    
    response.cookies.set('qb_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10 // 10 minutes
    })
    
    return response
    
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json({ 
      error: 'Failed to generate authorization URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}