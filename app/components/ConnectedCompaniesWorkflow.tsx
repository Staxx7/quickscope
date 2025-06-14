'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ConnectedCompaniesWorkflow({ companies }: Props) {
  const router = useRouter()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  const handleCompanyAction = (company: Company, action: string) => {
    const params = new URLSearchParams({
      account: company.company_id,
      company: company.company_name
    })

    switch (action) {
      case 'sync':
        router.push(`/admin/dashboard/data-extraction?${params.toString()}`)
        break
      case 'transcript':
        router.push(`/admin/dashboard/call-transcripts?${params.toString()}`)
        break
      case 'analysis':
        router.push(`/admin/dashboard/advanced-analysis?${params.toString()}`)
        break
      case 'report':
        router.push(`/admin/dashboard/report-generation?${params.toString()}`)
        break
      case 'prospect':
        router.push(`/admin/prospects/create?company_id=${company.company_id}&company_name=${encodeURIComponent(company.company_name)}`)
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Connected QuickBooks Companies</h1>
            <p className="text-slate-400">Manage and analyze your connected QuickBooks accounts</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Connected</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">With Contacts</p>
              <p className="text-2xl font-bold text-white">{stats.withProspects}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">With Financials</p>
              <p className="text-2xl font-bold text-white">{stats.withFinancials}</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">AI Analyzed</p>
              <p className="text-2xl font-bold text-white">{stats.withAnalysis}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
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

      {/* Next Steps */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
        <div className="space-y-2">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between">
              <span className="text-slate-300">
                <span className="font-medium text-white">{company.company_name}:</span> {company.next_action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}