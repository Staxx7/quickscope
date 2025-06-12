// Production QuickBooks service with your live credentials
export interface QBCredentials {
  accessToken: string
  refreshToken: string
  companyId: string
  expiresAt: Date
}

export class QuickBooksService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.quickbooks.com'
    : 'https://sandbox-quickbooks.api.intuit.com'
  
  async getCompanyInfo(credentials: QBCredentials) {
    // Uses your live QB credentials from .env
    const response = await fetch(
      `${this.baseUrl}/v3/company/${credentials.companyId}/companyinfo/${credentials.companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json'
        }
      }
    )
    return response.json()
  }

  async getProfitLoss(credentials: QBCredentials, startDate?: string, endDate?: string) {
    // Live P&L data from QuickBooks
    const params = new URLSearchParams({
      start_date: startDate || '2024-01-01',
      end_date: endDate || new Date().toISOString().split('T')[0]
    })
    
    const response = await fetch(
      `${this.baseUrl}/v3/company/${credentials.companyId}/reports/ProfitAndLoss?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Accept': 'application/json'
        }
      }
    )
    return response.json()
  }
}

export const qbService = new QuickBooksService()
