import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
      `client_id=${process.env.QBO_CLIENT_ID}&` +
      `scope=com.intuit.quickbooks.accounting&` +
      `redirect_uri=${encodeURIComponent(process.env.QBO_REDIRECT_URI!)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `state=randomstate123`
    
    console.log('Redirecting to:', authUrl)
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 })
  }
}