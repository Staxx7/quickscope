import { createClient } from '@supabase/supabase-js'
export async function exchangeCodeForTokens(code: string, realmId: string) {
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QBO_CLIENT_ID}:${process.env.QBO_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.QBO_REDIRECT_URI!
      })
    })
  
    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }
  
    return response.json()
  }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface QBAnalysisResult {
  companyInfo: any
  financialMetrics: {
    revenue: number
    expenses: number
    netIncome: number
    cashFlow: number
  }
  insights: string[]
  recommendations: string[]
}

export async function analyzeQuickBooksData(accessToken: string, companyId: string): Promise<QBAnalysisResult> {
  try {
    // 1. Fetch company information
    const companyInfo = await fetchCompanyInfo(accessToken, companyId)
    
    // 2. Fetch financial data
    const profitLoss = await fetchProfitLoss(accessToken, companyId)
    const balanceSheet = await fetchBalanceSheet(accessToken, companyId)
    const cashFlow = await fetchCashFlow(accessToken, companyId)
    
    // 3. Calculate metrics
    const metrics = calculateFinancialMetrics(profitLoss, balanceSheet, cashFlow)
    
    // 4. Generate insights using AI
    const insights = await generateFinancialInsights(metrics, companyInfo)
    
    // 5. Store in Supabase
    await storeAnalysisResults(companyId, {
      companyInfo,
      metrics,
      insights,
      analyzedAt: new Date().toISOString()
    })
    
    return {
      companyInfo,
      financialMetrics: metrics,
      insights: insights.insights,
      recommendations: insights.recommendations
    }
  } catch (error) {
    console.error('QuickBooks analysis error:', error)
    throw error
  }
}

async function fetchCompanyInfo(accessToken: string, companyId: string) {
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/companyinfo/${companyId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch company info')
  }
  
  return await response.json()
}

async function fetchProfitLoss(accessToken: string, companyId: string) {
  const today = new Date()
  const startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]
  const endDate = today.toISOString().split('T')[0]
  
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch P&L')
  }
  
  return await response.json()
}

async function fetchBalanceSheet(accessToken: string, companyId: string) {
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/BalanceSheet`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch Balance Sheet')
  }
  
  return await response.json()
}

async function fetchCashFlow(accessToken: string, companyId: string) {
  const today = new Date()
  const startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0]
  const endDate = today.toISOString().split('T')[0]
  
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/CashFlow?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch Cash Flow')
  }
  
  return await response.json()
}

function calculateFinancialMetrics(profitLoss: any, balanceSheet: any, cashFlow: any) {
  // Extract key financial metrics from QB reports
  // This is simplified - you'll need to parse the actual QB report structure
  return {
    revenue: extractRevenueFromPL(profitLoss),
    expenses: extractExpensesFromPL(profitLoss),
    netIncome: extractNetIncomeFromPL(profitLoss),
    cashFlow: extractCashFlowFromReport(cashFlow),
    assets: extractAssetsFromBS(balanceSheet),
    liabilities: extractLiabilitiesFromBS(balanceSheet),
    equity: extractEquityFromBS(balanceSheet)
  }
}

async function generateFinancialInsights(metrics: any, companyInfo: any) {
  try {
    // Using OpenAI API for financial analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst providing insights for small businesses.'
          },
          {
            role: 'user',
            content: `Analyze this financial data and provide insights and recommendations:
            
            Company: ${companyInfo?.QueryResponse?.CompanyInfo?.[0]?.CompanyName || 'Unknown'}
            Revenue: $${metrics.revenue?.toLocaleString() || 0}
            Expenses: $${metrics.expenses?.toLocaleString() || 0}
            Net Income: $${metrics.netIncome?.toLocaleString() || 0}
            Cash Flow: $${metrics.cashFlow?.toLocaleString() || 0}
            
            Provide 3-5 key insights and 3-5 actionable recommendations.`
          }
        ]
      })
    })

    const aiResponse = await response.json()
    const analysis = aiResponse.choices[0].message.content

    // Parse the response into insights and recommendations
    return {
      insights: extractInsights(analysis),
      recommendations: extractRecommendations(analysis)
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    return {
      insights: ['Financial data analysis completed'],
      recommendations: ['Schedule consultation to discuss findings']
    }
  }
}

async function storeAnalysisResults(companyId: string, analysisData: any) {
  const { data, error } = await supabase
    .from('financial_analyses')
    .insert([
      {
        company_id: companyId,
        analysis_data: analysisData,
        created_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Error storing analysis:', error)
    throw error
  }

  return data
}

// Helper functions to extract data from QB reports
function extractRevenueFromPL(profitLoss: any): number {
  // Parse QuickBooks P&L structure to extract revenue
  // This will need to be customized based on actual QB report format
  return 0
}

function extractExpensesFromPL(profitLoss: any): number {
  // Parse QuickBooks P&L structure to extract expenses
  return 0
}

function extractNetIncomeFromPL(profitLoss: any): number {
  // Parse QuickBooks P&L structure to extract net income
  return 0
}

function extractCashFlowFromReport(cashFlow: any): number {
  // Parse QuickBooks Cash Flow structure
  return 0
}

function extractAssetsFromBS(balanceSheet: any): number {
  // Parse QuickBooks Balance Sheet structure
  return 0
}

function extractLiabilitiesFromBS(balanceSheet: any): number {
  // Parse QuickBooks Balance Sheet structure
  return 0
}

function extractEquityFromBS(balanceSheet: any): number {
  // Parse QuickBooks Balance Sheet structure
  return 0
}

function extractInsights(analysis: string): string[] {
  // Parse AI response to extract insights
  const insights = analysis.split('\n').filter(line => 
    line.toLowerCase().includes('insight') || 
    line.toLowerCase().includes('finding')
  )
  return insights.slice(0, 5)
}

function extractRecommendations(analysis: string): string[] {
  // Parse AI response to extract recommendations
  const recommendations = analysis.split('\n').filter(line => 
    line.toLowerCase().includes('recommend') || 
    line.toLowerCase().includes('suggest')
  )
  return recommendations.slice(0, 5)
}