// components/dashboard/StreamlinedAccountWorkflowDashboard.tsx
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

export default function StreamlinedAccountWorkflowDashboard() {
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

      const response = await fetch('/api/admin/prospects-with-ai', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Failed to load prospects: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success && data.prospects) {
        setProspects(data.prospects)
        const calculatedStats = calculateStats(data.prospects)
        setStats(calculatedStats)
      } else {
        setProspects(getDemoProspects())
        setStats(getDemoStats())
      }

    } catch (err) {
      console.error('Dashboard loading error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setProspects(getDemoProspects())
      setStats(getDemoStats())
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (prospects: Prospect[]): DashboardStats => {
    const totalValue = prospects.length * 50000
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

  // FIXED: Proper navigation with company context
  const handleViewDetails = (prospect: Prospect) => {
    const params = new URLSearchParams({
      account: prospect.company_id || prospect.id,
      company: prospect.name
    })
    router.push(`/admin/dashboard/data-extraction?${params.toString()}`)
  }

  const handleUploadTranscript = (prospect: Prospect) => {
    const params = new URLSearchParams({
      account: prospect.company_id || prospect.id,
      company: prospect.name
    })
    router.push(`/admin/dashboard/call-transcripts?${params.toString()}`)
  }

  const handleGenerateReport = (prospect: Prospect) => {
    const params = new URLSearchParams({
      account: prospect.company_id || prospect.id,
      company: prospect.name,
      prospect_id: prospect.id
    })
    router.push(`/admin/dashboard/report-generation?${params.toString()}`)
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    const params = new URLSearchParams({
      account: prospect.company_id || prospect.id,
      company: prospect.name
    })
    router.push(`/admin/advanced-analysis?${params.toString()}`)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      
      {/* STREAMLINED SIDEBAR */}
      <div className="w-64 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">QuickScope</h1>
              <p className="text-slate-400 text-sm">AI Platform</p>
            </div>
          </div>

          {/* STREAMLINED SYSTEM STATUS */}
          <div className="mb-8">
            <div className="text-slate-400 text-sm mb-3">System Status</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Companies</span>
                <span className="text-slate-400 text-sm">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Reports</span>
                <span className="text-slate-400 text-sm">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">AI Insights</span>
                <span className="text-slate-400 text-sm">156</span>
              </div>
            </div>
          </div>

          {/* STREAMLINED NAVIGATION */}
          <nav className="space-y-2">
            <div className="text-slate-400 text-sm mb-3">Navigation</div>
            
            <div className="bg-blue-600/20 text-blue-400 p-3 rounded-lg border border-blue-600/30">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium">Account Workflow</span>
              </div>
              <p className="text-xs text-blue-300 mt-1">Connected accounts with progress tracking</p>
            </div>

            <button 
              onClick={() => router.push('/admin/dashboard/call-transcripts')}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Call Transcripts</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Upload and analyze client call transcripts</p>
            </button>

            <button 
              onClick={() => router.push('/admin/dashboard/data-extraction')}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Data Extraction</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Extract live QuickBooks financial data</p>
            </button>

            <button 
              onClick={() => router.push('/admin/advanced-analysis')}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Financial Analysis</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">AI-powered financial insights</p>
            </button>

            <button 
              onClick={() => router.push('/admin/dashboard/report-generation')}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Report Generation</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Generate audit decks and financial reports</p>
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Workflow Dashboard</h1>
          <p className="text-slate-400">AI-Enhanced Prospect Intelligence Platform</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
              ⚠️ Using demo data due to: {error}
            </div>
          )}
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">${stats.totalPipelineValue.toLocaleString()}</div>
            <div className="text-slate-400 text-sm">Total Pipeline Value</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">{stats.highProbabilityDeals}</div>
            <div className="text-slate-400 text-sm">High Probability Deals</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">{stats.urgentFollowUps}</div>
            <div className="text-slate-400 text-sm">Urgent Follow-ups</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">{stats.averageCloseability}%</div>
            <div className="text-slate-400 text-sm">Avg Closeability</div>
          </div>
        </div>

        {/* PROSPECTS TABLE */}
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
                        prospect.status === 'analysis_complete' ? 'bg-blue-500/20 text-blue-400' :
                        prospect.status === 'transcript_uploaded' ? 'bg-slate-500/20 text-slate-400' :
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
                        prospect.urgency_level === 'high' ? 'bg-blue-500/20 text-blue-400' :
                        prospect.urgency_level === 'medium' ? 'bg-slate-500/20 text-slate-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {prospect.urgency_level || 'Low'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{prospect.next_action || 'Review'}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(prospect)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Extract Data
                        </button>
                        <button
                          onClick={() => handleUploadTranscript(prospect)}
                          className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors"
                        >
                          Transcript
                        </button>
                        <button
                          onClick={() => handleGenerateReport(prospect)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Generate Report
                        </button>
                        <button
                          onClick={() => handleFinancialAnalysis(prospect)}
                          className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors"
                        >
                          Analysis
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
  )
}