// app/connect/page.tsx - Previous design with exact text and glassmorphic styling
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Component that uses useSearchParams
function ConnectContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company')
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAuthUrl = async () => {
      try {
        const response = await fetch('/api/auth/quickbooks/url')
        const data = await response.json()
        setAuthUrl(data.url)
      } catch (error) {
        console.error('Error getting auth URL:', error)
      } finally {
        setLoading(false)
      }
    }

    getAuthUrl()
  }, [])

  const handleConnect = () => {
    if (authUrl) {
      // Store company info in sessionStorage if provided
      if (companyId) {
        sessionStorage.setItem('connectingCompany', companyId)
      }
      window.location.href = authUrl
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Connect Your QuickBooks
          </h1>

          <p className="text-slate-300">
            Securely link your QuickBooks account to enable real-time financial analysis and AI-powered insights.
          </p>

          <div className="space-y-4">
            {loading ? (
              <div className="py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={!authUrl}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Connect QuickBooks
              </button>
            )}

            <Link
              href="/dashboard"
              className="block w-full px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-center"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="text-xs text-slate-400 pt-4 border-t border-white/10">
            <p>By connecting, you agree to share your QuickBooks data for analysis purposes.</p>
            <p className="mt-2">Your data is encrypted and secure.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component
function LoadingConnect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading connection page...</p>
      </div>
    </div>
  )
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<LoadingConnect />}>
      <ConnectContent />
    </Suspense>
  )
}
