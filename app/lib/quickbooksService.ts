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
}

let qbServiceInstance: QuickBooksService | null = null;

export function getQuickBooksService(): QuickBooksService {
  if (!qbServiceInstance) {
    qbServiceInstance = new QuickBooksService();
  }
  return qbServiceInstance;
} 