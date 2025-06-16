'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Clock, FileText, TrendingUp, ArrowRight, Shield, Zap } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyName = searchParams.get('company_name') || searchParams.get('company') || 'Your Company'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Connection Successful!
          </h1>
          
          <p className="text-xl text-gray-400">
            {companyName} has been successfully connected to QuickScope
          </p>
        </div>

        {/* What Happens Next Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 text-yellow-500 mr-3" />
            What Happens Next?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Immediate Data Sync</h3>
                  <p className="text-gray-400 text-sm">Your financial data is being synchronized in real-time. This typically takes 2-5 minutes.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">AI Analysis Begins</h3>
                  <p className="text-gray-400 text-sm">Our AI engine will analyze your financial patterns and generate insights automatically.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mt-1">
                  <FileText className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Report Generation Ready</h3>
                  <p className="text-gray-400 text-sm">You can now generate comprehensive financial reports and audit decks instantly.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Secure & Encrypted</h3>
                  <p className="text-gray-400 text-sm">Your data is protected with bank-level encryption and SOC 2 compliance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Expected Timeline</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Data Synchronization</span>
              </div>
              <span className="text-gray-400 text-sm">2-5 minutes</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Initial AI Analysis</span>
              </div>
              <span className="text-gray-400 text-sm">5-10 minutes</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Full Report Generation</span>
              </div>
              <span className="text-gray-400 text-sm">Available immediately</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => router.push('/dashboard/data-extraction')}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            <span>View Financial Data</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@quickscope.info" className="text-blue-400 hover:text-blue-300">
              support@quickscope.info
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading component
function LoadingSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading success page...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSuccess />}>
      <SuccessContent />
    </Suspense>
  )
}
