// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get form data (store for later callback)
    const formData = await request.json()
    console.log('Connect form data:', formData)
    
    // Check environment variables first
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    
    if (!clientId || !redirectUri) {
      console.error('Missing QB credentials:', { 
        hasClientId: !!clientId,
        hasRedirectUri: !!redirectUri,
        allEnvKeys: Object.keys(process.env).filter(key => key.includes('QUICKBOOKS'))
      })
      
      return NextResponse.json({ 
        error: 'QuickBooks credentials not configured properly',
        details: 'Missing QUICKBOOKS_CLIENT_ID or QUICKBOOKS_REDIRECT_URI'
      }, { status: 500 })
    }
    
    console.log('QB OAuth credentials found:', {
      clientId: clientId.substring(0, 10) + '...',
      redirectUri
    })
    
    // Store form data in session/database for callback
    // TODO: Store formData for the callback to use
    
    // Build QB OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', 'randomstate123')
    
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

// Also support GET for direct testing
export async function GET(request: NextRequest) {
  return POST(request)
}
