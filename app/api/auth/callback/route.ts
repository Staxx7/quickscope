// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    console.log('OAuth Callback received:', { 
      code: code ? code.substring(0, 20) + '...' : null,
      state, 
      realmId,
      fullUrl: request.url
    })

    if (!code || !realmId) {
      console.error('Missing required OAuth parameters:', { code: !!code, realmId: !!realmId })
      return NextResponse.redirect(new URL('/connect?error=missing_parameters', request.url))
    }

    // Get environment variables
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing QB environment variables')
      return NextResponse.redirect(new URL('/connect?error=config_error', request.url))
    }

    // Exchange authorization code for access token
    console.log('Exchanging code for tokens...', {
      clientId: clientId.substring(0, 10) + '...',
      clientSecret: clientSecret.substring(0, 10) + '...',
      redirectUri,
      codeLength: code.length,
      realmId
    })
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const authHeader = `Basic ${credentials}`
    
    console.log('Auth details:', {
      authStringLength: `${clientId}:${clientSecret}`.length,
      authHeaderLength: authHeader.length,
      authHeaderPreview: authHeader.substring(0, 30) + '...'
    })
    
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri
    })

    console.log('Token request details:', {
      url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      bodyParams: Object.fromEntries(tokenRequestBody.entries()),
      authHeaderStart: authHeader.substring(0, 50) + '...'
    })
    
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': authHeader
      },
      body: tokenRequestBody
    })

    const responseText = await tokenResponse.text()
    console.log('Token response:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      headers: Object.fromEntries(tokenResponse.headers.entries()),
      body: responseText
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed with detailed response')
      
      // Create detailed error URL
      const errorUrl = new URL('/connect', request.url)
      errorUrl.searchParams.set('error', 'token_exchange_failed')
      errorUrl.searchParams.set('status', tokenResponse.status.toString())
      errorUrl.searchParams.set('details', responseText.substring(0, 200))
      
      return NextResponse.redirect(errorUrl)
    }

    const tokens = JSON.parse(responseText)
console.log('Tokens received successfully:', {
  hasAccessToken: !!tokens.access_token,
  hasRefreshToken: !!tokens.refresh_token,
  expiresIn: tokens.expires_in
})

    // Get company information from QuickBooks
    console.log('Fetching company info...')
    
    const companyResponse = await fetch(`https://api.quickbooks.com/v3/company/${realmId}/companyinfo/${realmId}`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      }
    })

    let companyName = 'Unknown Company'
    if (companyResponse.ok) {
      const companyData = await companyResponse.json()
      companyName = companyData?.QueryResponse?.CompanyInfo?.[0]?.Name || 'Unknown Company'
      console.log('Company name retrieved:', companyName)
    } else {
      console.warn('Failed to fetch company info, using default name')
    }

    // TODO: Store tokens in database
    // For now, we'll just redirect to success
    console.log('OAuth flow completed successfully')

    // Store basic info in URL for success page
    const successUrl = new URL('/success', request.url)
    successUrl.searchParams.set('company', companyName)
    successUrl.searchParams.set('realmId', realmId)
    successUrl.searchParams.set('connected', 'true')

    return NextResponse.redirect(successUrl)

  } catch (error) {
    console.error('Error in auth callback:', error)
    
    // Redirect to connect page with detailed error
    const connectUrl = new URL('/connect', request.url)
    connectUrl.searchParams.set('error', 'callback_error')
    connectUrl.searchParams.set('details', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.redirect(connectUrl)
  }
}
