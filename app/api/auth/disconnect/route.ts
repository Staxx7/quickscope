// app/api/auth/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    console.log('Disconnect request received')
    
    // Get company ID from cookies or request body
    const companyIdCookie = request.cookies.get('qb_company_id')
    const companyId = companyIdCookie?.value
    
    if (!companyId) {
      // Try to get from request body
      const body = await request.json().catch(() => ({}))
      if (!body.companyId) {
        return NextResponse.json({ 
          error: 'No QuickBooks connection found to disconnect' 
        }, { status: 400 })
      }
    }

    // Get the token to revoke it with QuickBooks
    const { data: tokenData } = await supabase
      .from('qbo_tokens')
      .select('refresh_token')
      .eq('company_id', companyId)
      .single()

    // Revoke token with QuickBooks if we have credentials
    const clientId = process.env.QUICKBOOKS_CLIENT_ID
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET
    
    if (clientId && clientSecret && tokenData?.refresh_token) {
      try {
        const revokeResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/revoke', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
          },
          body: new URLSearchParams({
            token: tokenData.refresh_token
          })
        })
        
        if (!revokeResponse.ok) {
          console.error('Failed to revoke QB token:', await revokeResponse.text())
          // Continue anyway - we'll still remove from our database
        }
      } catch (revokeError) {
        console.error('Error revoking QB token:', revokeError)
        // Continue anyway
      }
    }

    // Remove token from database
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

    // Clear the cookies
    const response = NextResponse.json({ 
      success: true,
      message: 'QuickBooks connection disconnected successfully'
    })
    
    response.cookies.delete('qb_authenticated')
    response.cookies.delete('qb_company_id')
    
    return response
    
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json({ 
      error: 'Failed to disconnect QuickBooks',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
