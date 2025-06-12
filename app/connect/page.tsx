// app/connect/page.tsx - Fixed TypeScript errors
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface CompanyInfo {
  name: string
  id?: string
}

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user is already connected
  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      // Check if user has active QB connection
      const response = await fetch('/api/qbo/connection-status')
      if (response.ok) {
        const data = await response.json()
        if (data.connected) {
          setIsConnected(true)
          setCompanyInfo(data.company)
        }
      }
    } catch (error) {
      console.log('No existing connection found')
    }
  }

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

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/auth/disconnect', { method: 'POST' })
      if (response.ok) {
        setIsConnected(false)
        setCompanyInfo(null)
      }
    } catch (error) {
      setError('Failed to disconnect')
    }
  }

  // Show connected state - HIDE connect button per QB requirement
  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                QuickBooks Connected! ✅
              </h1>
              <p className="text-xl text-slate-300">
                Your QuickBooks account is successfully connected
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Active</h2>
                {companyInfo && (
                  <p className="text-gray-600">Connected to: {companyInfo.name}</p>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  🚀 Go to Dashboard
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  🔌 Disconnect QuickBooks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if connection failed
  if (searchParams.get('error')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Connection Failed
              </h1>
              <p className="text-xl text-slate-300">
                There was an issue connecting your QuickBooks account
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
                <p className="text-red-600 mb-4">
                  Error: {searchParams.get('error')}
                </p>
              </div>

              <button
                onClick={() => window.location.href = '/connect'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show connect form - ONLY when not connected per QB requirement
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Connect Your QuickBooks
            </h1>
            <p className="text-xl text-slate-300">
              Securely connect your QuickBooks Online account to get started with your financial analysis
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
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
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email address"
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
                  placeholder="Enter your company name"
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
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              {/* QB-COMPLIANT CONNECT BUTTON - Use official QuickBooks button */}
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
              <p className="text-sm text-gray-500">
                Your QuickBooks data is secured with bank-level encryption. 
                We only access the financial data needed for your analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
