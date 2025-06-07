import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 })
    }

    // Get the stored token for this company
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (tokenError || !tokenRecord) {
      return NextResponse.json({ error: 'No valid token found for this company' }, { status: 404 })
    }

    // Check if token is expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }

    // Use production API endpoint since you're using production keys
    const apiUrl = `https://quickbooks.api.intuit.com/v3/company/${companyId}/companyinfo/${companyId}`
    
    console.log('Making QBO API call with:')
    console.log('URL:', apiUrl)
    console.log('Token (first 20 chars):', tokenRecord.access_token.substring(0, 20) + '...')
    
    const qboResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${tokenRecord.access_token}`,
        'Accept': 'application/json'
      }
    })

    console.log('QBO Response Status:', qboResponse.status)

    if (!qboResponse.ok) {
      const errorText = await qboResponse.text()
      console.error('QBO API Error Status:', qboResponse.status)
      console.error('QBO API Error Response:', errorText)
      return NextResponse.json({ 
        error: 'Failed to fetch company info from QuickBooks',
        details: errorText,
        status: qboResponse.status 
      }, { status: 500 })
    }

    const companyData = await qboResponse.json()
    console.log('✅ Company info retrieved:', companyData)

    return NextResponse.json({
      success: true,
      companyId: companyId,
      data: companyData
    })

  } catch (error) {
    console.error('Company info fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
