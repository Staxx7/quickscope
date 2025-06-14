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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Completing Connection</h2>
          <p className="text-slate-300">Setting up your financial data integration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/connect'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/30">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Successfully Connected!</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your QuickBooks account has been successfully connected to our financial analysis platform. 
              Our team can now access your data to provide powerful insights and reporting.
            </p>
          </div>

          {/* Connection Status Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Connection Status: Active</h3>
                <p className="text-slate-400">Your QuickBooks data is now securely accessible for financial analysis and reporting.</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Bank-Level Security */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bank-Level Security</h3>
              <p className="text-slate-400 text-sm">Your data is protected with enterprise-grade encryption and security protocols.</p>
            </div>

            {/* Real-Time Analysis */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-Time Analysis</h3>
              <p className="text-slate-400 text-sm">Our team will provide up-to-date financial insights with automatic data synchronization.</p>
            </div>

            {/* Expert Support */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
              <p className="text-slate-400 text-sm">Our financial experts will analyze your data and provide actionable recommendations.</p>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Data Analysis Begins</h3>
                  <p className="text-slate-400">Our team will start analyzing your QuickBooks data to identify key insights and opportunities.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Report Preparation</h3>
                  <p className="text-slate-400">We'll prepare comprehensive financial reports and AI-driven insights tailored to your business.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Results Delivery</h3>
                  <p className="text-slate-400">You'll receive detailed analysis and recommendations to optimize your financial performance.</p>
                </div>
              </div>
            </div>

            {/* Final Message */}
            <div className="mt-8 text-center bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">No Further Action Needed!</h3>
              <p className="text-slate-300">
                We'll get to work and look forward to presenting more details on your scheduled audit call!
              </p>
            </div>

            {/* Only show dashboard button for paid users */}
            {isPaidUser && (
              <div className="mt-8 text-center">
                <a
                  href="/dashboard"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-8 rounded-lg transition-all duration-200 font-medium shadow-lg transform hover:scale-[1.02]"
                >
                  Open Your Dashboard
                </a>
              </div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
