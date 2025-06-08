import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const accessToken = searchParams.get('accessToken')
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString().split('T')[0]
    
    if (!companyId || !accessToken) {
      return NextResponse.json({ 
        error: 'Company ID and access token required' 
      }, { status: 400 })
    }

    const baseUrl = process.env.QB_SANDBOX_BASE_URL || 'https://sandbox-quickbooks.api.intuit.com'
    
    // Fetch Balance Sheet report from QuickBooks API
    const reportUrl = new URL(`${baseUrl}/v3/company/${companyId}/reports/BalanceSheet`)
    reportUrl.searchParams.set('date', asOfDate)
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

    // Parse the Balance Sheet report structure
    const rows = report.Rows || []
    
    let totalAssets = 0
    let totalLiabilities = 0
    let totalEquity = 0
    const assetItems = []
    const liabilityItems = []
    const equityItems = []

    // Parse QB report rows
    for (const row of rows) {
      if (row.group === 'Assets' || row.Header?.Name?.includes('ASSETS') || row.Header?.Name?.includes('Assets')) {
        const items = extractBalanceSheetItems(row, 'Assets')
        assetItems.push(...items)
        totalAssets += items.reduce((sum, item) => sum + item.amount, 0)
      } else if (row.group === 'Liabilities' || row.Header?.Name?.includes('LIABILITIES') || row.Header?.Name?.includes('Liabilities')) {
        const items = extractBalanceSheetItems(row, 'Liabilities')
        liabilityItems.push(...items)
        totalLiabilities += items.reduce((sum, item) => sum + item.amount, 0)
      } else if (row.group === 'Equity' || row.Header?.Name?.includes('EQUITY') || row.Header?.Name?.includes('Equity')) {
        const items = extractBalanceSheetItems(row, 'Equity')
        equityItems.push(...items)
        totalEquity += items.reduce((sum, item) => sum + item.amount, 0)
      }
      
      // Also check for total rows
      if (row.Header?.Name?.includes('TOTAL ASSETS')) {
        totalAssets = parseFloat(row.Summary?.ColData?.[0]?.value || '0') || totalAssets
      } else if (row.Header?.Name?.includes('TOTAL LIABILITIES')) {
        totalLiabilities = parseFloat(row.Summary?.ColData?.[0]?.value || '0') || totalLiabilities
      } else if (row.Header?.Name?.includes('TOTAL EQUITY')) {
        totalEquity = parseFloat(row.Summary?.ColData?.[0]?.value || '0') || totalEquity
      }
    }

    // Calculate key metrics
    const currentAssets = assetItems
      .filter(item => item.name.toLowerCase().includes('current') || 
                      item.name.toLowerCase().includes('cash') ||
                      item.name.toLowerCase().includes('receivable') ||
                      item.name.toLowerCase().includes('inventory'))
      .reduce((sum, item) => sum + item.amount, 0)

    const currentLiabilities = liabilityItems
      .filter(item => item.name.toLowerCase().includes('current') ||
                      item.name.toLowerCase().includes('payable') ||
                      item.name.toLowerCase().includes('accrued'))
      .reduce((sum, item) => sum + item.amount, 0)

    const transformedData = {
      asOfDate,
      totalAssets,
      totalLiabilities,
      totalEquity,
      currentAssets: currentAssets || totalAssets * 0.6, // Estimate if not found
      currentLiabilities: currentLiabilities || totalLiabilities * 0.7, // Estimate if not found
      workingCapital: (currentAssets || totalAssets * 0.6) - (currentLiabilities || totalLiabilities * 0.7),
      currentRatio: currentLiabilities > 0 ? (currentAssets || totalAssets * 0.6) / (currentLiabilities || totalLiabilities * 0.7) : 0,
      debtToEquity: totalEquity > 0 ? totalLiabilities / totalEquity : 0,
      assetItems: assetItems.length > 0 ? assetItems : [
        { name: 'Total Assets', amount: totalAssets }
      ],
      liabilityItems: liabilityItems.length > 0 ? liabilityItems : [
        { name: 'Total Liabilities', amount: totalLiabilities }
      ],
      equityItems: equityItems.length > 0 ? equityItems : [
        { name: 'Total Equity', amount: totalEquity }
      ],
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(transformedData)
    
  } catch (error) {
    console.error('Error fetching Balance Sheet data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch balance sheet data' }, 
      { status: 500 }
    )
  }
}

// Helper function to extract balance sheet line items
function extractBalanceSheetItems(row: any, category: string): Array<{name: string, amount: number}> {
  const items = []
  
  if (row.Rows) {
    for (const subRow of row.Rows) {
      if (subRow.ColData && subRow.ColData[0]?.value) {
        const name = subRow.ColData[0].value
        const amount = parseFloat(subRow.ColData[1]?.value || '0')
        
        // Skip total rows and headers
        if (name && !isNaN(amount) && amount !== 0 && 
            !name.toLowerCase().includes('total') &&
            !name.toLowerCase().includes('assets') &&
            !name.toLowerCase().includes('liabilities') &&
            !name.toLowerCase().includes('equity')) {
          items.push({ name, amount: Math.abs(amount) })
        }
      }
      
      // Recursively check for nested rows
      if (subRow.Rows) {
        items.push(...extractBalanceSheetItems(subRow, category))
      }
    }
  }
  
  return items
}
