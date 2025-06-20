// app/connect/page.tsx - Back to original design with Suspense
'use client'

import { useState, Suspense } from 'react'
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
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Calling OAuth API directly...')
      window.location.href = '/api/auth/login'
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      setIsLoading(false)
    }
  }

  // Show error state if connection failed
  const errorParam = searchParams.get('error')
  const errorDetails = searchParams.get('details')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h1 className="text-3xl font-bold text-white">QUICKSCOPE</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Connect Your QuickBooks
            </h2>
            <p className="text-xl text-slate-300">
              Securely connect your QuickBooks Online account for analysis
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Error Display */}
            {(error || errorParam) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-semibold mb-2">Connection Failed</h4>
                <p className="text-red-700 mb-2">{error || errorParam}</p>
                {errorDetails && (
                  <details className="mt-2">
                    <summary className="text-red-600 cursor-pointer text-sm">View technical details</summary>
                    <pre className="text-xs text-red-500 mt-2 p-2 bg-red-50 rounded overflow-auto">
                      {decodeURIComponent(errorDetails)}
                    </pre>
                  </details>
                )}
                <p className="text-sm text-red-600 mt-2">
                  If this error persists, please contact support.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Connect to QuickBooks</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-sm text-green-600 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Your data is encrypted and secure
              </div>
              <p className="text-sm text-gray-500">
                We only access financial reports, not transaction details
              </p>
            </div>
          </div>

          {/* Debug Link (temporary) */}
          <div className="mt-6 text-center">
            <a 
              href="/api/debug/oauth"
              target="_blank"
              className="text-sm text-slate-400 hover:text-slate-300 underline"
            >
              Debug OAuth Credentials
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ConnectLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
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
