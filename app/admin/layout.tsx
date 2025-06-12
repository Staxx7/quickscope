// app/admin/layout.tsx - Simple Layout
export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}

// app/admin/dashboard/advanced-analysis/page.tsx - Simple Analysis Page
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AdvancedAnalysisContent() {
  const searchParams = useSearchParams()
  const companyId = searchParams.get('company_id') || 'default'
  const companyName = searchParams.get('company_name') || 'Selected Company'

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Advanced Financial Analysis</h1>
      <p className="text-gray-600 mb-6">Analyzing financial data for {companyName}</p>
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Company: {companyName}</h2>
        <p className="text-blue-700">Company ID: {companyId}</p>
        <p className="text-blue-700 mt-4">Advanced financial analysis component will be integrated here.</p>
      </div>
    </div>
  )
}

export default function AdvancedAnalysisPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdvancedAnalysisContent />
    </Suspense>
  )
}

// app/admin/dashboard/data-extraction/page.tsx - Simple Data Extraction Page
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

// app/admin/dashboard/call-transcripts/page.tsx - Simple Call Transcripts Page  
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

// app/admin/dashboard/report-generation/page.tsx - Simple Report Generation Page
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
