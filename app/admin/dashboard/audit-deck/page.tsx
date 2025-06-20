'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import IntelligentAuditDeckGenerator from 'app/components/IntelligentAuditDeckGenerator'
import GlobalCompanySelector from 'app/components/GlobalCompanySelector'
import { WorkflowManager } from 'lib/workflowManager'
import { Building2, ArrowRight, FileText, Brain, TrendingUp, Mic, CheckCircle, Download } from 'lucide-react'

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

function AuditDeckContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [deckGenerated, setDeckGenerated] = useState(false)
  
  useEffect(() => {
    const companyId = searchParams?.get('company_id') || 
                      searchParams?.get('account') || 
                      searchParams?.get('companyId')
    const companyName = searchParams?.get('company_name') || 
                        searchParams?.get('company')
    const prospectId = searchParams?.get('prospect_id') || 
                       searchParams?.get('prospectId')
    
    if (companyId && companyName) {
      // Update workflow state - this is the final step
      WorkflowManager.updateStep(companyId, 'audit-deck')
      
      setSelectedCompany({
        id: prospectId || companyId,
        company_id: companyId,
        company_name: companyName,
        connection_status: 'active',
        workflow_stage: 'audit_deck',
        has_financial_data: true,
        has_ai_analysis: true,
        transcript_count: 1
      })
    }
    
    setLoading(false)
  }, [searchParams])

  const handleCompanyChange = (company: Company | string) => {
    if (typeof company === 'string') return
    
    setSelectedCompany(company)
    WorkflowManager.updateStep(company.company_id, 'audit-deck')
    
    const params = new URLSearchParams({
      company_id: company.company_id,
      company_name: company.company_name,
      account: company.company_id,
      company: company.company_name,
      prospect_id: company.id
    })
    router.push(`/admin/dashboard/audit-deck?${params.toString()}`)
  }

  const handleDeckGenerated = (deck: any) => {
    setDeckGenerated(true)
    
    if (selectedCompany) {
      WorkflowManager.updateStep(selectedCompany.company_id, 'audit-deck', deck)
    }
  }

  const handleStartNewWorkflow = () => {
    router.push('/admin/dashboard')
  }

  const handleViewAllDecks = () => {
    router.push('/admin/audit-deck')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Progress Bar - Complete! */}
      {selectedCompany && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Workflow Complete!</h3>
            <span className="text-sm text-slate-400">Step 6 of 6</span>
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
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-green-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Transcripts</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-green-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Analysis</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-green-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Reports</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center ring-4 ring-emerald-500/30">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xs text-white font-medium mt-1">Audit Deck</p>
            </div>
          </div>
        </div>
      )}

      {/* Company Selector Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Audit Deck Creation</h2>
            <p className="text-slate-400">
              {selectedCompany 
                ? `Generating comprehensive audit deck for ${selectedCompany.company_name}`
                : 'Select a company to create an audit deck'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <GlobalCompanySelector 
              onCompanySelect={handleCompanyChange}
              showWorkflowStage={true}
            />
            {selectedCompany && (
              <button
                onClick={handleStartNewWorkflow}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <span>Start New Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {deckGenerated && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-emerald-400 font-semibold text-lg">Audit deck created successfully!</p>
                <p className="text-emerald-400/80">Your comprehensive financial audit presentation is ready.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleViewAllDecks}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                View All Decks
              </button>
              <button
                onClick={handleStartNewWorkflow}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <span>New Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCompany ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <IntelligentAuditDeckGenerator 
            prospectId={selectedCompany.id}
            companyId={selectedCompany.company_id}
            companyName={selectedCompany.company_name}
            onDeckGenerated={handleDeckGenerated}
          />
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Company Selected</h3>
          <p className="text-slate-400 mb-6">
            Please select a company from the dropdown above or go back to the dashboard to choose one.
          </p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Workflow Summary */}
      {selectedCompany && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Workflow Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Financial Data</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white font-medium">Extracted</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Call Transcripts</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white font-medium">Analyzed</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">AI Analysis</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-white font-medium">Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-slate-300">Loading audit deck generator...</p>
      </div>
    </div>
  )
}

export default function AuditDeckPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuditDeckContent />
    </Suspense>
  )
}