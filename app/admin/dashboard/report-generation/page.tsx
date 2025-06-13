'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import IntelligentAuditDeckGenerator from 'app/components/IntelligentAuditDeckGenerator'

function ReportGenerationContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams?.get('account')
  const companyName = searchParams?.get('company')
  const prospectId = searchParams?.get('prospectId')

  if (!companyId || !companyName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Company Selected</h2>
          <p className="text-gray-600">Please select a company from the dashboard to generate reports.</p>
        </div>
      </div>
    )
  }

  return (
    <IntelligentAuditDeckGenerator 
      prospectId={prospectId || companyId}
      companyId={companyId}
      companyName={decodeURIComponent(companyName)}
    />
  )
}

export default function ReportGenerationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ReportGenerationContent />
    </Suspense>
  )
}