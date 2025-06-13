'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EliteAdvancedFinancialAnalyzer from '../../components/EliteAdvancedFinancialAnalyzer'

function FinancialAnalysisContent() {
  const searchParams = useSearchParams()
  
  // Extract URL parameters - using consistent parameter names
  const companyId = searchParams?.get('account') || searchParams?.get('company_id')
  const companyName = searchParams?.get('company') || searchParams?.get('company_name')

  // Handle missing parameters gracefully
  if (!companyId || !companyName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Company Selected</h2>
          <p className="text-gray-600">Please select a company from the dashboard to view financial analysis.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <EliteAdvancedFinancialAnalyzer 
      companyId={companyId}
      companyName={decodeURIComponent(companyName)}
    />
  )
}

export default function FinancialAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <FinancialAnalysisContent />
    </Suspense>
  )
}