import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking QBO connections in database...');
    
    // Get all QBO token records
    const { data: qboTokens, error } = await supabase
      .from('qbo_tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: 'Database error',
        details: error.message 
      }, { status: 500 });
    }

    console.log(`Found ${qboTokens?.length || 0} QBO token records`);

    // Check token expiration status
    const now = new Date();
    const tokensWithStatus = qboTokens?.map(token => {
      const expiresAt = new Date(token.expires_at);
      const createdAt = new Date(token.created_at);
      const accessTokenExpired = now >= expiresAt;
      
      // Refresh token expires 100 days from creation
      const refreshTokenExpiresAt = new Date(createdAt.getTime() + (100 * 24 * 60 * 60 * 1000));
      const refreshTokenExpired = now >= refreshTokenExpiresAt;
      
      return {
        company_id: token.company_id,
        company_name: token.company_name,
        created_at: token.created_at,
        expires_at: token.expires_at,
        access_token_expired: accessTokenExpired,
        refresh_token_expired: refreshTokenExpired,
        status: refreshTokenExpired ? 'EXPIRED' : accessTokenExpired ? 'NEEDS_REFRESH' : 'ACTIVE'
      };
    }) || [];

    return NextResponse.json({
      success: true,
      total_connections: tokensWithStatus.length,
      active_connections: tokensWithStatus.filter(t => t.status === 'ACTIVE').length,
      expired_connections: tokensWithStatus.filter(t => t.status === 'EXPIRED').length,
      connections: tokensWithStatus,
      debug_info: {
        current_time: now.toISOString(),
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 