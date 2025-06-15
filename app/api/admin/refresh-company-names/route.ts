import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabaseClient'

async function refreshQBOToken(refreshToken: string, companyId: string): Promise<{ success: boolean; access_token?: string; error?: string }> {
  try {
    const tokenEndpoint = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.statusText} - ${errorText}`);
    }

    const tokenData = await response.json();
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));
    
    const supabase = getSupabaseServerClient();
    await supabase
      .from('qbo_tokens')
      .update({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('company_id', companyId);

    return {
      success: true,
      access_token: tokenData.access_token
    };

  } catch (error) {
    console.error('Error refreshing QBO token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

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
        // Skip if already has a proper company name (not the placeholder format)
        if (token.company_name && !token.company_name.startsWith('Company ')) {
          results.push({
            company_id: token.company_id,
            status: 'skipped',
            message: 'Already has company name',
            company_name: token.company_name
          })
          continue
        }
        
        // Log what we're processing
        console.log(`Processing company: ${token.company_name} (ID: ${token.company_id})`)
        
        // Check if token is expired
        const isExpired = new Date(token.expires_at) < new Date()
        if (isExpired) {
          console.log(`Token expired for ${token.company_id}, attempting refresh...`)
          
          // Attempt to refresh the token
          const refreshResult = await refreshQBOToken(token.refresh_token, token.company_id)
          if (!refreshResult.success) {
            console.log(`Failed to refresh token: ${refreshResult.error}`)
            results.push({
              company_id: token.company_id,
              status: 'error',
              message: 'Token refresh failed',
              error: refreshResult.error,
              company_name: token.company_name
            })
            failureCount++
            continue
          }
          
          console.log(`Successfully refreshed token for ${token.company_id}`)
          // Update the local token object with new access token
          token.access_token = refreshResult.access_token!
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
    
    const url = `${baseUrl}/v3/company/${realmId}/companyinfo/${realmId}`
    console.log(`Fetching company info from: ${url}`)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
    
    console.log(`QuickBooks API response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('QuickBooks API error:', response.status, errorText)
      return null
    }
    
    const data = await response.json()
    console.log('QuickBooks response data:', JSON.stringify(data, null, 2))
    
    const companyName = data?.QueryResponse?.CompanyInfo?.[0]?.Name || 
                       data?.QueryResponse?.CompanyInfo?.[0]?.CompanyName ||
                       data?.CompanyInfo?.Name ||
                       data?.CompanyInfo?.CompanyName ||
                       null
    
    console.log(`Extracted company name: ${companyName}`)
    
    return {
      name: companyName,
      raw: data // For debugging
    }
  } catch (error) {
    console.error('Error fetching company info:', error)
    return null
  }
}