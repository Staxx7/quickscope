// app/api/financial-snapshots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QBOToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  company_name: string;
}

interface FinancialData {
  revenue: number;
  net_income: number;
  expenses: number;
  assets: number;
  liabilities: number;
}

interface QBOFinancialResponse {
  success: boolean;
  data?: FinancialData;
  error?: string;
}

interface TokenRefreshResponse {
  success: boolean;
  access_token?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const realm_id = searchParams.get('realm_id');

    if (!realm_id) {
      return NextResponse.json({ error: 'realm_id is required' }, { status: 400 });
    }

    // First check if we have cached financial data
    const { data: existingSnapshots, error: snapshotError } = await supabase
      .from('financial_snapshots')
      .select('*')
      .eq('company_id', realm_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (snapshotError) {
      console.error('Error fetching existing snapshots:', snapshotError);
    }

    // If we have recent data (less than 24 hours old), return it
    if (existingSnapshots && existingSnapshots.length > 0) {
      const latestSnapshot = existingSnapshots[0];
      const snapshotAge = Date.now() - new Date(latestSnapshot.created_at).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (snapshotAge < twentyFourHours) {
        return NextResponse.json([latestSnapshot]);
      }
    }

    // Get fresh data from QuickBooks
    const { data: tokens, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('access_token, refresh_token, expires_at, company_name')
      .eq('company_id', realm_id)
      .single();

    if (tokenError || !tokens) {
      return NextResponse.json({ error: 'No valid QuickBooks connection found' }, { status: 404 });
    }

    const tokenData = tokens as QBOToken;

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    
    let accessToken = tokenData.access_token;

    if (now >= expiresAt) {
      // Try to refresh the token
      const refreshResult = await refreshQBOToken(tokenData.refresh_token, realm_id);
      if (!refreshResult.success) {
        return NextResponse.json({ 
          error: 'QuickBooks connection expired. Please reconnect.',
          code: 'TOKEN_EXPIRED'
        }, { status: 401 });
      }
      accessToken = refreshResult.access_token!;
    }

    // Fetch fresh financial data from QuickBooks
    const financialData: QBOFinancialResponse = await fetchQBOFinancialData(realm_id, accessToken);

    if (!financialData.success || !financialData.data) {
      return NextResponse.json({ 
        error: 'Failed to fetch financial data from QuickBooks',
        details: financialData.error
      }, { status: 500 });
    }

    // Store the new financial snapshot
    const { data: newSnapshot, error: insertError } = await supabase
      .from('financial_snapshots')
      .insert({
        company_id: realm_id,
        revenue: financialData.data.revenue,
        net_income: financialData.data.net_income,
        expenses: financialData.data.expenses,
        assets: financialData.data.assets,
        liabilities: financialData.data.liabilities,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing financial snapshot:', insertError);
      return NextResponse.json({ error: 'Failed to store financial data' }, { status: 500 });
    }

    return NextResponse.json([newSnapshot]);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_id, revenue, net_income, expenses, assets, liabilities } = body;

    if (!company_id) {
      return NextResponse.json({ error: 'company_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('financial_snapshots')
      .insert({
        company_id,
        revenue: revenue || 0,
        net_income: net_income || 0,
        expenses: expenses || 0,
        assets: assets || 0,
        liabilities: liabilities || 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial snapshot:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function refreshQBOToken(refreshToken: string, companyId: string): Promise<TokenRefreshResponse> {
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
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      })
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData = await response.json();

    // Update the token in database
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
    
    await supabase
      .from('qbo_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    return {
      success: true,
      access_token: tokenData.access_token
    };

  } catch (error) {
    console.error('Error refreshing QBO token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function fetchQBOFinancialData(companyId: string, accessToken: string): Promise<QBOFinancialResponse> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com';

    // Fetch Profit & Loss Report
    const plResponse = await fetch(
      `${baseUrl}/v3/company/${companyId}/reports/ProfitAndLoss?summarize_column_by=Total&date_macro=This Fiscal Year-to-date`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!plResponse.ok) {
      throw new Error(`P&L fetch failed: ${plResponse.statusText}`);
    }

    const plData = await plResponse.json();

    // Fetch Balance Sheet Report
    const bsResponse = await fetch(
      `${baseUrl}/v3/company/${companyId}/reports/BalanceSheet?summarize_column_by=Total&date_macro=Today`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!bsResponse.ok) {
      throw new Error(`Balance Sheet fetch failed: ${bsResponse.statusText}`);
    }

    const bsData = await bsResponse.json();

    // Extract financial metrics
    const financialMetrics = extractFinancialMetrics(plData, bsData);

    return {
      success: true,
      data: financialMetrics
    };

  } catch (error) {
    console.error('Error fetching QBO financial data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function extractFinancialMetrics(plData: any, bsData: any): FinancialData {
  let revenue = 0;
  let expenses = 0;
  let netIncome = 0;

  try {
    const plReport = plData?.QueryResponse?.Report?.[0];
    if (plReport?.Rows) {
      for (const section of plReport.Rows) {
        if (section.group === 'Income' && section.ColData) {
          revenue = parseFloat(section.ColData[1]?.value || '0') || 0;
        } else if (section.group === 'Expenses' && section.ColData) {
          expenses = parseFloat(section.ColData[1]?.value || '0') || 0;
        }
      }
    }
    netIncome = revenue - expenses;
  } catch (error) {
    console.error('Error parsing P&L data:', error);
  }

  let assets = 0;
  let liabilities = 0;

  try {
    const bsReport = bsData?.QueryResponse?.Report?.[0];
    if (bsReport?.Rows) {
      for (const section of bsReport.Rows) {
        if (section.group === 'Assets' && section.ColData) {
          assets = parseFloat(section.ColData[1]?.value || '0') || 0;
        } else if (section.group === 'Liabilities' && section.ColData) {
          liabilities = parseFloat(section.ColData[1]?.value || '0') || 0;
        }
      }
    }
  } catch (error) {
    console.error('Error parsing Balance Sheet data:', error);
  }

  return {
    revenue,
    net_income: netIncome,
    expenses,
    assets,
    liabilities
  };
}
