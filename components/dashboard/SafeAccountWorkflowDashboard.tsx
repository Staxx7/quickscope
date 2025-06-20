// components/dashboard/SafeAccountWorkflowDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPipelineValue: 0,
    highProbabilityDeals: 0,
    urgentFollowUps: 0,
    averageCloseability: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to load prospects from database
      const response = await fetch('/api/admin/prospects-with-ai', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load prospects: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.prospects) {
        setProspects(data.prospects)
        
        // Calculate stats from prospects
        const calculatedStats = calculateStats(data.prospects)
        setStats(calculatedStats)
      } else {
        // Fallback to demo data if API fails
        console.warn('API failed, using demo data')
        setProspects(getDemoProspects())
        setStats(getDemoStats())
      }

    } catch (err) {
      console.error('Dashboard loading error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Use demo data as fallback
      setProspects(getDemoProspects())
      setStats(getDemoStats())
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (prospects: Prospect[]): DashboardStats => {
    const totalValue = prospects.length * 50000 // Estimated value per prospect
    const highProb = prospects.filter(p => (p.closeability_score || 0) >= 80).length
    const urgent = prospects.filter(p => p.urgency_level === 'high').length
    const avgClose = prospects.reduce((acc, p) => acc + (p.closeability_score || 0), 0) / prospects.length

    return {
      totalPipelineValue: totalValue,
      highProbabilityDeals: highProb,
      urgentFollowUps: urgent,
      averageCloseability: Math.round(avgClose)
    }
  }

  const getDemoProspects = (): Prospect[] => [
    {
      id: '1',
      name: 'TechFlow Solutions',
      email: 'contact@techflowsolutions.com',
      industry: 'B2B SaaS',
      status: 'analysis_complete',
      urgency_level: 'high',
      closeability_score: 87,
      company_id: 'test123',
      workflow_stage: 'ready_for_audit',
      next_action: 'Generate Report'
    },
    {
      id: '2', 
      name: 'Growth Dynamics LLC',
      email: 'info@growthdynamics.com',
      industry: 'Professional Services',
      status: 'transcript_uploaded',
      urgency_level: 'medium',
      closeability_score: 72,
      company_id: 'test456',
      workflow_stage: 'analysis_pending',
      next_action: 'Generate Analysis'
    }
  ]

  const getDemoStats = (): DashboardStats => ({
    totalPipelineValue: 129600,
    highProbabilityDeals: 1,
    urgentFollowUps: 1,
    averageCloseability: 78
  })

  const handleViewDetails = (prospect: Prospect) => {
    router.push(`/admin/dashboard/data-extraction?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  const handleUploadTranscript = (prospect: Prospect) => {
    router.push(`/admin/dashboard/call-transcripts?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  const handleGenerateReport = (prospect: Prospect) => {
    router.push(`/admin/dashboard/report-generation?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}&prospect_id=${prospect.id}`)
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    router.push(`/admin/advanced-analysis?account=${prospect.company_id}&company=${encodeURIComponent(prospect.name)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading QuickScope Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Workflow Dashboard</h1>
            <p className="text-slate-400">AI-Enhanced Prospect Intelligence Platform</p>
            {error && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
                ⚠️ Using demo data due to: {error}
              </div>
            )}
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
                  {prospects.map((prospect) => (
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
                            onClick={() => handleViewDetails(prospect)}
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