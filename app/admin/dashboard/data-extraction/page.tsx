'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DataExtractionContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">QuickBooks Data Extraction</h1>
      <p className="text-gray-600 mb-6">Extract and analyze financial data from {companyName}</p>
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-green-900 mb-2">Company: {companyName}</h2>
        <p className="text-green-700">Company ID: {companyId}</p>
        <p className="text-green-700 mt-4">QuickBooks data extraction component will be integrated here.</p>
      </div>
    </div>
  )
}

export default function DataExtractionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataExtractionContent />
    </Suspense>
  )
}
