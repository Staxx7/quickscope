'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import EliteAdvancedFinancialAnalyzer from '../../components/EliteAdvancedFinancialAnalyzer'
import { useCompany } from '@/app/contexts/CompanyContext'

function AdvancedAnalysisContent() {
  const { selectedCompany, isLoading } = useCompany()
  const router = useRouter()

  if (isLoading) {
    return <div>Loading company data...</div>
  }

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">No Company Selected</h2>
          <p className="text-slate-300 mb-6">Please select a company from the dashboard to view financial analysis.</p>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <EliteAdvancedFinancialAnalyzer 
      companyId={selectedCompany.id}
      companyName={selectedCompany.name}
    />
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Loading advanced financial analysis...</p>
      </div>
    </div>
  )
}

export default function AdvancedAnalysisPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdvancedAnalysisContent />
    </Suspense>
  )
}