import { NextRequest, NextResponse } from 'next/server';
import { qbService, QBCredentials } from '@/lib/quickbooksService';
import { supabase } from '@/lib/supabaseClient';

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://quickbooks.api.intuit.com'
  : 'https://sandbox-quickbooks.api.intuit.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || searchParams.get('company_id');

    if (!companyId) {
      return NextResponse.json({ error: 'company_id is required' }, { status: 400 });
    }

    // Get QB tokens from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (tokenError || !tokenData) {
      console.error('No QB tokens found for company:', companyId, tokenError);
      return NextResponse.json(
        { error: 'QuickBooks connection not found. Please reconnect your QuickBooks account.' },
        { status: 404 }
      );
    }

    // Check if token is expired and refresh if needed
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    
    let accessToken = tokenData.access_token;
    let refreshToken = tokenData.refresh_token;

    if (now >= expiresAt) {
      const refreshResult = await qbService.refreshToken(refreshToken);
      if (!refreshResult) {
        return NextResponse.json(
          { error: 'QuickBooks connection expired. Please reconnect your account.' },
          { status: 401 }
        );
      }
      accessToken = refreshResult.accessToken;
      refreshToken = refreshResult.refreshToken;
    }

    const credentials: QBCredentials = {
      companyId,
      accessToken,
      refreshToken,
      expiresAt: new Date(expiresAt)
    };

    // Get company info first to verify connection
    const companyInfo = await qbService.getCompanyInfo(credentials);
    if (!companyInfo.success) {
      return NextResponse.json({ error: 'No QuickBooks connection found' }, { status: 404 });
    }

    // Fetch comprehensive financial data
    const [profitLoss, balanceSheet, cashFlow, trialBalance, accountsReceivable, accountsPayable] = await Promise.all([
      qbService.getProfitLoss(credentials),
      qbService.getBalanceSheet(credentials),
      fetchCashFlow(credentials),
      fetchTrialBalance(credentials),
      fetchAccountsReceivable(credentials),
      fetchAccountsPayable(credentials)
    ]);

    return NextResponse.json({
      profitLoss,
      balanceSheet,
      cashFlow,
      trialBalance,
      accountsReceivable,
      accountsPayable,
      metadata: {
        retrievedAt: new Date().toISOString(),
        companyId
      }
    });
  } catch (error) {
    console.error('Enhanced financials error:', error);
    return NextResponse.json({ error: 'Failed to retrieve financial data' }, { status: 500 });
  }
}

// Helper functions for fetching additional data
async function fetchCashFlow(credentials: QBCredentials) {
  try {
    const response = await fetch(`${baseUrl}/v3/company/${credentials.companyId}/reports/CashFlow`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching Cash Flow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function fetchTrialBalance(credentials: QBCredentials) {
  try {
    const response = await fetch(`${baseUrl}/v3/company/${credentials.companyId}/reports/TrialBalance`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching Trial Balance:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function fetchAccountsReceivable(credentials: QBCredentials) {
  try {
    const response = await fetch(`${baseUrl}/v3/company/${credentials.companyId}/reports/AgedReceivables`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching Accounts Receivable:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function fetchAccountsPayable(credentials: QBCredentials) {
  try {
    const response = await fetch(`${baseUrl}/v3/company/${credentials.companyId}/reports/AgedPayables`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching Accounts Payable:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
