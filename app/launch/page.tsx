// app/launch/page.tsx - OpenID Launch Handler
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LaunchPage() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get parameters from QB App Store launch
    const realmId = searchParams.get('realmId')
    const state = searchParams.get('state')
    
    console.log('Launch from QB App Store:', { realmId, state })
    
    // Perform OpenID authentication with Intuit
    const handleOpenIDAuth = async () => {
      try {
        // Redirect to OpenID Connect endpoint
        const openIdUrl = new URL('https://oauth.platform.intuit.com/oauth2/v1/authorize')
        openIdUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_QUICKBOOKS_CLIENT_ID || '')
        openIdUrl.searchParams.set('scope', 'openid profile email')
        openIdUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/openid/callback`)
        openIdUrl.searchParams.set('response_type', 'code')
        openIdUrl.searchParams.set('access_type', 'offline')
        openIdUrl.searchParams.set('state', state || 'launch_' + Date.now())
        
        // For now, redirect directly to dashboard
        // In production, implement proper OpenID flow
        window.location.href = '/admin/dashboard'
        
      } catch (error) {
        console.error('OpenID launch error:', error)
        // Fallback to dashboard
        window.location.href = '/admin/dashboard'
      }
    }
    
    handleOpenIDAuth()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white mb-2">Launching QuickScope...</h1>
        <p className="text-slate-300">Redirecting to your dashboard</p>
      </div>
    </div>
  )
}