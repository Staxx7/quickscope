// QuickBooks Data Service - Centralized data fetching for advanced tools

export interface QBCredentials {
    companyId: string
    accessToken: string
  }
  
  export interface FinancialDataSet {
    companyInfo: any
    profitLoss: any
    balanceSheet: any
    cashFlow: any
    dateRange: {
      start: string
      end: string
    }
  }
  
  export class QuickBooksService {
    private baseUrl: string
  
    constructor() {
      this.baseUrl = '/api/qbo'
    }
  
    /**
     * Fetch comprehensive financial dataset for advanced analysis
     */
    async fetchComprehensiveFinancialData(
      credentials: QBCredentials,
      dateRange?: { start: string; end: string }
    ): Promise<FinancialDataSet> {
      const { companyId, accessToken } = credentials
      
      // Default to YTD if no date range provided
      const defaultDateRange = {
        start: new Date().getFullYear() + '-01-01',
        end: new Date().toISOString().split('T')[0]
      }
      
      const finalDateRange = dateRange || defaultDateRange
  
      try {
        // Fetch all financial data in parallel
        const [companyInfo, profitLoss, balanceSheet, cashFlow] = await Promise.all([
          this.fetchCompanyInfo(companyId, accessToken),
          this.fetchProfitLoss(companyId, accessToken, finalDateRange),
          this.fetchBalanceSheet(companyId, accessToken, finalDateRange.end),
          this.fetchCashFlow(companyId, accessToken, finalDateRange)
        ])
  
        return {
          companyInfo,
          profitLoss,
          balanceSheet,
          cashFlow,
          dateRange: finalDateRange
        }
  
      } catch (error) {
        console.error('Error fetching comprehensive financial data:', error)
        throw new Error('Failed to fetch financial data from QuickBooks')
      }
    }
  
    /**
     * Fetch company information
     */
    async fetchCompanyInfo(companyId: string, accessToken: string) {
      const params = new URLSearchParams({ companyId, accessToken })
      const response = await fetch(`${this.baseUrl}/company-info?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch company info: ${response.status}`)
      }
      
      return response.json()
    }
  
    /**
     * Fetch Profit & Loss data
     */
    async fetchProfitLoss(
      companyId: string, 
      accessToken: string, 
      dateRange: { start: string; end: string }
    ) {
      const params = new URLSearchParams({ 
        companyId, 
        accessToken,
        startDate: dateRange.start,
        endDate: dateRange.end
      })
      
      const response = await fetch(`${this.baseUrl}/profit-loss?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profit & loss data: ${response.status}`)
      }
      
      return response.json()
    }
  
    /**
     * Fetch Balance Sheet data
     */
    async fetchBalanceSheet(
      companyId: string, 
      accessToken: string, 
      asOfDate?: string
    ) {
      const params = new URLSearchParams({ 
        companyId, 
        accessToken,
        asOfDate: asOfDate || new Date().toISOString().split('T')[0]
      })
      
      const response = await fetch(`${this.baseUrl}/balance-sheet?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance sheet data: ${response.status}`)
      }
      
      return response.json()
    }
  
    /**
     * Fetch Cash Flow data
     */
    async fetchCashFlow(
      companyId: string, 
      accessToken: string, 
      dateRange: { start: string; end: string }
    ) {
      const params = new URLSearchParams({ 
        companyId, 
        accessToken,
        startDate: dateRange.start,
        endDate: dateRange.end
      })
      
      const response = await fetch(`${this.baseUrl}/cash-flow?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cash flow data: ${response.status}`)
      }
      
      return response.json()
    }
  
    /**
     * Get stored QB credentials for a company/prospect
     * This integrates with your existing prospect/company storage
     */
    async getStoredCredentials(prospectId: string): Promise<QBCredentials | null> {
      try {
        // First, check localStorage for development/testing
        const stored = localStorage.getItem(`qb_credentials_${prospectId}`)
        
        if (stored) {
          return JSON.parse(stored)
        }
  
        // For production, you would fetch from your database
        // Example API call to your prospect storage:
        // const response = await fetch(`/api/prospects/${prospectId}/qb-credentials`)
        // if (response.ok) {
        //   return response.json()
        // }
        
        // For now, return mock credentials for testing
        if (prospectId === 'comp_001') {
          return {
            companyId: 'test_company_123',
            accessToken: 'mock_access_token_for_testing'
          }
        }
        
        return null
        
      } catch (error) {
        console.error('Error fetching stored credentials:', error)
        return null
      }
    }
  
    /**
     * Store QB credentials after OAuth completion
     */
    async storeCredentials(prospectId: string, credentials: QBCredentials): Promise<void> {
      try {
        // Store in localStorage for development
        localStorage.setItem(`qb_credentials_${prospectId}`, JSON.stringify(credentials))
        
        // For production, store in your database
        // Example:
        // await fetch(`/api/prospects/${prospectId}/qb-credentials`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(credentials)
        // })
        
      } catch (error) {
        console.error('Error storing credentials:', error)
        throw new Error('Failed to store QB credentials')
      }
    }
  
    /**
     * Test QB connection
     */
    async testConnection(credentials: QBCredentials): Promise<boolean> {
      try {
        await this.fetchCompanyInfo(credentials.companyId, credentials.accessToken)
        return true
      } catch (error) {
        console.error('Connection test failed:', error)
        return false
      }
    }
  
    /**
     * Generate QB OAuth URL for new connections
     */
    async generateAuthUrl(prospectId: string): Promise<string> {
      try {
        const response = await fetch(`${this.baseUrl}/auth?companyId=${prospectId}`)
        
        if (!response.ok) {
          throw new Error('Failed to generate auth URL')
        }
        
        const data = await response.json()
        return data.authUrl
        
      } catch (error) {
        console.error('Error generating auth URL:', error)
        throw new Error('Failed to generate QuickBooks authorization URL')
      }
    }
  
    /**
     * Check if credentials exist for a prospect
     */
    async hasCredentials(prospectId: string): Promise<boolean> {
      const credentials = await this.getStoredCredentials(prospectId)
      return credentials !== null
    }
  
    /**
     * Refresh expired access token
     */
    async refreshAccessToken(companyId: string, refreshToken: string): Promise<QBCredentials | null> {
      try {
        // This would call your refresh token endpoint
        // const response = await fetch(`${this.baseUrl}/refresh`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ companyId, refreshToken })
        // })
        
        // For now, return null (would need QB refresh token implementation)
        return null
        
      } catch (error) {
        console.error('Error refreshing access token:', error)
        return null
      }
    }
  }
  
  // Export singleton instance
  export const qbService = new QuickBooksService()
  
  // Helper function to format QB API errors
  export function formatQBError(error: any): string {
    if (error.message?.includes('400')) {
      return 'Invalid request parameters. Please check your QuickBooks connection.'
    }
    
    if (error.message?.includes('401')) {
      return 'QuickBooks access token expired. Please reconnect your account.'
    }
    
    if (error.message?.includes('403')) {
      return 'Insufficient permissions to access QuickBooks data.'
    }
    
    if (error.message?.includes('404')) {
      return 'QuickBooks company not found or data unavailable.'
    }
    
    if (error.message?.includes('500')) {
      return 'QuickBooks server error. Please try again later.'
    }
    
    return error.message || 'Unknown error occurred while accessing QuickBooks.'
  }
  