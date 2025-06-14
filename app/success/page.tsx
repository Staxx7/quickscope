'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Get parameters from URL
        const connected = searchParams.get('connected')
        const companyId = searchParams.get('company')
        const companyName = searchParams.get('company_name')

        console.log('Success page params:', { connected, companyId })

        if (!connected || connected !== 'true') {
          setError('OAuth connection not confirmed')
          setLoading(false)
          return
        }

        if (!companyId) {
          setError('Missing company ID from QuickBooks')
          setLoading(false)
          return
        }

        // Check if tokens are already saved in database
        const { data: existingToken } = await supabase
          .from('qbo_tokens')
          .select('company_id, company_name')
          .eq('company_id', companyId)
          .single()

        if (existingToken) {
          console.log('QuickBooks connection already saved:', existingToken)
          
          // Check if this is a paid user
          const { data: prospect } = await supabase
            .from('prospects')
            .select('user_type')
            .eq('qb_company_id', companyId)
            .single()
          
          const isPaidUser = prospect?.user_type === 'paid_user' || prospect?.user_type === 'internal'
          sessionStorage.setItem('user_type', isPaidUser ? 'paid' : 'prospect')
          
          setSuccess(true)
          setLoading(false)
          return
        }

        // If we reach here, something went wrong with token storage
        console.error('No tokens found in database for company:', companyId)
        setError('Connection was successful but token storage failed. Please try connecting again.')
        setLoading(false)

      } catch (error) {
        console.error('Error in success handler:', error)
        setError(error instanceof Error ? error.message : 'Unexpected error occurred')
        setLoading(false)
      }
    }

    handleSuccess()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting QuickBooks</h2>
          <p className="text-gray-600">Setting up your financial data integration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/auth/quickbooks'}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    // Check if user is a paid user or prospect
    const userType = typeof window !== 'undefined' ? sessionStorage.getItem('user_type') : null
    const isPaidUser = userType === 'paid'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Successfully Connected!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your QuickBooks account has been linked successfully.
            </p>

            {/* Info Box */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <p className="text-gray-700">
                We'll email you the results of your financial audit within the next 24-48 hours.
              </p>
            </div>

            {/* Thank You Message */}
            <p className="text-gray-600 text-sm">
              Thank you for choosing our services!
            </p>

            {/* Only show dashboard button for paid users */}
            {isPaidUser && (
              <a
                href="/dashboard"
                className="inline-block mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Open Your Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
