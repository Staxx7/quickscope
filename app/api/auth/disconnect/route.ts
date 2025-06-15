// app/api/auth/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    console.log('Disconnect request received')
    
    // Get company ID from cookies or request body
    const companyIdCookie = request.cookies.get('qb_company_id')
    let companyId = companyIdCookie?.value
    
    if (!companyId) {
      // Try to get from request body
      const body = await request.json().catch(() => ({}))
      companyId = body.companyId
    }
    
    if (!companyId) {
      // Try to find any active connection
      const { data: activeTokens } = await supabase
        .from('qbo_tokens')
        .select('company_id')
        .limit(1)
      
      if (activeTokens && activeTokens.length > 0) {
        companyId = activeTokens[0].company_id
      } else {
        return NextResponse.json({ 
          error: 'No QuickBooks connection found to disconnect' 
        }, { status: 400 })
      }
    }

    console.log('Disconnecting company:', companyId)

    // Get the token to revoke it with QuickBooks
    const { data: tokenData } = await supabase
      .from('qbo_tokens')
      .select('refresh_token, access_token')
      .eq('company_id', companyId)
      .single()

    // Revoke token with QuickBooks if we have credentials
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    
    if (clientId && clientSecret && tokenData) {
      // Try to revoke both access and refresh tokens
      const tokensToRevoke = [tokenData.refresh_token, tokenData.access_token].filter(Boolean)
      
      for (const token of tokensToRevoke) {
        try {
          const revokeResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/revoke', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            body: new URLSearchParams({
              token: token
            })
          })
          
          if (!revokeResponse.ok) {
            console.error('Failed to revoke QB token:', await revokeResponse.text())
            // Continue anyway - we'll still remove from our database
          } else {
            console.log('Successfully revoked token')
          }
        } catch (revokeError) {
          console.error('Error revoking QB token:', revokeError)
          // Continue anyway
        }
      }
    }

    // Clear all related data in the correct order
    console.log('Clearing related data...')
    
    // 1. Clear financial snapshots
    const { error: snapshotError } = await supabase
      .from('financial_snapshots')
      .delete()
      .eq('company_id', companyId)
    
    if (snapshotError) {
      console.error('Error deleting financial snapshots:', snapshotError)
    }

    // 2. Clear AI analyses
    const { error: analysisError } = await supabase
      .from('ai_analyses')
      .delete()
      .eq('company_id', companyId)
    
    if (analysisError) {
      console.error('Error deleting AI analyses:', analysisError)
    }

    // 3. Update prospects to remove company_id reference
    const { error: prospectError } = await supabase
      .from('prospects')
      .update({ 
        company_id: null,
        connection_status: 'disconnected'
      })
      .eq('company_id', companyId)
    
    if (prospectError) {
      console.error('Error updating prospects:', prospectError)
    }

    // 4. Finally, remove the token
    const { error: deleteError } = await supabase
      .from('qbo_tokens')
      .delete()
      .eq('company_id', companyId)

    if (deleteError) {
      console.error('Error deleting token:', deleteError)
      return NextResponse.json({ 
        error: 'Failed to remove QuickBooks connection',
        details: deleteError.message
      }, { status: 500 })
    }

    console.log('QuickBooks disconnection completed successfully')

    // Clear the cookies
    const response = NextResponse.json({ 
      success: true,
      message: 'QuickBooks connection disconnected successfully',
      companyId: companyId
    })
    
    response.cookies.delete('qb_authenticated')
    response.cookies.delete('qb_company_id')
    response.cookies.delete('qb_realm_id')
    
    return response
    
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json({ 
      error: 'Failed to disconnect QuickBooks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
