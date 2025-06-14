// app/launch/page.tsx - Fixed with Suspense boundary
'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Component that uses useSearchParams
function LaunchContent() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Get parameters from QB App Store launch
    const realmId = searchParams.get('realmId')
    const state = searchParams.get('state')
    
    console.log('Launch from QB App Store:', { realmId, state })
    
    // Perform OpenID authentication with Intuit
    const handleOpenIDAuth = async () => {
      try {
        // For now, redirect directly to dashboard
        // In production, implement proper OpenID flow
        window.location.href = '/admin/dashboard'
        
      } catch (error) {
        console.error('OpenID launch error:', error)
        // Fallback to dashboard
        window.location.href = '/admin/dashboard'
      }
    }
    
    // Add a small delay to show loading state
    const timer = setTimeout(handleOpenIDAuth, 1500)
    
    return () => clearTimeout(timer)
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

// Loading component for Suspense fallback
function LaunchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
        <p className="text-slate-300">Preparing your launch</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function LaunchPage() {
  return (
    <Suspense fallback={<LaunchLoading />}>
      <LaunchContent />
    </Suspense>
  )
}
