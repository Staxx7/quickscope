'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AIEnhancedFinancialDashboard from '@/components/AIEnhancedFinancialDashboard'

function AdvancedAnalysisContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <AIEnhancedFinancialDashboard 
      companyId={companyId}
      companyName={companyName}
    />
  )
}

export default function AdvancedAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <AdvancedAnalysisContent />
    </Suspense>
  )
}
