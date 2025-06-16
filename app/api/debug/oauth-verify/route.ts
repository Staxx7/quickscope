import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Get all OAuth-related configuration
  const clientId = process.env.QUICKBOOKS_CLIENT_ID
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
  const nodeEnv = process.env.NODE_ENV
  
  // Check both possible redirect URIs
  const productionRedirectUri = 'https://quickscope.info/api/qbo/callback'
  const wwwProductionRedirectUri = 'https://www.quickscope.info/api/qbo/callback'
  const localRedirectUri = 'http://localhost:3005/api/qbo/callback'
  
  const currentRedirectUri = nodeEnv === 'production' 
    ? productionRedirectUri
    : localRedirectUri
  
  // Generate auth URLs with different redirect URIs to test
  const authUrls = {
    withoutWWW: generateAuthUrl(clientId, productionRedirectUri),
    withWWW: generateAuthUrl(clientId, wwwProductionRedirectUri),
    current: generateAuthUrl(clientId, currentRedirectUri)
  }
  
  // Check if we can reach QuickBooks OAuth endpoint
  let oauthEndpointCheck = {}
  try {
    const checkResponse = await fetch('https://appcenter.intuit.com/connect/oauth2', {
      method: 'HEAD'
    })
    oauthEndpointCheck = {
      reachable: true,
      status: checkResponse.status
    }
  } catch (error) {
    oauthEndpointCheck = {
      reachable: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
  
  return NextResponse.json({
    configuration: {
      environment: nodeEnv,
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdFormat: clientId ? `${clientId.substring(0, 5)}...${clientId.substring(clientId.length - 5)}` : 'MISSING'
    },
    redirectURIs: {
      current: currentRedirectUri,
      production: productionRedirectUri,
      productionWithWWW: wwwProductionRedirectUri,
      local: localRedirectUri,
      note: 'Make sure ONE of these EXACTLY matches your QuickBooks app settings'
    },
    authURLs: authUrls,
    oauthEndpointCheck,
    quickbooksAppSettings: {
      instruction: 'Go to https://app.developer.intuit.com',
      steps: [
        '1. Select your app',
        '2. Go to "Keys & OAuth" or "Keys & credentials"',
        '3. Check the "Redirect URIs" section',
        '4. Make sure it EXACTLY matches one of the URIs above',
        '5. Common issues: http vs https, www vs no-www, trailing slashes'
      ]
    },
    timestamp: new Date().toISOString()
  })
}

function generateAuthUrl(clientId: string | undefined, redirectUri: string): string {
  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2')
  authUrl.searchParams.append('client_id', clientId || 'MISSING_CLIENT_ID')
  authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('state', 'test123')
  return authUrl.toString()
}