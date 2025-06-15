import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Get all QB tokens
    const { data: tokens, error: fetchError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('Error fetching tokens:', fetchError)
      return NextResponse.json({
        error: 'Failed to fetch tokens',
        details: fetchError.message
      }, { status: 500 })
    }
    
    const results = []
    let successCount = 0
    let failureCount = 0
    
    // Process each token
    for (const token of tokens || []) {
      try {
        // Skip if already has a company name (unless it's the generic format)
        if (token.company_name && !token.company_name.startsWith('Company ')) {
          results.push({
            company_id: token.company_id,
            status: 'skipped',
            message: 'Already has company name',
            company_name: token.company_name
          })
          continue
        }
        
        // Check if token is expired
        const isExpired = new Date(token.expires_at) < new Date()
        if (isExpired) {
          results.push({
            company_id: token.company_id,
            status: 'skipped',
            message: 'Token expired',
            company_name: token.company_name
          })
          continue
        }
        
        // Fetch company info from QuickBooks
        const companyInfo = await fetchCompanyInfoFromQuickBooks(
          token.company_id,
          token.access_token
        )
        
        if (companyInfo && companyInfo.name) {
          // Update the token with the company name
          const { error: updateError } = await supabase
            .from('qbo_tokens')
            .update({ 
              company_name: companyInfo.name,
              updated_at: new Date().toISOString()
            })
            .eq('company_id', token.company_id)
          
          if (updateError) {
            results.push({
              company_id: token.company_id,
              status: 'error',
              message: 'Failed to update database',
              error: updateError.message
            })
            failureCount++
          } else {
            results.push({
              company_id: token.company_id,
              status: 'success',
              message: 'Company name updated',
              company_name: companyInfo.name,
              old_name: token.company_name
            })
            successCount++
          }
        } else {
          results.push({
            company_id: token.company_id,
            status: 'error',
            message: 'Failed to fetch company info from QuickBooks'
          })
          failureCount++
        }
      } catch (error) {
        results.push({
          company_id: token.company_id,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        failureCount++
      }
    }
    
    return NextResponse.json({
      success: true,
      summary: {
        total: tokens?.length || 0,
        updated: successCount,
        failed: failureCount,
        skipped: (tokens?.length || 0) - successCount - failureCount
      },
      results
    })
    
  } catch (error) {
    console.error('Error in refresh company names:', error)
    return NextResponse.json({
      error: 'Failed to refresh company names',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function fetchCompanyInfoFromQuickBooks(realmId: string, accessToken: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com'
    
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      console.error('QuickBooks API error:', response.status)
      return null
    }
    
    const data = await response.json()
    const companyName = data?.QueryResponse?.CompanyInfo?.[0]?.Name || 
                       data?.QueryResponse?.CompanyInfo?.[0]?.CompanyName ||
                       data?.CompanyInfo?.Name ||
                       data?.CompanyInfo?.CompanyName ||
                       null
    
    return {
      name: companyName,
      raw: data // For debugging
    }
  } catch (error) {
    console.error('Error fetching company info:', error)
    return null
  }
}