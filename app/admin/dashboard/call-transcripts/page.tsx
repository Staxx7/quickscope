'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CallTranscriptsIntegration from '../../../components/CallTranscriptsIntegration'
import { useCompany } from '@/app/contexts/CompanyContext'

function CallTranscriptsContent() {
  const searchParams = useSearchParams()
  const { selectedCompany, isLoading } = useCompany()
  
  // Get company details from URL params or context
  const companyId = searchParams?.get('account') || searchParams?.get('companyId') || selectedCompany?.realmId || selectedCompany?.id || ''
  const companyName = searchParams?.get('company') || searchParams?.get('companyName') || selectedCompany?.name || ''

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading company data...</p>
        </div>
      </div>
    )
  }

  if (!companyId && !companyName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">No Company Selected</h2>
          <p className="text-slate-300 mb-6">Please select a company from the dashboard to manage call transcripts.</p>
          <button 
            onClick={() => window.location.href = '/admin/dashboard'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <CallTranscriptsIntegration 
      defaultCompanyId={companyId}
      defaultCompanyName={decodeURIComponent(companyName)}
    />
  )
}

export default function CallTranscriptsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading call transcripts...</p>
        </div>
      </div>
    }>
      <CallTranscriptsContent />
    </Suspense>
  )
}