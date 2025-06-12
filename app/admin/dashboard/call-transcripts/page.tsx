'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CallTranscriptsContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Call Transcript Analysis</h1>
      <p className="text-gray-600 mb-6">Upload and analyze call transcripts for {companyName}</p>
      <div className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Company: {companyName}</h2>
        <p className="text-purple-700">Company ID: {companyId}</p>
        <p className="text-purple-700 mt-4">Call transcript integration component will be added here.</p>
      </div>
    </div>
  )
}

export default function CallTranscriptsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallTranscriptsContent />
    </Suspense>
  )
}
