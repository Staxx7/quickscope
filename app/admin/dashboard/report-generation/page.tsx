'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import IntelligentAuditDeckGenerator from '@/components/IntelligentAuditDeckGenerator'

function ReportGenerationContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  // Generate a prospect ID based on company ID for consistency
  const prospectId = `prospect-${companyId}`

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Intelligent Audit Deck Generation</h1>
        <p className="text-gray-600">Generate AI-powered audit decks and reports for {companyName}</p>
      </div>
      
      <IntelligentAuditDeckGenerator 
        prospectId={prospectId}
        companyName={companyName}
        companyId={companyId}
        onDeckGenerated={(deck) => {
          console.log('Audit deck generated:', deck)
        }}
      />
    </div>
  )
}

export default function ReportGenerationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ReportGenerationContent />
    </Suspense>
  )
}
