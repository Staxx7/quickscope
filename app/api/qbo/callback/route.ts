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

    // Create Supabase client
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

    // Store tokens in database
    try {
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
        })
        .select()
        .single();

      if (dbError) {
        console.error('Supabase upsert error:', dbError);
        // Continue anyway - don't block the OAuth flow
      } else {
        console.log('Successfully stored tokens for company:', companyName);
      }

      // Create/update prospect record
      // First check if a prospect with this qb_company_id exists
      const { data: existingProspect } = await supabase
        .from('prospects')
        .select('id')
        .eq('qb_company_id', realmId)
        .single();

      const prospectData = {
        company_name: companyName,
        contact_name: companyName,
        email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        qb_company_id: realmId,
        workflow_stage: 'connected',
        user_type: 'prospect',
        updated_at: new Date().toISOString()
      };

      let prospectResult;
      if (existingProspect) {
        // Update existing prospect
        const { data, error } = await supabase
          .from('prospects')
          .update(prospectData)
          .eq('id', existingProspect.id)
          .select()
          .single();
        
        prospectResult = data;
        if (error) {
          console.warn('Prospect update error:', error);
        }
      } else {
        // Create new prospect
        const { data, error } = await supabase
          .from('prospects')
          .insert(prospectData)
          .select()
          .single();
        
        prospectResult = data;
        if (error) {
          console.warn('Prospect insert error:', error);
        }
      }

      if (prospectResult) {
        console.log('Prospect saved/updated:', prospectResult.id);
      }
      
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      // Continue anyway - don't block the OAuth flow
    }

    // Create success redirect with cookies
    const successUrl = `${baseUrl}/success?company=${encodeURIComponent(companyName)}&realmId=${realmId}`;
    const response = NextResponse.redirect(successUrl);
    
    // Set authentication cookies
    response.cookies.set('qb_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    response.cookies.set('qb_company_id', realmId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    response.cookies.set('qb_realm_id', realmId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    console.log('OAuth flow completed successfully, redirecting with cookies set');
    return response;

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
