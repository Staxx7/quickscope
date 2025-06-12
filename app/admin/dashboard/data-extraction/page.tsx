'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import EnhancedQBODataExtractor from '@/components/EnhancedQBODataExtractor'

function DataExtractionContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QuickBooks Data Extraction</h1>
        <p className="text-gray-600">Extract and analyze financial data from {companyName}</p>
      </div>
      
      <EnhancedQBODataExtractor 
        companyId={companyId}
        companyName={companyName}
      />
    </div>
  )
}

export default function DataExtractionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <DataExtractionContent />
    </Suspense>
  )
}
