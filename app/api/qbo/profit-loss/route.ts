import { NextRequest, NextResponse } from 'next/server'
import { quickbooksService, getSupabase } from '@/app/lib/serviceFactory'

export async function GET(request: NextRequest) {
  try {
    // Get parameters from query
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching P&L for:', companyId, 'from:', startDate, 'to:', endDate)

    // Get Profit & Loss from QuickBooks
    const result = await quickbooksService.getProfitLoss(
      companyId, 
      startDate || undefined, 
      endDate || undefined
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Parse and structure the data
    const profitLossData = parseProfitLossData(result.data)

    // Cache the data in financial_snapshots
    const supabase = getSupabase()
    await supabase
      .from('financial_snapshots')
      .upsert({
        company_id: companyId,
        snapshot_date: new Date().toISOString().split('T')[0],
        revenue: profitLossData.totalRevenue,
        expenses: profitLossData.totalExpenses,
        net_income: profitLossData.netIncome,
        gross_margin: profitLossData.grossMargin,
        operating_margin: profitLossData.operatingMargin,
        net_margin: profitLossData.netMargin,
        raw_data: result.data,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      data: profitLossData,
      raw: result.data
    })

  } catch (error) {
    console.error('Error in profit-loss API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function parseProfitLossData(data: any) {
  const rows = data?.Rows || []
  const parsed: any = {
    revenue: {
      sales: {},
      other: {}
    },
    expenses: {
      cogs: {},
      operating: {},
      other: {}
    },
    totalRevenue: 0,
    totalCOGS: 0,
    grossProfit: 0,
    totalExpenses: 0,
    operatingIncome: 0,
    netIncome: 0,
    grossMargin: 0,
    operatingMargin: 0,
    netMargin: 0
  }

  // Parse rows into structured data
  rows.forEach((section: any) => {
    if (section.group === 'Income' || section.group === 'Revenue') {
      parseSection(section, parsed.revenue)
      parsed.totalRevenue = getColValue(section.summary?.ColData)
    } else if (section.group === 'COGS' || section.group === 'CostOfGoodsSold') {
      parseSection(section, parsed.expenses.cogs)
      parsed.totalCOGS = getColValue(section.summary?.ColData)
    } else if (section.group === 'Expenses' || section.group === 'OperatingExpenses') {
      parseSection(section, parsed.expenses.operating)
      const sectionTotal = getColValue(section.summary?.ColData)
      parsed.totalExpenses += sectionTotal
    }
  })

  // Calculate derived metrics
  parsed.grossProfit = parsed.totalRevenue - parsed.totalCOGS
  parsed.operatingIncome = parsed.grossProfit - parsed.totalExpenses
  parsed.netIncome = parsed.operatingIncome // Simplified - would include other income/expenses

  // Calculate margins
  if (parsed.totalRevenue > 0) {
    parsed.grossMargin = (parsed.grossProfit / parsed.totalRevenue) * 100
    parsed.operatingMargin = (parsed.operatingIncome / parsed.totalRevenue) * 100
    parsed.netMargin = (parsed.netIncome / parsed.totalRevenue) * 100
  }

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
