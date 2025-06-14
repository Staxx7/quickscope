import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('company_id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Get the latest valid token for this company
    const { data: tokenData, error } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !tokenData) {
      return NextResponse.json(
        { error: 'No valid token found for this company' },
        { status: 404 }
      )
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at)
    const now = new Date()

    if (expiresAt <= now) {
      // Try to refresh the token
      try {
        const refreshedToken = await refreshAccessToken(tokenData.refresh_token)
        
        // Update the token in database
        const { data: updatedToken, error: updateError } = await supabase
          .from('qbo_tokens')
          .update({
            access_token: refreshedToken.access_token,
            expires_at: new Date(Date.now() + refreshedToken.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', tokenData.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update refreshed token' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          access_token: refreshedToken.access_token,
          expires_at: updatedToken.expires_at,
          company_id: companyId
        })

      } catch (refreshError) {
        return NextResponse.json(
          { error: 'Token expired and refresh failed', details: refreshError },
          { status: 401 }
        )
      }
    }

    // Return valid token
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_at: tokenData.expires_at,
      company_id: companyId
    })

  } catch (error) {
    console.error('Error getting token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.QB_CLIENT_ID
  const clientSecret = process.env.QB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('OAuth credentials not configured')
  }

  const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Token refresh failed: ${JSON.stringify(errorData)}`)
  }

  return await response.json()
}
