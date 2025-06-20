'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConnectionFailedContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const getFriendlyErrorMessage = () => {
    if (message?.includes('invalid_state')) {
      return 'The connection link has expired. Please close this window and try again.'
    }
    if (message?.includes('token_exchange_failed')) {
      return 'Could not securely connect to QuickBooks at this time. Please try again.'
    }
    return 'An unexpected error occurred. Please close this window and try again.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#f7f7f7] to-[#e2eafc] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center border border-white/50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Connection Failed</h1>
        <p className="text-gray-600 mb-2">
          {getFriendlyErrorMessage()}
        </p>
        <p className="text-sm text-gray-500">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}

export default function ConnectionFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectionFailedContent />
    </Suspense>
  )
} 