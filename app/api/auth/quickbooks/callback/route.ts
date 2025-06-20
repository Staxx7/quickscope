import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId') // QuickBooks company ID
    const error = searchParams.get('error')

    const errorUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/connect/error`);

    // Handle OAuth error
    if (error) {
      console.error('QuickBooks OAuth error:', error)
      errorUrl.searchParams.set('message', `quickbooks_auth_failed: ${error}`);
      return NextResponse.redirect(errorUrl.toString());
    }

    // Validate required parameters
    if (!code || !realmId) {
      errorUrl.searchParams.set('message', 'missing_oauth_params');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Optional: Verify state parameter
    const storedState = request.cookies.get('qb_oauth_state')?.value
    if (storedState && storedState !== state) {
      errorUrl.searchParams.set('message', 'invalid_state');
      return NextResponse.redirect(errorUrl.toString());
    }

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForTokens(code, realmId)
    
    if (!tokenData.success) {
      errorUrl.searchParams.set('message', 'token_exchange_failed');
      return NextResponse.redirect(errorUrl.toString());
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
      errorUrl.searchParams.set('message', `database_error: ${dbError.message}`);
      return NextResponse.redirect(errorUrl.toString());
    }

    // Redirect to a clean success page, no tokens in URL
    const successUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/connect/complete`);
    successUrl.searchParams.set('companyName', companyInfo.name || 'Your Company');
    return NextResponse.redirect(successUrl.toString());

  } catch (error) {
    console.error('Error in QuickBooks OAuth callback:', error);
    const errorUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/connect/failed`);
    errorUrl.searchParams.set('message', error instanceof Error ? error.message : 'An unexpected error occurred during QuickBooks connection.');
    return NextResponse.redirect(errorUrl.toString());
  }
}

async function exchangeCodeForTokens(code: string, realmId: string) {
  try {
    const tokenEndpoint = process.env.NODE_ENV === 'production'
      ? 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
      : 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`;

    console.log('Exchanging code for tokens with:', {
      tokenEndpoint,
      redirectUri,
      hasClientId: !!process.env.QUICKBOOKS_CLIENT_ID,
      hasClientSecret: !!process.env.QUICKBOOKS_CLIENT_SECRET
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Token exchange failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Token exchange successful.');
    return {
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    };

  } catch (error) {
    console.error('Error in exchangeCodeForTokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function getCompanyInfo(realmId: string, accessToken: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com';

    const url = `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`;
    console.log(`Fetching company info from: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Company info fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch company info with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const companyInfo = data?.QueryResponse?.CompanyInfo?.[0] || data?.CompanyInfo;

    const name = companyInfo?.CompanyName || companyInfo?.LegalName || `Company ${realmId}`;
    console.log(`Found company name: ${name}`);

    return {
      name: name,
      id: realmId
    };

  } catch (error) {
    console.error('Error in getCompanyInfo:', error);
    return {
      name: `Company ${realmId}`,
      id: realmId
    };
  }
}
