'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, TrendingUp, Download, Eye, Plus, Search, Filter, Brain, Target, BarChart3, PieChart } from 'lucide-react'
import EnhancedFinancialAnalysis from '../../components/EnhancedFinancialAnalysis'
import DocumentAnalysis from '../../components/DocumentAnalysis'
import AdvancedFinancialAnalysis from '../../components/AdvancedFinancialAnalysis'
import TranscriptionAnalysis from '../../components/TranscriptionAnalysis'
import AuditDeckGenerator from '../../components/AuditDeckGenerator'

interface Prospect {
  id: string
  company_name: string
  company_id: string
  email: string
  created_at: string
  qbo_connected: boolean
  access_token?: string
  refresh_token?: string
}

interface FinancialData {
  revenue: number
  expenses: number
  net_income: number
  gross_margin: number
  expense_breakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

export default function AdminDashboard() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'financial-analysis' | 'transcript' | 'document-analysis'>('overview')
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchProspects()
  }, [])

  const fetchProspects = async () => {
    try {
      const response = await fetch('/api/admin/prospects')
      if (response.ok) {
        const data = await response.json()
        setProspects(data.prospects || [])
      }
    } catch (error) {
      console.error('Error fetching prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewData = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setActiveTab('overview')
  }

  const handleFinancialAnalysis = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setActiveTab('financial-analysis')
  }

  const handleTranscript = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setActiveTab('transcript')
  }

  const handleDocumentAnalysis = (prospect: Prospect) => {
    setSelectedProspect(prospect)
    setActiveTab('document-analysis')
  }

  const handleAnalysisComplete = (insights: any) => {
    console.log('Analysis complete:', insights)
  }

  const handleBackToOverview = () => {
    setSelectedProspect(null)
    setActiveTab('overview')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">STAXX Admin Dashboard</h1>
              {selectedProspect && (
                <nav className="ml-8 flex space-x-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'overview'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('financial-analysis')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'financial-analysis'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Financial Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('document-analysis')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'document-analysis'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Document Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'transcript'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Transcript Analysis
                  </button>
                </nav>
              )}
            </div>
            <div className="flex space-x-3">
              {selectedProspect && (
                <button
                  onClick={handleBackToOverview}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  ← Back to Overview
                </button>
              )}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Prospect</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Analysis View */}
        {selectedProspect && activeTab === 'financial-analysis' && (
          <EnhancedFinancialAnalysis
            companyId={selectedProspect.company_id}
            companyName={selectedProspect.company_name}
            dateRange={dateRange}
          />
        )}

        {/* Document Analysis View */}
        {selectedProspect && activeTab === 'document-analysis' && (
          <DocumentAnalysis
            companyName={selectedProspect.company_name}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {/* Transcript Analysis View */}
        {selectedProspect && activeTab === 'transcript' && (
          <TranscriptAnalysis
            companyName={selectedProspect.company_name}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {/* Overview/Default View */}
        {(!selectedProspect || activeTab === 'overview') && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Connected Prospects ({prospects.length})
                  </h2>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search prospects..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        QB Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Connected
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prospects.map((prospect) => (
                      <tr key={prospect.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {prospect.company_name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {prospect.company_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {prospect.company_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{prospect.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            prospect.qbo_connected
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {prospect.qbo_connected ? 'Connected' : 'Disconnected'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(prospect.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleViewData(prospect)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleFinancialAnalysis(prospect)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center space-x-1"
                            >
                              <TrendingUp className="w-3 h-3" />
                              <span>Financial</span>
                            </button>
                            <button
                              onClick={() => handleDocumentAnalysis(prospect)}
                              className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition flex items-center space-x-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Documents</span>
                            </button>
                            <button
                              onClick={() => handleTranscript(prospect)}
                              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition flex items-center space-x-1"
                            >
                              <Target className="w-3 h-3" />
                              <span>Transcript</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {prospects.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prospects yet</h3>
                <p className="text-gray-500">
                  Connect your first QuickBooks prospect to get started with comprehensive financial analysis.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
