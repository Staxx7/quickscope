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
    
    // Fetch P&L report from QuickBooks API
    const reportUrl = new URL(`${baseUrl}/v3/company/${companyId}/reports/ProfitAndLoss`)
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
      throw new Error(`QB API Error: ${response.status}`)
    }

    const data = await response.json()
    const report = data.QueryResponse || data

    // Parse the P&L report structure
    const rows = report.Rows || []
    
    let totalRevenue = 0
    let totalExpenses = 0
    let netIncome = 0
    let grossProfit = 0
    const revenueItems = []
    const expenseItems = []

    // Parse QB report rows (this is complex due to QB's nested structure)
    for (const row of rows) {
      if (row.group === 'Income' || row.Header?.Name?.includes('Income') || row.Header?.Name?.includes('Revenue')) {
        // Process income/revenue items
        const items = extractLineItems(row, 'Revenue')
        revenueItems.push(...items)
        totalRevenue += items.reduce((sum, item) => sum + item.amount, 0)
      } else if (row.group === 'Expenses' || row.Header?.Name?.includes('Expense')) {
        // Process expense items
        const items = extractLineItems(row, 'Expense')
        expenseItems.push(...items)
        totalExpenses += items.reduce((sum, item) => sum + item.amount, 0)
      } else if (row.Header?.Name?.includes('Gross Profit')) {
        grossProfit = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      } else if (row.Header?.Name?.includes('Net Income')) {
        netIncome = parseFloat(row.Summary?.ColData?.[0]?.value || '0')
      }
    }

    // If we couldn't parse specific values, calculate them
    if (grossProfit === 0 && totalRevenue > 0) {
      grossProfit = totalRevenue - getCOGS(rows)
    }
    
    if (netIncome === 0) {
      netIncome = totalRevenue - totalExpenses
    }

    const transformedData = {
      dateRange: { startDate, endDate },
      totalRevenue,
      totalExpenses,
      grossProfit,
      netIncome,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0,
      revenueItems: revenueItems.length > 0 ? revenueItems : [
        { name: 'Total Revenue', amount: totalRevenue }
      ],
      expenseItems: expenseItems.length > 0 ? expenseItems : [
        { name: 'Total Expenses', amount: totalExpenses }
      ],
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('Error fetching P&L data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profit & loss data' }, 
      { status: 500 }
    )
  }
}

// Helper function to extract line items from QB report rows
function extractLineItems(row: any, type: string): Array<{name: string, amount: number}> {
  const items = []
  
  if (row.Rows) {
    for (const subRow of row.Rows) {
      if (subRow.ColData && subRow.ColData[0]?.value) {
        const name = subRow.ColData[0].value
        const amount = parseFloat(subRow.ColData[1]?.value || '0')
        if (name && !isNaN(amount)) {
          items.push({ name, amount: Math.abs(amount) })
        }
      }
      // Recursively check for nested rows
      if (subRow.Rows) {
        items.push(...extractLineItems(subRow, type))
      }
    }
  }
  
  return items
}

// Helper function to find COGS in the report
function getCOGS(rows: any[]): number {
  for (const row of rows) {
    if (row.Header?.Name?.includes('Cost of Goods Sold') || row.Header?.Name?.includes('COGS')) {
      return parseFloat(row.Summary?.ColData?.[0]?.value || '0')
    }
    if (row.Rows) {
      const cogs = getCOGS(row.Rows)
      if (cogs > 0) return cogs
    }
  }
  return 0
}
