// components/dashboard/SafeAccountWorkflowDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, CheckCircle, XCircle, AlertCircle, FileText, Brain, Users, DollarSign, Clock, TrendingUp, ChevronRight, Building2, Phone, Mail, Calendar, Target, Activity, BarChart3, Briefcase, UserCheck, FileSearch, MessageSquare, PieChart, Zap, Shield, Award, ArrowUpRight, Loader2 } from 'lucide-react'
import { LoadingState, NoDataError, ConnectionError } from '@/app/components/ErrorStates'

interface Prospect {
  id: string
  name: string
  email: string
  industry?: string
  status: string
  urgency_level?: string
  closeability_score?: number
  company_id?: string
  workflow_stage?: string
  next_action?: string
}

interface DashboardStats {
  totalPipelineValue: number
  highProbabilityDeals: number
  urgentFollowUps: number
  averageCloseability: number
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-400 mb-4">Dashboard Error</h2>
              <p className="text-red-300 mb-4">
                The dashboard encountered an error while loading. This is likely due to:
              </p>
              <ul className="text-red-300 text-sm space-y-2 mb-6">
                <li>• Database connection issues</li>
                <li>• Missing QuickBooks API tokens</li>
                <li>• Component loading problems</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function SafeAccountWorkflowDashboard() {
  const router = useRouter()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [filterStage, setFilterStage] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/prospects-with-ai')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.prospects) {
        setProspects(data.prospects)
        setStats(data.stats)
      } else {
        throw new Error(data.error || 'No data available')
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const handleProspectClick = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    // Navigate to detailed view
    router.push(`/dashboard/prospect/${prospect.id}`)
  }

  const handleViewDetails = (prospect: Prospect) => {
    router.push(`/dashboard/data-extraction?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  const handleUploadTranscript = (prospect: Prospect) => {
    router.push(`/dashboard/call-transcripts?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  const handleGenerateReport = (prospect: Prospect) => {
    router.push(`/dashboard/report-generation?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}&prospect_id=${prospect.id}`)
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    router.push(`/dashboard/advanced-analysis?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  const getStageColor = (stage: string) => {
    // ... existing code ...
  }

  const getHealthScoreColor = (score: number) => {
    // ... existing code ...
  }

  const formatCurrency = (amount: number) => {
    // ... existing code ...
  }

  const filteredProspects = prospects.filter(prospect => {
    // ... existing code ...
  })

  // Show loading state
  if (isLoading) {
    return <LoadingState message="Loading account workflow dashboard..." />
  }

  // Show error state
  if (error) {
    return <ConnectionError message={error} onRetry={handleRefresh} />
  }

  // Show no data state
  if (!prospects.length || !stats) {
    return <NoDataError message="No prospect data available. Please ensure you have connected companies with financial data." onRetry={handleRefresh} />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Workflow Dashboard</h1>
                <p className="text-slate-400">AI-powered sales intelligence and account management</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="text-2xl font-bold text-emerald-400">${stats.totalPipelineValue.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Total Pipeline Value</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="text-2xl font-bold text-blue-400">{stats.highProbabilityDeals}</div>
              <div className="text-slate-400 text-sm">High Probability Deals</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="text-2xl font-bold text-orange-400">{stats.urgentFollowUps}</div>
              <div className="text-slate-400 text-sm">Urgent Follow-ups</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <div className="text-2xl font-bold text-purple-400">{stats.averageCloseability}%</div>
              <div className="text-slate-400 text-sm">Avg Closeability</div>
            </div>
          </div>

          {/* Prospects Table */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Connected Prospects</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-300">Company</th>
                    <th className="text-left p-4 text-slate-300">Industry</th>
                    <th className="text-left p-4 text-slate-300">Status</th>
                    <th className="text-left p-4 text-slate-300">Closeability</th>
                    <th className="text-left p-4 text-slate-300">Urgency</th>
                    <th className="text-left p-4 text-slate-300">Next Action</th>
                    <th className="text-left p-4 text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProspects.map((prospect) => (
                    <tr key={prospect.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="p-4">
                        <div className="text-white font-medium">{prospect.name}</div>
                        <div className="text-slate-400 text-sm">{prospect.email}</div>
                      </td>
                      <td className="p-4 text-slate-300">{prospect.industry || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          prospect.status === 'analysis_complete' ? 'bg-emerald-500/20 text-emerald-400' :
                          prospect.status === 'transcript_uploaded' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {prospect.status?.replace(/_/g, ' ') || 'Connected'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{prospect.closeability_score || 0}/100</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          prospect.urgency_level === 'high' ? 'bg-red-500/20 text-red-400' :
                          prospect.urgency_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {prospect.urgency_level || 'Low'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{prospect.next_action || 'Review'}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleProspectClick(prospect)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleUploadTranscript(prospect)}
                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                          >
                            Transcript
                          </button>
                          <button
                            onClick={() => handleGenerateReport(prospect)}
                            className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                          >
                            Generate Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}