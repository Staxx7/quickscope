import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface TokenData {
  id: string;
  company_id: string;
  company_name: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get all tokens that will expire in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 70); // Refresh tokens used 70+ days ago

    // Fetch tokens that need refreshing
    const { data: tokensToRefresh, error } = await supabase
      .from('qbo_tokens')
      .select('*')
      .lt('updated_at', ninetyDaysAgo.toISOString())
      .order('updated_at', { ascending: true })
      .limit(10); // Process in batches

    if (error) {
      console.error('Error fetching tokens:', error);
      return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
    }

    if (!tokensToRefresh || tokensToRefresh.length === 0) {
      return NextResponse.json({ message: 'No tokens need refreshing' });
    }

    const results = [];
    
    for (const token of tokensToRefresh as TokenData[]) {
      try {
        // Refresh the token
        const refreshResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID || process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QB_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            'grant_type': 'refresh_token',
            'refresh_token': token.refresh_token
          })
        });

        if (refreshResponse.ok) {
          const newTokenData = await refreshResponse.json();
          const newExpiresAt = new Date(Date.now() + (newTokenData.expires_in * 1000));
          
          // Update tokens in database
          await supabase
            .from('qbo_tokens')
            .update({
              access_token: newTokenData.access_token,
              refresh_token: newTokenData.refresh_token,
              expires_at: newExpiresAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('company_id', token.company_id);

          results.push({
            company_id: token.company_id,
            company_name: token.company_name,
            status: 'refreshed'
          });
        } else {
          results.push({
            company_id: token.company_id,
            company_name: token.company_name,
            status: 'failed',
            error: 'Token refresh failed'
          });
        }
      } catch (error) {
        results.push({
          company_id: token.company_id,
          company_name: token.company_name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Token refresh completed',
      results,
      processed: results.length
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 