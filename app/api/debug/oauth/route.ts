// app/api/debug/oauth/route.ts - Debug endpoint to test credentials
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    
    // Test with a fake authorization code to see the exact error
    const testCode = 'test_code_123'
    
    console.log('Testing QB credentials:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
      clientIdStart: clientId?.substring(0, 10) + '...',
      clientSecretStart: clientSecret?.substring(0, 10) + '...',
      redirectUri
    })
    
    const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: testCode,
        redirect_uri: redirectUri || ''
      })
    })

    const responseText = await tokenResponse.text()
    
    return NextResponse.json({
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      headers: Object.fromEntries(tokenResponse.headers.entries()),
      body: responseText,
      credentials: {
        clientIdLength: clientId?.length || 0,
        clientSecretLength: clientSecret?.length || 0,
        redirectUri
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
