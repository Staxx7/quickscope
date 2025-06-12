interface QBCredentials {
  accessToken: string
  refreshToken: string
  companyId: string
  expiresAt: Date
}

interface QBApiResponse {
  QueryResponse?: any
  QueryFault?: any
  Fault?: any
}

export class QuickBooksService {
  private baseUrl = 'https://api.quickbooks.com' // Production QB API

  /**
   * Make authenticated request to QuickBooks API
   */
  private async makeRequest(endpoint: string, credentials: QBCredentials): Promise<any> {
    const url = `${this.baseUrl}/v3/company/${credentials.companyId}/${endpoint}`
    
    console.log(`QB API Request: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`QB API Error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`QuickBooks API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.Fault) {
      console.error('QB API Fault:', data.Fault)
      throw new Error(`QuickBooks API fault: ${data.Fault.Error?.[0]?.Detail || 'Unknown error'}`)
    }

    return data
  }

  /**
   * Get company information
   */
  async getCompanyInfo(credentials: QBCredentials) {
    try {
      const data = await this.makeRequest(`companyinfo/${credentials.companyId}`, credentials)
      return {
        success: true,
        data: data.QueryResponse?.CompanyInfo?.[0] || null
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get Profit & Loss Report
   */
  async getProfitLoss(credentials: QBCredentials, startDate?: string, endDate?: string) {
    try {
      const start = startDate || '2024-01-01'
      const end = endDate || new Date().toISOString().split('T')[0]
      
      const endpoint = `reports/ProfitAndLoss?start_date=${start}&end_date=${end}&summarize_column_by=Total`
      const data = await this.makeRequest(endpoint, credentials)
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('Error fetching P&L:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get Balance Sheet Report
   */
  async getBalanceSheet(credentials: QBCredentials, asOfDate?: string) {
    try {
      const asOf = asOfDate || new Date().toISOString().split('T')[0]
      const endpoint = `reports/BalanceSheet?start_date=${asOf}&end_date=${asOf}`
      
      const data = await this.makeRequest(endpoint, credentials)
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('Error fetching Balance Sheet:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get Chart of Accounts
   */
  async getChartOfAccounts(credentials: QBCredentials) {
    try {
      const data = await this.makeRequest("accounts", credentials)
      
      return {
        success: true,
        data: data.QueryResponse?.Account || []
      }
    } catch (error) {
      console.error('Error fetching Chart of Accounts:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get all items (products/services)
   */
  async getItems(credentials: QBCredentials) {
    try {
      const data = await this.makeRequest("items", credentials)
      
      return {
        success: true,
        data: data.QueryResponse?.Item || []
      }
    } catch (error) {
      console.error('Error fetching Items:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
    try {
      const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.QB_CLIENT_ID}:${process.env.QB_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })
      })

      if (!response.ok) {
        console.error('Token refresh failed:', response.status, response.statusText)
        return null
      }

      const tokenData = await response.json()
      
      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  }
}

export const qbService = new QuickBooksService()

// Export types
export type { QBCredentials }
