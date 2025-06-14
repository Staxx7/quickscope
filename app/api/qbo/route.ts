import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, phone } = await request.json()

    // Store prospect data temporarily
    const prospectData = {
      name,
      email,
      company,
      phone,
      timestamp: new Date().toISOString()
    }

    // QuickBooks OAuth parameters
    const clientId = process.env.QUICKBOOKS_CLIENT_ID || 'your_qb_app_id'
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || 'http://localhost:3005/api/qbo/callback'
    const scope = 'com.intuit.quickbooks.accounting'
    const state = Buffer.from(JSON.stringify(prospectData)).toString('base64')

    // Build QuickBooks OAuth URL
    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('scope', scope)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('state', state)

    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error) {
    console.error('Error initiating OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks connection' },
      { status: 500 }
    )
  }
}