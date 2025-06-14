import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/app/lib/serviceFactory'
import { config } from '@/app/lib/config'

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
      return NextResponse.redirect(`${config.app.url}/error?message=quickbooks_auth_failed`)
    }

    // Validate required parameters
    if (!code || !realmId) {
      return NextResponse.redirect(`${config.app.url}/error?message=missing_oauth_params`)
    }

    // Verify state parameter if it exists
    if (state) {
      const storedState = request.cookies.get('qb_oauth_state')?.value
      console.log('State verification:', { received: state, stored: storedState })
      
      if (storedState && storedState !== state) {
        console.error('State mismatch:', { received: state, stored: storedState })
        return NextResponse.redirect(`${config.app.url}/error?message=invalid_state`)
      }
    }

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForTokens(code, realmId)
    
    if (!tokenResponse.success) {
      return NextResponse.redirect(`${config.app.url}/error?message=token_exchange_failed`)
    }

    // Get company information from QuickBooks
    const companyInfo = await getCompanyInfo(realmId, tokenResponse.access_token)

    // Store tokens and company info in database
    const supabase = getSupabase()
    
    console.log('Attempting to store tokens for company:', realmId)
    console.log('Company info:', companyInfo)
    
    const tokenDataToSave = {
      company_id: realmId,
      company_name: companyInfo.name || `Company ${realmId}`,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: new Date(Date.now() + (tokenResponse.expires_in * 1000)).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Token data to be saved:', { ...tokenDataToSave, access_token: '[REDACTED]', refresh_token: '[REDACTED]' })
    
    const { data: savedToken, error: dbError } = await supabase
      .from('qbo_tokens')
      .upsert(tokenDataToSave, {
        onConflict: 'company_id'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error storing QB tokens:', dbError)
      console.error('Full error details:', JSON.stringify(dbError, null, 2))
      return NextResponse.redirect(`${config.app.url}/error?message=database_error&details=${encodeURIComponent(dbError.message)}`)
    }
    
    console.log('Successfully saved token:', savedToken?.company_id)

    // Create/update prospect record with QuickBooks company ID
    const prospectData = {
      company_name: companyInfo.name || `Company ${realmId}`,
      contact_name: companyInfo.name || 'Unknown',
      email: `contact@${(companyInfo.name || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
      qb_company_id: realmId,
      workflow_stage: 'connected',
      user_type: 'prospect', // Default to prospect
      updated_at: new Date().toISOString()
    }
    
    console.log('Creating/updating prospect:', prospectData)
    
    const { data: savedProspect, error: prospectError } = await supabase
      .from('prospects')
      .upsert(prospectData, {
        onConflict: 'qb_company_id',
        ignoreDuplicates: false
      })
      .select()
      .single()
      
    if (prospectError) {
      console.warn('Prospect upsert warning:', prospectError)
      // Don't fail the whole flow for this
    } else {
      console.log('Prospect saved/updated:', savedProspect?.id)
    }

    // Check if this is an internal user or prospect
    const { data: prospect } = await supabase
      .from('prospects')
      .select('user_type')
      .eq('qb_company_id', realmId)
      .single()

    const isInternalUser = prospect?.user_type === 'internal' || prospect?.user_type === 'paid_user'

    // Redirect based on user type
    if (isInternalUser) {
      // Internal users go directly to admin dashboard
      const response = NextResponse.redirect(`${config.app.url}/admin/dashboard`)
      
      // Set cookies to indicate successful authentication
      response.cookies.set('qb_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      response.cookies.set('qb_company_id', realmId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return response
    } else {
      // Prospects go to success page
      const successUrl = new URL(`${config.app.url}/success`)
      successUrl.searchParams.set('connected', 'true')
      successUrl.searchParams.set('company', realmId)
      successUrl.searchParams.set('company_name', encodeURIComponent(companyInfo.name || 'Company'))
      
      const response = NextResponse.redirect(successUrl.toString())
      
      // Set cookies to indicate successful authentication
      response.cookies.set('qb_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      response.cookies.set('qb_company_id', realmId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      return response
    }

  } catch (error) {
    console.error('Error in QuickBooks OAuth callback:', error)
    return NextResponse.redirect(`${config.app.url}/error?message=unexpected_error`)
  }
}

async function exchangeCodeForTokens(code: string, realmId: string) {
  try {
    const response = await fetch(config.quickbooks.tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.quickbooks.clientId}:${config.quickbooks.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': config.quickbooks.redirectUri
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
    const baseUrl = config.quickbooks.baseUrl

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
    const companyInfo = data?.QueryResponse?.CompanyInfo?.[0] || data?.CompanyInfo

    return {
      name: companyInfo?.CompanyName || companyInfo?.Name || `Company ${realmId}`,
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
