'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Star, Clock, AlertTriangle, TrendingUp, MessageSquare, Eye, Zap, Target, Users, Phone, Calendar, Search, Filter, RefreshCw, BarChart3, DollarSign, CheckCircle, ArrowRight, FileText, Presentation } from 'lucide-react'
import { useCompany } from '@/app/contexts/CompanyContext'

interface FinancialSummary {
  revenue: number
  expenses: number
  profit: number
  profit_margin: number
  cash_flow: number
  health_score?: number
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
  budget_fit?: string
  timeline?: string
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
  last_data_sync?: string
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
    aiAnalyzed: 0
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncingProspectId, setSyncingProspectId] = useState<string | null>(null)
  const [runningAIAnalysis, setRunningAIAnalysis] = useState<string | null>(null)
  const { setSelectedCompany } = useCompany()

  const fetchProspects = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/prospects-with-ai');
      if (!response.ok) {
        throw new Error('Failed to fetch connected companies from the server.');
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'An error occurred while fetching data.');
      }

      setProspects(data.prospects || []);
      setStats(data.stats || { total: 0, connected: 0, expired: 0, aiAnalyzed: 0 });
      
    } catch (err) {
      console.error('Error fetching prospects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load prospects');
      setProspects([]);
      setStats({ total: 0, connected: 0, expired: 0, aiAnalyzed: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects()
  }, [])

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
    
    const matchesWorkflowStage = filterAIStatus === 'all' || 
      prospect.workflow_stage === filterAIStatus ||
      // Legacy compatibility for existing filter options
      (filterAIStatus === 'analyzed' && prospect.ai_analysis?.analysis_status === 'completed') ||
      (filterAIStatus === 'high-value' && prospect.ai_analysis && prospect.ai_analysis.closeability_score >= 80) ||
      (filterAIStatus === 'urgent' && prospect.ai_analysis?.urgency_level === 'high') ||
      (filterAIStatus === 'pending' && (!prospect.ai_analysis || prospect.ai_analysis.analysis_status !== 'completed'))

    return matchesSearch && matchesStatus && matchesWorkflowStage
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'syncing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getWorkflowStageIcon = (stage: string) => {
    switch (stage) {
      case 'connected': return '🔗'
      case 'transcript_uploaded': return '🎙️'
      case 'ai_analyzed': return '🧠'
      case 'financial_analyzed': return '📊'
      case 'reports_generated': return '📋'
      case 'audit_deck_ready': return '🎯'
      case 'audit_completed': return '✅'
      default: return '⏳'
    }
  }

  const getWorkflowStageName = (stage: string) => {
    switch (stage) {
      case 'connected': return 'QB Connected'
      case 'transcript_uploaded': return 'Transcript Ready'
      case 'ai_analyzed': return 'AI Analyzed'
      case 'financial_analyzed': return 'Financial Analysis'
      case 'reports_generated': return 'Reports Generated'
      case 'audit_deck_ready': return 'Audit Deck Ready'
      case 'audit_completed': return 'Audit Completed'
      default: return 'Pending Setup'
    }
  }

  const getNextAction = (prospect: Prospect) => {
    if (prospect.connection_status !== 'active') {
      return 'Reconnect QuickBooks'
    }
    
    switch (prospect.workflow_stage) {
      case 'connected':
        return 'Upload Discovery Call Transcript'
      case 'transcript_uploaded':
        return 'Run AI Transcript Analysis'
      case 'ai_analyzed':
        return 'Generate Financial Analysis'
      case 'financial_analyzed':
        return 'Generate Financial Reports'
      case 'reports_generated':
        return 'Create Audit Deck'
      case 'audit_deck_ready':
        return 'Present to Prospect'
      case 'audit_completed':
        return 'Follow-up Actions'
      default:
        return 'Setup Required'
    }
  }

  const getWorkflowProgress = (stage: string) => {
    switch (stage) {
      case 'connected': return 15
      case 'transcript_uploaded': return 30
      case 'ai_analyzed': return 45
      case 'financial_analyzed': return 65
      case 'reports_generated': return 85
      case 'audit_deck_ready': return 95
      case 'audit_completed': return 100
      default: return 0
    }
  }

  const handleReconnect = (companyId: string) => {
    // This will redirect the user to the QuickBooks OAuth flow
    window.location.href = `/api/qbo/auth?companyId=${companyId}`;
  };

  const getNextActionButton = (prospect: Prospect, actions?: any) => {
    if (prospect.connection_status !== 'active') {
      return (
        <button
          onClick={() => handleReconnect(prospect.company_id)}
          disabled={syncingProspectId === prospect.id}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          {syncingProspectId === prospect.id ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <span>🔄</span>
          )}
          <span>{syncingProspectId === prospect.id ? 'Reconnecting...' : 'Reconnect QB'}</span>
        </button>
      )
    }
    
    switch (prospect.workflow_stage) {
      case 'connected':
        return (
          <button
            onClick={() => handleTranscript(prospect)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🎙️</span>
            <span>Upload Call Transcript</span>
          </button>
        )
      case 'transcript_uploaded':
        return (
          <button
            onClick={() => runAIAnalysis(prospect.id, prospect.company_id)}
            disabled={runningAIAnalysis === prospect.id}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            {runningAIAnalysis === prospect.id ? (
              <div className="animate-pulse text-lg">🧠</div>
            ) : (
              <span>🧠</span>
            )}
            <span>{runningAIAnalysis === prospect.id ? 'Analyzing...' : 'Run AI Analysis'}</span>
          </button>
        )
      case 'ai_analyzed':
        return (
          <button
            onClick={() => handleFinancialAnalysis(prospect)}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>Financial Analysis</span>
          </button>
        )
      case 'financial_analyzed':
        return (
          <button
            onClick={() => handleGenerateReport(prospect)}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📋</span>
            <span>Generate Reports</span>
          </button>
        )
      case 'reports_generated':
        return (
          <button
            onClick={() => handleGenerateReport(prospect)}
            className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🎯</span>
            <span>Create Audit Deck</span>
          </button>
        )
      case 'audit_deck_ready':
        return (
          <button
            onClick={() => handleGenerateReport(prospect)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>✅</span>
            <span>Present to Prospect</span>
          </button>
        )
      default:
        return (
          <button
            onClick={() => handleTranscript(prospect)}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🎙️</span>
            <span>Upload Transcript</span>
          </button>
        )
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

  const handleNavigation = (path: string, prospect: Prospect) => {
    // Pass the full prospect object, which matches the new Company interface
    setSelectedCompany({
      id: prospect.company_id, 
      name: prospect.company_name,
      status: prospect.connection_status,
      last_sync: prospect.last_data_sync,
      connected_at: prospect.connection_date,
      realmId: prospect.company_id
    });
    router.push(path);
  };

  const handleDataExtraction = (prospect: Prospect) => {
    handleNavigation(`/admin/dashboard/data-extraction`, prospect);
  };
  
  const handleTranscript = (prospect: Prospect) => {
    handleNavigation(`/admin/dashboard/call-transcripts`, prospect);
  };

  const handleGenerateReport = (prospect: Prospect) => {
    handleNavigation(`/admin/dashboard/report-generation`, prospect);
  };

  const handleFinancialAnalysis = (prospect: Prospect) => {
    handleNavigation(`/admin/dashboard/advanced-analysis`, prospect);
  };

  const handleLiveDataExtraction = async (prospect: Prospect) => {
    try {
      // Show loading state
      setSyncingProspectId(prospect.id)
      
      // Trigger comprehensive live data extraction with proper parameters
      const response = await fetch(`/api/qbo/extract-comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: prospect.company_id,
          dataTypes: ['profit_loss', 'balance_sheet', 'cash_flow', 'chart_of_accounts'],
          dateRange: {
            startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
            endDate: new Date().toISOString()
          },
          extractionType: 'live',
          includeBenchmarks: true,
          includeMarketData: true
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Live data extraction successful:', result.message)
        alert(`✅ Live data extraction completed successfully for ${prospect.company_name}`)
        
        // Refresh prospects to show updated data
        setTimeout(() => {
          fetchProspects()
        }, 1000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Data extraction failed')
      }
    } catch (error) {
      console.error('Error extracting live data:', error)
      alert(`❌ Data extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSyncingProspectId(null)
    }
  }

  const triggerSync = async (companyId: string, prospectId: string) => {
    try {
      setSyncingProspectId(prospectId)
      
      const response = await fetch(`/api/qbo/sync/${companyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ensureLiveData: true,
          syncAll: true
        })
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading prospects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Prospects</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button 
            onClick={fetchProspects}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6">
      {/* Clean Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              🎯 Account Workflow
            </h1>
            <p className="text-slate-400">
              Intelligent prospect management with AI-powered insights and sales intelligence
            </p>
          </div>
          <div className="flex space-x-3">
            {/* Removed duplicate sync button - using AdminLayout sync button */}
          </div>
        </div>

        {/* Error handling moved to retry button functionality */}
      </div>

      {/* Clean Stats Cards - Removed High Value and Urgent */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-slate-400">Total Prospects</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-green-400">{stats.connected}</div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-orange-400">{stats.aiAnalyzed}</div>
          <div className="text-sm text-slate-400">AI Analyzed</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-purple-400">
            {stats.total > 0 ? Math.round((stats.connected / stats.total) * 100) : 0}%
          </div>
          <div className="text-sm text-slate-400">Health Score</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search prospects, companies, emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Connections</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={filterAIStatus}
              onChange={(e) => setFilterAIStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All AI Status</option>
              <option value="connected">QB Connected</option>
              <option value="transcript_uploaded">Transcript Ready</option>
              <option value="ai_analyzed">AI Analyzed</option>
              <option value="financial_analyzed">Financial Analysis</option>
              <option value="reports_generated">Reports Generated</option>
              <option value="audit_deck_ready">Audit Deck Ready</option>
              <option value="audit_completed">Audit Completed</option>
            </select>
            {/* Removed second duplicate sync button */}
          </div>
        </div>
      </div>

      {/* Enhanced Table View */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Connected Prospects</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Last Data Sync
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Next Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {prospect.company_name || 'Unknown Company'}
                      </div>
                      <div className="text-sm text-slate-400">{prospect.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-700 text-slate-300">
                      {prospect.industry || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(prospect.connection_status)}`}>
                      {prospect.connection_status === 'active' ? 'active' : 'expired'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {prospect.last_data_sync ? new Date(prospect.last_data_sync).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {prospect.next_action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {prospect.connection_status === 'expired' ? (
                        <button
                          onClick={() => triggerSync(prospect.company_id, prospect.id)}
                          disabled={syncingProspectId === prospect.id}
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md"
                        >
                          {syncingProspectId === prospect.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                          ) : (
                            'Reconnect QB'
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDataExtraction(prospect)}
                            className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md"
                          >
                            Extract Data
                          </button>
                          <button
                            onClick={() => handleTranscript(prospect)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                          >
                            Transcript
                          </button>
                          <button
                            onClick={() => handleGenerateReport(prospect)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-md"
                          >
                            Generate Report
                          </button>
                          <button
                            onClick={() => handleFinancialAnalysis(prospect)}
                            className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-md"
                          >
                            Analysis
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProspects.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-white mb-2">No prospects found</h3>
          <p className="text-slate-400">
            {searchTerm || filterStatus !== 'all' || filterAIStatus !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Connect your first QuickBooks account to get started'
            }
          </p>
        </div>
      )}

    </div>
  )
}