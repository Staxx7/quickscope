'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ConnectedCompaniesWorkflow from '@/app/components/ConnectedCompaniesWorkflow'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUserAndFetchCompanies = async () => {
      try {
        // Fetch connected companies using the new endpoint
        const response = await fetch('/api/admin/connected-companies')
        
        if (!response.ok) {
          throw new Error('Failed to fetch connected companies')
        }

        const data = await response.json()
        
        if (data.success && data.companies) {
          setCompanies(data.companies)
          
          // Check if we have any active companies
          const activeCompanies = data.companies.filter((c: any) => c.connection_status === 'active')
          
          if (data.companies.length === 0) {
            // No companies connected
            router.push('/connect?reason=no_connection')
          } else if (activeCompanies.length === 0) {
            // All companies are expired
            router.push('/connect?reason=all_expired')
          }
        } else {
          // No companies connected
          router.push('/connect?reason=no_data')
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading connected companies...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg max-w-md mx-auto">
        <h2 className="text-red-400 font-semibold text-lg mb-2">Connection Error</h2>
        <p className="text-gray-300">{error}</p>
        <button
          onClick={() => router.push('/connect')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Connect QuickBooks
        </button>
      </div>
    )
  }

  // Show the companies workflow
  return <ConnectedCompaniesWorkflow companies={companies} />
}
