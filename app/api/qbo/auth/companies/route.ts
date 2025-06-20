// app/api/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QBOToken {
  company_id: string;
  company_name: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
  refresh_token: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching companies from qbo_tokens table...');
    
    // Get all companies with valid QuickBooks connections
    const { data: qboTokens, error } = await supabase
      .from('qbo_tokens')
      .select('company_id, company_name, created_at, updated_at, expires_at, refresh_token')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching QBO tokens:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch companies',
        details: error.message 
      }, { status: 500 });
    }

    console.log(`Found ${qboTokens?.length || 0} QBO token records`);

    if (!qboTokens || qboTokens.length === 0) {
      return NextResponse.json({ 
        companies: [],
        total: 0,
        active: 0,
        expired: 0,
        message: 'No connected QuickBooks companies found'
      });
    }

    // Check token expiration and determine status
    const companies = qboTokens.map((token: QBOToken) => {
      const now = new Date();
      const expiresAt = new Date(token.expires_at);
      const accessTokenExpired = now >= expiresAt;
      
      // Calculate refresh token expiration (100 days from creation)
      const createdAt = new Date(token.created_at);
      const refreshTokenExpiresAt = new Date(createdAt.getTime() + (100 * 24 * 60 * 60 * 1000)); // 100 days
      const refreshTokenExpired = now >= refreshTokenExpiresAt;
      
      let status: 'active' | 'expired' | 'needs_refresh';
      
      if (refreshTokenExpired) {
        // Refresh token expired - truly expired, needs reconnection
        status = 'expired';
      } else if (accessTokenExpired) {
        // Access token expired but refresh token valid - needs refresh but still "active"
        status = 'active'; // We'll handle refresh automatically
      } else {
        // Access token still valid
        status = 'active';
      }
      
      return {
        id: token.company_id,
        company_name: token.company_name || `Company ${token.company_id}`,
        realm_id: token.company_id, // Using company_id as realm_id for consistency
        connected_at: token.created_at,
        last_sync: token.updated_at,
        status: status,
        expires_at: token.expires_at,
        access_token_expired: accessTokenExpired,
        refresh_token_expired: refreshTokenExpired
      };
    });

    const result = {
      companies,
      total: companies.length,
      active: companies.filter(c => c.status === 'active').length,
      expired: companies.filter(c => c.status === 'expired').length
    };

    console.log('Companies API result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Unexpected error fetching companies:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
