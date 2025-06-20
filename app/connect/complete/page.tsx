'use client'

import { Suspense } from 'react'

function ConnectionCompleteContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#f7f7f7] to-[#e2eafc] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg p-8 sm:p-12 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center border border-white/50">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Connection Successful!</h1>
        <p className="text-gray-600 mb-2">
          Thank you. Your accounting platform has been securely linked.
        </p>
        <p className="text-gray-600">
          Our team will now begin the initial analysis. You may now close this window.
        </p>
      </div>
    </div>
  )
}

export default function ConnectionCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#fde2e4] via-[#f7f7f7] to-[#e2eafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ConnectionCompleteContent />
    </Suspense>
  )
} 