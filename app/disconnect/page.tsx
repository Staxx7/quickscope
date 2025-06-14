'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DisconnectPage() {
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    setError('')

    try {
      const response = await fetch('/api/auth/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Clear any local storage
        sessionStorage.removeItem('authenticated')
        sessionStorage.removeItem('active_company_id')
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setError(data.error || 'Failed to disconnect QuickBooks')
      }
    } catch (err) {
      setError('An error occurred while disconnecting')
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Disconnected Successfully</h2>
          <p className="text-gray-600 mb-6">Your QuickBooks account has been disconnected from QuickScope.</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Disconnect QuickBooks</h2>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Warning:</strong> Disconnecting will remove access to your QuickBooks data. 
            You'll need to reconnect to use QuickScope's features again.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDisconnecting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Disconnecting...
              </span>
            ) : (
              'Disconnect QuickBooks'
            )}
          </button>
          
          <button
            onClick={() => router.back()}
            disabled={isDisconnecting}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          You can reconnect your QuickBooks account at any time.
        </p>
      </div>
    </div>
  )
}