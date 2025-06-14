import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QBOCredentials {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  company_id: string;
}

class QuickBooksService {
  async getStoredCredentials(companyId: string): Promise<QBOCredentials | null> {
    const { data, error } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error || !data) return null;
    return data as QBOCredentials;
  }

  async testConnection(credentials: QBOCredentials): Promise<boolean> {
    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://quickbooks.api.intuit.com'
        : 'https://sandbox-quickbooks.api.intuit.com';

      const response = await fetch(
        `${baseUrl}/v3/company/${credentials.company_id}/companyinfo/${credentials.company_id}`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
            'Accept': 'application/json'
          }
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error testing QuickBooks connection:', error);
      return false;
    }
  }

  async fetchComprehensiveFinancialData(credentials: QBOCredentials, dateRange: { start: string; end: string }) {
    // Implementation for fetching financial data
    // This is a placeholder that returns mock data
    return {
      profitLoss: {},
      balanceSheet: {},
      cashFlow: {}
    };
  }

  async getQBOToken(companyId: string): Promise<string> {
    const { data: tokenData, error } = await supabase
      .from('qbo_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('company_id', companyId)
      .single();

    if (error || !tokenData) {
      throw new Error('No valid QuickBooks connection found');
    }

    // Check if token needs refresh
    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);
    
    if (now >= expiresAt) {
      const refreshResult = await refreshQBOToken(tokenData.refresh_token, companyId);
      if (!refreshResult.success) {
        throw new Error('QuickBooks connection expired');
      }
      return refreshResult.access_token!;
    }

    return tokenData.access_token;
  }
}

let qbServiceInstance: QuickBooksService | null = null;

export function getQuickBooksService(): QuickBooksService {
  if (!qbServiceInstance) {
    qbServiceInstance = new QuickBooksService();
  }
  return qbServiceInstance;
}

export async function getQBOToken(companyId: string): Promise<string> {
  return getQuickBooksService().getQBOToken(companyId);
}

async function refreshQBOToken(refreshToken: string, companyId: string): Promise<{ success: boolean; access_token?: string; error?: string }> {
  try {
    const tokenEndpoint = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64')}`,
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