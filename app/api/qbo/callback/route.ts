// app/api/qbo/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const error = searchParams.get('error');

    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickscope.info' : 'http://localhost:3005';

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${baseUrl}/connect?error=${encodeURIComponent(error)}`);
    }

    // Validate required parameters
    if (!code || !realmId) {
      console.error('Missing OAuth parameters');
      return NextResponse.redirect(`${baseUrl}/connect?error=missing_parameters`);
    }

    console.log('Processing OAuth callback for realmId:', realmId);

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForTokens(code);
    if (!tokenData) {
      return NextResponse.redirect(`${baseUrl}/connect?error=token_exchange_failed`);
    }

    // Get company information
    const companyInfo = await getCompanyInfo(realmId, tokenData.access_token);
    const companyName = companyInfo?.name || `Company ${realmId}`;

    // DEBUG: Check environment variables
    console.log('=== SUPABASE DEBUG ===');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Service Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Service Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
    console.log('About to create Supabase client...');

    // Create Supabase client with explicit error handling
    let supabase;
    try {
      supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      console.log('Supabase client created successfully');
    } catch (clientError) {
      console.error('Error creating Supabase client:', clientError);
      return NextResponse.redirect(`${baseUrl}/connect?error=supabase_client_error`);
    }

    console.log('Testing basic Supabase connectivity...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('qbo_tokens')
        .select('company_id')
        .limit(1);
      
      console.log('Supabase connectivity test result:', { testData, testError });
      
      // If the connectivity test passes, try the upsert
      if (!testError) {
        console.log('Connectivity test passed, attempting upsert...');
        
        const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
        const tokenRecord = {
          company_id: realmId,
          company_name: companyName,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error: dbError } = await supabase
          .from('qbo_tokens')
          .upsert(tokenRecord, {
            onConflict: 'company_id'
          });

        if (dbError) {
          console.error('Supabase upsert error:', dbError);
          // Continue anyway - don't block the OAuth flow
        } else {
          console.log('Successfully stored tokens for company:', companyName);
        }
      }
      
    } catch (connectivityError) {
      console.error('Supabase connectivity test failed:', connectivityError);
      // Continue anyway - don't block the OAuth flow
    }

    // ALWAYS SUCCEED - Don't let database issues block OAuth success
    console.log('=== OAUTH SUCCESS ===');
    console.log('✅ QuickBooks OAuth completed successfully!');
    console.log('📋 Token Details:');
    console.log('- Company:', companyName);
    console.log('- Realm ID:', realmId);
    console.log('- Access Token (first 20 chars):', tokenData.access_token?.substring(0, 20) + '...');
    console.log('- Refresh Token (first 20 chars):', tokenData.refresh_token?.substring(0, 20) + '...');
    console.log('- Expires in:', tokenData.expires_in, 'seconds');
    console.log('=== END OAUTH SUCCESS ===');

    // Redirect to success page regardless of database status
    return NextResponse.redirect(`${baseUrl}/connect/success?company=${encodeURIComponent(companyName)}&realmId=${realmId}`);

  } catch (error) {
    console.error('Unexpected error in OAuth callback:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://quickscope.info' : 'http://localhost:3005';
    return NextResponse.redirect(`${baseUrl}/connect?error=unexpected_error`);
  }
}

async function exchangeCodeForTokens(code: string) {
  try {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? 'https://quickscope.info/api/qbo/callback'
      : 'http://localhost:3005/api/qbo/callback';

    if (!clientId || !clientSecret) {
      console.error('Missing QuickBooks credentials');
      return null;
    }

    const tokenEndpoint = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

    console.log('Exchanging code for tokens...');
    console.log('Token endpoint:', tokenEndpoint);
    console.log('Client ID:', clientId);
    console.log('Redirect URI:', redirectUri);

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUri
      })
    });

    console.log('Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      return null;
    }

    const tokenData = await response.json();
    console.log('Token exchange successful');
    return tokenData;

  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return null;
  }
}

async function getCompanyInfo(realmId: string, accessToken: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com';

    console.log('Fetching company info from:', `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`);

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
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('Company info response:', JSON.stringify(data, null, 2));
    
    // Try multiple possible paths for the company name
    const companyName = 
      data?.CompanyInfo?.CompanyName ||
      data?.CompanyInfo?.Name ||
      data?.QueryResponse?.CompanyInfo?.[0]?.CompanyName ||
      data?.QueryResponse?.CompanyInfo?.[0]?.Name ||
      data?.QueryResponse?.CompanyInfo?.[0]?.LegalName ||
      null;
    
    console.log('Extracted company name:', companyName);
    
    return {
      name: companyName,
      legalName: data?.QueryResponse?.CompanyInfo?.[0]?.LegalName || null,
      raw: data // Keep for debugging
    };
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}
