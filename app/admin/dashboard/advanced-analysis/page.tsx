'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import EliteAdvancedFinancialAnalyzer from '@/app/components/EliteAdvancedFinancialAnalyzer'
import GlobalCompanySelector from '@/app/components/GlobalCompanySelector'
import { WorkflowManager } from '@/lib/workflowManager'
import { Building2, ArrowRight, FileText, Brain, TrendingUp, Mic, BarChart3 } from 'lucide-react'

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

function AdvancedAnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  
  useEffect(() => {
    const companyId = searchParams?.get('company_id') || 
                      searchParams?.get('account') || 
                      searchParams?.get('companyId')
    const companyName = searchParams?.get('company_name') || 
                        searchParams?.get('company')
    
    if (companyId && companyName) {
      // Update workflow state
      WorkflowManager.updateStep(companyId, 'financial-analysis')
      
      setSelectedCompany({
        id: companyId,
        company_id: companyId,
        company_name: companyName,
        connection_status: 'active',
        workflow_stage: 'financial_analysis',
        has_financial_data: true,
        has_ai_analysis: false,
        transcript_count: 1
      })
    }
    
    setLoading(false)
  }, [searchParams])

  const handleCompanyChange = (company: Company | string) => {
    if (typeof company === 'string') return
    
    setSelectedCompany(company)
    WorkflowManager.updateStep(company.company_id, 'financial-analysis')
    
    const params = new URLSearchParams({
      company_id: company.company_id,
      company_name: company.company_name,
      account: company.company_id,
      company: company.company_name
    })
    router.push(`/admin/dashboard/advanced-analysis?${params.toString()}`)
  }

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true)
    
    if (selectedCompany) {
      // Auto-navigate after a short delay
      setTimeout(() => {
        const url = `/admin/dashboard/report-generation?company_id=${selectedCompany.company_id}&company_name=${encodeURIComponent(selectedCompany.company_name)}&account=${selectedCompany.company_id}&company=${encodeURIComponent(selectedCompany.company_name)}`
        window.location.href = url
      }, 2000)
    }
  }

  const handleNextStep = () => {
    if (!selectedCompany) return
    const url = `/admin/dashboard/report-generation?company_id=${selectedCompany.company_id}&company_name=${encodeURIComponent(selectedCompany.company_name)}&account=${selectedCompany.company_id}&company=${encodeURIComponent(selectedCompany.company_name)}`
    window.location.href = url
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
            <span className="text-sm text-slate-400">Step 4 of 6</span>
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
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-blue-500/30">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-1 bg-slate-600"></div>
              </div>
              <p className="text-xs text-white font-medium mt-1">Analysis</p>
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
            <h2 className="text-xl font-semibold text-white mb-2">Financial Analysis</h2>
            <p className="text-slate-400">
              {selectedCompany 
                ? `Analyzing financial data for ${selectedCompany.company_name}`
                : 'Select a company to analyze financial data'
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
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Generate Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {analysisComplete && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-blue-400 font-medium">Financial analysis complete!</p>
                <p className="text-blue-400/80 text-sm">Redirecting to report generation...</p>
              </div>
            </div>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Continue Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedCompany ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
          <EliteAdvancedFinancialAnalyzer 
            companyId={selectedCompany.company_id}
            companyName={selectedCompany.company_name}
          />
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Company Selected</h3>
          <p className="text-slate-400 mb-6">
            Please select a company from the dropdown above or go back to the dashboard to choose one.
          </p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
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
