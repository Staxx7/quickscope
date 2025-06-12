import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    const scope = process.env.QUICKBOOKS_SCOPE || 'com.intuit.quickbooks.accounting'

    if (!clientId || !redirectUri) {
      console.error('Missing OAuth configuration:', { 
        hasClientId: !!clientId, 
        hasRedirectUri: !!redirectUri 
      })
      
      return NextResponse.json(
        { error: 'OAuth configuration missing' },
        { status: 500 }
      )
    }

    // Generate a more secure state parameter
    const state = `qbo_${Date.now()}_${Math.random().toString(36).substring(2)}`
    
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', scope)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', state)

    console.log('Redirecting to QuickBooks OAuth:', authUrl.toString())

    return NextResponse.redirect(authUrl.toString())

  } catch (error) {
    console.error('Error in OAuth login:', error)
    
    return NextResponse.json(
      { 
        error: 'OAuth login failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
