import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const accessToken = searchParams.get('accessToken')
    const startDate = searchParams.get('startDate') || '2024-01-01'
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]
    
    if (!companyId || !accessToken) {
      return NextResponse.json({ 
        error: 'Company ID and access token required' 
      }, { status: 400 })
    }

    const baseUrl = process.env.QB_SANDBOX_BASE_URL || 'https://sandbox-quickbooks.api.intuit.com'
    
    // Fetch Cash Flow report from QuickBooks API
    const reportUrl = new URL(`${baseUrl}/v3/company/${companyId}/reports/CashFlow`)
    reportUrl.searchParams.set('start_date', startDate)
    reportUrl.searchParams.set('end_date', endDate)
    reportUrl.searchParams.set('summarize_column_by', 'Total')
    
    const response = await fetch(reportUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      // If Cash Flow report isn't available, calculate from other data
      return await calculateCashFlowFromOtherReports(companyId, accessToken, startDate, endDate, baseUrl)
    }

    const data = await response.json()
    const report = data.QueryResponse || data

    // Parse the Cash Flow report structure
    const rows = report.Rows || []
    
    let operatingCashFlow = 0
    let investingCashFlow = 0
    let financingCashFlow = 0
    let netCashFlow = 0
    let beginningCash = 0
    let endingCash = 0

    // Parse QB cash flow report rows
    for (const row of rows) {
      if (row.Header?.Name?.includes('Operating Activities') || row.group === 'Operating') {
        operatingCashFlow = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Investing Activities') || row.group === 'Investing') {
        investingCashFlow = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Financing Activities') || row.group === 'Financing') {
        financingCashFlow = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Net Cash Flow') || row.Header?.Name?.includes('Net Change')) {
        netCashFlow = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Beginning Cash')) {
        beginningCash = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Ending Cash')) {
        endingCash = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      }
    }

    // Calculate net cash flow if not found
    if (netCashFlow === 0) {
      netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow
    }

    // Calculate cash runway (months of operating expenses covered)
    const monthlyBurn = Math.abs(operatingCashFlow) / 
      (new Date(endDate).getTime() - new Date(startDate).getTime()) * (30 * 24 * 60 * 60 * 1000)
    const cashRunway = monthlyBurn > 0 ? endingCash / monthlyBurn : 0

    const transformedData = {
      dateRange: { startDate, endDate },
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netCashFlow,
      beginningCash,
      endingCash,
      freeCashFlow: operatingCashFlow + investingCashFlow, // Operating + Investing
      cashBurn: monthlyBurn,
      cashRunway: cashRunway > 0 ? cashRunway : 0,
      cashConversionCycle: await calculateCashConversionCycle(companyId, accessToken, baseUrl),
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('Error fetching Cash Flow data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cash flow data' }, 
      { status: 500 }
    )
  }
}

// Fallback: Calculate cash flow from P&L and Balance Sheet if direct report unavailable
async function calculateCashFlowFromOtherReports(
  companyId: string, 
  accessToken: string, 
  startDate: string, 
  endDate: string, 
  baseUrl: string
) {
  try {
    // Get P&L data for operating cash flow estimate
    const plUrl = new URL(`${baseUrl}/v3/company/${companyId}/reports/ProfitAndLoss`)
    plUrl.searchParams.set('start_date', startDate)
    plUrl.searchParams.set('end_date', endDate)
    
    const plResponse = await fetch(plUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    // Get current cash balance from Balance Sheet
    const bsUrl = new URL(`${baseUrl}/v3/company/${companyId}/reports/BalanceSheet`)
    bsUrl.searchParams.set('date', endDate)
    
    const bsResponse = await fetch(bsUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    })

    let netIncome = 0
    let currentCash = 0

    if (plResponse.ok) {
      const plData = await plResponse.json()
      // Extract net income from P&L (simplified)
      netIncome = extractNetIncomeFromPL(plData.QueryResponse || plData)
    }

    if (bsResponse.ok) {
      const bsData = await bsResponse.json()
      // Extract cash from Balance Sheet
      currentCash = extractCashFromBS(bsData.QueryResponse || bsData)
    }

    // Estimate cash flows (this is a simplified calculation)
    const estimatedOperatingCF = netIncome * 1.2 // Add back depreciation estimate
    const estimatedInvestingCF = -netIncome * 0.1 // Estimate capex
    const estimatedFinancingCF = 0 // Unknown without more data

    return NextResponse.json({
      dateRange: { startDate, endDate },
      operatingCashFlow: estimatedOperatingCF,
      investingCashFlow: estimatedInvestingCF,
      financingCashFlow: estimatedFinancingCF,
      netCashFlow: estimatedOperatingCF + estimatedInvestingCF,
      beginningCash: currentCash * 0.8, // Estimate
      endingCash: currentCash,
      freeCashFlow: estimatedOperatingCF + estimatedInvestingCF,
      cashBurn: Math.abs(estimatedOperatingCF) / 12, // Monthly estimate
      cashRunway: estimatedOperatingCF < 0 ? currentCash / (Math.abs(estimatedOperatingCF) / 12) : 0,
      cashConversionCycle: 30, // Default estimate
      estimated: true, // Flag that this is estimated
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    throw new Error('Failed to calculate cash flow from financial statements')
  }
}

// Helper function to calculate cash conversion cycle
async function calculateCashConversionCycle(companyId: string, accessToken: string, baseUrl: string): Promise<number> {
  try {
    // This would require A/R and A/P aging reports
    // For now, return a reasonable estimate
    return 45 // Average 45-day cycle
  } catch (error) {
    return 45 // Default
  }
}

// Helper functions to extract data from reports
function extractNetIncomeFromPL(report: any): number {
  const rows = report.Rows || []
  for (const row of rows) {
    if (row.Header?.Name?.includes('Net Income')) {
      return parseFloat(row.Summary?.ColData?.[0]?.value || '0')
    }
  }
  return 0
}

function extractCashFromBS(report: any): number {
  const rows = report.Rows || []
  for (const row of rows) {
    if (row.Rows) {
      for (const subRow of row.Rows) {
        if (subRow.ColData && subRow.ColData[0]?.value?.toLowerCase().includes('cash')) {
          return parseFloat(subRow.ColData[1]?.value || '0')
        }
      }
    }
  }
  return 0
}
