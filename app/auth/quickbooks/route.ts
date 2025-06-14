import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // QuickBooks OAuth configuration
    const clientId = process.env.QB_CLIENT_ID
    const redirectUri = process.env.QB_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`
    const scope = 'com.intuit.quickbooks.accounting'
    const state = generateRandomState()

    if (!clientId) {
      return NextResponse.json(
        { error: 'QuickBooks client ID not configured' },
        { status: 500 }
      )
    }

    // Build QuickBooks OAuth URL
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://appcenter.intuit.com/connect/oauth2'
      : 'https://appcenter.intuit.com/connect/oauth2'

    const authUrl = new URL(baseUrl)
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', scope)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', state)

    // Store state in session/cookie for verification (optional but recommended)
    const response = NextResponse.redirect(authUrl.toString())
    response.cookies.set('qb_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })

    return response

  } catch (error) {
    console.error('Error initiating QuickBooks OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks connection' },
      { status: 500 }
    )
  }
}

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}
