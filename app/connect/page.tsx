// app/connect/page.tsx - Previous design with exact text and glassmorphic styling
'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Component that uses useSearchParams
function ConnectContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  // Prefetch the OAuth URL when component mounts to speed up redirect
  useEffect(() => {
    // Create a hidden link to prefetch DNS and establish connection
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = 'https://appcenter.intuit.com'
    document.head.appendChild(link)
    
    // Also prefetch the OAuth endpoint
    const prefetchLink = document.createElement('link')
    prefetchLink.rel = 'prefetch'
    prefetchLink.href = '/api/auth/login'
    document.head.appendChild(prefetchLink)
    
    return () => {
      document.head.removeChild(link)
      document.head.removeChild(prefetchLink)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Store form data for later use if needed
      sessionStorage.setItem('connect_form_data', JSON.stringify(formData))
      
      // Show redirecting state
      setTimeout(() => {
        setIsRedirecting(true)
      }, 500)
      
      // Small delay to show the loading state before redirect
      setTimeout(() => {
        window.location.href = '/api/auth/login'
      }, 800)
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      setIsLoading(false)
      setIsRedirecting(false)
    }
  }

  // Show error state if connection failed
  const errorParam = searchParams.get('error')
  const errorDetails = searchParams.get('details')

  // If redirecting to QuickBooks - sleek loading animation
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          {/* Sleek circular loading animation */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 mx-auto">
              <svg className="w-20 h-20 animate-spin" viewBox="0 0 100 100">
                <circle
                  className="text-slate-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={70}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
            </div>
            {/* Pulsing dot in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Redirecting to QuickBooks</h2>
          <p className="text-slate-400 text-sm">Please wait while we connect your account...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Header with exact logo and text from previous design */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              {/* Logo - matching the style from previous screenshot */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center transform -rotate-3">
                    <span className="text-white text-2xl font-bold">Q</span>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-wider">QUICKSCOPE</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Get Your Free Financial Audit
            </h2>
            <p className="text-xl text-slate-300">
              Connect your accounting software to receive a comprehensive
            </p>
            <p className="text-xl text-slate-300">
              financial health assessment.
            </p>
          </div>

          {/* Glassmorphic Form Container */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
            {/* Error Display */}
            {(error || errorParam) && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <h4 className="text-red-400 font-semibold mb-2">Connection Failed</h4>
                <p className="text-red-300 mb-2">{error || errorParam}</p>
                {errorDetails && (
                  <details className="mt-2">
                    <summary className="text-red-400 cursor-pointer text-sm">View technical details</summary>
                    <pre className="text-xs text-red-300 mt-2 p-2 bg-red-500/10 rounded overflow-auto">
                      {decodeURIComponent(errorDetails)}
                    </pre>
                  </details>
                )}
                <p className="text-sm text-red-400 mt-2">
                  If this error persists, please contact support.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Connect to QuickBooks</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center text-sm text-green-400 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Your data is encrypted and secure
              </div>
              <p className="text-sm text-slate-400">
                We use bank-level security to protect your information
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              No credit card required • Results in 24-48 hours • 100% confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ConnectLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ConnectPage() {
  return (
    <Suspense fallback={<ConnectLoading />}>
      <ConnectContent />
    </Suspense>
  )
}
