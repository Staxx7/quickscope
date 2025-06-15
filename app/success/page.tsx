'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const company = searchParams.get('company')
  const realmId = searchParams.get('realmId')
  const provider = searchParams.get('provider') || 'QuickBooks'

  useEffect(() => {
    if (!company && !realmId) {
      router.push('/dashboard')
    }
  }, [company, realmId, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            {provider} Connected Successfully!
          </h1>

          {company && (
            <p className="text-xl text-slate-300">
              <span className="font-semibold">{company}</span> is now connected
            </p>
          )}

          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Next Steps:</h2>
            <ul className="text-left space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                Your financial data is being synced
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                AI analysis will be available shortly
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                Generate comprehensive reports anytime
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// Loading component
function LoadingSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading success page...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSuccess />}>
      <SuccessContent />
    </Suspense>
  )
}
