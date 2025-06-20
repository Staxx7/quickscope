'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CallTranscriptsIntegration from 'app/components/CallTranscriptsIntegration'
import GlobalCompanySelector from 'app/components/GlobalCompanySelector'
import { WorkflowManager } from 'lib/workflowManager'
import { Building2, ArrowRight, FileText, Brain, TrendingUp, Mic } from 'lucide-react'

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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedTranscripts, setSavedTranscripts] = useState<any[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  // Get company from URL params or workflow state
  useEffect(() => {
    const companyId = searchParams?.get('account') || 
                      searchParams?.get('company_id') || 
                      searchParams?.get('companyId')
    const companyName = searchParams?.get('company') || 
                        searchParams?.get('company_name')
    
    if (companyId && companyName) {
      // Update workflow state
      WorkflowManager.updateStep(companyId, 'call-transcripts')
      
      setSelectedCompany({
        id: companyId,
        company_id: companyId,
        company_name: companyName,
        connection_status: 'active',
        workflow_stage: 'call_transcripts',
        has_financial_data: true,
        has_ai_analysis: false,
        transcript_count: 0
      })
      
      // Load saved transcripts
      const transcripts = WorkflowManager.getTranscriptData(companyId)
      setSavedTranscripts(transcripts)
    }
    
    setLoading(false)
  }, [searchParams])

  const handleCompanyChange = useCallback((company: Company) => {
    setSelectedCompany(company)
    
    // Update workflow
    WorkflowManager.updateStep(company.company_id, 'call-transcripts')
    
    // Load saved transcripts for new company
    const transcripts = WorkflowManager.getTranscriptData(company.company_id)
    setSavedTranscripts(transcripts)
    
    // Update URL
    const params = new URLSearchParams({
      company_id: company.company_id,
      company_name: company.company_name,
      account: company.company_id,
      company: company.company_name
    })
    router.push(`/admin/dashboard/call-transcripts?${params.toString()}`)
  }, [router])

  const handleTranscriptUploaded = useCallback((transcriptData: any) => {
    if (!selectedCompany) return
    
    // Save transcript data
    WorkflowManager.saveTranscriptData(selectedCompany.company_id, transcriptData)
    
    // Update local state
    setSavedTranscripts(prev => [...prev, {
      ...transcriptData,
      timestamp: new Date().toISOString()
    }])
    
    // Update workflow step data
    WorkflowManager.updateStep(selectedCompany.company_id, 'call-transcripts', transcriptData)
    
    // Set success state
    setUploadSuccess(true)
    
    // Auto-navigate after a short delay
    setTimeout(() => {
      const url = `/admin/dashboard/advanced-analysis?company_id=${selectedCompany.company_id}&company_name=${encodeURIComponent(selectedCompany.company_name)}&account=${selectedCompany.company_id}&company=${encodeURIComponent(selectedCompany.company_name)}`
      window.location.href = url
    }, 2000)
  }, [selectedCompany])

  const handleNextStep = () => {
    if (!selectedCompany) return
    const url = `/admin/dashboard/advanced-analysis?company_id=${selectedCompany.company_id}&company_name=${encodeURIComponent(selectedCompany.company_name)}&account=${selectedCompany.company_id}&company=${encodeURIComponent(selectedCompany.company_name)}`
    window.location.href = url
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Progress Bar */}
      {selectedCompany && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Workflow Progress</h3>
            <span className="text-sm text-slate-400">Step 3 of 6</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-green-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Connect</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-green-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Extract Data</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center ring-4 ring-purple-500/30">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-slate-600"></div>
              </div>
              <p className="text-xs text-white font-medium mt-1">Transcripts</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 h-1 bg-slate-600"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Analysis</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 h-1 bg-slate-600"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Reports</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Audit Deck</p>
            </div>
          </div>
        </div>
      )}

      {/* Company Selector Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Call Transcripts</h2>
            <p className="text-slate-400">
              {selectedCompany 
                ? `Upload and analyze call transcripts for ${selectedCompany.company_name}`
                : 'Select a company to upload call transcripts'
              }
            </p>
            {savedTranscripts.length > 0 && (
              <p className="text-sm text-purple-400 mt-2">
                {savedTranscripts.length} transcript{savedTranscripts.length > 1 ? 's' : ''} uploaded
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <GlobalCompanySelector 
              onCompanySelect={handleCompanyChange}
              showWorkflowStage={true}
            />
            {selectedCompany && (
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-purple-400 font-medium">Transcript analysis complete!</p>
                <p className="text-purple-400/80 text-sm">Redirecting to financial analysis...</p>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>Continue Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Saved Transcripts */}
      {savedTranscripts.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Uploaded Transcripts</h3>
          <div className="space-y-3">
            {savedTranscripts.map((transcript, index) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {transcript.fileName || `Transcript ${index + 1}`}
                    </p>
                    <p className="text-sm text-slate-400">
                      Uploaded {new Date(transcript.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {transcript.sentiment && (
                      <span className={`px-2 py-1 text-xs rounded ${
                        transcript.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        transcript.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {transcript.sentiment}
                      </span>
                    )}
                    <span className="text-green-400 text-sm">✓ Analyzed</span>
                  </div>
                </div>
                {transcript.insights && transcript.insights.length > 0 && (
                  <div className="mt-3 text-sm text-slate-300">
                    <p className="font-medium text-purple-400 mb-1">Key Insights:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {transcript.insights.slice(0, 3).map((insight: string, i: number) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCompany ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <CallTranscriptsIntegration 
            defaultCompanyId={selectedCompany.company_id}
            defaultCompanyName={selectedCompany.company_name}
          />
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
          <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Company Selected</h3>
          <p className="text-slate-400 mb-6">
            Please select a company from the dropdown above or go back to the dashboard to choose one.
          </p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}

export default function CallTranscriptsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <CallTranscriptsContent />
    </Suspense>
  )
}