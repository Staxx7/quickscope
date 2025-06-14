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
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')

        console.log('Success page params:', { connected, companyId, accessToken: accessToken ? 'present' : 'missing' })

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

        if (!accessToken) {
          setError('Missing access token from QuickBooks')
          setLoading(false)
          return
        }

        // Get company information from QuickBooks API
        const companyInfo = await fetchCompanyInfo(companyId, accessToken)
        
        // Store tokens in Supabase
        const { error: dbError } = await supabase
          .from('qbo_tokens')
          .upsert({
            company_id: companyId,
            company_name: companyInfo.name,
            access_token: accessToken,
            refresh_token: refreshToken || 'not_provided',
            expires_at: new Date(Date.now() + (3600 * 1000)).toISOString(), // 1 hour default
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'company_id'
          })

        if (dbError) {
          console.error('Database error:', dbError)
          setError(`Failed to store tokens: ${dbError.message}`)
          setLoading(false)
          return
        }

        // Create/update prospect record
        const { error: prospectError } = await supabase
          .from('prospects')
          .upsert({
            id: crypto.randomUUID(),
            company_name: companyInfo.name,
            qb_company_id: companyId,
            connection_status: 'connected',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'qb_company_id'
          })

        if (prospectError) {
          console.warn('Prospect creation warning:', prospectError)
          // Don't fail the whole process for this
        }

        setSuccess(true)
        setLoading(false)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 3000)

      } catch (error) {
        console.error('Error in success handler:', error)
        setError(error instanceof Error ? error.message : 'Unexpected error occurred')
        setLoading(false)
      }
    }

    handleSuccess()
  }, [searchParams, router])

  const fetchCompanyInfo = async (companyId: string, accessToken: string) => {
    try {
      // Try to get company info from QuickBooks
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://quickbooks.api.intuit.com'
        : 'https://sandbox-quickbooks.api.intuit.com'

      const response = await fetch(`${baseUrl}/v3/company/${companyId}/companyinfo/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const companyInfo = data?.QueryResponse?.CompanyInfo?.[0]
        return {
          name: companyInfo?.Name || companyInfo?.CompanyName || `Company ${companyId}`,
          id: companyId
        }
      } else {
        console.warn('Failed to fetch company info, using fallback')
        return {
          name: `Company ${companyId}`,
          id: companyId
        }
      }
    } catch (error) {
      console.warn('Error fetching company info:', error)
      return {
        name: `Company ${companyId}`,
        id: companyId
      }
    }
  }

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Connected!</h2>
          <p className="text-gray-600 mb-6">Your QuickBooks account has been linked successfully.</p>
          <div className="text-sm text-gray-500 mb-6">
            Redirecting to dashboard in 3 seconds...
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
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
