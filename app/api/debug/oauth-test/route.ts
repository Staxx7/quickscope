import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
  const nodeEnv = process.env.NODE_ENV
  
  // Test OAuth URL generation
  const redirectUri = nodeEnv === 'production' 
    ? 'https://quickscope.info/api/qbo/callback'
    : 'http://localhost:3005/api/qbo/callback'
  
  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
  authUrl.searchParams.append('client_id', clientId || 'MISSING_CLIENT_ID')
  authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('state', 'test123')
  
  // Test token endpoint accessibility
  let tokenEndpointStatus = 'unknown'
  try {
    const tokenTestResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'OPTIONS'
    })
    tokenEndpointStatus = `${tokenTestResponse.status} ${tokenTestResponse.statusText}`
  } catch (error) {
    tokenEndpointStatus = `Error: ${error instanceof Error ? error.message : 'Unknown'}`
  }
  
  // Check Vercel environment
  const vercelEnv = {
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION
  }
  
  return NextResponse.json({
    environment: {
      NODE_ENV: nodeEnv,
      isProduction: nodeEnv === 'production',
      vercel: vercelEnv
    },
    credentials: {
      hasClientId: !!clientId,
      clientIdLength: clientId?.length || 0,
      clientIdPrefix: clientId?.substring(0, 10) + '...',
      hasClientSecret: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0
    },
    oauth: {
      authUrl: authUrl.toString(),
      redirectUri,
      tokenEndpointStatus
    },
    endpoints: {
      authUrl: '/api/auth/quickbooks/url',
      callback: '/api/qbo/callback',
      disconnect: '/api/auth/disconnect'
    },
    timestamp: new Date().toISOString()
  })
}