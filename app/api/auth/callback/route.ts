// app/api/qbo/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  x_refresh_token_expires_in: number;
}

interface CompanyInfo {
  QueryResponse: {
    CompanyInfo: Array<{
      Name: string;
      CompanyAddr?: {
        Line1?: string;
        City?: string;
        CountrySubDivisionCode?: string;
      };
    }>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const realmId = searchParams.get('realmId');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
      return NextResponse.redirect(`${baseUrl}/connect?error=${encodeURIComponent(error)}`);
    }

    // Validate required parameters
    if (!code || !realmId) {
      console.error('Missing required OAuth parameters:', { code: !!code, realmId: !!realmId });
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
      return NextResponse.redirect(`${baseUrl}/connect?error=missing_parameters`);
    }

    console.log('Processing OAuth callback for realmId:', realmId);

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForTokens(code);
    if (!tokenData) {
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
      return NextResponse.redirect(`${baseUrl}/connect?error=token_exchange_failed`);
    }

    // Get company information
    const companyInfo = await getCompanyInfo(realmId, tokenData.access_token);
    const companyName = companyInfo?.QueryResponse?.CompanyInfo?.[0]?.Name || `Company ${realmId}`;

    // Store tokens in database
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
    const refreshExpiresAt = new Date(Date.now() + (tokenData.x_refresh_token_expires_in * 1000));

    const { error: dbError } = await supabase
      .from('qbo_tokens')
      .upsert({
        company_id: realmId,
        company_name: companyName,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        refresh_expires_at: refreshExpiresAt.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'company_id'
      });

    if (dbError) {
      console.error('Error storing tokens:', dbError);
      const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
      return NextResponse.redirect(`${baseUrl}/connect?error=database_error`);
    }

    console.log('Successfully stored tokens for company:', companyName);

    // Redirect to success page
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
    return NextResponse.redirect(`${baseUrl}/connect/success?company=${encodeURIComponent(companyName)}&realmId=${realmId}`);

  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickbooks.info' : 'http://localhost:3005';
    return NextResponse.redirect(`${baseUrl}/connect?error=unexpected_error`);
  }
}

async function exchangeCodeForTokens(code: string): Promise<TokenResponse | null> {
  try {
    const tokenEndpoint = process.env.NODE_ENV === 'production'
      ? 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
      : 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': process.env.NODE_ENV === 'production' 
          ? 'https://quickbooks.info/api/qbo/callback'
          : 'http://localhost:3005/api/qbo/callback'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      return null;
    }

    const tokenData: TokenResponse = await response.json();
    console.log('Successfully exchanged code for tokens');
    return tokenData;

  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return null;
  }
}

async function getCompanyInfo(realmId: string, accessToken: string): Promise<CompanyInfo | null> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com';

    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch company info:', response.status);
      return null;
    }

    const companyInfo: CompanyInfo = await response.json();
    console.log('Successfully fetched company info');
    return companyInfo;

  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}
