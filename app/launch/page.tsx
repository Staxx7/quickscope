// app/launch/page.tsx - Fixed with Suspense boundary
'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Component that uses useSearchParams
function LaunchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    const realmId = searchParams.get('realmId')
    const state = searchParams.get('state')
    
    console.log('Launch from QB App Store:', { realmId, state })
    
    // Redirect to connect with the realmId
    if (realmId) {
      router.push(`/connect?realmId=${realmId}`)
    } else {
      router.push('/connect')
    }
  }, [searchParams, router])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to QuickBooks connection...</p>
      </div>
    </div>
  )
}

// Loading component
function LoadingLaunch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}

export default function LaunchPage() {
  return (
    <Suspense fallback={<LoadingLaunch />}>
      <LaunchContent />
    </Suspense>
  )
}
