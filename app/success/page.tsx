// app/success/page.tsx - Fixed with Suspense boundary
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

// Component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams()
  const [companyName, setCompanyName] = useState('Your Company')
  
  useEffect(() => {
    const company = searchParams.get('company')
    const realmId = searchParams.get('realmId')
    const sessionId = searchParams.get('session_id') // From Stripe
    
    if (company) {
      setCompanyName(company)
    }
    
    // Handle Stripe success
    if (sessionId) {
      // Verify payment and activate subscription
      console.log('Payment successful:', sessionId)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Success Header */}
          <div className="mb-12">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              🎉 Welcome to QuickScope!
            </h1>
            <p className="text-xl text-slate-300">
              {companyName} is now connected and ready for financial analysis
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What happens next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Analysis</h3>
                <p className="text-slate-300 text-sm">We're analyzing your QuickBooks data to generate insights and identify opportunities.</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold text-white mb-2">Dashboard Ready</h3>
                <p className="text-slate-300 text-sm">Your personalized financial dashboard will be ready in just a few minutes.</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-6">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
                <p className="text-slate-300 text-sm">We'll email you when new insights and reports are available.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <a 
              href="/admin/dashboard" 
              className="inline-block w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              🎯 Go to Dashboard
            </a>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a 
                href="/pricing" 
                className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View Pricing Plans
              </a>
              
              <a 
                href="/support" 
                className="inline-block bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Get Support
              </a>
            </div>
          </div>

          {/* Free Trial Notice */}
          <div className="mt-12 p-6 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg">
            <h3 className="text-lg font-semibold text-green-300 mb-2">🎁 Your 14-Day Free Trial Starts Now</h3>
            <p className="text-green-200">
              Explore all QuickScope features free for 14 days. No credit card required. 
              Cancel anytime or upgrade to continue after your trial.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function SuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading success page...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  )
}
