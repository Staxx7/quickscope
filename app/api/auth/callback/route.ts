import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    console.log('OAuth Callback received:', { code, state, realmId })

    if (!code || !realmId) {
      return NextResponse.json(
        { error: 'Missing authorization code or realm ID' },
        { status: 400 }
      )
    }

    const dashboardUrl = new URL('/admin/dashboard', request.url)
    dashboardUrl.searchParams.set('connected', 'true')
    dashboardUrl.searchParams.set('company', realmId)

    return NextResponse.redirect(dashboardUrl)

  } catch (error) {
    console.error('Error in auth callback:', error)
    
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    dashboardUrl.searchParams.set('error', 'connection_failed')
    
    return NextResponse.redirect(dashboardUrl)
  }
}
