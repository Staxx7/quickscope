import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { qbService } from '@/lib/quickbooksService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching company info for:', companyId)

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

    // Check if token is expired
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

    // Fetch company info from QuickBooks
    const credentials = {
      accessToken,
      refreshToken,
      companyId,
      expiresAt: new Date(tokenData.expires_at)
    }

    const result = await qbService.getCompanyInfo(credentials)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch company information' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      company: result.data
    })

  } catch (error) {
    console.error('Error in company-info API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
