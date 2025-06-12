// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('OAuth login GET request received')
    
    // Check environment variables first
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    
    console.log('Environment check:', {
      hasClientId: !!clientId,
      hasRedirectUri: !!redirectUri,
      clientIdStart: clientId ? clientId.substring(0, 10) + '...' : 'missing',
      redirectUri: redirectUri || 'missing'
    })
    
    if (!clientId || !redirectUri) {
      console.error('Missing QB credentials')
      return NextResponse.json({ 
        error: 'QuickBooks credentials not configured properly',
        details: 'Missing QUICKBOOKS_CLIENT_ID or QUICKBOOKS_REDIRECT_URI',
        env: {
          hasClientId: !!clientId,
          hasRedirectUri: !!redirectUri
        }
      }, { status: 500 })
    }
    
    // Build QB OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', 'quickscope_oauth_' + Date.now())
    
    console.log('Redirecting to QB OAuth:', authUrl.toString())
    
    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json({ 
      error: 'Failed to initiate QB connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('OAuth login POST request received')
    
    // For POST requests, we can optionally handle form data
    let formData = null
    try {
      formData = await request.json()
      console.log('Form data received:', formData)
    } catch (e) {
      console.log('No JSON body in POST request, proceeding without form data')
    }
    
    // Check environment variables
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      return NextResponse.json({ 
        error: 'QuickBooks credentials not configured properly'
      }, { status: 500 })
    }
    
    // TODO: Store form data for later use in callback
    // if (formData) {
    //   // Store in session or database
    // }
    
    // Build QB OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', 'quickscope_oauth_' + Date.now())
    
    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('Login POST API error:', error)
    return NextResponse.json({ 
      error: 'Failed to initiate QB connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
