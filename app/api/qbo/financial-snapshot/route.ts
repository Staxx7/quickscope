// app/api/financial-snapshots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

const supabase = getSupabaseServerClient();

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

// Update app/api/qbo/financial-snapshot/route.ts
interface EnhancedFinancialSnapshot {
  // Current basic fields
  revenue: number;
  expenses: number;
  profit: number;
  profit_margin: number;
  cash_flow: number;
  
  // NEW: Enhanced financial metrics
  assets: {
    current_assets: number;
    fixed_assets: number;
    total_assets: number;
  };
  liabilities: {
    current_liabilities: number;
    long_term_debt: number;
    total_liabilities: number;
  };
  ratios: {
    current_ratio: number;
    debt_to_equity: number;
    gross_margin: number;
    operating_margin: number;
  };
  trends: {
    revenue_growth_rate: number;
    expense_growth_rate: number;
    profit_trend: 'increasing' | 'decreasing' | 'stable';
  };
  benchmarks: {
    industry_avg_profit_margin: number;
    performance_vs_industry: 'above' | 'below' | 'average';
  };
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
        // Map database column names to expected API response format
        const mappedSnapshot = {
          ...latestSnapshot,
          net_income: latestSnapshot.profit,
          assets: latestSnapshot.total_assets,
          liabilities: latestSnapshot.total_liabilities
        };
        return NextResponse.json([mappedSnapshot]);
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

    // Log the request attempt
    console.log('Attempting to fetch financial data:', {
      realm_id,
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length,
      environment: process.env.NODE_ENV
    });

    // Fetch fresh financial data from QuickBooks
    const financialData: QBOFinancialResponse = await fetchQBOFinancialData(realm_id, accessToken);

    if (!financialData.success || !financialData.data) {
      console.error('Failed to fetch financial data:', {
        success: financialData.success,
        error: financialData.error,
        hasData: !!financialData.data
      });
      return NextResponse.json({ 
        error: 'Failed to fetch financial data from QuickBooks',
        details: financialData.error
      }, { status: 500 });
    }

    // Calculate additional financial metrics
    const equity = financialData.data.assets - financialData.data.liabilities;
    const debtToEquity = equity > 0 ? financialData.data.liabilities / equity : 0;
    const profitMargin = financialData.data.revenue > 0 
      ? (financialData.data.net_income / financialData.data.revenue) * 100 
      : 0;

    // Log the financial data for debugging
    console.log('Financial data to store:', {
      company_id: realm_id,
      revenue: financialData.data.revenue,
      expenses: financialData.data.expenses,
      profit: financialData.data.net_income,
      total_assets: financialData.data.assets,
      total_liabilities: financialData.data.liabilities,
      calculated_metrics: {
        profit_margin: profitMargin.toFixed(2),
        debt_to_equity: debtToEquity.toFixed(2),
        equity: equity
      }
    });

    // Check if all data is zero
    const hasAnyData = financialData.data.revenue > 0 || 
                       financialData.data.expenses > 0 || 
                       financialData.data.assets > 0 || 
                       financialData.data.liabilities > 0;

    if (!hasAnyData) {
      console.warn('QuickBooks returned all zero values - company may have no financial data');
    }

    // Prepare data to insert - matching exact column names from database schema
    const dataToInsert = {
      company_id: realm_id,
      revenue: financialData.data.revenue || 0,
      profit: financialData.data.net_income || 0,  // Column is 'profit' not 'net_income'
      expenses: financialData.data.expenses || 0,
      total_assets: financialData.data.assets || 0,  // Column is 'total_assets' not 'assets'
      total_liabilities: financialData.data.liabilities || 0,  // Column is 'total_liabilities' not 'liabilities'
      profit_margin: profitMargin,
      cash_flow: 0,  // Will be calculated in future updates
      current_ratio: 0,  // Will be calculated when we have current assets/liabilities
      debt_to_equity: debtToEquity,
      gross_margin: 0,  // Will be calculated in future updates
      operating_margin: 0,  // Will be calculated in future updates
      revenue_growth_rate: 0,  // Will be calculated in future updates
      snapshot_type: 'monthly',  // Required field with default
      snapshot_data: JSON.stringify({
        source: 'quickbooks',
        period: new Date().getFullYear().toString(),
        extracted_at: new Date().toISOString()
      }),
      created_at: new Date().toISOString()
    };

    console.log('Attempting to insert financial snapshot:', dataToInsert);

    // Store the new financial snapshot
    const { data: newSnapshot, error: insertError } = await supabase
      .from('financial_snapshots')
      .insert(dataToInsert)
      .select()
      .single();

    if (insertError) {
      console.error('Error storing financial snapshot:', insertError);
      return NextResponse.json({ 
        error: 'Failed to store financial data',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint || insertError.details
      }, { status: 500 });
    }

    // Map database column names back to expected API response format
    const responseData = newSnapshot ? [{
      ...newSnapshot,
      net_income: newSnapshot.profit,  // Map back for consistency
      assets: newSnapshot.total_assets,
      liabilities: newSnapshot.total_liabilities
    }] : [];

    return NextResponse.json(responseData);

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
        profit: net_income || 0,  // Map to correct column name
        expenses: expenses || 0,
        total_assets: assets || 0,  // Map to correct column name
        total_liabilities: liabilities || 0,  // Map to correct column name
        profit_margin: revenue > 0 ? ((net_income / revenue) * 100) : 0,
        snapshot_type: 'monthly',
        snapshot_data: JSON.stringify({
          source: 'api_post',
          extracted_at: new Date().toISOString()
        }),
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
        'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID || process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QB_CLIENT_SECRET || process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
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
    console.log('P&L Response:', JSON.stringify(plData, null, 2));

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
    console.log('Balance Sheet Response:', JSON.stringify(bsData, null, 2));

    // Extract financial metrics
    const financialMetrics = extractFinancialMetrics(plData, bsData);
    console.log('Extracted Financial Metrics:', financialMetrics);

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
    // Extract values from QuickBooks P&L Report structure
    const plRows = plData?.Rows || [];
    
    // Helper function to safely extract numeric value
    const extractValue = (colData: any): number => {
      if (!colData || !Array.isArray(colData)) return 0;
      const valueCol = colData.find((col: any) => col.value && !isNaN(parseFloat(col.value)));
      return valueCol ? Math.abs(parseFloat(valueCol.value)) : 0;
    };

    // Recursive function to find specific rows
    const findRowByLabel = (rows: any[], labels: string[]): any => {
      for (const row of rows) {
        // Check header
        if (row.Header?.ColData) {
          const headerText = row.Header.ColData[0]?.value || '';
          if (labels.some(label => headerText.toLowerCase().includes(label.toLowerCase()))) {
            return row;
          }
        }
        // Check summary
        if (row.Summary?.ColData) {
          const summaryText = row.Summary.ColData[0]?.value || '';
          if (labels.some(label => summaryText.toLowerCase().includes(label.toLowerCase()))) {
            return row;
          }
        }
        // Recurse into nested rows
        if (row.Rows && Array.isArray(row.Rows)) {
          const found = findRowByLabel(row.Rows, labels);
          if (found) return found;
        }
      }
      return null;
    };

    // Find income row
    const incomeRow = findRowByLabel(plRows, ['Total Income', 'Total Revenue', 'Income']);
    if (incomeRow?.Summary?.ColData) {
      revenue = extractValue(incomeRow.Summary.ColData);
    }

    // Find expenses row
    const expenseRow = findRowByLabel(plRows, ['Total Expenses', 'Total Operating Expenses', 'Expenses']);
    if (expenseRow?.Summary?.ColData) {
      expenses = extractValue(expenseRow.Summary.ColData);
    }

    // Find net income row
    const netIncomeRow = findRowByLabel(plRows, ['Net Income', 'Net Profit', 'Net Earnings', 'Net Operating Income']);
    if (netIncomeRow?.Summary?.ColData) {
      netIncome = extractValue(netIncomeRow.Summary.ColData);
      // Net income can be negative, so don't use Math.abs for final value
      if (netIncomeRow.Summary.ColData[1]?.value) {
        netIncome = parseFloat(netIncomeRow.Summary.ColData[1].value) || 0;
      }
    }

    // If net income not found, calculate it
    if (netIncome === 0 && (revenue > 0 || expenses > 0)) {
      netIncome = revenue - expenses;
    }

    console.log('Extracted P&L - Revenue:', revenue, 'Expenses:', expenses, 'Net Income:', netIncome);
  } catch (error) {
    console.error('Error parsing P&L data:', error);
  }

  let assets = 0;
  let liabilities = 0;

  try {
    // Extract values from QuickBooks Balance Sheet Report structure
    const bsRows = bsData?.Rows || [];
    
    // Helper function to safely extract numeric value
    const extractValue = (colData: any): number => {
      if (!colData || !Array.isArray(colData)) return 0;
      const valueCol = colData.find((col: any) => col.value && !isNaN(parseFloat(col.value)));
      return valueCol ? Math.abs(parseFloat(valueCol.value)) : 0;
    };

    // Recursive function to find specific rows
    const findRowByLabel = (rows: any[], labels: string[]): any => {
      for (const row of rows) {
        // Check header
        if (row.Header?.ColData) {
          const headerText = row.Header.ColData[0]?.value || '';
          if (labels.some(label => headerText.toLowerCase().includes(label.toLowerCase()))) {
            return row;
          }
        }
        // Check summary
        if (row.Summary?.ColData) {
          const summaryText = row.Summary.ColData[0]?.value || '';
          if (labels.some(label => summaryText.toLowerCase().includes(label.toLowerCase()))) {
            return row;
          }
        }
        // Recurse into nested rows
        if (row.Rows && Array.isArray(row.Rows)) {
          const found = findRowByLabel(row.Rows, labels);
          if (found) return found;
        }
      }
      return null;
    };

    // Find assets row
    const assetsRow = findRowByLabel(bsRows, ['Total Assets', 'TOTAL ASSETS']);
    if (assetsRow?.Summary?.ColData) {
      assets = extractValue(assetsRow.Summary.ColData);
    }

    // Find liabilities row
    const liabilitiesRow = findRowByLabel(bsRows, ['Total Liabilities', 'TOTAL LIABILITIES']);
    if (liabilitiesRow?.Summary?.ColData) {
      liabilities = extractValue(liabilitiesRow.Summary.ColData);
    }

    console.log('Extracted Balance Sheet - Assets:', assets, 'Liabilities:', liabilities);
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
