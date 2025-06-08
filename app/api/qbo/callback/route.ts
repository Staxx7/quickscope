import { NextRequest, NextResponse } from 'next/server'
import { sendNewProspectNotification } from '@/lib/emailService'
import { analyzeQuickBooksData, exchangeCodeForTokens } from '@/lib/quickbooksService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const realmId = searchParams.get('realmId')

    if (!code || !state || !realmId) {
      throw new Error('Missing required OAuth parameters')
    }

    // Decode prospect data from state
    let prospectData
    try {
      prospectData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch {
      throw new Error('Invalid state parameter')
    }

    // Exchange authorization code for access token (for production)
    const tokenResponse = await exchangeCodeForTokens(code, realmId)

    // For now, simulate successful connection
    const prospect = {
      id: 'prospect_' + Math.random().toString(36).substr(2, 9),
      name: prospectData.name,
      email: prospectData.email,
      company: prospectData.company,
      phone: prospectData.phone,
      qboCompanyId: realmId,
      connectedAt: new Date().toISOString(),
      status: 'connected'
    }

// After successful token exchange, add these calls:

// 1. Send email notification
await sendNewProspectNotification({
  to: 'team@staxx.com',
  subject: `New QuickBooks Connection: ${prospectData.company}`,
  prospect: prospectData
})

// 2. Trigger financial analysis
// Queue analysis for background processing
setTimeout(async () => {
  try {
    await analyzeQuickBooksData(tokenResponse.access_token, realmId)
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}, 1000) // Delay to ensure prospect is saved first

    // TODO: Save to your database
    console.log('New prospect connected:', prospect)
    
    // TODO: Add to your admin pipeline automatically
    
    // Redirect to success page
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('name', prospect.name)
    redirectUrl.searchParams.set('company', prospect.company)
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Redirect to your homepage with error
    const errorUrl = new URL('/', request.url)
    errorUrl.searchParams.set('error', 'connection_failed')
    
    return NextResponse.redirect(errorUrl)
  }
}
