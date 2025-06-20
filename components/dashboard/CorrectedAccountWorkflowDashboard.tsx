// components/dashboard/CorrectedAccountWorkflowDashboard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WorkflowManager } from '@/lib/workflowManager'

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

export default function CorrectedAccountWorkflowDashboard() {
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

  // Handle Extract Data button click
  const handleExtractData = (e: React.MouseEvent, prospect: Prospect) => {
    e.preventDefault()
    e.stopPropagation()
    
    const companyId = prospect.company_id || prospect.id
    const companyName = prospect.name
    
    console.log('Extract Data clicked for:', companyName)
    
    // Start or update workflow
    WorkflowManager.startWorkflow(companyId, companyName, prospect.email)
    
    // Use direct navigation to avoid any interference
    const url = `/admin/dashboard/data-extraction?company_id=${companyId}&company_name=${encodeURIComponent(companyName)}&account=${companyId}&company=${encodeURIComponent(companyName)}`
    
    // Force navigation using window.location to bypass any interceptors
    window.location.href = url
  }

  // Handle Upload Transcript button click
  const handleUploadTranscript = (e: React.MouseEvent, prospect: Prospect) => {
    e.preventDefault()
    e.stopPropagation()
    
    const companyId = prospect.company_id || prospect.id
    const companyName = prospect.name
    
    console.log('Upload Transcript clicked for:', companyName)
    
    // Start or update workflow if not started
    const workflowState = WorkflowManager.getWorkflowState(companyId)
    if (!workflowState) {
      WorkflowManager.startWorkflow(companyId, companyName, prospect.email)
    }
    
    // Use direct navigation
    const url = `/admin/dashboard/call-transcripts?company_id=${companyId}&company_name=${encodeURIComponent(companyName)}&account=${companyId}&company=${encodeURIComponent(companyName)}`
    window.location.href = url
  }

  // Handle Generate Report button click
  const handleGenerateReport = (e: React.MouseEvent, prospect: Prospect) => {
    e.preventDefault()
    e.stopPropagation()
    
    const companyId = prospect.company_id || prospect.id
    const companyName = prospect.name
    
    console.log('Generate Report clicked for:', companyName)
    
    // Start or update workflow if not started
    const workflowState = WorkflowManager.getWorkflowState(companyId)
    if (!workflowState) {
      WorkflowManager.startWorkflow(companyId, companyName, prospect.email)
    }
    
    // Use direct navigation
    const url = `/admin/dashboard/report-generation?company_id=${companyId}&company_name=${encodeURIComponent(companyName)}&account=${companyId}&company=${encodeURIComponent(companyName)}&prospect_id=${prospect.id}`
    window.location.href = url
  }

  // Handle Financial Analysis button click
  const handleFinancialAnalysis = (e: React.MouseEvent, prospect: Prospect) => {
    e.preventDefault()
    e.stopPropagation()
    
    const companyId = prospect.company_id || prospect.id
    const companyName = prospect.name
    
    console.log('Financial Analysis clicked for:', companyName)
    
    // Start or update workflow if not started
    const workflowState = WorkflowManager.getWorkflowState(companyId)
    if (!workflowState) {
      WorkflowManager.startWorkflow(companyId, companyName, prospect.email)
    }
    
    // Use direct navigation
    const url = `/admin/dashboard/advanced-analysis?company_id=${companyId}&company_name=${encodeURIComponent(companyName)}&account=${companyId}&company=${encodeURIComponent(companyName)}`
    window.location.href = url
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 AI-Enhanced Account Workflow
          </h1>
          <p className="text-slate-400">Intelligent prospect management with AI-powered insights and sales intelligence</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
              ⚠️ Using demo data due to: {error}
            </div>
          )}
        </div>

        {/* STATS CARDS - GLASSMORPHIC DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-blue-400">👥</div>
              <div>
                <div className="text-2xl font-bold text-white">{prospects.length}</div>
                <div className="text-slate-400 text-sm">Total Prospects</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-emerald-400">✅</div>
              <div>
                <div className="text-2xl font-bold text-white">{prospects.filter(p => p.status === 'connected').length}</div>
                <div className="text-slate-400 text-sm">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-purple-400">🧠</div>
              <div>
                <div className="text-2xl font-bold text-white">{prospects.filter(p => p.status === 'analysis_complete').length}</div>
                <div className="text-slate-400 text-sm">AI Analyzed</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-yellow-400">⭐</div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.highProbabilityDeals}</div>
                <div className="text-slate-400 text-sm">High Value</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-red-400">🔥</div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.urgentFollowUps}</div>
                <div className="text-slate-400 text-sm">Urgent</div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="text-orange-400">⚠️</div>
              <div>
                <div className="text-2xl font-bold text-white">{prospects.filter(p => p.status === 'expired').length}</div>
                <div className="text-slate-400 text-sm">Expired</div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="mb-8 flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search prospects, companies, emails..."
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Connections</option>
          </select>
          <select className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All AI Status</option>
          </select>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            ✅ Sync All
          </button>
        </div>

         {/* PROSPECTS TABLE - GLASSMORPHIC DESIGN */}
         <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-white">Connected Prospects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
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
                  <tr key={prospect.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="text-white font-medium">{prospect.name}</div>
                      <div className="text-slate-400 text-sm">{prospect.email}</div>
                    </td>
                    <td className="p-4 text-slate-300">{prospect.industry || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prospect.status === 'analysis_complete' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        prospect.status === 'transcript_uploaded' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {prospect.status?.replace(/_/g, ' ') || 'Connected'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium">{prospect.closeability_score || 0}/100</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        prospect.urgency_level === 'high' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        prospect.urgency_level === 'medium' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {prospect.urgency_level || 'Low'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{prospect.next_action || 'Review'}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleExtractData(e, prospect)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Extract Data
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleUploadTranscript(e, prospect)
                          }}
                          className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Transcript
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleGenerateReport(e, prospect)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Generate Report
                        </button>
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleFinancialAnalysis(e, prospect)
                          }}
                          className="px-3 py-1 bg-slate-600 text-white text-xs rounded hover:bg-slate-700 transition-colors cursor-pointer"
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