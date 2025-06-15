import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Check cookies
    const qbAuthenticated = request.cookies.get('qb_authenticated')?.value
    const qbCompanyId = request.cookies.get('qb_company_id')?.value
    const qbRealmId = request.cookies.get('qb_realm_id')?.value
    
    // Check database tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('qbo_tokens')
      .select('company_id, company_name, created_at, updated_at, expires_at')
      .order('created_at', { ascending: false })
    
    // Check prospects with QB connections
    const { data: prospects, error: prospectError } = await supabase
      .from('prospects')
      .select('id, company_name, qb_company_id, connection_status')
      .not('qb_company_id', 'is', null)
    
    return NextResponse.json({
      cookies: {
        qb_authenticated: qbAuthenticated || null,
        qb_company_id: qbCompanyId || null,
        qb_realm_id: qbRealmId || null
      },
      tokens: {
        count: tokens?.length || 0,
        data: tokens || [],
        error: tokenError?.message || null
      },
      prospects: {
        count: prospects?.length || 0,
        data: prospects || [],
        error: prospectError?.message || null
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error checking QB status:', error)
    return NextResponse.json({ 
      error: 'Failed to check QuickBooks status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}