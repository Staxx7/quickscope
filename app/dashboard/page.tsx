'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ConnectedCompaniesWorkflow from '@/app/components/ConnectedCompaniesWorkflow'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<string | null>(null)

  useEffect(() => {
    const checkUserAndFetchCompanies = async () => {
      try {
        // Check user type
        const storedUserType = sessionStorage.getItem('user_type')
        setUserType(storedUserType)

        // If internal user, show admin dashboard
        if (storedUserType === 'internal') {
          router.push('/admin/dashboard')
          return
        }

        // Fetch connected companies using the new endpoint
        const response = await fetch('/api/admin/connected-companies')
        
        if (!response.ok) {
          throw new Error('Failed to fetch connected companies')
        }

        const data = await response.json()
        
        if (data.success && data.companies && data.companies.length > 0) {
          // Filter for active companies only
          const activeCompanies = data.companies.filter((c: any) => c.connection_status === 'active')
          
          if (activeCompanies.length > 0) {
            setCompanies(activeCompanies)
            // Set a flag that we have authenticated companies
            sessionStorage.setItem('authenticated', 'true')
            sessionStorage.setItem('active_company_id', activeCompanies[0].company_id)
          } else {
            // All companies are expired
            router.push('/connect?reason=expired')
          }
        } else {
          // No companies connected
          router.push('/connect?reason=no_connection')
        }
      } catch (err) {
        console.error('Error checking connections:', err)
        setError(err instanceof Error ? err.message : 'Failed to check connections')
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAndFetchCompanies()
  }, [router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg max-w-md">
          <h2 className="text-red-400 font-semibold text-lg mb-2">Connection Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/connect')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Connect QuickBooks
          </button>
        </div>
      </div>
    )
  }

  // Show dashboard if we have companies
  if (companies.length > 0) {
    return <ConnectedCompaniesWorkflow companies={companies} />
  }

  // This shouldn't be reached due to redirect, but just in case
  return null
}
