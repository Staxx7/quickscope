'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConnectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Send data to OAuth initiation endpoint
      const response = await fetch('/api/qbo/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          company: formData.company,
          phone: formData.phone
        }),
      })

      if (response.ok) {
        const { authUrl } = await response.json()
        // Redirect to QuickBooks OAuth
        window.location.href = authUrl
      } else {
        throw new Error('Failed to initiate QuickBooks connection')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Same grid pattern for consistency */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Header */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 lg:px-12">
        <a href="/" className="flex items-center space-x-3">
          {/* STAXX Logo Icon */}
          <div className="w-8 h-8 flex flex-col justify-center space-y-0.5">
            <div className="h-1.5 bg-white rounded-sm"></div>
            <div className="h-1.5 bg-white rounded-sm w-3/4"></div>
            <div className="h-1.5 bg-white rounded-sm w-1/2"></div>
          </div>
          <span className="text-white font-medium text-xl tracking-wide">Quickscope by STAXX</span>
        </a>
      </nav>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 flex flex-col justify-center space-y-0.5">
                <div className="h-1 bg-black rounded-sm"></div>
                <div className="h-1 bg-black rounded-sm w-3/4"></div>
                <div className="h-1 bg-black rounded-sm w-1/2"></div>
              </div>
              <span className="text-black font-bold text-lg">QUICKSCOPE</span>
            </div>
            <p className="text-gray-600 text-sm">by STAXX</p>
          </div>

          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            Connect Your QuickBooks
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your details to begin comprehensive financial analysis
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corporation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-black font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting to QuickBooks...' : 'Connect QuickBooks Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-green-600 text-sm mb-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure QuickBooks OAuth Connection
            </div>
            <p className="text-gray-500 text-xs">
              🔒 Your data is encrypted and never stored on our servers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
