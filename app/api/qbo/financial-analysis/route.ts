import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 })
    }

    // Get stored token
    const { data: tokenData } = await supabase
      .from('qbo_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('company_id', companyId)
      .single()

    if (!tokenData) {
      return NextResponse.json({ error: 'No token found' }, { status: 404 })
    }

    // Fetch multiple financial reports
    const [profitLoss, balanceSheet, cashFlow] = await Promise.all([
      fetchQBOReport(tokenData.access_token, companyId, 'ProfitAndLoss'),
      fetchQBOReport(tokenData.access_token, companyId, 'BalanceSheet'),
      fetchQBOReport(tokenData.access_token, companyId, 'CashFlow')
    ])

    // Calculate financial ratios and insights
    const analysis = calculateFinancialInsights(profitLoss, balanceSheet, cashFlow)

    return NextResponse.json({
      profitLoss,
      balanceSheet,
      cashFlow,
      analysis,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching financial analysis:', error)
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 })
  }
}

async function fetchQBOReport(accessToken: string, companyId: string, reportType: string) {
  const baseUrl = process.env.QUICKBOOKS_SANDBOX === 'true' 
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'

  const response = await fetch(
    `${baseUrl}/v3/company/${companyId}/reports/${reportType}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch ${reportType}`)
  }

  return response.json()
}

function calculateFinancialInsights(profitLoss: any, balanceSheet: any, cashFlow: any) {
  // Extract key metrics
  const revenue = extractValue(profitLoss, 'Total Revenue')
  const expenses = extractValue(profitLoss, 'Total Expenses')
  const netIncome = revenue - expenses
  
  const currentAssets = extractValue(balanceSheet, 'Total Current Assets')
  const currentLiabilities = extractValue(balanceSheet, 'Total Current Liabilities')
  const totalAssets = extractValue(balanceSheet, 'Total Assets')
  const totalLiabilities = extractValue(balanceSheet, 'Total Liabilities')

  // Calculate ratios
  const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0
  const debtToEquity = (totalAssets - totalLiabilities) > 0 
    ? totalLiabilities / (totalAssets - totalLiabilities) : 0

  // Generate insights
  const insights = []
  
  if (profitMargin < 5) {
    insights.push({
      type: 'warning',
      title: 'Low Profit Margin',
      description: `Profit margin of ${profitMargin.toFixed(1)}% is below industry standards`,
      recommendation: 'Consider cost reduction strategies or pricing optimization'
    })
  }

  if (currentRatio < 1.2) {
    insights.push({
      type: 'danger',
      title: 'Liquidity Concern',
      description: `Current ratio of ${currentRatio.toFixed(2)} indicates potential cash flow issues`,
      recommendation: 'Improve working capital management and cash reserves'
    })
  }

  if (debtToEquity > 2) {
    insights.push({
      type: 'warning',
      title: 'High Leverage',
      description: `Debt-to-equity ratio of ${debtToEquity.toFixed(2)} is elevated`,
      recommendation: 'Consider debt reduction strategies'
    })
  }

  return {
    metrics: {
      revenue,
      expenses,
      netIncome,
      profitMargin,
      currentRatio,
      debtToEquity
    },
    insights,
    score: calculateHealthScore(profitMargin, currentRatio, debtToEquity)
  }
}

function extractValue(report: any, itemName: string): number {
  // Implementation to extract specific values from QBO reports
  // This would need to be customized based on QBO report structure
  return 0
}

function calculateHealthScore(profitMargin: number, currentRatio: number, debtToEquity: number): number {
  let score = 50 // Base score

  // Profit margin scoring
  if (profitMargin > 15) score += 20
  else if (profitMargin > 10) score += 15
  else if (profitMargin > 5) score += 10
  else if (profitMargin < 0) score -= 20

  // Liquidity scoring
  if (currentRatio > 2) score += 15
  else if (currentRatio > 1.5) score += 10
  else if (currentRatio > 1.2) score += 5
  else if (currentRatio < 1) score -= 15

  // Leverage scoring
  if (debtToEquity < 0.5) score += 15
  else if (debtToEquity < 1) score += 10
  else if (debtToEquity < 2) score += 5
  else score -= 15

  return Math.max(0, Math.min(100, score))
}
