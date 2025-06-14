// app/api/test-credentials/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.QB_CLIENT_ID
    const clientSecret = process.env.QB_CLIENT_SECRET
    const redirectUri = process.env.QB_REDIRECT_URI
    
    // Test basic auth encoding
    const authString = `${clientId}:${clientSecret}`
    const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`
    
    return NextResponse.json({
      success: true,
      config: {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasRedirectUri: !!redirectUri,
        clientIdLength: clientId?.length || 0,
        clientSecretLength: clientSecret?.length || 0,
        clientIdStart: clientId?.substring(0, 15) + '...',
        clientSecretStart: clientSecret?.substring(0, 15) + '...',
        redirectUri,
        authHeaderLength: authHeader.length,
        authHeaderStart: authHeader.substring(0, 30) + '...'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test credentials',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
