'use client'

import { Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CallTranscriptsIntegration from 'app/components/CallTranscriptsIntegration'
import GlobalCompanySelector from 'app/components/GlobalCompanySelector'
import { extractCompanyFromUrlParams } from 'lib/companyUtils'
import { FileText } from 'lucide-react'

interface Company {
  id: string
  company_id: string
  company_name: string
  connection_status: string
  workflow_stage: string
  has_financial_data: boolean
  has_ai_analysis: boolean
  transcript_count: number
}

function CallTranscriptsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Use utility function to extract company parameters
  const companyParams = searchParams ? extractCompanyFromUrlParams(searchParams) : null

  // Handle company selection from the global selector
  const handleCompanySelect = useCallback((company: Company) => {
    // Update URL with selected company
    const params = new URLSearchParams({
      company_id: company.company_id,
      company_name: company.company_name
    })
    router.push(`/dashboard/call-transcripts?${params.toString()}`)
  }, [router])

  // If no company selected, show selector
  if (!companyParams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Call Transcripts</h1>
            <p className="text-slate-400">Upload and analyze sales call transcripts</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <div className="max-w-md mx-auto text-center">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-4">Select a Company</h2>
              <p className="text-slate-300 mb-6">Choose a connected company to upload call transcripts</p>
              
              <div className="mb-6">
                <GlobalCompanySelector 
                  onCompanySelect={handleCompanySelect}
                  showWorkflowStage={true}
                />
              </div>
              
              <div className="text-sm text-slate-400">
                <p>Or go back to the</p>
                <button 
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-blue-400 hover:text-blue-300 underline mt-1"
                >
                  Account Workflow Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Company Selector */}
      <div className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Call Transcripts</h1>
              <p className="text-slate-400 text-sm mt-1">Upload and analyze sales calls</p>
            </div>
            <div className="w-full max-w-md">
              <GlobalCompanySelector 
                onCompanySelect={handleCompanySelect}
                showWorkflowStage={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <CallTranscriptsIntegration 
          defaultCompanyId={companyParams.companyId}
          defaultCompanyName={companyParams.companyName}
        />
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Loading call transcripts...</p>
      </div>
    </div>
  )
}

export default function CallTranscriptsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallTranscriptsContent />
    </Suspense>
  )
}