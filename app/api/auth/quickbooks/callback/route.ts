import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId') // QuickBooks company ID
    const error = searchParams.get('error')

    // Handle OAuth error
    if (error) {
      console.error('QuickBooks OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=quickbooks_auth_failed`)
    }

    // Validate required parameters
    if (!code || !realmId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=missing_oauth_params`)
    }

    // Optional: Verify state parameter
    const storedState = request.cookies.get('qb_oauth_state')?.value
    if (storedState && storedState !== state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=invalid_state`)
    }

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForTokens(code, realmId)
    
    if (!tokenData.success) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=token_exchange_failed`)
    }

    // Get company information from QuickBooks
    const companyInfo = await getCompanyInfo(realmId, tokenData.access_token)

    // Store tokens and company info in database
    const { error: dbError } = await supabase
      .from('qbo_tokens')
      .upsert({
        company_id: realmId,
        company_name: companyInfo.name || `Company ${realmId}`,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'company_id'
      })

    if (dbError) {
      console.error('Error storing QB tokens:', dbError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=database_error`)
    }

    // Redirect to success page with company info
    const successUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/success`)
    successUrl.searchParams.set('company_id', realmId)
    successUrl.searchParams.set('company_name', companyInfo.name || 'Your Company')
    
    return NextResponse.redirect(successUrl.toString())

  } catch (error) {
    console.error('Error in QuickBooks OAuth callback:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/error?message=unexpected_error`)
  }
}

async function exchangeCodeForTokens(code: string, realmId: string) {
  try {
    const tokenEndpoint = process.env.NODE_ENV === 'production'
      ? 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
      : 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': process.env.QUICKBOOKS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`
      })
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    }

  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function getCompanyInfo(realmId: string, accessToken: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com'

    const response = await fetch(`${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Company info fetch failed: ${response.statusText}`)
    }

    const data = await response.json()
    const companyInfo = data?.QueryResponse?.CompanyInfo?.[0]

    return {
      name: companyInfo?.Name || companyInfo?.CompanyName || `Company ${realmId}`,
      id: realmId
    }

  } catch (error) {
    console.error('Error fetching company info:', error)
    return {
      name: `Company ${realmId}`,
      id: realmId
    }
  }
}
