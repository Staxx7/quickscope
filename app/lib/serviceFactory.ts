// Unified Service Factory
// Provides centralized access to all platform services with consistent interfaces

import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Initialize Supabase client
const supabase = createClient(
  config.database.supabase.url,
  config.database.supabase.serviceRoleKey
);

// QuickBooks Service Types
interface QBCredentials {
  accessToken: string;
  refreshToken: string;
  companyId: string;
  expiresAt: Date;
}

interface QBTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  company_id: string;
}

// Unified QuickBooks Service
class UnifiedQuickBooksService {
  private baseUrl = config.quickbooks.environment === 'production' 
    ? 'https://quickbooks.api.intuit.com'
    : 'https://sandbox-quickbooks.api.intuit.com';

  // Get stored credentials from database
  async getStoredCredentials(companyId: string): Promise<QBCredentials | null> {
    const { data, error } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error || !data) return null;
    
    const tokenData = data as QBTokenData;
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      companyId: tokenData.company_id,
      expiresAt: new Date(tokenData.expires_at)
    };
  }

  // Get valid access token (refreshing if needed)
  async getValidAccessToken(companyId: string): Promise<string> {
    const credentials = await this.getStoredCredentials(companyId);
    if (!credentials) {
      throw new Error('No QuickBooks connection found for this company');
    }

    // Check if token needs refresh
    const now = new Date();
    if (now >= credentials.expiresAt) {
      const refreshed = await this.refreshToken(credentials.refreshToken, companyId);
      if (!refreshed) {
        throw new Error('Failed to refresh QuickBooks token');
      }
      return refreshed.accessToken;
    }

    return credentials.accessToken;
  }

  // Refresh access token
  async refreshToken(refreshToken: string, companyId: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
    try {
      const response = await fetch(config.quickbooks.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${config.quickbooks.clientId}:${config.quickbooks.clientSecret}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      });

      if (!response.ok) {
        console.error('Token refresh failed:', response.status, response.statusText);
        return null;
      }

      const tokenData = await response.json();
      const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
      
      // Update token in database
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
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  // Make authenticated request to QuickBooks API
  async makeRequest(endpoint: string, companyId: string): Promise<any> {
    const accessToken = await this.getValidAccessToken(companyId);
    const url = `${this.baseUrl}/v3/company/${companyId}/${endpoint}`;
    
    console.log(`QB API Request: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`QB API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`QuickBooks API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.Fault) {
      console.error('QB API Fault:', data.Fault);
      throw new Error(`QuickBooks API fault: ${data.Fault.Error?.[0]?.Detail || 'Unknown error'}`);
    }

    return data;
  }

  // Get company information
  async getCompanyInfo(companyId: string) {
    try {
      const data = await this.makeRequest(`companyinfo/${companyId}`, companyId);
      return {
        success: true,
        data: data.CompanyInfo || data.QueryResponse?.CompanyInfo?.[0] || null
      };
    } catch (error) {
      console.error('Error fetching company info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get Profit & Loss Report
  async getProfitLoss(companyId: string, startDate?: string, endDate?: string) {
    try {
      const start = startDate || '2024-01-01';
      const end = endDate || new Date().toISOString().split('T')[0];
      
      const endpoint = `reports/ProfitAndLoss?start_date=${start}&end_date=${end}&summarize_column_by=Total`;
      const data = await this.makeRequest(endpoint, companyId);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching P&L:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get Balance Sheet Report
  async getBalanceSheet(companyId: string, asOfDate?: string) {
    try {
      const asOf = asOfDate || new Date().toISOString().split('T')[0];
      const endpoint = `reports/BalanceSheet?start_date=${asOf}&end_date=${asOf}`;
      
      const data = await this.makeRequest(endpoint, companyId);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching Balance Sheet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get Financial Snapshot (combined reports)
  async getFinancialSnapshot(companyId: string) {
    try {
      const [companyInfo, profitLoss, balanceSheet] = await Promise.all([
        this.getCompanyInfo(companyId),
        this.getProfitLoss(companyId),
        this.getBalanceSheet(companyId)
      ]);

      return {
        success: true,
        data: {
          company: companyInfo.data,
          profitLoss: profitLoss.data,
          balanceSheet: balanceSheet.data
        }
      };
    } catch (error) {
      console.error('Error fetching financial snapshot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Service Factory
class ServiceFactory {
  private static instance: ServiceFactory;
  private quickbooksService: UnifiedQuickBooksService;

  private constructor() {
    this.quickbooksService = new UnifiedQuickBooksService();
  }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getQuickBooksService(): UnifiedQuickBooksService {
    return this.quickbooksService;
  }

  getSupabaseClient() {
    return supabase;
  }
}

// Export convenient access methods
export const serviceFactory = ServiceFactory.getInstance();
export const quickbooksService = serviceFactory.getQuickBooksService();
export const getSupabase = () => serviceFactory.getSupabaseClient();

// Export types
export type { QBCredentials, UnifiedQuickBooksService };