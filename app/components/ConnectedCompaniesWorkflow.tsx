'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, FileText, Brain, Users, DollarSign, Clock, TrendingUp } from 'lucide-react'

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
    // Use prospect_id as account parameter if company_id is null
    const accountId = company.company_id || company.prospect_id || company.id
    
    const params = new URLSearchParams({
      account: accountId,
      company: company.company_name
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
    const stages: Record<string, { label: string; color: string }> = {
      'needs_prospect_info': { label: 'Needs Contact Info', color: 'bg-yellow-500' },
      'needs_transcript': { label: 'Needs Transcript', color: 'bg-orange-500' },
      'needs_analysis': { label: 'Needs Analysis', color: 'bg-purple-500' },
      'ready_for_report': { label: 'Ready for Report', color: 'bg-green-500' }
    }
    return stages[stage] || { label: stage, color: 'bg-gray-500' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Connected QuickBooks Companies</h1>
            <p className="text-slate-400">Manage and analyze your connected QuickBooks accounts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefreshCompanyNames}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Fetch company names from QuickBooks for connections showing company IDs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Company Names</span>
            </button>
            <button
              onClick={handleRefreshAndSync}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh & Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Consolidated Dashboard Cards - Now 5 cards with better sizing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
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

      {/* Companies List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Connected Companies</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-slate-300 font-medium">Company</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Contact</th>
                <th className="text-left p-4 text-slate-300 font-medium">Financial Summary</th>
                <th className="text-left p-4 text-slate-300 font-medium">AI Analysis</th>
                <th className="text-left p-4 text-slate-300 font-medium">Workflow Stage</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const stageInfo = getWorkflowStageDisplay(company.workflow_stage)
                
                return (
                  <tr key={company.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-white">{company.company_name}</p>
                        <p className="text-sm text-slate-400">ID: {company.company_id}</p>
                        <p className="text-xs text-slate-500">Connected {company.days_connected} days ago</p>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {company.connection_status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${company.connection_status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                          {company.connection_status}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {company.has_prospect_record ? (
                        <div>
                          <p className="text-sm text-white">{company.contact_name}</p>
                          <p className="text-xs text-slate-400">{company.email}</p>
                        </div>
                      ) : (
                        <span className="text-yellow-400 text-sm">No contact info</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {company.has_financial_data ? (
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300">
                            Revenue: <span className="text-white font-medium">{formatCurrency(company.financial_summary?.revenue || 0)}</span>
                          </p>
                          <p className="text-sm text-slate-300">
                            Profit: <span className={`font-medium ${(company.financial_summary?.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(company.financial_summary?.profit || 0)}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">No financial data</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {company.has_ai_analysis ? (
                        <div className="space-y-1">
                          <p className="text-sm text-slate-300">
                            Closeability: <span className="text-white font-medium">{company.ai_analysis?.closeability_score}/100</span>
                          </p>
                          <p className="text-sm text-slate-300">
                            Health: <span className="text-white font-medium">{company.ai_analysis?.financial_health_score}/100</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Not analyzed</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs text-white ${stageInfo.color}`}>
                        {stageInfo.label}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {!company.has_prospect_record && (
                          <button
                            onClick={() => handleCompanyAction(company, 'prospect')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                          >
                            Add Contact
                          </button>
                        )}
                        
                        {company.has_prospect_record && !company.has_financial_data && (
                          <button
                            onClick={() => handleCompanyAction(company, 'sync')}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Sync Data
                          </button>
                        )}
                        
                        {company.has_prospect_record && company.transcript_count === 0 && (
                          <button
                            onClick={() => handleCompanyAction(company, 'transcript')}
                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                          >
                            Upload Call
                          </button>
                        )}
                        
                        {company.has_financial_data && !company.has_ai_analysis && (
                          <button
                            onClick={() => handleCompanyAction(company, 'analysis')}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                          >
                            Run Analysis
                          </button>
                        )}
                        
                        {company.workflow_stage === 'ready_for_report' && (
                          <button
                            onClick={() => handleCompanyAction(company, 'report')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            Generate Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}