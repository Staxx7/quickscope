import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug: Checking QuickBooks connections...')

    // Get all tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('qbo_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    // Get all prospects  
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .select('*')
      .not('qb_company_id', 'is', null)
      .order('created_at', { ascending: false })

    // Get cookies
    const cookies = request.cookies.getAll()
    const qbCookies = cookies.filter(c => c.name.includes('qb'))

    const debugInfo = {
      tokens: {
        count: tokens?.length || 0,
        data: tokens?.map(t => ({
          company_id: t.company_id,
          company_name: t.company_name,
          created: t.created_at,
          expires: t.expires_at,
          isExpired: new Date(t.expires_at) < new Date()
        })),
        error: tokensError?.message
      },
      prospects: {
        count: prospects?.length || 0,
        withQBConnection: prospects?.filter(p => p.qb_company_id)?.length || 0,
        data: prospects?.map(p => ({
          id: p.id,
          company: p.company_name,
          qb_company_id: p.qb_company_id,
          user_type: p.user_type,
          created: p.created_at
        })),
        error: prospectsError?.message
      },
      cookies: {
        qbRelated: qbCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
      },
      environment: {
        hasClientId: !!process.env.QUICKBOOKS_CLIENT_ID,
        hasClientSecret: !!process.env.QUICKBOOKS_CLIENT_SECRET,
        redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
        appUrl: process.env.NEXT_PUBLIC_APP_URL
      }
    }

    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Debug check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}