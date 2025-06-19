'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect, useCallback } from 'react'
import { 
  Building2, TrendingUp, Brain, FileText, Download, RefreshCw, 
  DollarSign, BarChart3, AlertTriangle, CheckCircle, ArrowRight,
  Loader2
} from 'lucide-react'
import { toast } from 'react-toastify'
import GlobalCompanySelector from 'app/components/GlobalCompanySelector'

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

interface FinancialSummary {
  revenue: number
  expenses: number
  netIncome: number
  cashFlow: number
  profitMargin: number
  healthScore: number
}

function AdvancedAnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const companyId = searchParams.get('company_id') || ''
  const companyName = searchParams.get('company_name') || 'Selected Company'
  
  const [loading, setLoading] = useState(false)
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null)
  const [hasQuickBooksData, setHasQuickBooksData] = useState(false)
  const [hasTranscriptData, setHasTranscriptData] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // Handle company selection from the global selector
  const handleCompanySelect = useCallback((company: Company) => {
    // Update URL with selected company
    const params = new URLSearchParams({
      company_id: company.company_id,
      company_name: company.company_name
    })
    router.push(`/dashboard/advanced-analysis?${params.toString()}`)
  }, [router])

  useEffect(() => {
    if (companyId) {
      checkDataAvailability()
    }
  }, [companyId])

  const checkDataAvailability = async () => {
    try {
      // Check QuickBooks data
      const qbResponse = await fetch(`/api/financial-data/${companyId}`)
      setHasQuickBooksData(qbResponse.ok)
      
      if (qbResponse.ok) {
        const data = await qbResponse.json()
        setFinancialData({
          revenue: data.revenue || 0,
          expenses: data.expenses || 0,
          netIncome: data.net_income || 0,
          cashFlow: data.cash_flow || 0,
          profitMargin: data.profit_margin || 0,
          healthScore: 0 // Will be calculated by AI
        })
      }
      
      // Check transcript data
      const transcriptResponse = await fetch(`/api/call-transcripts?prospect_id=${companyId}`)
      const transcriptData = await transcriptResponse.json()
      setHasTranscriptData(transcriptData.transcripts && transcriptData.transcripts.length > 0)
    } catch (error) {
      console.error('Error checking data availability:', error)
    }
  }

  const runComprehensiveAnalysis = async () => {
    if (!companyId) {
      toast.error('Please select a company first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          includeTranscriptInsights: hasTranscriptData
        })
      })

      if (!response.ok) throw new Error('Analysis failed')
      
      const result = await response.json()
      
      // Update financial data with AI-enhanced insights
      if (result.analysis?.financialMetrics) {
        setFinancialData({
          ...financialData!,
          healthScore: result.analysis.company.healthScore || 85
        })
      }
      
      setAnalysisComplete(true)
      toast.success('Comprehensive financial analysis completed!')
      
    } catch (error) {
      toast.error('Failed to run analysis. Please ensure QuickBooks is connected.')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    if (!analysisComplete) {
      toast.warning('Please run the financial analysis first')
      return
    }

    try {
      // Navigate to report generation with analysis data
      const params = new URLSearchParams({
        company_id: companyId,
        company_name: companyName,
        analysis_complete: 'true'
      })
      window.location.href = `/dashboard/report-generation?${params.toString()}`
    } catch (error) {
      toast.error('Failed to proceed to report generation')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Advanced Financial Analysis</h1>
            <p className="text-slate-400">AI-powered financial health assessment and insights</p>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <div className="max-w-md mx-auto text-center">
              <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-4">Select a Company to Analyze</h2>
              <p className="text-slate-300 mb-6">Choose a connected company to run advanced financial analysis</p>
              
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
              <h1 className="text-2xl font-bold text-white">Financial Analysis</h1>
              <p className="text-slate-400 text-sm mt-1">
                Analyzing: <span className="text-white font-medium">{companyName}</span>
              </p>
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
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Data Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* QuickBooks Data */}
          <div className={`bg-white/5 backdrop-blur-xl rounded-xl border ${hasQuickBooksData ? 'border-green-500/30' : 'border-yellow-500/30'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">QuickBooks Data</h3>
              {hasQuickBooksData ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            {hasQuickBooksData && financialData ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="text-white font-medium">{formatCurrency(financialData.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Income:</span>
                  <span className="text-white font-medium">{formatCurrency(financialData.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profit Margin:</span>
                  <span className="text-white font-medium">{financialData.profitMargin}%</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No financial data synced</p>
            )}
          </div>

          {/* Transcript Data */}
          <div className={`bg-white/5 backdrop-blur-xl rounded-xl border ${hasTranscriptData ? 'border-green-500/30' : 'border-yellow-500/30'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Call Transcripts</h3>
              {hasTranscriptData ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {hasTranscriptData 
                ? 'Call transcript insights available for analysis' 
                : 'No call transcripts uploaded yet'}
            </p>
          </div>

          {/* AI Analysis Status */}
          <div className={`bg-white/5 backdrop-blur-xl rounded-xl border ${analysisComplete ? 'border-green-500/30' : 'border-slate-700'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
              {analysisComplete ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <Brain className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {analysisComplete 
                ? 'Comprehensive analysis complete' 
                : 'Ready to analyze financial health'}
            </p>
          </div>
        </div>

        {/* Main Action Area */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {analysisComplete ? 'Analysis Complete!' : 'Ready to Analyze'}
            </h2>
            
            {!analysisComplete ? (
              <>
                <p className="text-slate-300 mb-6">
                  Our AI will analyze your QuickBooks financial data
                  {hasTranscriptData && ' combined with call transcript insights'}
                  {' to provide comprehensive financial health assessment and recommendations.'}
                </p>
                
                <button
                  onClick={runComprehensiveAnalysis}
                  disabled={loading || !hasQuickBooksData}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Run Financial Analysis</span>
                    </>
                  )}
                </button>
                
                {!hasQuickBooksData && (
                  <p className="text-yellow-400 text-sm mt-4">
                    Please sync QuickBooks data first to enable analysis
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-slate-300 mb-6">
                  Your financial analysis is complete! You can now generate detailed reports
                  and audit decks based on the comprehensive insights.
                </p>
                
                {financialData && (
                  <div className="bg-white/5 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="text-3xl font-bold text-white mb-2">
                      Health Score: {financialData.healthScore}/100
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                        style={{ width: `${financialData.healthScore}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={generateReport}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Generate Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        company_id: companyId,
                        company_name: companyName,
                        analysis_complete: 'true'
                      })
                      window.location.href = `/dashboard/report-generation?${params.toString()}&deck=true`
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all duration-200"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Generate Audit Deck</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            <strong>Workflow:</strong> Sync QuickBooks Data → Upload Call Transcripts (optional) → 
            Run AI Analysis → Generate Reports & Audit Decks
          </p>
        </div>
      </div>
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
