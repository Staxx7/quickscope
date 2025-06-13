'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Star, Clock, AlertTriangle, TrendingUp, MessageSquare, Eye, Zap, Target, Users, Phone, Calendar, Search, Filter, RefreshCw, BarChart3, DollarSign, CheckCircle, ArrowRight } from 'lucide-react'

interface FinancialSummary {
  revenue: number
  expenses: number
  profit: number
  profit_margin: number
  cash_flow: number
}

interface AIAnalysisSummary {
  id: string
  closeability_score: number
  urgency_level: 'high' | 'medium' | 'low'
  analysis_status: 'completed' | 'processing' | 'pending'
  key_insights: string[]
  talking_points: string[]
  pain_points: string[]
  last_analyzed: string
  has_transcript_data: boolean
  financial_health_score?: number
}

interface Prospect {
  id: string
  company_id: string
  company_name: string
  email: string
  phone: string
  status: string
  connection_date: string
  connection_status: 'active' | 'expired'
  workflow_stage: string
  next_action: string
  financial_summary: FinancialSummary | null
  days_connected: number
  notes: string
  legalName?: string
  industry?: string
  foundedDate?: string
  employeeCount?: string
  recentActivity?: Array<{
    description: string
    date: string
  }>
  ai_analysis?: AIAnalysisSummary
}

interface ProspectsResponse {
  prospects: Prospect[]
  total: number
  connected: number
  expired: number
  error?: string
}

interface PredictiveAnalytics {
  total_pipeline_value: number;
  high_probability_deals: number;
  urgent_follow_ups: number;
  average_closeability: number;
}

export default function AIEnhancedAccountWorkflowDashboard() {
  const router = useRouter()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAIStatus, setFilterAIStatus] = useState<string>('all')
  const [stats, setStats] = useState({ 
    total: 0, 
    connected: 0, 
    expired: 0,
    aiAnalyzed: 0,
    highValue: 0,
    urgentFollowUp: 0
  })
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAIInsightsModal, setShowAIInsightsModal] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncingProspectId, setSyncingProspectId] = useState<string | null>(null)
  const [runningAIAnalysis, setRunningAIAnalysis] = useState<string | null>(null)
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null)

  const fetchProspects = async () => {
    try {
      setLoading(true)
      
      // Try the AI-enhanced endpoint first
      let response = await fetch('/api/admin/prospects-with-ai')
      
      if (!response.ok) {
        // Fallback to the standard prospects endpoint I created
        response = await fetch('/api/admin/prospects')
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch prospects')
      }

      const data: ProspectsResponse = await response.json()
      
      // Rest of your existing logic...
      setProspects(data.prospects)
      
      // Calculate AI-enhanced stats (your existing logic is perfect)
      const aiAnalyzed = data.prospects.filter(p => p.ai_analysis?.analysis_status === 'completed').length
      const highValue = data.prospects.filter(p => p.ai_analysis && p.ai_analysis.closeability_score >= 80).length
      const urgentFollowUp = data.prospects.filter(p => p.ai_analysis?.urgency_level === 'high').length
      
      setStats({
        total: data.total,
        connected: data.connected,
        expired: data.expired,
        aiAnalyzed,
        highValue,
        urgentFollowUp
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProspects()
  }, [])

  useEffect(() => {
    fetch('/api/admin/prospects-with-ai')
      .then(res => res.json())
      .then(data => {
        setPredictiveAnalytics(data.predictive_analytics);
      });
  }, []);

  const runAIAnalysis = async (prospectId: string, companyId: string) => {
    try {
      setRunningAIAnalysis(prospectId)
      
      const response = await fetch('/api/ai/analyze-prospect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId,
          companyId,
          analysisType: 'comprehensive'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('AI analysis completed:', result)
        
        // Refresh prospects to show updated AI data
        setTimeout(() => {
          fetchProspects()
        }, 1000)
      } else {
        throw new Error('AI analysis failed')
      }
    } catch (error) {
      console.error('Error running AI analysis:', error)
    } finally {
      setRunningAIAnalysis(null)
    }
  }

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || prospect.connection_status === filterStatus
    
    const matchesAIStatus = filterAIStatus === 'all' || 
      (filterAIStatus === 'analyzed' && prospect.ai_analysis?.analysis_status === 'completed') ||
      (filterAIStatus === 'high-value' && prospect.ai_analysis && prospect.ai_analysis.closeability_score >= 80) ||
      (filterAIStatus === 'urgent' && prospect.ai_analysis?.urgency_level === 'high') ||
      (filterAIStatus === 'pending' && (!prospect.ai_analysis || prospect.ai_analysis.analysis_status !== 'completed'))

    return matchesSearch && matchesStatus && matchesAIStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'expired': return 'bg-red-500'
      case 'syncing': return 'bg-amber-500'
      default: return 'bg-slate-500'
    }
  }

  const getWorkflowStageIcon = (stage: string) => {
    switch (stage) {
      case 'connected': return '🔗'
      case 'data_extracted': return '📊'
      case 'transcript_uploaded': return '🎵'
      case 'analysis_complete': return '🔍'
      case 'report_generated': return '📋'
      default: return '⏳'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getCloseabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleViewDetails = async (prospect: Prospect) => {
    try {
      const response = await fetch(`/api/qbo/company-details/${prospect.company_id}`)
      if (response.ok) {
        const additionalDetails = await response.json()
        setSelectedProspect({ ...prospect, ...additionalDetails })
      } else {
        setSelectedProspect(prospect)
      }
    } catch (error) {
      console.error('Error fetching additional details:', error)
      setSelectedProspect(prospect)
    }
    setShowDetailsModal(true)
  }

  const handleViewAIInsights = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setShowAIInsightsModal(true)
  }

  const handleUploadTranscript = (prospect: Prospect) => {
    router.push(`/admin/dashboard/call-transcripts?account=${prospect.company_id}&company=${encodeURIComponent(prospect.company_name)}`)
  }

  const handleGenerateReport = (prospect: Prospect) => {
    router.push(`/admin/dashboard/report-generation?account=${prospect.company_id}&company=${encodeURIComponent(prospect.company_name)}&prospectId=${prospect.id}`)
  }

  const handleDataExtraction = (prospect: Prospect) => {
    router.push(`/admin/dashboard/data-extraction?account=${prospect.company_id}&company=${encodeURIComponent(prospect.company_name)}`)
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    router.push(`/admin/dashboard/advanced-analysis?account=${prospect.company_id}&company=${encodeURIComponent(prospect.company_name)}`)
  }

  const triggerSync = async (prospectId: string) => {
    try {
      setSyncingProspectId(prospectId)
      
      const response = await fetch(`/api/qbo/sync/${prospectId}`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Sync successful:', result.message)
        
        setTimeout(() => {
          fetchProspects()
        }, 1000)
      } else {
        throw new Error('Sync failed')
      }
    } catch (error) {
      console.error('Error triggering sync:', error)
    } finally {
      setSyncingProspectId(null)
    }
  }

  const handleSyncAll = async () => {
    try {
      setIsSyncing(true)
      
      const response = await fetch('/api/qbo/sync', {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Sync all successful:', result.message)
        
        setTimeout(() => {
          fetchProspects()
        }, 1000)
      } else {
        throw new Error('Sync all failed')
      }
    } catch (error) {
      console.error('Error syncing all:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
        <div className="text-center text-red-400">
          <h2 className="text-xl font-semibold mb-2">Error Loading Prospects</h2>
          <p>{error}</p>
          <button 
            onClick={fetchProspects}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-cyan-400" />
              AI-Enhanced Account Workflow
            </h1>
            <p className="text-slate-400">Intelligent prospect management with AI-powered insights and sales intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-3 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">Total Prospects</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">Active</p>
              <p className="text-xl font-bold text-emerald-400">{stats.connected}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">AI Analyzed</p>
              <p className="text-xl font-bold text-purple-400">{stats.aiAnalyzed}</p>
            </div>
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">High Value</p>
              <p className="text-xl font-bold text-green-400">{stats.highValue}</p>
            </div>
            <Star className="w-6 h-6 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">Urgent</p>
              <p className="text-xl font-bold text-red-400">{stats.urgentFollowUp}</p>
            </div>
            <Clock className="w-6 h-6 text-red-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs">Expired</p>
              <p className="text-xl font-bold text-red-400">{stats.expired}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search prospects, companies, emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Connections</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterAIStatus}
            onChange={(e) => setFilterAIStatus(e.target.value)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All AI Status</option>
            <option value="analyzed">AI Analyzed</option>
            <option value="high-value">High Value (80+)</option>
            <option value="urgent">Urgent Follow-up</option>
            <option value="pending">Pending Analysis</option>
          </select>
          <button
            onClick={fetchProspects}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
          </button>
        </div>
      </div>

      {/* Enhanced Prospects Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">AI Intelligence</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status & Stage</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Financial Summary</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Connected</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium flex items-center">
                        {prospect.company_name}
                        {prospect.ai_analysis?.has_transcript_data && (
                          <span title="Has call transcript data">
                            <MessageSquare className="w-4 h-4 ml-2 text-purple-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm">{prospect.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {prospect.ai_analysis ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Star className={`w-4 h-4 ${getCloseabilityColor(prospect.ai_analysis.closeability_score)}`} />
                            <span className={`font-medium ${getCloseabilityColor(prospect.ai_analysis.closeability_score)}`}>
                              {prospect.ai_analysis.closeability_score}/100
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getUrgencyColor(prospect.ai_analysis.urgency_level)}`}>
                              {prospect.ai_analysis.urgency_level.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-slate-400">
                              Last analyzed {new Date(prospect.ai_analysis.last_analyzed).toLocaleDateString()}
                            </span>
                          </div>
                          {prospect.ai_analysis.talking_points.length > 0 && (
                            <button
                              onClick={() => handleViewAIInsights(prospect)}
                              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Insights</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-slate-500">No AI analysis</span>
                          <button
                            onClick={() => runAIAnalysis(prospect.id, prospect.company_id)}
                            disabled={runningAIAnalysis === prospect.id}
                            className="text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50"
                          >
                            {runningAIAnalysis === prospect.id ? 'Analyzing...' : 'Run AI Analysis'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(prospect.connection_status)}`}>
                        {prospect.connection_status}
                      </span>
                      <div className="flex items-center">
                        <span className="mr-2">{getWorkflowStageIcon(prospect.workflow_stage)}</span>
                        <span className="text-white text-sm">{prospect.workflow_stage.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {prospect.financial_summary ? (
                      <div className="text-sm">
                        <div className="text-white">Revenue: {formatCurrency(prospect.financial_summary.revenue)}</div>
                        <div className="text-slate-400">Profit: {formatCurrency(prospect.financial_summary.profit)}</div>
                        {prospect.ai_analysis?.financial_health_score && (
                          <div className="text-purple-400 flex items-center space-x-1">
                            <BarChart3 className="w-3 h-3" />
                            <span>Health: {prospect.ai_analysis.financial_health_score}/100</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{prospect.days_connected} days ago</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleViewDetails(prospect)}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDataExtraction(prospect)}
                        className="px-2 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition-colors"
                      >
                        Extract
                      </button>
                      <button
                        onClick={() => handleUploadTranscript(prospect)}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                      >
                        Transcript
                      </button>
                      <button
                        onClick={() => handleGenerateReport(prospect)}
                        className={`px-2 py-1 text-white text-xs rounded transition-colors ${
                          prospect.ai_analysis ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {prospect.ai_analysis ? 'AI Report' : 'Report'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No prospects found matching your criteria.</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      {showAIInsightsModal && selectedProspect?.ai_analysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-400" />
                AI Insights - {selectedProspect.company_name}
              </h3>
              <button
                onClick={() => setShowAIInsightsModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Scores */}
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  AI Assessment Scores
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Closeability Score</span>
                    <span className={`text-2xl font-bold ${getCloseabilityColor(selectedProspect.ai_analysis.closeability_score)}`}>
                      {selectedProspect.ai_analysis.closeability_score}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Urgency Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(selectedProspect.ai_analysis.urgency_level)}`}>
                      {selectedProspect.ai_analysis.urgency_level.toUpperCase()}
                    </span>
                  </div>
                  {selectedProspect.ai_analysis.financial_health_score && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Financial Health</span>
                      <span className="text-2xl font-bold text-green-400">
                        {selectedProspect.ai_analysis.financial_health_score}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Key Business Insights
                </h4>
                <ul className="space-y-2">
                  {selectedProspect.ai_analysis.key_insights.map((insight, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start">
                      <ArrowRight className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talking Points */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                  AI-Generated Talking Points
                </h4>
                <ul className="space-y-2">
                  {selectedProspect.ai_analysis.talking_points.map((point, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start">
                      <Target className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pain Points */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Identified Pain Points
                </h4>
                <ul className="space-y-2">
                  {selectedProspect.ai_analysis.pain_points.map((pain, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  handleGenerateReport(selectedProspect)
                  setShowAIInsightsModal(false)
                }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Generate AI Audit Deck</span>
              </button>
              <button
                onClick={() => {
                  handleUploadTranscript(selectedProspect)
                  setShowAIInsightsModal(false)
                }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Call Transcript</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Details Modal */}
      {showDetailsModal && selectedProspect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{selectedProspect.company_name} - Complete Profile</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <h4 className="text-lg font-semibold text-white mb-3">Company Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedProspect.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white">{selectedProspect.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Connected</p>
                      <p className="text-white">{new Date(selectedProspect.connection_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(selectedProspect.connection_status)}`}>
                        {selectedProspect.connection_status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                {selectedProspect.financial_summary && (
                  <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                    <h4 className="text-lg font-semibold text-white mb-3">Financial Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 text-sm">Revenue</p>
                        <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Profit</p>
                        <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.profit)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Expenses</p>
                        <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.expenses)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Profit Margin</p>
                        <p className="text-white text-lg font-semibold">{selectedProspect.financial_summary.profit_margin.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Analysis Section */}
              <div className="space-y-6">
                {selectedProspect.ai_analysis ? (
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-400" />
                      AI Intelligence Summary
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getCloseabilityColor(selectedProspect.ai_analysis.closeability_score)}`}>
                            {selectedProspect.ai_analysis.closeability_score}/100
                          </div>
                          <div className="text-slate-400 text-sm">Closeability Score</div>
                        </div>
                        <div className="text-center">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(selectedProspect.ai_analysis.urgency_level)} inline-block`}>
                            {selectedProspect.ai_analysis.urgency_level.toUpperCase()}
                          </div>
                          <div className="text-slate-400 text-sm mt-1">Urgency Level</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => {
                            setShowDetailsModal(false)
                            handleViewAIInsights(selectedProspect)
                          }}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Complete AI Analysis</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 text-center">
                    <Brain className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                    <h4 className="text-white font-medium mb-2">No AI Analysis Yet</h4>
                    <p className="text-slate-400 text-sm mb-4">Run AI analysis to unlock insights and sales intelligence</p>
                    <button
                      onClick={() => {
                        runAIAnalysis(selectedProspect.id, selectedProspect.company_id)
                        setShowDetailsModal(false)
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Run AI Analysis
                    </button>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  <h4 className="text-lg font-semibold text-white mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleFinancialAnalysis(selectedProspect)
                        setShowDetailsModal(false)
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Financial Analysis
                    </button>
                    <button
                      onClick={() => {
                        handleDataExtraction(selectedProspect)
                        setShowDetailsModal(false)
                      }}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Extract Data
                    </button>
                    <button
                      onClick={() => {
                        handleUploadTranscript(selectedProspect)
                        setShowDetailsModal(false)
                      }}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      Upload Transcript
                    </button>
                    <button
                      onClick={() => {
                        handleGenerateReport(selectedProspect)
                        setShowDetailsModal(false)
                      }}
                      className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {predictiveAnalytics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glassmorphic-card">
            <h3>Pipeline Value</h3>
            <p>${predictiveAnalytics.total_pipeline_value?.toLocaleString()}</p>
          </div>
          <div className="glassmorphic-card">
            <h3>High Probability</h3>
            <p>{predictiveAnalytics.high_probability_deals}</p>
          </div>
          <div className="glassmorphic-card">
            <h3>Urgent Follow-ups</h3>
            <p>{predictiveAnalytics.urgent_follow_ups}</p>
          </div>
          <div className="glassmorphic-card">
            <h3>Avg Closeability</h3>
            <p>{predictiveAnalytics.average_closeability}%</p>
          </div>
        </div>
      )}
    </div>
  )
}