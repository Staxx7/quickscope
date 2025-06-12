'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ReportGenerationContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Audit Deck Generation</h1>
      <p className="text-gray-600 mb-6">Generate AI-powered audit decks and reports for {companyName}</p>
      <div className="bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-indigo-900 mb-2">Company: {companyName}</h2>
        <p className="text-indigo-700">Company ID: {companyId}</p>
        <p className="text-indigo-700 mt-4">Intelligent audit deck generator will be integrated here.</p>
      </div>
    </div>
  )
}

export default function ReportGenerationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportGenerationContent />
    </Suspense>
  )
}
