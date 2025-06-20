'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ConnectErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorMessage = searchParams.get('message')

  const getFriendlyErrorMessage = () => {
    if (!errorMessage) {
      return 'An unknown error occurred during the connection process.'
    }
    if (errorMessage.includes('token_exchange_failed')) {
      return 'Could not securely connect to QuickBooks. Please try again.'
    }
    if (errorMessage.includes('invalid_state')) {
      return 'The connection request expired or was invalid. Please start over.'
    }
    return 'An unexpected error occurred. Our team has been notified.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Failed</h1>
        <p className="text-gray-600 mb-6">
          {getFriendlyErrorMessage()}
        </p>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  )
}

export default function ConnectErrorPage() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <ConnectErrorContent />
    </Suspense>
  )
} 