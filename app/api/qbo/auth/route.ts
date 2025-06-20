import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 })
    }

    // QuickBooks OAuth parameters
    const clientId = process.env.QB_CLIENT_ID
    const redirectUri = process.env.QB_REDIRECT_URI || 'http://localhost:3005/api/qbo/callback'
    const scope = 'com.intuit.quickbooks.accounting'
    const state = Buffer.from(JSON.stringify({ companyId })).toString('base64')
    
    // Build QuickBooks OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId!)
    authUrl.searchParams.set('scope', scope)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', state)

    return NextResponse.json({ authUrl: authUrl.toString() })
    
  } catch (error) {
    console.error('Error generating QB auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' }, 
      { status: 500 }
    )
  }
}