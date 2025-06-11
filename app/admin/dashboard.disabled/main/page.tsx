'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, TrendingUp, Download, Eye, Plus, Search, Filter, Brain, Target, Building2, ChevronDown, Clock, DollarSign, TrendingDown, AlertTriangle, Users, BarChart3, MessageSquare } from 'lucide-react'

interface ConnectedCompany {
  id: string
  company_name: string
  realm_id: string
  connected_at: string
  last_sync: string
  revenue?: number
  net_income?: number
  status: 'active' | 'expired' | 'error'
}

interface FinancialSnapshot {
  revenue: number
  net_income: number
  gross_margin: number
  expenses: number
  cash_position: number
  assets: number
  liabilities: number
  last_updated: string
}

interface WorkflowProgress {
  stage: number
  total_stages: number
  current_step: string
  next_step: string
  transcript_count: number
}

export default function EnhancedDashboard() {
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectedCompany[]>([])
  const [selectedCompany, setSelectedCompany] = useState<ConnectedCompany | null>(null)
  const [financialData, setFinancialData] = useState<FinancialSnapshot | null>(null)
  const [workflowProgress, setWorkflowProgress] = useState<WorkflowProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch connected companies on component mount
  useEffect(() => {
    fetchConnectedCompanies()
  }, [])

  // Fetch financial data when company is selected
  useEffect(() => {
    if (selectedCompany) {
      fetchFinancialData(selectedCompany.realm_id)
      fetchWorkflowProgress(selectedCompany.id)
    }
  }, [selectedCompany])

  const fetchConnectedCompanies = async () => {
    try {
      setError(null)
      const response = await fetch('/api/companies')
      
      if (response.ok) {
        const data = await response.json()
        if (data.companies && data.companies.length > 0) {
          setConnectedCompanies(data.companies)
          // Auto-select first active company
          const firstActive = data.companies.find((c: ConnectedCompany) => c.status === 'active')
          setSelectedCompany(firstActive || data.companies[0])
        } else {
          setError('No connected QuickBooks companies found')
        }
      } else {
        throw new Error('Failed to fetch companies')
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setError('Failed to load companies')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFinancialData = async (realmId: string) => {
    try {
      setError(null)
      const response = await fetch(`/api/financial-snapshots?realm_id=${realmId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          const snapshot = data[0]
          setFinancialData({
            revenue: snapshot.revenue || 0,
            net_income: snapshot.net_income || 0,
            gross_margin: snapshot.revenue > 0 ? ((snapshot.revenue - (snapshot.expenses || 0)) / snapshot.revenue) * 100 : 0,
            expenses: snapshot.expenses || 0,
            cash_position: snapshot.assets || 0, // Using assets as cash position for now
            assets: snapshot.assets || 0,
            liabilities: snapshot.liabilities || 0,
            last_updated: snapshot.created_at || new Date().toISOString()
          })
        }
      } else if (response.status === 401) {
        setError('QuickBooks connection expired - please reconnect')
      } else {
        setError('Failed to load financial data')
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
      setError('Failed to load financial data')
    }
  }

  const fetchWorkflowProgress = async (companyId: string) => {
    try {
      const response = await fetch(`/api/workflow/progress?realm_id=${companyId}`)
      if (response.ok) {
        const data = await response.json()
        setWorkflowProgress(data)
      }
    } catch (error) {
      console.error('Error fetching workflow progress:', error)
    }
  }

  const handleCompanySelect = (company: ConnectedCompany) => {
    setSelectedCompany(company)
    setShowCompanyDropdown(false)
    setFinancialData(null)
    setWorkflowProgress(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'expired': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'error': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getWorkflowStageTitle = (stage: number) => {
    const stages = [
      'Initial Connection',
      'Discovery Call Complete',
      'Financial Analysis',
      'Audit Deck Preparation',
      'Audit Call Scheduled'
    ]
    return stages[stage - 1] || 'Unknown Stage'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading connected companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">QS</span>
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">QUICKSCOPE</h1>
                <p className="text-gray-300">Financial Discovery Dashboard</p>
              </div>
            </div>
            
            {/* Company Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="flex items-center space-x-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Building2 className="h-4 w-4" />
                <span>{selectedCompany ? selectedCompany.company_name : 'Select Company'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showCompanyDropdown && (
                <div className="absolute right-0 mt-2 w-80 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-lg z-10">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-300 uppercase tracking-wide px-3 py-2">
                      Connected Companies ({connectedCompanies.length})
                    </div>
                    {connectedCompanies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => handleCompanySelect(company)}
                        className={`w-full text-left px-3 py-3 rounded-lg hover:bg-white/10 transition-all ${
                          selectedCompany?.id === company.id ? 'bg-white/20 border border-white/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white">{company.company_name}</div>
                            <div className="text-sm text-gray-300">
                              Connected {new Date(company.connected_at).toLocaleDateString()}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(company.status)}`}>
                            {company.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCompany ? (
          <div className="space-y-8">
            {/* Company Overview */}
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedCompany.company_name}</h2>
                  <p className="text-sm text-gray-300">Realm ID: {selectedCompany.realm_id}</p>
                  {error && (
                    <p className="text-sm text-red-400 mt-1">⚠️ {error}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/admin/dashboard/advanced-analysis'}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Analysis
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/dashboard/audit-deck/generate'}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Audit Deck
                  </button>
                </div>
              </div>

              {/* Financial Snapshot */}
              {financialData ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-500/30 p-4 rounded-xl">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      <span className="ml-2 text-sm font-medium text-blue-300">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {formatCurrency(financialData.revenue)}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 p-4 rounded-xl">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <span className="ml-2 text-sm font-medium text-green-300">Net Income</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {formatCurrency(financialData.net_income)}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-purple-500/20 border border-purple-500/30 p-4 rounded-xl">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-purple-400" />
                      <span className="ml-2 text-sm font-medium text-purple-300">Gross Margin</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {financialData.gross_margin.toFixed(1)}%
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-500/30 p-4 rounded-xl">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                      <span className="ml-2 text-sm font-medium text-orange-300">Total Assets</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {formatCurrency(financialData.assets)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-xl text-center mb-6">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300">
                    {error ? 'Financial data unavailable' : 'Loading financial data...'}
                  </p>
                </div>
              )}

              {/* Workflow Progress */}
              {workflowProgress && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-white">Workflow Progress</h3>
                    <span className="text-sm text-gray-300">
                      Stage {workflowProgress.stage} of {workflowProgress.total_stages}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>{getWorkflowStageTitle(workflowProgress.stage)}</span>
                      <span>{Math.round((workflowProgress.stage / workflowProgress.total_stages) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(workflowProgress.stage / workflowProgress.total_stages) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Current Step:</p>
                      <p className="text-sm text-gray-300">{workflowProgress.current_step}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Next Step:</p>
                      <p className="text-sm text-gray-300">{workflowProgress.next_step}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">Transcripts:</p>
                      <p className="text-sm text-gray-300">{workflowProgress.transcript_count} uploaded</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upload Transcript */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-blue-500/20 border border-blue-500/30">
                    <Upload className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-white">Upload Transcript</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Upload discovery call transcripts to enhance financial analysis context.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/dashboard/call-transcripts'}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Discovery Call
                </button>
              </div>

              {/* Financial Analysis */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-purple-500/20 border border-purple-500/30">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-white">AI Analysis</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Generate comprehensive financial insights and recommendations.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/dashboard/advanced-analysis'}
                  disabled={!financialData}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Run Analysis
                </button>
              </div>

              {/* Audit Deck Generator */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-green-500/20 border border-green-500/30">
                    <FileText className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-white">Audit Deck</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Generate a professional audit deck for the client presentation.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/dashboard/audit-deck/generate'}
                  disabled={!financialData}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Deck
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Connected Companies</h3>
            <p className="text-gray-300 mb-4">
              {error || 'Connect your first prospect\'s QuickBooks account to get started.'}
            </p>
            <button
              onClick={() => window.location.href = '/admin/dashboard/connect'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg"
            >
              Connect QuickBooks Account
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
