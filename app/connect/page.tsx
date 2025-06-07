'use client'
import { useState } from 'react'

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Store prospect info in localStorage for now (we'll improve this)
    localStorage.setItem('prospectInfo', JSON.stringify(formData))
    
    // Redirect to QuickBooks OAuth
    window.location.href = '/api/auth/login'
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-medium">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header with Enhanced Quickscope Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {/* Enhanced Quickscope Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Outer ring with gradient */}
                <div className="absolute w-10 h-10 border-3 border-black rounded-full opacity-90"></div>
                <div className="absolute w-8 h-8 border-2 border-gray-600 rounded-full"></div>
                
                {/* Corner brackets */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-black"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-black"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-black"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-black"></div>
                
                {/* Cross hairs with precision marks */}
                <div className="absolute w-0.5 h-10 bg-black"></div>
                <div className="absolute w-10 h-0.5 bg-black"></div>
                
                {/* Precision tick marks */}
                <div className="absolute w-2 h-0.5 bg-black top-1"></div>
                <div className="absolute w-2 h-0.5 bg-black bottom-1"></div>
                <div className="absolute w-0.5 h-2 bg-black left-1"></div>
                <div className="absolute w-0.5 h-2 bg-black right-1"></div>
                
                {/* Center targeting dot with ring */}
                <div className="absolute w-3 h-3 border border-black rounded-full bg-white"></div>
                <div className="absolute w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
              <div className="text-black flex flex-col items-start">
                <span className="text-2xl font-bold tracking-wider leading-none">QUICKSCOPE</span>
                <div className="text-sm text-gray-600 mt-1">by STAXX</div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-2">Connect Your QuickBooks</h1>
          <p className="text-gray-600">Share your financial data securely for analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 bg-white"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 bg-white"
              placeholder="john@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 bg-white"
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-400 bg-white"
              placeholder="(555) 123-4567"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Connecting...' : 'Connect to QuickBooks'}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <span>🔒</span>
            <span className="font-semibold">Your data is encrypted and secure</span>
          </div>
          <p>We only access financial reports, not transaction details</p>
        </div>
      </div>
    </div>
  )
}
