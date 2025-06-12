import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get form data (we'll store this in session/database later)
    const formData = await request.json()
    console.log('Connect form submitted:', formData)

    // Store prospect info in database for later use
    // (We'll update this after QB connection completes)
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15)
    
    // QuickBooks OAuth URL
    const qbAuthUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
    qbAuthUrl.searchParams.set('client_id', process.env.QB_CLIENT_ID!)
    qbAuthUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting')
    qbAuthUrl.searchParams.set('redirect_uri', process.env.QB_REDIRECT_URI!)
    qbAuthUrl.searchParams.set('response_type', 'code')
    qbAuthUrl.searchParams.set('access_type', 'offline')
    qbAuthUrl.searchParams.set('state', state)

    console.log('Redirecting to QB OAuth:', qbAuthUrl.toString())

    // Redirect to QuickBooks OAuth
    return NextResponse.redirect(qbAuthUrl.toString())

  } catch (error) {
    console.error('Error in login API:', error)
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks connection' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests the same way (for direct /api/auth/login access)
  const state = Math.random().toString(36).substring(2, 15)
  
  const qbAuthUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
  qbAuthUrl.searchParams.set('client_id', process.env.QB_CLIENT_ID!)
  qbAuthUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting')
  qbAuthUrl.searchParams.set('redirect_uri', process.env.QB_REDIRECT_URI!)
  qbAuthUrl.searchParams.set('response_type', 'code')
  qbAuthUrl.searchParams.set('access_type', 'offline')
  qbAuthUrl.searchParams.set('state', state)

  console.log('GET request - Redirecting to QB OAuth:', qbAuthUrl.toString())
  
  return NextResponse.redirect(qbAuthUrl.toString())
}
