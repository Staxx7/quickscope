// app/api/qbo/enhanced-financials/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

interface FinancialMetrics {
  revenue: number
  expenses: number
  netIncome: number
  grossMargin: number
  netMargin: number
  currentAssets: number
  currentLiabilities: number
  totalAssets: number
  totalLiabilities: number
  equity: number
  currentRatio: number
  quickRatio: number
  debtToEquityRatio: number
  returnOnAssets: number
  returnOnEquity: number
  inventoryTurnover: number
  accountsReceivableTurnover: number
  cashFlow: number
  workingCapital: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Fetch QB tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('realmId', companyId)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'QuickBooks connection not found' }, { status: 404 })
    }

    // Fetch comprehensive financial data
    const [companyInfo, profitLoss, balanceSheet, cashFlow] = await Promise.all([
      fetchCompanyInfo(tokenData.access_token, companyId),
      fetchProfitLoss(tokenData.access_token, companyId),
      fetchBalanceSheet(tokenData.access_token, companyId),
      fetchCashFlow(tokenData.access_token, companyId)
    ])

    // Calculate advanced financial metrics
    const metrics = calculateFinancialMetrics(profitLoss, balanceSheet, cashFlow)

    // Store financial snapshot
    await storeFinancialSnapshot(companyId, metrics)

    return NextResponse.json({
      success: true,
      data: {
        company: companyInfo,
        profitLoss,
        balanceSheet,
        cashFlow,
        metrics,
        analysisDate: new Date().toISOString(),
        healthScore: calculateHealthScore(metrics),
        industryBenchmarks: getIndustryBenchmarks(companyInfo.industry),
        recommendations: generateRecommendations(metrics)
      }
    })

  } catch (error) {
    console.error('Enhanced financials error:', error)
    return NextResponse.json({ error: 'Failed to fetch enhanced financial data' }, { status: 500 })
  }
}

async function fetchCompanyInfo(accessToken: string, companyId: string) {
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/companyinfo/${companyId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  
  if (!response.ok) throw new Error('Failed to fetch company info')
  const data = await response.json()
  return data.QueryResponse.CompanyInfo[0]
}

async function fetchProfitLoss(accessToken: string, companyId: string) {
  const startDate = new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0]
  const endDate = new Date().toISOString().split('T')[0]
  
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/ProfitAndLoss?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  
  if (!response.ok) throw new Error('Failed to fetch P&L')
  return await response.json()
}

async function fetchBalanceSheet(accessToken: string, companyId: string) {
  const asOfDate = new Date().toISOString().split('T')[0]
  
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/BalanceSheet?date=${asOfDate}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  
  if (!response.ok) throw new Error('Failed to fetch Balance Sheet')
  return await response.json()
}

async function fetchCashFlow(accessToken: string, companyId: string) {
  const startDate = new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0]
  const endDate = new Date().toISOString().split('T')[0]
  
  const response = await fetch(
    `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/CashFlow?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )
  
  if (!response.ok) throw new Error('Failed to fetch Cash Flow')
  return await response.json()
}

function calculateFinancialMetrics(profitLoss: any, balanceSheet: any, cashFlow: any): FinancialMetrics {
  // Extract key financial figures from QB reports
  const revenue = extractValue(profitLoss, 'Total Income') || 0
  const expenses = extractValue(profitLoss, 'Total Expenses') || 0
  const netIncome = revenue - expenses
  
  const currentAssets = extractValue(balanceSheet, 'Total Current Assets') || 0
  const currentLiabilities = extractValue(balanceSheet, 'Total Current Liabilities') || 0
  const totalAssets = extractValue(balanceSheet, 'Total Assets') || 0
  const totalLiabilities = extractValue(balanceSheet, 'Total Liabilities') || 0
  const equity = totalAssets - totalLiabilities
  
  return {
    revenue,
    expenses,
    netIncome,
    grossMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0,
    netMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
    currentAssets,
    currentLiabilities,
    totalAssets,
    totalLiabilities,
    equity,
    currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
    quickRatio: currentLiabilities > 0 ? (currentAssets * 0.8) / currentLiabilities : 0,
    debtToEquityRatio: equity > 0 ? totalLiabilities / equity : 0,
    returnOnAssets: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
    returnOnEquity: equity > 0 ? (netIncome / equity) * 100 : 0,
    inventoryTurnover: 12, // Placeholder - would need inventory data
    accountsReceivableTurnover: 8, // Placeholder - would need AR data
    cashFlow: netIncome, // Simplified - would extract from cash flow statement
    workingCapital: currentAssets - currentLiabilities
  }
}

function calculateHealthScore(metrics: FinancialMetrics): number {
  let score = 0
  let factors = 0
  
  // Profitability (30% weight)
  if (metrics.netMargin > 15) score += 30
  else if (metrics.netMargin > 5) score += 20
  else if (metrics.netMargin > 0) score += 10
  factors += 30
  
  // Liquidity (25% weight)
  if (metrics.currentRatio > 2) score += 25
  else if (metrics.currentRatio > 1.5) score += 20
  else if (metrics.currentRatio > 1) score += 15
  else if (metrics.currentRatio > 0.5) score += 10
  factors += 25
  
  // Leverage (20% weight)
  if (metrics.debtToEquityRatio < 0.5) score += 20
  else if (metrics.debtToEquityRatio < 1) score += 15
  else if (metrics.debtToEquityRatio < 2) score += 10
  factors += 20
  
  // Growth potential (25% weight)
  if (metrics.workingCapital > 50000) score += 25
  else if (metrics.workingCapital > 10000) score += 20
  else if (metrics.workingCapital > 0) score += 15
  factors += 25
  
  return Math.round((score / factors) * 100)
}

function getIndustryBenchmarks(industry: string) {
  // Industry-specific benchmarks - would be expanded with real data
  return {
    averageNetMargin: 12,
    averageCurrentRatio: 1.8,
    averageDebtToEquity: 0.7,
    averageROA: 6.5,
    averageROE: 12.5
  }
}

function generateRecommendations(metrics: FinancialMetrics): string[] {
  const recommendations = []
  
  if (metrics.currentRatio < 1.5) {
    recommendations.push("Improve liquidity by increasing current assets or reducing short-term debt")
  }
  
  if (metrics.netMargin < 10) {
    recommendations.push("Focus on cost reduction and profit margin improvement")
  }
  
  if (metrics.debtToEquityRatio > 1.5) {
    recommendations.push("Consider debt restructuring to improve financial stability")
  }
  
  if (metrics.workingCapital < 0) {
    recommendations.push("Address working capital constraints to ensure operational stability")
  }
  
  return recommendations
}

function extractValue(report: any, fieldName: string): number {
  // Helper function to extract values from QB reports
  // Would need to be implemented based on actual QB report structure
  return 0 // Placeholder
}

async function storeFinancialSnapshot(companyId: string, metrics: FinancialMetrics) {
  await supabase
    .from('financial_snapshots')
    .upsert({
      company_id: companyId,
      snapshot_date: new Date().toISOString(),
      revenue: metrics.revenue,
      expenses: metrics.expenses,
      net_income: metrics.netIncome,
      total_assets: metrics.totalAssets,
      total_liabilities: metrics.totalLiabilities,
      equity: metrics.equity,
      current_ratio: metrics.currentRatio,
      debt_to_equity: metrics.debtToEquityRatio,
      health_score: calculateHealthScore(metrics)
    })
}