import { NextRequest, NextResponse } from 'next/server'
import { quickbooksService, getSupabase } from '@/app/lib/serviceFactory'

export async function GET(request: NextRequest) {
  try {
    // Get company ID from query params
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Get Balance Sheet from QuickBooks
    const result = await quickbooksService.getBalanceSheet(companyId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Parse and structure the data
    const balanceSheetData = parseBalanceSheetData(result.data)

    // Cache the data in financial_snapshots
    const supabase = getSupabase()
    await supabase
      .from('financial_snapshots')
      .upsert({
        company_id: companyId,
        snapshot_date: new Date().toISOString().split('T')[0],
        assets: balanceSheetData.totalAssets,
        liabilities: balanceSheetData.totalLiabilities,
        equity: balanceSheetData.totalEquity,
        current_ratio: balanceSheetData.currentRatio,
        quick_ratio: balanceSheetData.quickRatio,
        debt_to_equity: balanceSheetData.debtToEquity,
        working_capital: balanceSheetData.workingCapital,
        raw_data: result.data,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      data: balanceSheetData,
      raw: result.data
    })

  } catch (error) {
    console.error('Error in balance sheet API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function parseBalanceSheetData(data: any) {
  const rows = data?.Rows || []
  const parsed: any = {
    assets: {
      current: {},
      fixed: {},
      other: {}
    },
    liabilities: {
      current: {},
      longTerm: {}
    },
    equity: {},
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    currentRatio: 0,
    quickRatio: 0,
    debtToEquity: 0,
    workingCapital: 0
  }

  // Parse rows into structured data
  rows.forEach((section: any) => {
    if (section.group === 'Assets') {
      parseSection(section, parsed.assets)
      parsed.totalAssets = getColValue(section.summary?.ColData)
    } else if (section.group === 'Liabilities') {
      parseSection(section, parsed.liabilities)
      parsed.totalLiabilities = getColValue(section.summary?.ColData)
    } else if (section.group === 'Equity') {
      parseSection(section, parsed.equity)
      parsed.totalEquity = getColValue(section.summary?.ColData)
    }
  })

  // Calculate ratios
  const currentAssets = calculateTotal(parsed.assets.current)
  const currentLiabilities = calculateTotal(parsed.liabilities.current)
  
  if (currentLiabilities > 0) {
    parsed.currentRatio = currentAssets / currentLiabilities
    parsed.quickRatio = (currentAssets - (parsed.assets.current.inventory || 0)) / currentLiabilities
  }
  
  if (parsed.totalEquity > 0) {
    parsed.debtToEquity = parsed.totalLiabilities / parsed.totalEquity
  }
  
  parsed.workingCapital = currentAssets - currentLiabilities

  return parsed
}

function parseSection(section: any, target: any) {
  if (section.Rows) {
    section.Rows.forEach((row: any) => {
      if (row.ColData) {
        const name = row.ColData[0]?.value || ''
        const value = getColValue(row.ColData)
        if (name && value !== null) {
          target[name.toLowerCase().replace(/\s+/g, '_')] = value
        }
      }
      // Recursively parse subsections
      if (row.Rows) {
        parseSection(row, target)
      }
    })
  }
}

function getColValue(colData: any[]): number {
  if (!colData || colData.length < 2) return 0
  const value = parseFloat(colData[1]?.value || '0')
  return isNaN(value) ? 0 : value
}

function calculateTotal(obj: any): number {
  return Object.values(obj).reduce((sum: number, val: any) => {
    if (typeof val === 'number') return sum + val
    if (typeof val === 'object') return sum + calculateTotal(val)
    return sum
  }, 0)
}
