import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get all relevant environment variables
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const qbBaseUrl = process.env.QUICKBOOKS_BASE_URL
    const scope = process.env.QUICKBOOKS_SCOPE

    // Test Basic Auth creation first
    let authInfo
    if (clientId && clientSecret) {
      try {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        authInfo = {
          basicAuthCreated: true,
          basicAuthPreview: `Basic ${basicAuth.substring(0, 30)}...`,
          basicAuthLength: basicAuth.length,
          canCreateAuth: true
        }
      } catch (error) {
        authInfo = {
          basicAuthCreated: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          canCreateAuth: false
        }
      }
    } else {
      authInfo = {
        basicAuthCreated: false,
        error: 'Missing client ID or secret',
        canCreateAuth: false
      }
    }

    // Overall status
    const allGood = !!(clientId && clientSecret && redirectUri && baseUrl && 
                      redirectUri === `${baseUrl}/api/auth/callback`)
    
    const statusInfo = {
      readyForOAuth: allGood,
      issues: allGood ? [] : [
        !clientId && 'Missing QUICKBOOKS_CLIENT_ID',
        !clientSecret && 'Missing QUICKBOOKS_CLIENT_SECRET', 
        !redirectUri && 'Missing QUICKBOOKS_REDIRECT_URI',
        !baseUrl && 'Missing NEXT_PUBLIC_BASE_URL',
        redirectUri !== `${baseUrl}/api/auth/callback` && 'Redirect URI mismatch'
      ].filter(Boolean)
    }

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: 'vercel'
      },
      credentials: {
        clientId: clientId ? `${clientId.substring(0, 15)}...` : '❌ MISSING',
        clientSecret: clientSecret ? `${clientSecret.substring(0, 8)}...` : '❌ MISSING',
        redirectUri: redirectUri || '❌ MISSING',
        baseUrl: baseUrl || '❌ MISSING',
        qbBaseUrl: qbBaseUrl || '❌ MISSING',
        scope: scope || '❌ MISSING'
      },
      validation: {
        clientIdExists: !!clientId,
        clientSecretExists: !!clientSecret,
        redirectUriExists: !!redirectUri,
        baseUrlExists: !!baseUrl,
        clientIdLength: clientId?.length || 0,
        clientSecretLength: clientSecret?.length || 0,
        clientIdCorrect: clientId === 'ABQvD8LJ8rY2dZ3PNnNxHJXlqWAnzVDTko5uPCE4qoZM9uesGQ',
        redirectUriMatch: redirectUri === `${baseUrl}/api/auth/callback`
      },
      urls: {
        expectedRedirectUri: `${baseUrl}/api/auth/callback`,
        configuredRedirectUri: redirectUri,
        authUrl: clientId ? `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&scope=${encodeURIComponent(scope || 'com.intuit.quickbooks.accounting')}&redirect_uri=${encodeURIComponent(redirectUri || '')}&response_type=code&access_type=offline&state=debug123` : 'Cannot generate - missing client ID'
      },
      auth: authInfo,
      status: statusInfo
    }

    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
