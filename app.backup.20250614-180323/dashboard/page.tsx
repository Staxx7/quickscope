'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SafeAccountWorkflowDashboard from '@/components/dashboard/SafeAccountWorkflowDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check for authentication status
    // This could be enhanced with proper session management
    const checkAuth = () => {
      // For now, check if we have QuickBooks tokens or session data
      // This should be replaced with proper authentication checking
      const hasAuth = typeof window !== 'undefined' && (
        localStorage.getItem('qb_access_token') ||
        sessionStorage.getItem('authenticated') ||
        document.cookie.includes('qb_session')
      )
      
      setIsAuthenticated(hasAuth)
      
      if (!hasAuth) {
        // Redirect to connect page if not authenticated
        router.push('/connect')
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <SafeAccountWorkflowDashboard />
  }

  // This shouldn't be reached due to redirect, but just in case
  return null
}
