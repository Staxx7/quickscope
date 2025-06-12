'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isStoring, setIsStoring] = useState(true)
  const [error, setError] = useState('')
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  
  const connected = searchParams.get('connected')
  const company = searchParams.get('company')
  const accessToken = searchParams.get('access_token')

  useEffect(() => {
    if (connected === 'true' && company && accessToken) {
      storeTokensAndCompanyData()
    } else {
      setError('Missing connection data')
      setIsStoring(false)
    }
  }, [connected, company, accessToken])

  const storeTokensAndCompanyData = async () => {
    try {
      // Store OAuth tokens in Supabase
      const { data: tokenData, error: tokenError } = await supabase
        .from('qbo_tokens')
        .upsert({
          company_id: company,
          access_token: accessToken,
          refresh_token: searchParams.get('refresh_token') || '',
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
          scope: 'com.intuit.quickbooks.accounting',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (tokenError) {
        console.error('Error storing tokens:', tokenError)
        setError('Failed to store access tokens')
        setIsStoring(false)
        return
      }

      // Get company information from QuickBooks
      const companyResponse = await fetch(`/api/qbo/company-info?access_token=${accessToken}&realm_id=${company}`)
      const companyData = await companyResponse.json()

      if (companyResponse.ok) {
        setCompanyInfo(companyData)
        
        // Store prospect information
        const { data: prospectData, error: prospectError } = await supabase
          .from('prospects')
          .upsert({
            company_id: company,
            company_name: companyData.name || 'Unknown Company',
            email: companyData.email || '',
            phone: companyData.phone || '',
            status: 'connected',
            connection_date: new Date().toISOString(),
            last_sync: new Date().toISOString(),
            financial_health_score: null,
            notes: 'Connected via QuickScope OAuth flow'
          })
          .select()

        if (prospectError) {
          console.error('Error storing prospect:', prospectError)
        }
      }

      setIsStoring(false)

    } catch (error) {
      console.error('Error in token storage:', error)
      setError('Connection failed')
      setIsStoring(false)
    }
  }

  const goToDashboard = () => {
    // Navigate to admin dashboard with company context
    router.push(`/admin/dashboard?company=${company}&connected=true`)
  }

  const viewPricingPlans = () => {
    router.push('/pricing')
  }

  const getSupport = () => {
    window.open('mailto:support@quickscope.info', '_blank')
  }

  if (isStoring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Setting up your connection...</h2>
          <p className="text-slate-400">Storing your QuickBooks data securely</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/connect')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">
            🎉 Welcome to QuickScope!
          </h1>
          
          <p className="text-lg text-slate-300">
            {companyInfo?.name || company} is now connected and ready for financial analysis
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">What happens next?</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Data Analysis</h3>
              <p className="text-sm text-slate-300">
                We're analyzing your QuickBooks data to generate insights and identify opportunities.
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🚀</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Dashboard Ready</h3>
              <p className="text-sm text-slate-300">
                Your personalized financial dashboard will be ready in just a few minutes.
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📧</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-sm text-slate-300">
                We'll email you when new insights and reports are available.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={goToDashboard}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center justify-center"
          >
            <span className="mr-2">🎯</span>
            Go to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={viewPricingPlans}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              View Pricing Plans
            </button>
            
            <button
              onClick={getSupport}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Get Support
            </button>
          </div>
        </div>

        {/* Free Trial Notice */}
        <div className="mt-8 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-emerald-400 text-xl mr-3">🎁</span>
            <div>
              <h3 className="font-semibold text-emerald-400">Your 14-Day Free Trial Starts Now</h3>
              <p className="text-emerald-300 text-sm">
                Explore all QuickScope features free for 14 days. No credit card required. Cancel anytime or upgrade to continue after your trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
