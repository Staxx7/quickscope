import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { qbService } from '@/lib/quickbooksService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const asOfDate = searchParams.get('asOfDate')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching Balance Sheet for:', companyId, 'as of:', asOfDate || 'current date')

    // Get QB tokens from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .single()

    if (tokenError || !tokenData) {
      console.error('No QB tokens found for company:', companyId, tokenError)
      return NextResponse.json(
        { error: 'QuickBooks connection not found. Please reconnect your QuickBooks account.' },
        { status: 404 }
      )
    }

    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    
    let accessToken = tokenData.access_token
    let refreshToken = tokenData.refresh_token

    if (now >= expiresAt) {
      console.log('Token expired, refreshing...')
      
      const refreshResult = await qbService.refreshToken(refreshToken)
      if (!refreshResult) {
        return NextResponse.json(
          { error: 'Unable to refresh QuickBooks token. Please reconnect your account.' },
          { status: 401 }
        )
      }

      // Update tokens in database
      const newExpiresAt = new Date(now.getTime() + refreshResult.expiresIn * 1000)
      
      await supabase
        .from('qbo_tokens')
        .update({
          access_token: refreshResult.accessToken,
          refresh_token: refreshResult.refreshToken,
          expires_at: newExpiresAt.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('company_id', companyId)

      accessToken = refreshResult.accessToken
      refreshToken = refreshResult.refreshToken
    }

    // Fetch Balance Sheet from QuickBooks
    const credentials = {
      accessToken,
      refreshToken,
      companyId,
      expiresAt: new Date(tokenData.expires_at)
    }

    const result = await qbService.getBalanceSheet(credentials, asOfDate || undefined)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch Balance Sheet data' },
        { status: 500 }
      )
    }

    // Extract and format key balance sheet metrics for easier consumption
    const report = result.data
    let formattedData = {
      raw: report,
      summary: {
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0,
        asOfDate: asOfDate || new Date().toISOString().split('T')[0]
      }
    }

    // Try to extract summary data if available
    try {
      if (report?.Header?.ReportName === 'BalanceSheet' && report?.Rows) {
        // Parse QB balance sheet structure to extract totals
        // This is simplified - QB structure can vary
        const rows = report.Rows
        for (const row of rows) {
          if (row.group === 'TotalAssets' && row.ColData) {
            formattedData.summary.totalAssets = parseFloat(row.ColData[1]?.value || '0')
          }
          if (row.group === 'TotalLiabilitiesAndEquity' && row.ColData) {
            formattedData.summary.totalLiabilities = parseFloat(row.ColData[1]?.value || '0')
          }
        }
        formattedData.summary.totalEquity = formattedData.summary.totalAssets - formattedData.summary.totalLiabilities
      }
    } catch (parseError) {
      console.warn('Could not parse balance sheet summary:', parseError)
      // Return raw data even if parsing fails
    }

    return NextResponse.json({
      success: true,
      report: formattedData
    })

  } catch (error) {
    console.error('Error in balance-sheet API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
