'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, FileText, Brain, Users, DollarSign, Clock, TrendingUp, ChevronRight, Building2 } from 'lucide-react'

interface Company {
  id: string
  company_id: string
  company_name: string
  connection_status: string
  connected_at: string
  expires_at: string
  days_connected: number
  prospect_id: string | null
  contact_name: string | null
  email: string
  phone: string | null
  industry: string
  user_type: string
  workflow_stage: string
  has_prospect_record: boolean
  has_financial_data: boolean
  has_ai_analysis: boolean
  transcript_count: number
  financial_summary: {
    revenue: number
    expenses: number
    profit: number
    profit_margin: number
  } | null
  ai_analysis: {
    closeability_score: number
    financial_health_score: number
    key_insights: any[]
    analysis_date: string
  } | null
  next_action: string
}

interface Props {
  companies: Company[]
}

export default function ConnectedCompaniesWorkflow({ companies: initialCompanies }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null)

  // Check for refresh parameter and success message
  useEffect(() => {
    const refreshParam = searchParams?.get('refresh')
    const successParam = searchParams?.get('success')
    
    if (refreshParam || successParam === 'contact_added') {
      // Force refresh the page data
      fetchLatestData()
      
      // Show success message if contact was just added
      if (successParam === 'contact_added') {
        setShowSuccessMessage(true)
        // Hide message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 5000)
      }
    }
  }, [searchParams])

  const fetchLatestData = async () => {
    try {
      const response = await fetch('/api/admin/connected-companies')
      const data = await response.json()
      if (data.success && data.companies) {
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Error fetching updated data:', error)
    }
  }

  const handleRefreshAndSync = async () => {
    setIsRefreshing(true)
    try {
      // First fetch latest data
      await fetchLatestData()
      // Then trigger any sync operations (could add sync API call here)
      setTimeout(() => {
        setIsRefreshing(false)
      }, 1000)
    } catch (error) {
      console.error('Error refreshing:', error)
      setIsRefreshing(false)
    }
  }

  const handleRefreshCompanyNames = async () => {
    try {
      const response = await fetch('/api/admin/refresh-company-names', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Show success message
        alert(`Company names refreshed!\n\nUpdated: ${result.summary.updated}\nSkipped: ${result.summary.skipped}\nFailed: ${result.summary.failed}`)
        
        // Refresh the display
        await fetchLatestData()
      } else {
        alert(`Failed to refresh company names: ${result.error}`)
      }
    } catch (error) {
      console.error('Error refreshing company names:', error)
      alert('Failed to refresh company names')
    }
  }

  const handleCompanyAction = (company: Company, action: string) => {
    // Store selected company in session storage for context
    sessionStorage.setItem('selectedCompany', JSON.stringify({
      id: company.company_id || company.prospect_id || company.id,
      name: company.company_name
    }))
    
    // Use prospect_id as account parameter if company_id is null
    const accountId = company.company_id || company.prospect_id || company.id
    
    const params = new URLSearchParams({
      company_id: accountId,
      company_name: company.company_name
    })

    switch (action) {
      case 'sync':
        router.push(`/dashboard/data-extraction?${params.toString()}`)
        break
      case 'transcript':
        router.push(`/dashboard/call-transcripts?${params.toString()}`)
        break
      case 'analysis':
        router.push(`/dashboard/advanced-analysis?${params.toString()}`)
        break
      case 'report':
        router.push(`/dashboard/report-generation?${params.toString()}`)
        break
      case 'prospect':
        router.push(`/admin/prospects/create?company_id=${accountId}&company_name=${encodeURIComponent(company.company_name)}`)
        break
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getWorkflowStageDisplay = (stage: string) => {
    const stages: Record<string, { label: string; color: string; bgColor: string }> = {
      'needs_prospect_info': { label: 'Needs Contact Info', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
      'needs_transcript': { label: 'Needs Transcript', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
      'needs_analysis': { label: 'Needs Analysis', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
      'ready_for_report': { label: 'Ready for Report', color: 'text-green-400', bgColor: 'bg-green-500/20' }
    }
    return stages[stage] || { label: stage, color: 'text-gray-400', bgColor: 'bg-gray-500/20' }
  }

  // Calculate stats
  const stats = {
    total: companies.length,
    withProspects: companies.filter(c => c.has_prospect_record).length,
    withFinancials: companies.filter(c => c.has_financial_data).length,
    withAnalysis: companies.filter(c => c.has_ai_analysis).length,
    totalRevenue: companies.reduce((sum, c) => sum + (c.financial_summary?.revenue || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white font-medium">Contact Information Added Successfully!</p>
              <p className="text-green-300 text-sm">The workflow stage has been updated.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Account Workflow</h1>
          <p className="text-slate-400 mt-1">Manage your connected QuickBooks accounts through the workflow</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefreshCompanyNames}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            title="Fetch company names from QuickBooks for connections showing company IDs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Names</span>
          </button>
          <button
            onClick={handleRefreshAndSync}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Workflow Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Connected */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
          <p className="text-slate-400 text-sm mt-1">Total Connected</p>
        </div>

        {/* Need Contact Info */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-7 h-7 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {companies.filter(c => c.workflow_stage === 'needs_prospect_info').length}
          </p>
          <p className="text-sm text-slate-300 mt-1">Need Contact</p>
        </div>

        {/* Need Transcripts */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-7 h-7 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {companies.filter(c => c.workflow_stage === 'needs_transcript').length}
          </p>
          <p className="text-sm text-slate-300 mt-1">Need Transcript</p>
        </div>

        {/* Need Analysis */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Brain className="w-7 h-7 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {companies.filter(c => c.workflow_stage === 'needs_analysis').length}
          </p>
          <p className="text-sm text-slate-300 mt-1">Need Analysis</p>
        </div>

        {/* Ready for Reports */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-7 h-7 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {companies.filter(c => c.workflow_stage === 'ready_for_report').length}
          </p>
          <p className="text-sm text-slate-300 mt-1">Ready for Report</p>
        </div>
      </div>

      {/* Companies List - Enhanced Card View */}
      <div className="space-y-4">
        {companies.map((company) => {
          const stageInfo = getWorkflowStageDisplay(company.workflow_stage)
          const isExpanded = expandedCompany === company.id
          
          return (
            <div
              key={company.id}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-200"
            >
              {/* Company Header */}
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedCompany(isExpanded ? null : company.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{company.company_name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-400">ID: {company.company_id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs ${stageInfo.color} ${stageInfo.bgColor}`}>
                          {stageInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-white/10 p-6 space-y-6">
                  {/* Company Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Contact Information</h4>
                      {company.has_prospect_record ? (
                        <div className="space-y-2">
                          <p className="text-white">{company.contact_name || 'No name'}</p>
                          <p className="text-sm text-slate-300">{company.email}</p>
                          {company.phone && <p className="text-sm text-slate-300">{company.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-yellow-400">No contact information</p>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Financial Summary</h4>
                      {company.has_financial_data ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            Revenue: <span className="text-white font-medium">{formatCurrency(company.financial_summary?.revenue || 0)}</span>
                          </p>
                          <p className="text-sm">
                            Profit: <span className={`font-medium ${(company.financial_summary?.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(company.financial_summary?.profit || 0)}
                            </span>
                          </p>
                          <p className="text-sm">
                            Margin: <span className="text-white font-medium">{company.financial_summary?.profit_margin || 0}%</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500">No financial data synced</p>
                      )}
                    </div>

                    {/* AI Analysis */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-3">AI Analysis</h4>
                      {company.has_ai_analysis ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            Closeability: <span className="text-white font-medium">{company.ai_analysis?.closeability_score}/100</span>
                          </p>
                          <p className="text-sm">
                            Health Score: <span className="text-white font-medium">{company.ai_analysis?.financial_health_score}/100</span>
                          </p>
                          <p className="text-sm text-slate-400">
                            Analyzed: {new Date(company.ai_analysis?.analysis_date || '').toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-500">Not analyzed yet</p>
                      )}
                    </div>
                  </div>

                  {/* Workflow Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Workflow Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      {!company.has_prospect_record && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompanyAction(company, 'prospect')
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          <span>Add Contact Info</span>
                        </button>
                      )}
                      
                      {company.has_prospect_record && !company.has_financial_data && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompanyAction(company, 'sync')
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Sync Financial Data</span>
                        </button>
                      )}
                      
                      {company.has_prospect_record && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompanyAction(company, 'transcript')
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Upload Call Transcript</span>
                        </button>
                      )}
                      
                      {company.has_financial_data && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompanyAction(company, 'analysis')
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <Brain className="w-4 h-4" />
                          <span>Run AI Analysis</span>
                        </button>
                      )}
                      
                      {company.workflow_stage === 'ready_for_report' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCompanyAction(company, 'report')
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Generate Report</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-white/10">
                    <span>Connected {company.days_connected} days ago</span>
                    <div className="flex items-center space-x-4">
                      {company.transcript_count > 0 && (
                        <span>{company.transcript_count} transcript{company.transcript_count > 1 ? 's' : ''}</span>
                      )}
                      <span className={`flex items-center space-x-1 ${company.connection_status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {company.connection_status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>{company.connection_status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No connected companies found</p>
          <button
            onClick={() => router.push('/connect')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Connect QuickBooks
          </button>
        </div>
      )}
    </div>
  )
}