'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FinancialSummary {
  revenue: number
  expenses: number
  profit: number
  profit_margin: number
  cash_flow: number
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
}

interface ProspectsResponse {
  prospects: Prospect[]
  total: number
  connected: number
  expired: number
}

export default function AccountWorkflowDashboard() {
  const router = useRouter()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [stats, setStats] = useState({ total: 0, connected: 0, expired: 0 })
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchProspects()
  }, [])

  const fetchProspects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/prospects')
      const data: ProspectsResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch prospects')
      }

      setProspects(data.prospects)
      setStats({
        total: data.total,
        connected: data.connected,
        expired: data.expired
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || prospect.connection_status === filterStatus

    return matchesSearch && matchesFilter
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setShowDetailsModal(true)
  }

  const handleUploadTranscript = (prospect: Prospect) => {
    router.push(`/admin/call-transcripts?company_id=${prospect.company_id}&company_name=${encodeURIComponent(prospect.company_name)}`)
  }

  const handleGenerateReport = (prospect: Prospect) => {
    router.push(`/admin/reports?company_id=${prospect.company_id}&company_name=${encodeURIComponent(prospect.company_name)}`)
  }

  const handleDataExtraction = (prospect: Prospect) => {
    router.push(`/admin/data-extraction?company_id=${prospect.company_id}&company_name=${encodeURIComponent(prospect.company_name)}`)
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    router.push(`/admin/financial-analysis?company_id=${prospect.company_id}&company_name=${encodeURIComponent(prospect.company_name)}`)
  }

  const triggerSync = async (prospectId: string) => {
    try {
      const response = await fetch('/api/admin/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trigger_sync',
          prospect_id: prospectId
        })
      })

      if (response.ok) {
        // Refresh the prospects list
        fetchProspects()
      }
    } catch (error) {
      console.error('Error triggering sync:', error)
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
        <h1 className="text-3xl font-bold text-white mb-2">Account Workflow Dashboard</h1>
        <p className="text-slate-400">Manage connected prospects and their financial analysis workflow</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Prospects</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Connections</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.connected}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Expired Connections</p>
              <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by company name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <button
            onClick={fetchProspects}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Prospects Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Financial Summary</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Connected</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{prospect.company_name}</div>
                      <div className="text-slate-400 text-sm">{prospect.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(prospect.connection_status)}`}>
                      {prospect.connection_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="mr-2">{getWorkflowStageIcon(prospect.workflow_stage)}</span>
                      <span className="text-white text-sm">{prospect.workflow_stage.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {prospect.financial_summary ? (
                      <div className="text-sm">
                        <div className="text-white">Revenue: {formatCurrency(prospect.financial_summary.revenue)}</div>
                        <div className="text-slate-400">Profit: {formatCurrency(prospect.financial_summary.profit)}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500">No data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{prospect.days_connected} days ago</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(prospect)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDataExtraction(prospect)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                      >
                        Extract Data
                      </button>
                      <button
                        onClick={() => handleUploadTranscript(prospect)}
                        className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                      >
                        Transcript
                      </button>
                      <button
                        onClick={() => handleGenerateReport(prospect)}
                        className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
                      >
                        Report
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
            <p className="text-slate-400">No prospects found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedProspect && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{selectedProspect.company_name} Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Company Info */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Company Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
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
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Financial Summary</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Revenue</p>
                      <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Expenses</p>
                      <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.expenses)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Profit</p>
                      <p className="text-white text-lg font-semibold">{formatCurrency(selectedProspect.financial_summary.profit)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Profit Margin</p>
                      <p className="text-white text-lg font-semibold">{selectedProspect.financial_summary.profit_margin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFinancialAnalysis(selectedProspect)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Financial Analysis
                  </button>
                  <button
                    onClick={() => handleDataExtraction(selectedProspect)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Extract Data
                  </button>
                  <button
                    onClick={() => handleUploadTranscript(selectedProspect)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Upload Transcript
                  </button>
                  <button
                    onClick={() => handleGenerateReport(selectedProspect)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Generate Report
                  </button>
                  <button
                    onClick={() => triggerSync(selectedProspect.id)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Sync Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
