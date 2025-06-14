import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    console.log('OAuth Callback received:', { code, state, realmId })

    if (!code || !realmId) {
      console.error('Missing required parameters:', { code: !!code, realmId: !!realmId })
      const errorUrl = new URL('/connect', request.url)
      errorUrl.searchParams.set('error', 'missing_parameters')
      return NextResponse.redirect(errorUrl)
    }

    // NOW WE NEED TO EXCHANGE THE CODE FOR TOKENS
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing OAuth configuration for token exchange')
      const errorUrl = new URL('/connect', request.url)
      errorUrl.searchParams.set('error', 'oauth_config_missing')
      return NextResponse.redirect(errorUrl)
    }

    console.log('Attempting token exchange with:', {
      clientId: `${clientId.substring(0, 10)}...`,
      redirectUri,
      hasSecret: !!clientSecret
    })

    const tokenExchangeResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    const tokenData = await tokenExchangeResponse.json()
    
    if (!tokenExchangeResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      const errorUrl = new URL('/connect', request.url)
      errorUrl.searchParams.set('error', 'token_exchange_failed')
      errorUrl.searchParams.set('status', tokenExchangeResponse.status.toString())
      errorUrl.searchParams.set('details', JSON.stringify(tokenData))
      return NextResponse.redirect(errorUrl)
    }

    console.log('Token exchange successful:', tokenData)

    // For now, redirect to success page with the data
    const successUrl = new URL('/success', request.url)
    successUrl.searchParams.set('connected', 'true')
    successUrl.searchParams.set('company', realmId)
    successUrl.searchParams.set('access_token', tokenData.access_token)

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('Error in auth callback:', error)
    
    // Redirect to connect page with error
    const errorUrl = new URL('/connect', request.url)
    errorUrl.searchParams.set('error', 'connection_failed')
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.redirect(errorUrl)
  }
}
