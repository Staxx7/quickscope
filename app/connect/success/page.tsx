'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ConnectSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyName = searchParams.get('companyName')

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin/dashboard')
    }, 4000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Successfully Connected!</h1>
        <p className="text-gray-600 mb-6">
          Your account for <span className="font-semibold text-green-700">{companyName || 'your company'}</span> has been linked.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          You will be automatically redirected to your dashboard.
        </p>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  )
}

export default function ConnectSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectSuccessContent />
    </Suspense>
  )
} 