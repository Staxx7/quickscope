// app/components/ProspectWorkflowDashboard.tsx
// This component integrates everything together for your main dashboard

'use client'
import React, { useState, useEffect } from 'react'
import { Building, Users, Brain, FileText, TrendingUp, AlertCircle, Clock, Star, Download, RefreshCw } from 'lucide-react'
import IntelligentAuditDeckGenerator from './IntelligentAuditDeckGenerator'
import CallTranscriptsIntegration from './CallTranscriptsIntegration'
import EnhancedQBODataExtractor from './EnhancedQBODataExtractor'
import { useToast } from './Toast'

interface Prospect {
  id: string
  company_name: string
  company_id?: string // QuickBooks Company ID
  industry?: string
  status: 'discovery' | 'analysis' | 'presentation' | 'proposal' | 'closed'
  created_at: string
  urgency_level?: 'low' | 'medium' | 'high'
  closeability_score?: number
  last_activity?: string
}

const ProspectWorkflowDashboard: React.FC = () => {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'transcripts' | 'financial' | 'audit'>('overview')
  const [loading, setLoading] = useState(true)
  const { showToast, ToastContainer } = useToast()

  // Load prospects from your database
  useEffect(() => {
    loadProspects()
  }, [])

  const loadProspects = async () => {
    try {
      setLoading(true)
      // Replace with your actual prospects API endpoint
      const response = await fetch('/api/prospects')
      if (response.ok) {
        const data = await response.json()
        setProspects(data)
      } else {
        // For demo purposes, use mock data
        setProspects([
          {
            id: 'prospect-1',
            company_name: 'TechFlow Solutions',
            company_id: 'qb-company-123',
            industry: 'B2B SaaS',
            status: 'analysis',
            created_at: new Date().toISOString(),
            urgency_level: 'high',
            closeability_score: 87,
            last_activity: '2 hours ago'
          },
          {
            id: 'prospect-2', 
            company_name: 'Growth Dynamics LLC',
            company_id: 'qb-company-456',
            industry: 'Professional Services',
            status: 'discovery',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            urgency_level: 'medium',
            closeability_score: 72,
            last_activity: '1 day ago'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load prospects:', error)
      showToast('Failed to load prospects', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'discovery': return 'bg-blue-100 text-blue-800'
      case 'analysis': return 'bg-yellow-100 text-yellow-800'  
      case 'presentation': return 'bg-purple-100 text-purple-800'
      case 'proposal': return 'bg-orange-100 text-orange-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-400'
    }
  }

  const renderProspectsList = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Prospects</h2>
          <button
            onClick={loadProspects}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {prospects.map((prospect) => (
          <div
            key={prospect.id}
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedProspect?.id === prospect.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
            }`}
            onClick={() => setSelectedProspect(prospect)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{prospect.company_name}</h3>
                  <p className="text-sm text-gray-500">{prospect.industry}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {prospect.closeability_score && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{prospect.closeability_score}%</span>
                  </div>
                )}
                
                {prospect.urgency_level && (
                  <AlertCircle className={`w-4 h-4 ${getUrgencyColor(prospect.urgency_level)}`} />
                )}
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Last activity: {prospect.last_activity}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTabContent = () => {
    if (!selectedProspect) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Prospect</h3>
          <p className="text-gray-500">Choose a prospect from the list to view their details and begin analysis.</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{selectedProspect.company_name}</h2>
              <div className="flex items-center space-x-4">
                {selectedProspect.closeability_score && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedProspect.closeability_score}%</div>
                    <div className="text-xs text-gray-500">Closeability</div>
                  </div>
                )}
                {selectedProspect.urgency_level && (
                  <div className={`text-center ${getUrgencyColor(selectedProspect.urgency_level)}`}>
                    <AlertCircle className="w-6 h-6 mx-auto" />
                    <div className="text-xs capitalize">{selectedProspect.urgency_level}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => setActiveTab('transcripts')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <div className="font-medium">Call Transcripts</div>
                <div className="text-sm text-gray-500">Upload & analyze calls</div>
              </button>

              <button
                onClick={() => setActiveTab('financial')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                <div className="font-medium">Financial Data</div>
                <div className="text-sm text-gray-500">QuickBooks integration</div>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <Brain className="w-6 h-6 text-purple-600 mb-2" />
                <div className="font-medium">AI Audit Deck</div>
                <div className="text-sm text-gray-500">Generate presentation</div>
              </button>

              <div className="p-4 border rounded-lg bg-gray-50">
                <Clock className="w-6 h-6 text-gray-400 mb-2" />
                <div className="font-medium text-gray-600">Status</div>
                <div className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(selectedProspect.status)}`}>
                  {selectedProspect.status}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Upload discovery call recording</span>
                  <button
                    onClick={() => setActiveTab('transcripts')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Start →
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Connect QuickBooks data</span>
                  <button
                    onClick={() => setActiveTab('financial')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Connect →
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Generate AI audit deck</span>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Generate →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'transcripts':
        return (
          <CallTranscriptsIntegration
            defaultCompanyId={selectedProspect.id}
            defaultCompanyName={selectedProspect.company_name}
          />
        )

      case 'financial':
        return selectedProspect.company_id ? (
          <EnhancedQBODataExtractor
            companyId={selectedProspect.company_id}
            companyName={selectedProspect.company_name}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">QuickBooks connection not available for this prospect.</p>
          </div>
        )

      case 'audit':
        return (
          <IntelligentAuditDeckGenerator
            prospectId={selectedProspect.id}
            companyName={selectedProspect.company_name}
            companyId={selectedProspect.company_id}
            onDeckGenerated={(deck) => {
              showToast('Audit deck generated successfully!', 'success')
              // You could update the prospect status here
            }}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastContainer />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prospect Intelligence Dashboard</h1>
        <p className="text-gray-600">Manage prospects from discovery to audit presentation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prospects List */}
        <div className="lg:col-span-1">
          {renderProspectsList()}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {selectedProspect && (
            <div className="mb-4">
              <nav className="flex space-x-4">
                {[
                  { id: 'overview', label: 'Overview', icon: Users },
                  { id: 'transcripts', label: 'Transcripts', icon: FileText },
                  { id: 'financial', label: 'Financial', icon: TrendingUp },
                  { id: 'audit', label: 'AI Audit', icon: Brain }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default ProspectWorkflowDashboard
