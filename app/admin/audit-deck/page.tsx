'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import IntelligentAuditDeckGenerator from '../../components/IntelligentAuditDeckGenerator'
import { Users, Building, TrendingUp } from 'lucide-react'

interface Prospect {
  id: string
  company_name: string
  qbo_company_id: string
  contact_email: string
  workflow_stage: string
  created_at: string
}

function AuditDeckContent() {
  const searchParams = useSearchParams()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)

  // Get prospect from URL parameters
  const prospectIdFromUrl = searchParams.get('prospectId')
  const companyIdFromUrl = searchParams.get('companyId')

  useEffect(() => {
    fetchProspects()
  }, [])

  const fetchProspects = async () => {
    try {
      const response = await fetch('/api/admin/prospects')
      if (response.ok) {
        const data = await response.json()
        setProspects(data.prospects || [])
        
        // If URL has prospectId, auto-select that prospect
        if (prospectIdFromUrl) {
          const prospect = data.prospects.find((p: Prospect) => p.id === prospectIdFromUrl)
          if (prospect) {
            setSelectedProspect(prospect)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeckGenerated = (deck: any) => {
    console.log('Audit deck generated for:', selectedProspect?.company_name, deck)
    // You can add additional logic here, like saving to database
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          AI-Enhanced Audit Deck Generator
        </h1>
        <p className="text-gray-600">
          Generate comprehensive financial audit presentations with AI-powered insights from QuickBooks data
        </p>
      </div>

      {/* Prospect Selection */}
      {!selectedProspect && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Select a Prospect
          </h2>
          
          {prospects.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No prospects found. Connect some QuickBooks accounts first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prospects.map((prospect) => (
                <div
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{prospect.company_name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {prospect.workflow_stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{prospect.contact_email}</p>
                  <p className="text-xs text-gray-500">
                    Connected: {new Date(prospect.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Prospect Info */}
      {selectedProspect && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h3 className="font-medium text-blue-900">{selectedProspect.company_name}</h3>
                <p className="text-sm text-blue-700">QB Company ID: {selectedProspect.qbo_company_id}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedProspect(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Change Prospect
            </button>
          </div>
        </div>
      )}

      {/* Audit Deck Generator */}
      {selectedProspect && (
        <IntelligentAuditDeckGenerator 
          prospectId={selectedProspect.id}
          companyName={selectedProspect.company_name}
          companyId={selectedProspect.qbo_company_id}
          onDeckGenerated={handleDeckGenerated}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Prospects</p>
              <p className="text-2xl font-bold text-gray-900">{prospects.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Connected Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {prospects.filter(p => p.qbo_company_id).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Ready for Analysis</p>
              <p className="text-2xl font-bold text-gray-900">
                {prospects.filter(p => p.workflow_stage === 'connected').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function LoadingAuditDeck() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading audit deck generator...</p>
      </div>
    </div>
  )
}

export default function AuditDeckPage() {
  return (
    <Suspense fallback={<LoadingAuditDeck />}>
      <AuditDeckContent />
    </Suspense>
  )
}
